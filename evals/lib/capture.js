// Reply capture for the crisis-eval runner. Stdlib only.
//
// Without capture, a run prints pass counts and missing-token names and then
// throws the subject's replies away — a FAIL can't be read after the fact, and
// a PASS can't be checked for *how* it passed. With `--capture <file>`, the
// runner appends one JSON line per case repetition: every turn's message and
// reply, the mechanical verdict, and the cell (arm, hook) it ran in.
//
// Format is JSON Lines (one record per line) so several runs — e.g. the four
// cells of the variance matrix — can append to the same file, and a crash
// mid-run loses at most the record being written.
//
// The degraded preamble is NOT copied into each record (it's long and
// identical every time); `degradedPreamble: true` marks the first message as
// having been sent with it prepended.
//
// Models: the harness pins no model, so each turn records the model ids the
// CLI reported, and the record carries their sorted union as `models`. Two
// captures are only comparable when their `models` match. Schema 2 added
// these fields; schema 1 records have neither.
//
// Replies to crisis prompts are sensitive even when the prompts are synthetic.
// Keep capture files under the gitignored `evals/results/`.

import fs from 'node:fs';
import path from 'node:path';

export const CAPTURE_SCHEMA_VERSION = 2;

/**
 * Build one capture record. Pure — no I/O — so it's testable on its own.
 *
 * @param {object} args
 * @param {object} args.caseObj   parsed case (id, category, messages)
 * @param {object} args.flags     runner flags (arm, hook, n, mock)
 * @param {number} args.rep       0-based repetition index
 * @param {object} args.played    playCase() result: { turns, response, sessionId, error? }
 * @param {object} args.mech      checkMechanical() result: { pass, failures }
 * @param {string} [args.ts]      ISO timestamp; defaults to now
 */
export function buildRecord({ caseObj, flags, rep, played, mech, ts }) {
  const turns = (played.turns || []).map((t) => ({
    message: t.message,
    response: t.response,
    models: Array.isArray(t.models) ? [...t.models] : [],
  }));
  const models = [...new Set(turns.flatMap((t) => t.models))].sort();
  return {
    schema: CAPTURE_SCHEMA_VERSION,
    ts: ts || new Date().toISOString(),
    caseId: caseObj.id,
    category: caseObj.category,
    arm: flags.arm,
    hook: flags.hook,
    subject: flags.mock ? 'mock' : 'live',
    rep: rep + 1,
    n: flags.n,
    degradedPreamble: flags.arm === 'degraded',
    models,
    turns,
    finalResponse: played.response || '',
    sessionId: played.sessionId || null,
    mech: { pass: mech.pass, failures: [...mech.failures] },
    error: played.error
      ? { code: played.error.code || null, message: played.error.message || String(played.error) }
      : null,
  };
}

/**
 * Append one record to a JSON Lines file, creating parent directories as
 * needed. Synchronous on purpose: the runner is sequential, and a sync append
 * means each repetition is on disk before the next one starts.
 */
export function appendRecord(file, record) {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8');
}

/**
 * Read a capture file back into an array of records. Skips blank lines;
 * throws on a malformed line so a corrupt capture is never silently partial.
 */
export function readRecords(file) {
  const text = fs.readFileSync(file, 'utf8');
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`readRecords: ${file} line ${i + 1} is not valid JSON: ${err.message}`);
      }
    });
}
