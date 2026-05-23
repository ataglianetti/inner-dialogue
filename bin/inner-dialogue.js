#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { install } from '../cli/install.js';
import { update } from '../cli/update.js';
import { doctor } from '../cli/doctor.js';
import { packageFile } from '../cli/lib/paths.js';

const HELP = `inner-dialogue — private AI therapist toolkit

Usage:
  inner-dialogue install   [flags]   Create a new therapist setup
  inner-dialogue update    [flags]   Update framework files in an existing setup
  inner-dialogue doctor    [flags]   Validate a therapy folder
  inner-dialogue --version           Print version
  inner-dialogue --help              Print this help

Install flags:
  --name <name>              Therapist name (e.g. Sage)
  --path <dir>               Storage location (absolute or ~/...)
  --persona <slug>           e.g. warm-4o, direct-challenging, coach
  --structure <slug>         structured | moderate | freeform
  --modalities <a,b,c>       Comma-separated slugs (cbt,ifs,...)
  --force                    Reinstall over existing .therapy/
  --json                     Print JSON result

Update flags:
  --path <dir>               Therapy folder (default: cwd)
  --dry-run                  Show plan without writing
  --force                    Overwrite user-edited framework files
  --json                     Print JSON result

Doctor flags:
  --path <dir>               Therapy folder (default: cwd)
  --json                     Print JSON result

Examples:
  npx inner-dialogue install --name Sage --path ~/Sage \\
      --persona warm-4o --structure moderate --modalities cbt,ifs
  npx inner-dialogue update --path ~/Sage --dry-run
  npx inner-dialogue doctor --path ~/Sage
`;

function parseList(v) {
  if (!v) return undefined;
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function printResult(result, json) {
  if (json) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    return;
  }
  if (result.ok && result.path) {
    process.stdout.write(
      `\nReady: ${result.therapist} at ${result.path}\n` +
        `  persona:    ${result.persona}\n` +
        `  structure:  ${result.structure}\n` +
        `  modalities: ${result.modalities.join(', ')}\n\n` +
        `Start a session: double-click start-session.command (Mac/Linux) or .bat (Windows)\n`
    );
    return;
  }
  if (result.plan) {
    const p = result.plan;
    if (result.dry_run) process.stdout.write('Dry run — no files written.\n\n');
    if (result.backup) process.stdout.write(`Backup: ${result.backup}\n\n`);
    if (p.updates.length) {
      process.stdout.write(`Updated (${p.updates.length}):\n`);
      for (const u of p.updates)
        process.stdout.write(`  ${u.path}  ${u.from_version ?? '?'} → ${u.to_version ?? '?'}\n`);
    }
    if (p.new_files.length) {
      process.stdout.write(`\nAdded (${p.new_files.length}):\n`);
      for (const u of p.new_files)
        process.stdout.write(`  ${u.path}  (v${u.to_version ?? '?'})\n`);
    }
    if (p.skipped_user_edited.length) {
      process.stdout.write(
        `\nSkipped — user edits preserved (${p.skipped_user_edited.length}):\n`
      );
      for (const u of p.skipped_user_edited)
        process.stdout.write(`  ${u.path}  (${u.reason})\n`);
      process.stdout.write(
        `\nUse --force to overwrite these. Your edits are backed up regardless.\n`
      );
    }
    if (result.message) process.stdout.write(`\n${result.message}\n`);
    return;
  }
  if (result.issues !== undefined) {
    if (result.ok) {
      process.stdout.write('All checks passed:\n');
      for (const c of result.checks) process.stdout.write(`  ok  ${c}\n`);
    } else {
      process.stdout.write('Issues found:\n');
      for (const i of result.issues) process.stdout.write(`  !!  ${i}\n`);
      if (result.checks.length) {
        process.stdout.write('\nPassed:\n');
        for (const c of result.checks) process.stdout.write(`  ok  ${c}\n`);
      }
    }
  }
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes('--help') || argv.includes('-h') || argv.length === 0) {
    process.stdout.write(HELP);
    return 0;
  }

  if (argv.includes('--version') || argv.includes('-v')) {
    const pkg = JSON.parse(await readFile(packageFile('package.json'), 'utf8'));
    process.stdout.write(pkg.version + '\n');
    return 0;
  }

  const command = argv[0];
  const rest = argv.slice(1);

  const commonOptions = {
    path: { type: 'string' },
    json: { type: 'boolean' },
    force: { type: 'boolean' },
  };

  let parsed;
  try {
    if (command === 'install') {
      parsed = parseArgs({
        args: rest,
        options: {
          ...commonOptions,
          name: { type: 'string' },
          persona: { type: 'string' },
          structure: { type: 'string' },
          modalities: { type: 'string' },
        },
        strict: true,
      });
    } else if (command === 'update') {
      parsed = parseArgs({
        args: rest,
        options: {
          ...commonOptions,
          'dry-run': { type: 'boolean' },
        },
        strict: true,
      });
    } else if (command === 'doctor') {
      parsed = parseArgs({
        args: rest,
        options: { path: { type: 'string' }, json: { type: 'boolean' } },
        strict: true,
      });
    } else {
      process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
      return 1;
    }
  } catch (err) {
    process.stderr.write(`Argument error: ${err.message}\n`);
    return 2;
  }

  const v = parsed.values;
  try {
    let result;
    if (command === 'install') {
      result = await install({
        name: v.name,
        path: v.path,
        persona: v.persona,
        structure: v.structure,
        modalities: parseList(v.modalities),
        force: v.force,
        json: v.json,
      });
    } else if (command === 'update') {
      result = await update({
        path: v.path || process.cwd(),
        dryRun: v['dry-run'],
        force: v.force,
      });
    } else {
      result = await doctor({ path: v.path || process.cwd() });
    }
    printResult(result, v.json);
    return result.ok === false ? 1 : 0;
  } catch (err) {
    if (v.json) {
      process.stdout.write(
        JSON.stringify({ ok: false, error: err.message }, null, 2) + '\n'
      );
    } else {
      process.stderr.write(`Error: ${err.message}\n`);
    }
    return 1;
  }
}

main().then((code) => process.exit(code));
