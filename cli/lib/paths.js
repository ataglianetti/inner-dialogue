import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { homedir } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PACKAGE_ROOT = resolve(__dirname, '..', '..');

export function packageFile(...parts) {
  return join(PACKAGE_ROOT, ...parts);
}

export function expandHome(p) {
  if (!p) return p;
  if (p === '~') return homedir();
  if (p.startsWith('~/')) return join(homedir(), p.slice(2));
  return p;
}

export function therapyPaths(root) {
  const r = resolve(expandHome(root));
  return {
    root: r,
    claudeMd: join(r, 'CLAUDE.md'),
    profile: join(r, 'profile.md'),
    sessions: join(r, 'sessions'),
    therapy: join(r, '.therapy'),
    versionJson: join(r, '.therapy', 'version.json'),
    safetyProtocol: join(r, '.therapy', 'safety-protocol.md'),
    commands: join(r, '.therapy', 'commands.md'),
    persona: join(r, '.therapy', 'persona.md'),
    sessionStructure: join(r, '.therapy', 'session-structure.md'),
    modalitiesDir: join(r, '.therapy', 'modalities'),
    library: join(r, '.therapy', 'library'),
    libraryPersonas: join(r, '.therapy', 'library', 'personas'),
    libraryModalities: join(r, '.therapy', 'library', 'modalities'),
    libraryStructures: join(r, '.therapy', 'library', 'structures'),
    launcherUnix: join(r, 'start-session.command'),
    launcherWin: join(r, 'start-session.bat'),
  };
}
