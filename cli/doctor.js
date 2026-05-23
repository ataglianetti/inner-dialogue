import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { therapyPaths } from './lib/paths.js';
import { readVersionJson } from './lib/version.js';

// Minimal seed sections. Profiles are expected to evolve beyond these — the
// LLM is instructed to add H2s as themes emerge and reorganize around active
// modalities. We only warn if the file appears truly unstructured.
const SEED_PROFILE_SECTIONS = ['Background', 'Current Focus', 'Notes'];

function checkProfileStructure(content) {
  const errors = [];
  const warnings = [];

  const h2s = [...content.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) =>
    m[1].trim()
  );

  if (h2s.length === 0) {
    errors.push(
      'profile.md has no H2 sections — the LLM has nothing to append updates under'
    );
    return { errors, warnings };
  }

  // If the profile has a healthy number of H2s, assume it has evolved its own
  // structure and don't second-guess it.
  if (h2s.length >= 4) {
    return { errors, warnings };
  }

  // Small profile — check it has at least one seed-ish section to give the LLM
  // somewhere to start. Background and Current Focus are the most universal.
  const hasBackground =
    h2s.some((h) => /background/i.test(h)) ||
    h2s.some((h) => /context|history/i.test(h));
  if (!hasBackground) {
    warnings.push(
      'profile.md has no Background section (or equivalent). New profiles should seed with at least Background, Current Focus, and Notes — the LLM grows structure from there.'
    );
  }

  return { errors, warnings };
}

export async function doctor(opts) {
  const paths = therapyPaths(opts.path);
  const errors = [];
  const warnings = [];
  const ok = [];

  if (!existsSync(paths.root)) {
    errors.push(`Therapy folder not found: ${paths.root}`);
    return { ok: false, errors, warnings, checks: ok };
  }
  ok.push(`folder exists: ${paths.root}`);

  if (!existsSync(paths.therapy)) {
    errors.push('.therapy/ folder missing');
  } else {
    ok.push('.therapy/ folder present');
  }

  const versionData = await readVersionJson(paths.versionJson);
  if (!versionData) {
    errors.push('.therapy/version.json missing or unparseable');
  } else {
    ok.push(`version.json present (kit ${versionData.kit_version || '?'})`);
    if (!versionData.files) {
      warnings.push(
        'version.json uses legacy schema (no per-file hashes) — run `inner-dialogue update --force` to migrate'
      );
    }
  }

  for (const required of [
    paths.safetyProtocol,
    paths.persona,
    paths.sessionStructure,
    paths.commands,
  ]) {
    if (!existsSync(required)) {
      errors.push(
        `missing framework file: ${required.replace(paths.root + '/', '')}`
      );
    }
  }

  if (existsSync(paths.profile)) {
    const content = await readFile(paths.profile, 'utf8');
    const result = checkProfileStructure(content);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    if (result.errors.length === 0 && result.warnings.length === 0) {
      ok.push('profile.md structure valid');
    }
  } else {
    errors.push('profile.md missing');
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    issues: errors, // backwards compat for older output handlers
    checks: ok,
  };
}
