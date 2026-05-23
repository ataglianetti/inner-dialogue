import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export async function readVersionJson(path) {
  if (!existsSync(path)) return null;
  const raw = await readFile(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeVersionJson(path, data) {
  await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function emptyVersionJson(kitVersion, sourceUrl) {
  return {
    kit_version: kitVersion,
    installed: new Date().toISOString().slice(0, 10),
    files: {},
    source_url: sourceUrl || 'https://github.com/ataglianetti/inner-dialogue',
  };
}

export function recordFile(versionData, relPath, fileVersion, hash, sourceRel) {
  versionData.files = versionData.files || {};
  versionData.files[relPath] = {
    version: fileVersion,
    hash,
    source: sourceRel,
  };
}
