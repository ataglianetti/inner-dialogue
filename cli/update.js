import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

import { therapyPaths, packageFile } from './lib/paths.js';
import { loadFramework } from './lib/framework.js';
import {
  readVersionJson,
  writeVersionJson,
  emptyVersionJson,
  recordFile,
} from './lib/version.js';
import { hashString } from './lib/hash.js';
import { snapshotTherapy } from './lib/backup.js';

const ALWAYS_SKIP_RELATIVE = [
  'profile.md',
  'CLAUDE.md',
  'sessions/',
];

function isProtected(targetRel) {
  for (const p of ALWAYS_SKIP_RELATIVE) {
    if (targetRel === p || targetRel.startsWith(p)) return true;
  }
  return false;
}

function isActiveCopy(targetRel) {
  return (
    targetRel === '.therapy/persona.md' ||
    targetRel === '.therapy/session-structure.md' ||
    targetRel.startsWith('.therapy/modalities/')
  );
}

async function readIfExists(p) {
  if (!existsSync(p)) return null;
  return readFile(p, 'utf8');
}

export async function update(opts) {
  const paths = therapyPaths(opts.path);

  if (!existsSync(paths.therapy)) {
    throw new Error(
      `No therapy folder found at ${paths.root}. Run \`inner-dialogue install\` first.`
    );
  }

  const existing =
    (await readVersionJson(paths.versionJson)) ||
    emptyVersionJson('0.0.0');
  const oldFiles = existing.files || {};
  const framework = await loadFramework();
  const pkgJson = JSON.parse(
    await readFile(packageFile('package.json'), 'utf8')
  );

  const plan = {
    updates: [],
    new_files: [],
    skipped_user_edited: [],
    unchanged: [],
  };

  for (const f of framework) {
    if (isProtected(f.target)) continue;
    if (isActiveCopy(f.target)) continue;

    const targetAbs = join(paths.root, f.target);
    const current = await readIfExists(targetAbs);

    if (current === null) {
      plan.new_files.push({
        path: f.target,
        version: f.version,
      });
      continue;
    }

    const currentHash = hashString(current);
    const knownHash = oldFiles[f.target]?.hash;

    if (currentHash === f.hash) {
      plan.unchanged.push({ path: f.target, version: f.version });
      continue;
    }

    if (knownHash && currentHash !== knownHash) {
      plan.skipped_user_edited.push({
        path: f.target,
        reason: 'modified since install',
        from_version: oldFiles[f.target]?.version,
        to_version: f.version,
      });
      continue;
    }

    if (!knownHash) {
      plan.skipped_user_edited.push({
        path: f.target,
        reason: 'unknown origin (pre-2.2.0 install or hand-placed file)',
        to_version: f.version,
      });
      continue;
    }

    plan.updates.push({
      path: f.target,
      from_version: oldFiles[f.target]?.version,
      to_version: f.version,
    });
  }

  if (opts.dryRun) {
    return { ok: true, dry_run: true, plan };
  }

  const willWrite = plan.updates.length + plan.new_files.length;
  if (willWrite === 0) {
    return {
      ok: true,
      backup: null,
      plan,
      message: 'Already up to date.',
    };
  }

  const backupPath = await snapshotTherapy(paths.therapy);

  const newVersion = { ...existing };
  newVersion.kit_version = pkgJson.version;
  newVersion.files = { ...oldFiles };
  newVersion.last_update = new Date().toISOString().slice(0, 10);

  const frameworkByTarget = new Map(framework.map((f) => [f.target, f]));

  for (const item of [...plan.updates, ...plan.new_files]) {
    const f = frameworkByTarget.get(item.path);
    const targetAbs = join(paths.root, f.target);
    await mkdir(dirname(targetAbs), { recursive: true });
    await writeFile(targetAbs, f.content, 'utf8');
    recordFile(newVersion, f.target, f.version, f.hash, f.source);
  }

  if (opts.force) {
    for (const item of plan.skipped_user_edited) {
      const f = frameworkByTarget.get(item.path);
      if (!f) continue;
      const targetAbs = join(paths.root, f.target);
      await writeFile(targetAbs, f.content, 'utf8');
      recordFile(newVersion, f.target, f.version, f.hash, f.source);
    }
    plan.forced_overwrites = plan.skipped_user_edited;
    plan.skipped_user_edited = [];
  }

  await writeVersionJson(paths.versionJson, newVersion);

  return {
    ok: true,
    backup: backupPath,
    plan,
    kit_version: pkgJson.version,
  };
}
