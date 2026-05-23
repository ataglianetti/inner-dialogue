import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export function hashString(content) {
  return 'sha256-' + createHash('sha256').update(content, 'utf8').digest('hex');
}

export async function hashFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  return hashString(content);
}

export function extractVersion(content) {
  const m = content.match(/<!--\s*version:\s*([^\s>-]+)\s*-->/);
  return m ? m[1] : null;
}
