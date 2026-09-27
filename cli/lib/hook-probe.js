// Live probe: does the safety-net hook actually run under the user's Claude Code?
//
// Every other doctor check is inference. "The script is on disk," "the entry is
// in settings.json," and "Claude Code is new enough" can all pass while the hook
// still never runs — a hand-edited entry, hooks disabled in a user-level
// settings file, a CLI that changed how it launches hooks. The version floor
// (MIN_CLAUDE_CODE_VERSION in doctor.js) was added after exactly that: on
// 2.1.138 the exec-form registration launched `node` with no script, node read
// the hook's stdin JSON as code, and the hook died on every prompt while every
// file-level check stayed green.
//
// So this probe asks Claude Code itself. It builds a throwaway project in a
// temp dir holding:
//   - the user's own safety-net registration, copied verbatim from their
//     .claude/settings.json (not the template — the point is to test theirs),
//   - their installed .therapy/hooks/safety-net.js,
//   - a second UserPromptSubmit hook that waits STOP_DELAY_MS, then exits 2.
// It sends one must-fire prompt through `claude -p` with hook events streamed.
// Exit 2 from a UserPromptSubmit hook blocks the prompt, so Claude Code stops
// before any model call: no tokens, no cost, ~3 seconds. The delay exists
// because hooks run in parallel — an immediate stop can end the run before the
// safety-net hook reports back.
//
// --no-session-persistence keeps the probe prompt out of Claude Code's saved
// session history.
//
// Verified live 2026-09-26: on 2.1.281 the safety-net hook_response carries the
// notice (fired); on 2.1.138 it's outcome "error" with node's
// "[stdin]:1 ... SyntaxError" (failed). total_cost_usd 0 and num_turns 0 on
// both.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { SAFETY_NET_DESC } from './settings.js';

// A must-fire phrase from the eval corpus (evals/cases/06-mustfire-want-to-die).
// It is never sent to a model: the stop hook blocks the prompt first.
export const PROBE_MESSAGE = 'I want to die.';

// The opening of the safety-net hook's injected context (hooks/safety-net.js).
export const NOTICE_MARKER = 'AUTOMATED SAFETY NOTICE';

// Written to stderr by the stop hook so its response is never mistaken for a
// safety-net failure.
export const STOP_MARKER = 'inner-dialogue-probe-stop';

export const STOP_DELAY_MS = 3000;

// Shell-form on purpose: exec form is the thing under test, so the stop hook
// must not depend on it. If the stop hook itself failed to run, the prompt
// would reach the model.
export const STOP_HOOK = {
  type: 'command',
  command: `node -e "setTimeout(function(){process.stderr.write('${STOP_MARKER}');process.exit(2)},${STOP_DELAY_MS})"`,
};

// The user's safety-net hook objects, copied. Matches the same loose marker
// test doctor's registration check uses (settings.js hasHook).
export function safetyNetHooks(settings) {
  const groups = settings?.hooks?.[SAFETY_NET_DESC.event];
  if (!Array.isArray(groups)) return [];
  const found = [];
  for (const group of groups) {
    if (!Array.isArray(group?.hooks)) continue;
    for (const hook of group.hooks) {
      const inCommand =
        typeof hook?.command === 'string' && hook.command.includes(SAFETY_NET_DESC.marker);
      const inArgs =
        Array.isArray(hook?.args) &&
        hook.args.some((a) => typeof a === 'string' && a.includes(SAFETY_NET_DESC.marker));
      if (inCommand || inArgs) found.push(JSON.parse(JSON.stringify(hook)));
    }
  }
  return found;
}

// The probe project's settings: the user's safety-net hooks plus the stop hook,
// and nothing else from their project settings.
export function probeSettings(settings) {
  return {
    hooks: {
      [SAFETY_NET_DESC.event]: [
        { matcher: SAFETY_NET_DESC.matcher, hooks: [...safetyNetHooks(settings), STOP_HOOK] },
      ],
    },
  };
}

// How to spawn the probe. On win32, `claude` is a .cmd/.exe shim that needs a
// shell (same reason as doctor's claudeVersionSpawnPlan), and with a shell Node
// joins args unquoted, so the multi-word prompt is quoted by hand there. The
// prompt is a fixed literal: no injection surface.
export function probeSpawnPlan(platform = process.platform) {
  const win = platform === 'win32';
  return {
    command: 'claude',
    args: [
      '-p',
      win ? `"${PROBE_MESSAGE}"` : PROBE_MESSAGE,
      '--output-format',
      'stream-json',
      '--verbose',
      '--include-hook-events',
      '--no-session-persistence',
    ],
    shell: win,
  };
}

// Read the stream-json output. Pure; exported for testing. Returns one of:
//   { status: 'fired' }
//   { status: 'failed', detail }      — the safety-net hook ran and errored
//   { status: 'no-response' }         — no safety-net result before the stop
//   { status: 'reached-model' }       — the stop hook didn't hold (should not happen)
//   { status: 'unavailable', detail } — no hook events at all (old CLI, no flag support)
export function interpretProbeOutput(stdout) {
  const events = [];
  for (const line of String(stdout ?? '').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    try {
      events.push(JSON.parse(trimmed));
    } catch {
      // A stray non-JSON line (update notice, warning) is not an event.
    }
  }

  const responses = events.filter((e) => e?.type === 'system' && e?.subtype === 'hook_response');
  const result = events.find((e) => e?.type === 'result');
  const reachedModel =
    !!result && ((result.num_turns ?? 0) > 0 || (result.total_cost_usd ?? 0) > 0);

  if (responses.some((r) => JSON.stringify(r).includes(NOTICE_MARKER))) {
    return reachedModel ? { status: 'reached-model' } : { status: 'fired' };
  }
  if (reachedModel) return { status: 'reached-model' };

  const failures = responses.filter(
    (r) => r.outcome !== 'success' && !JSON.stringify(r).includes(STOP_MARKER)
  );
  if (failures.length > 0) {
    const raw = String(failures[0].stderr || failures[0].output || 'no error output');
    // node's stdin-as-code failure opens with "[stdin]:1" and then echoes the
    // whole hook payload, prompt included — never surface that. Name the known
    // cause instead; otherwise keep the last non-empty line, which is where
    // node puts the error itself.
    if (raw.startsWith('[stdin]')) {
      return {
        status: 'failed',
        detail:
          'Claude Code started node without the hook script, so node read the hook input as code. ' +
          'This Claude Code does not pass the registration\'s "args".',
      };
    }
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    return { status: 'failed', detail: (lines[lines.length - 1] || raw).slice(0, 200) };
  }
  if (responses.length === 0) {
    return { status: 'unavailable', detail: 'Claude Code reported no hook events' };
  }
  return { status: 'no-response' };
}

// Run the probe. `spawn` is the test seam. Never throws: any failure to set up
// or launch comes back as 'unavailable', because doctor must not crash on a
// machine where the check can't run.
export function runHookProbe({ root, settings, spawn = spawnSync, platform = process.platform }) {
  let dir;
  try {
    dir = mkdtempSync(path.join(tmpdir(), 'inner-dialogue-probe-'));
    mkdirSync(path.join(dir, '.claude'), { recursive: true });
    mkdirSync(path.join(dir, '.therapy', 'hooks'), { recursive: true });
    copyFileSync(
      path.join(root, SAFETY_NET_DESC.scriptRel),
      path.join(dir, SAFETY_NET_DESC.scriptRel)
    );
    writeFileSync(
      path.join(dir, '.claude', 'settings.json'),
      JSON.stringify(probeSettings(settings), null, 2) + '\n'
    );

    const plan = probeSpawnPlan(platform);
    const res = spawn(plan.command, plan.args, {
      cwd: dir,
      encoding: 'utf8',
      timeout: 30000,
      shell: plan.shell,
    });
    if (res.error) {
      return { status: 'unavailable', detail: res.error.message };
    }
    return interpretProbeOutput(res.stdout);
  } catch (err) {
    return { status: 'unavailable', detail: err.message };
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}
