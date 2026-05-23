# Migrating an Existing Therapy Folder

If you set up Inner Dialogue before version 2.2.0, your therapy folder uses the old prompt-driven install layout. The folder still works for sessions, but the new `npx inner-dialogue update` command can't safely tell which framework files are original versus customized — it'll warn you about every file as "unknown origin" and skip them.

This guide walks you through a one-time migration. After it, regular `npx inner-dialogue update` runs work normally, and you get all the latest safety protocols, modalities, and personas.

**Your personal data (`profile.md`, `sessions/`, root `CLAUDE.md`) is never touched.** The migration only refreshes framework files.

---

## Before you start

1. **Locate your therapy folder.** Common paths:
   - `~/Sage` (or whatever you named your therapist)
   - `~/Documents/Sage`
   - Wherever you chose during setup

2. **Make a manual backup if you want extra safety.** The migration creates one automatically (`.therapy.bak-<timestamp>/`), but if you want a belt-and-suspenders copy:
   ```bash
   cp -r ~/Sage ~/Sage-pre-migration
   ```

3. **Make sure you have Node.js** (you probably do if Claude Code works). Check with `node --version` — anything 18.3 or newer is fine.

---

## Step 1: Preview what will change

```bash
npx inner-dialogue@latest update --path ~/Sage --force --dry-run
```

(Replace `~/Sage` with your folder path.)

You'll see something like:

```
Added (18):
  .therapy/library/personas/contemplative.md
  .therapy/library/modalities/ifs.md
  ... (new personas, modalities, structures since your install)

Force-overwritten (2):
  .therapy/safety-protocol.md  (was: unknown origin)
  .therapy/commands.md         (was: unknown origin)
```

This is the dry run — nothing is written yet. The "Added" list is new content shipped since your install. The "Force-overwritten" list is framework files being refreshed with the current versions.

If you see anything under "Force-overwritten" that you intentionally customized (rare for end users), the original will still be saved in the automatic backup — but pause and check first.

---

## Step 2: Apply the migration

```bash
npx inner-dialogue@latest update --path ~/Sage --force
```

This:

- Snapshots `.therapy/` to `.therapy.bak-<timestamp>/` first
- Overwrites the legacy framework files with current versions
- Adds new library files (personas, modalities, structures shipped since your install)
- Generates a fresh `version.json` with per-file hashes for future updates
- Leaves `profile.md`, `sessions/`, and the root `CLAUDE.md` exactly as they were

Output ends with a `Backup:` line — note that path in case you need to roll back.

---

## Step 3: Verify

```bash
npx inner-dialogue@latest doctor --path ~/Sage
```

You should see "All checks passed." If anything fails (most commonly: profile.md has a missing H2 section), it'll tell you what to fix.

Also confirm a regular update is now a no-op:

```bash
npx inner-dialogue@latest update --path ~/Sage --dry-run
```

Expected output: `Dry run — no files written.` (no Updates, Added, or Skipped sections). That means you're on the current framework and future updates will work normally.

---

## Step 4: Start a session

Open your therapy folder and run Claude as usual:

```bash
cd ~/Sage && claude
```

Or double-click `start-session.command` / `start-session.bat`.

Your therapist will read the refreshed framework files and continue from your existing profile and session history.

---

## Rolling back

If something looks wrong after migration, your old `.therapy/` is in `.therapy.bak-<timestamp>/`. To restore:

```bash
cd ~/Sage
mv .therapy .therapy.failed-migration
mv .therapy.bak-<timestamp> .therapy
```

(Replace `<timestamp>` with the actual folder name — `ls -d ~/Sage/.therapy.bak-*` shows it.)

Your profile and sessions weren't touched, so they're already correct.

---

## What didn't get touched

Just to be explicit, the migration **does not** modify:

| File | Why |
|---|---|
| `profile.md` | Your accumulated profile data |
| `sessions/*.md` | Your session history |
| Root `CLAUDE.md` | Your therapist's persona file |
| `.therapy/persona.md`, `session-structure.md`, `modalities/*.md` | Your active configuration choices |

If you want to refresh those active config files to match the latest library content, ask your therapist during a session ("switch persona" / "add modality" / "change session structure") or copy from `.therapy/library/<kind>/<slug>.md` to the active slot manually.

---

## If you used a pre-1.0.0 monolithic install

If your folder predates the `.therapy/` split-file architecture (a single big `CLAUDE.md` with everything inline, no `.therapy/` directory at all), you need a full reinstall:

1. Read your existing `CLAUDE.md` to recall your therapist name, persona, modalities, and session structure
2. Run a fresh install over the same folder:
   ```bash
   npx inner-dialogue@latest install \
     --force --path ~/YourFolder \
     --name YourName --persona <slug> \
     --structure <slug> --modalities <slugs>
   ```
3. `--force` lets install overwrite the legacy `CLAUDE.md`. Your `profile.md` and `sessions/` are still preserved by install.

If you'd rather have Claude walk you through this, open the inner-dialogue repo and say "migrate my existing therapist" — Claude will read your old CLAUDE.md and run the install for you.

---

## Questions?

See [GETTING-STARTED.md](docs/GETTING-STARTED.md) for the normal install/update flow, or [open an issue](https://github.com/ataglianetti/inner-dialogue/issues).
