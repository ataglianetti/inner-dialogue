import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { therapyPaths } from './lib/paths.js';
import { readVersionJson } from './lib/version.js';

const REQUIRED_PROFILE_SECTIONS = [
  'Background',
  'Current Focus Areas',
  'Psychological Framework',
  'Values & Goals',
  'Progress & Wins',
  'Therapeutic Notes',
];

function checkProfileStructure(content) {
  const issues = [];
  const h2s = [...content.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1].trim());
  for (const required of REQUIRED_PROFILE_SECTIONS) {
    if (!h2s.includes(required)) {
      issues.push(`profile.md missing H2 section: "${required}"`);
    }
  }
  return issues;
}

export async function doctor(opts) {
  const paths = therapyPaths(opts.path);
  const issues = [];
  const ok = [];

  if (!existsSync(paths.root)) {
    issues.push(`Therapy folder not found: ${paths.root}`);
    return { ok: false, issues, checks: ok };
  }
  ok.push(`folder exists: ${paths.root}`);

  if (!existsSync(paths.therapy)) {
    issues.push('.therapy/ folder missing');
  } else {
    ok.push('.therapy/ folder present');
  }

  const versionData = await readVersionJson(paths.versionJson);
  if (!versionData) {
    issues.push('.therapy/version.json missing or unparseable');
  } else {
    ok.push(`version.json present (kit ${versionData.kit_version || '?'})`);
    if (!versionData.files) {
      issues.push(
        'version.json uses legacy schema (no per-file hashes) — run `inner-dialogue update` to migrate'
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
      issues.push(`missing framework file: ${required.replace(paths.root + '/', '')}`);
    }
  }

  if (existsSync(paths.profile)) {
    const content = await readFile(paths.profile, 'utf8');
    const profileIssues = checkProfileStructure(content);
    if (profileIssues.length) {
      issues.push(...profileIssues);
    } else {
      ok.push('profile.md structure valid');
    }
  } else {
    issues.push('profile.md missing');
  }

  return {
    ok: issues.length === 0,
    checks: ok,
    issues,
  };
}
