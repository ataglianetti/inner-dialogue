import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { therapyPaths } from './lib/paths.js';
import { readVersionJson } from './lib/version.js';

const TEMPLATE_PROFILE_SECTIONS = [
  'Background',
  'Current Focus Areas',
  'Psychological Framework',
  'Values & Goals',
  'Progress & Wins',
  'Therapeutic Notes',
];

const MINIMUM_H2_COUNT = 3;

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

  if (h2s.length < MINIMUM_H2_COUNT) {
    warnings.push(
      `profile.md has only ${h2s.length} H2 section${
        h2s.length === 1 ? '' : 's'
      } — consider adding more so session insights have clear places to land`
    );
  }

  const missing = TEMPLATE_PROFILE_SECTIONS.filter((s) => !h2s.includes(s));
  if (missing.length === TEMPLATE_PROFILE_SECTIONS.length) {
    warnings.push(
      'profile.md uses none of the template H2 sections, but has its own structure. This is fine — the LLM targets existing H2s, not template ones. Listed for awareness only.'
    );
  } else if (missing.length > 0) {
    warnings.push(
      `profile.md is missing some template H2 sections: ${missing.join(
        ', '
      )}. Not required — the LLM targets your existing H2s — but consider whether content for these themes lives elsewhere in your file.`
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
