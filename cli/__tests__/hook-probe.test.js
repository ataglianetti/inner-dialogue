// Tests for cli/lib/hook-probe.js and doctor's live safety-net probe.
//
// Nothing here spawns a real `claude`: runHookProbe takes an injected spawn,
// and doctor takes an injected runHookProbe. The stream-json samples are
// trimmed from real runs on 2026-09-26 (Claude Code 2.1.281 fired; 2.1.138
// failed with node reading the hook input as code).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  interpretProbeOutput,
  probeSettings,
  probeSpawnPlan,
  runHookProbe,
  safetyNetHooks,
  PROBE_MESSAGE,
  STOP_HOOK,
  STOP_MARKER,
} from '../lib/hook-probe.js';
import { doctor } from '../doctor.js';

const EXEC_FORM = {
  type: 'command',
  command: 'node',
  args: ['${CLAUDE_PROJECT_DIR}/.therapy/hooks/safety-net.js'],
};
const TIME_HOOK = { type: 'command', command: 'node -e "console.log(1)"' };

function settingsWith(hooks) {
  return { hooks: { UserPromptSubmit: [{ matcher: '', hooks }] } };
}

// --- stream-json samples ----------------------------------------------------

const line = (o) => JSON.stringify(o);
const hookResponse = (fields) =>
  line({ type: 'system', subtype: 'hook_response', hook_event: 'UserPromptSubmit', ...fields });
const RESULT_BLOCKED = line({ type: 'result', subtype: 'success', num_turns: 0, total_cost_usd: 0 });
const STOPPED = hookResponse({ exit_code: 2, outcome: 'error', stderr: STOP_MARKER, output: STOP_MARKER });
const FIRED = hookResponse({
  exit_code: 0,
  outcome: 'success',
  stdout: line({ hookSpecificOutput: { additionalContext: 'AUTOMATED SAFETY NOTICE - a pattern matcher flagged…' } }),
});
const STDIN_CRASH = hookResponse({
  exit_code: 1,
  outcome: 'error',
  stderr: '[stdin]:1\n{"session_id":"x","prompt":"I want to die."}\n    ^\nSyntaxError: Unexpected token \':\'',
});

test('interpretProbeOutput: the notice in a hook response means fired', () => {
  const out = [FIRED, STOPPED, RESULT_BLOCKED].join('\n');
  assert.deepEqual(interpretProbeOutput(out), { status: 'fired' });
});

test('interpretProbeOutput: node reading stdin as code is named, and the prompt is not echoed', () => {
  const r = interpretProbeOutput([STDIN_CRASH, STOPPED, RESULT_BLOCKED].join('\n'));
  assert.equal(r.status, 'failed');
  assert.match(r.detail, /without the hook script/);
  assert.doesNotMatch(r.detail, /want to die/);
});

test('interpretProbeOutput: another crash reports its last line', () => {
  const crash = hookResponse({
    exit_code: 1,
    outcome: 'error',
    stderr: 'node:internal/modules/cjs/loader\n\nError: Cannot find module \'/x/safety-net.js\'\n',
  });
  const r = interpretProbeOutput([crash, STOPPED, RESULT_BLOCKED].join('\n'));
  assert.equal(r.status, 'failed');
  assert.equal(r.detail, "Error: Cannot find module '/x/safety-net.js'");
});

test('interpretProbeOutput: only the stop hook answered means no-response', () => {
  assert.deepEqual(interpretProbeOutput([STOPPED, RESULT_BLOCKED].join('\n')), {
    status: 'no-response',
  });
});

test('interpretProbeOutput: any model turn or cost means reached-model, even if it fired', () => {
  const ran = line({ type: 'result', num_turns: 1, total_cost_usd: 0.02 });
  assert.deepEqual(interpretProbeOutput([FIRED, ran].join('\n')), { status: 'reached-model' });
  assert.deepEqual(interpretProbeOutput([STOPPED, ran].join('\n')), { status: 'reached-model' });
});

test('interpretProbeOutput: no hook events at all means unavailable; junk lines are ignored', () => {
  assert.equal(interpretProbeOutput('').status, 'unavailable');
  assert.equal(interpretProbeOutput('update available!\n{not json\n' + RESULT_BLOCKED).status, 'unavailable');
  assert.equal(interpretProbeOutput('update available!\n' + FIRED).status, 'fired');
});

test('safetyNetHooks copies only the safety-net entries, by command or args', () => {
  const shellForm = { type: 'command', command: 'node "$CLAUDE_PROJECT_DIR/.therapy/hooks/safety-net.js"' };
  const settings = {
    hooks: {
      UserPromptSubmit: [
        { matcher: '', hooks: [TIME_HOOK, EXEC_FORM] },
        { matcher: '', hooks: [shellForm] },
      ],
      SessionStart: [{ matcher: '', hooks: [{ type: 'command', command: 'x safety-net.js' }] }],
    },
  };
  const found = safetyNetHooks(settings);
  assert.deepEqual(found, [EXEC_FORM, shellForm]);
  found[0].args.push('mutated');
  assert.equal(EXEC_FORM.args.length, 1, 'returned hooks are copies');
  assert.deepEqual(safetyNetHooks({}), []);
  assert.deepEqual(safetyNetHooks(null), []);
});

test('probeSettings holds the user\'s safety-net hooks plus the shell-form stop hook, nothing else', () => {
  const s = probeSettings(settingsWith([TIME_HOOK, EXEC_FORM]));
  assert.deepEqual(s, { hooks: { UserPromptSubmit: [{ matcher: '', hooks: [EXEC_FORM, STOP_HOOK] }] } });
  assert.equal(STOP_HOOK.args, undefined, 'stop hook must not depend on exec form');
  assert.match(STOP_HOOK.command, /process\.exit\(2\)/);
});

test('probeSpawnPlan streams hook events, skips session history, and quotes the prompt on win32', () => {
  const posix = probeSpawnPlan('darwin');
  assert.equal(posix.command, 'claude');
  assert.equal(posix.shell, false);
  for (const flag of ['--include-hook-events', '--no-session-persistence', 'stream-json', '--verbose']) {
    assert.ok(posix.args.includes(flag), `has ${flag}`);
  }
  assert.equal(posix.args[1], PROBE_MESSAGE);
  const win = probeSpawnPlan('win32');
  assert.equal(win.shell, true);
  assert.equal(win.args[1], `"${PROBE_MESSAGE}"`);
});

// --- runHookProbe with a fake spawn ------------------------------------------

function makeRoot(withScript = true) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'hook-probe-root-'));
  if (withScript) {
    mkdirSync(path.join(root, '.therapy', 'hooks'), { recursive: true });
    writeFileSync(path.join(root, '.therapy', 'hooks', 'safety-net.js'), '// installed hook\n');
  }
  return root;
}

test('runHookProbe builds the probe project, spawns in it, interprets, and cleans up', () => {
  const root = makeRoot();
  let seen;
  const spawn = (command, args, opts) => {
    seen = {
      command,
      args,
      cwd: opts.cwd,
      settings: JSON.parse(readFileSync(path.join(opts.cwd, '.claude', 'settings.json'), 'utf8')),
      script: readFileSync(path.join(opts.cwd, '.therapy', 'hooks', 'safety-net.js'), 'utf8'),
    };
    return { status: 0, stdout: [FIRED, STOPPED, RESULT_BLOCKED].join('\n') };
  };
  try {
    const r = runHookProbe({ root, settings: settingsWith([TIME_HOOK, EXEC_FORM]), spawn, platform: 'darwin' });
    assert.deepEqual(r, { status: 'fired' });
    assert.equal(seen.command, 'claude');
    assert.equal(seen.script, '// installed hook\n', "the user's installed script is what runs");
    assert.deepEqual(seen.settings.hooks.UserPromptSubmit[0].hooks, [EXEC_FORM, STOP_HOOK]);
    assert.equal(existsSync(seen.cwd), false, 'probe dir removed afterward');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('runHookProbe never throws: a spawn error or a missing script is unavailable', () => {
  const root = makeRoot();
  try {
    const r = runHookProbe({
      root,
      settings: settingsWith([EXEC_FORM]),
      spawn: () => ({ error: new Error('spawn claude ENOENT') }),
    });
    assert.deepEqual(r, { status: 'unavailable', detail: 'spawn claude ENOENT' });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  const bare = makeRoot(false);
  try {
    const r = runHookProbe({ root: bare, settings: settingsWith([EXEC_FORM]), spawn: () => assert.fail('must not spawn') });
    assert.equal(r.status, 'unavailable');
  } finally {
    rmSync(bare, { recursive: true, force: true });
  }
});

// --- doctor integration --------------------------------------------------------

// Minimal install that passes every other doctor check (same pattern as
// doctor-claude-version.test.js).
function makeInstall({ settings = settingsWith([EXEC_FORM]) } = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'doctor-hook-probe-'));
  const therapy = path.join(root, '.therapy');
  mkdirSync(path.join(therapy, 'hooks'), { recursive: true });
  writeFileSync(path.join(therapy, 'version.json'), JSON.stringify({ kit_version: '2.9.0', files: {} }));
  for (const f of ['safety-protocol.md', 'persona.md', 'session-structure.md', 'commands.md']) {
    writeFileSync(path.join(therapy, f), `# ${f}\n`);
  }
  writeFileSync(path.join(therapy, 'hooks', 'safety-net.js'), '// fixture\n');
  writeFileSync(path.join(root, 'profile.md'), '# Profile\n\n## Background\n\n## Current Focus\n\n## Notes\n');
  mkdirSync(path.join(root, 'context'), { recursive: true });
  writeFileSync(path.join(root, 'context', 'index.md'), '# Index\n');
  mkdirSync(path.join(root, '.claude'), { recursive: true });
  writeFileSync(path.join(root, '.claude', 'settings.json'), JSON.stringify(settings));
  return root;
}

async function runDoctor({ probeResult, claudeVersionOutput = '2.1.281 (Claude Code)', settings } = {}) {
  const root = makeInstall({ settings });
  const calls = [];
  try {
    const result = await doctor({
      path: root,
      claudeVersionOutput,
      runHookProbe: (args) => {
        calls.push(args);
        return probeResult;
      },
    });
    return { result, calls, root };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const probeWarning = (r) => r.warnings.find((w) => /live|crashed when|report back/.test(w));

test('doctor: a fired probe is an ok check naming the version, and gets the real root + settings', async () => {
  const { result, calls, root } = await runDoctor({ probeResult: { status: 'fired' } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].root, root);
  assert.deepEqual(calls[0].settings, settingsWith([EXEC_FORM]));
  assert.ok(result.checks.some((c) => c.includes('fired in a live check under Claude Code 2.1.281')));
  assert.equal(probeWarning(result), undefined);
});

test('doctor: a crash on an outdated CLI warns with the detail and defers to the version warning', async () => {
  const { result } = await runDoctor({
    claudeVersionOutput: '2.1.138 (Claude Code)',
    probeResult: { status: 'failed', detail: 'boom.' },
  });
  const w = probeWarning(result);
  assert.ok(w, 'probe warning present');
  assert.match(w, /crashed when Claude Code 2\.1\.138 ran it: boom\./);
  assert.match(w, /will not run on prompts/);
  assert.match(w, /confirms the Claude Code version warning above/);
  assert.doesNotMatch(w, /claude update/, 'the update fix lives in the version warning, once');
  assert.ok(
    result.warnings.some((x) => x.includes('older than') && x.includes('claude update')),
    'the version warning still carries the fix'
  );
  assert.equal(result.ok, true, 'warning severity: validation still passes');
});

test('doctor: a crash on a current CLI points at the registration, not an update', async () => {
  const { result } = await runDoctor({ probeResult: { status: 'failed', detail: 'boom.' } });
  const w = probeWarning(result);
  assert.match(w, /Check the safety-net entry in \.claude\/settings\.json/);
  assert.doesNotMatch(w, /claude update/);
});

test('doctor: no-response and reached-model warn; unavailable stays silent', async () => {
  assert.match(probeWarning((await runDoctor({ probeResult: { status: 'no-response' } })).result), /disableAllHooks/);
  assert.match(
    (await runDoctor({ probeResult: { status: 'reached-model' } })).result.warnings.join('\n'),
    /reached the model/
  );
  const { result } = await runDoctor({ probeResult: { status: 'unavailable', detail: 'x' } });
  assert.equal(probeWarning(result), undefined);
  assert.ok(!result.checks.some((c) => c.includes('live check')));
});

test('doctor: the probe is skipped when there is nothing to probe or no claude', async () => {
  // No claude on PATH (version unknown).
  assert.equal((await runDoctor({ claudeVersionOutput: null, probeResult: { status: 'fired' } })).calls.length, 0);
  // Not registered.
  assert.equal((await runDoctor({ settings: settingsWith([TIME_HOOK]), probeResult: { status: 'fired' } })).calls.length, 0);
});
