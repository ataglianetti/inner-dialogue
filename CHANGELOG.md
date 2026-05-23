# Changelog

All notable changes to Inner Dialogue.

---

## [2.2.3] - 2026-05-23

### Changed
- **`doctor` now distinguishes errors from warnings.** Template H2 section misses in `profile.md` are demoted from errors to soft warnings — the template's own prompt invites users to add custom sections, and the LLM's update logic targets existing H2s rather than template-specific ones. Profiles that evolved their own structure (common for any folder older than a few weeks) no longer fail `doctor`. Real structural problems (missing `.therapy/`, malformed `version.json`, missing `profile.md`, zero H2s) remain errors.
- `doctor` exits 0 on warnings-only, 1 on errors. Output visually separates errors (`!!`) from warnings (`~~`).
- Legacy `version.json` schema is now a warning, not an error — the file still works, the migration is just recommended.

---

## [2.2.2] - 2026-05-23

### Fixed
- **Migration from legacy `version.json` schema now produces a complete registry.** Previously, `update --force` against a pre-2.2.0 folder only recorded hashes for files it wrote — every other framework file that already matched bundled content was left unregistered, causing future updates to re-flag them as "unknown origin." Now `update` detects the legacy schema and folds all `unchanged` files into the new registry alongside any writes, so a single migration run produces a fully-tracked folder. Dry-run output also surfaces this as "Folded into new registry (N)" so users see what the migration accomplishes before applying.

---

## [2.2.1] - 2026-05-23

### Added
- **MIGRATING.md** — Step-by-step guide for users with pre-2.2.0 therapy folders. Documents the one-time `update --force` migration that refreshes framework files and generates a fresh hash registry while leaving `profile.md`, `sessions/`, and root `CLAUDE.md` untouched.

### Fixed
- **`update --force --dry-run` now actually previews the forced overwrites.** Previously the force-reshuffle of skipped files happened after the dry-run early-return, so users couldn't preview what `--force` would do — making MIGRATING.md's preview step misleading.

---

## [2.2.0] - 2026-05-22

### Added
- **`inner-dialogue` CLI** — Published to npm. `npx inner-dialogue install`, `update`, and `doctor` commands. The conversational setup flow now calls the CLI under the hood instead of asking the LLM to perform `mkdir`/`cp`/`chmod` from prose instructions.
- **Hash-aware updater** — `update` records a SHA-256 of every framework file at install time. On re-run, files whose current content matches the registered hash are safely overwritten with the new version; files that have been edited are skipped with a warning. Run with `--force` to overwrite anyway. `--dry-run` previews the plan without writing.
- **Automatic backups** — Every `update` snapshots `.therapy/` to `.therapy.bak-<timestamp>/` before any write. Roll back by restoring from the snapshot.
- **`doctor` command** — Validates folder integrity (presence of framework files, `profile.md` H2 structure intact, `version.json` schema). Catches the drift modes that motivated 2.1.2.
- **Direct CLI install path** — `npx inner-dialogue install` works without Claude Code for scripting / power-user setups, with interactive prompts when run in a TTY.

### Changed
- **Setup CLAUDE.md slimmed down** — The 700-line procedural setup file is now a ~150-line conversation script. File operations live in the tested CLI, not in LLM-followed prose.
- **`version.json` schema** — Now tracks per-file hashes (`files[path]: {version, hash, source}`) instead of just component versions. Old format auto-migrates on first `update` (treated as unknown-origin until the user confirms).

### For Existing Users
See [MIGRATING.md](MIGRATING.md) for the one-time migration to the hash-aware updater. Your `profile.md`, `sessions/`, and root `CLAUDE.md` are never touched.

---

## [2.1.2] - 2026-05-09

### Fixed
- **Profile updates now target specific sections** — At session end, the AI must match each update to an existing H2 section in `profile.md` rather than appending freeform. Prevents `profile.md` from accumulating unstructured content over many sessions.

---

## [2.1.1] - 2026-02-08

### Fixed
- **Setup import flow now fully implemented** — Step 6 now includes complete logic for categorizing files (profile.md, ChatGPT exports, markdown, PDF), extracting profile information, and converting conversations to dated session files. Previously the setup instructions referenced import handling but didn't include the processing steps.

---

## [2.1.0] - 2026-02-08

### Added
- **Import command** — Import notes anytime during a session, not just at setup. Say "import" or "I have files to import" and provide a path.
- **Manifest-based updates** — Updates now use `manifest.json` to discover all available components. Existing users can get new features automatically.
- **Smart modality recommendations** — If you import notes during setup, your therapist reads them and recommends modalities based on your history.

### Changed
- **Smarter import handling** — Imported files now become session history (`sessions/YYYY-MM-DD.md`) with original dates, plus key patterns extracted to `profile.md`. This gives natural relevance decay like real memory.
- **Commands moved to updatable file** — Customization commands now live in `.therapy/commands.md` so existing users receive new commands via updates.
- **Setup flow reordered** — Import step now comes before modality selection, enabling personalized recommendations.

### For Existing Users
Run "update" or "check for updates" during a session to get these features.

---

## [2.0.0] - 2026-02-01

### Added
- **8 communication styles** (up from 2):
  - Warm 4o-Style
  - Direct & Challenging
  - Warm & Supportive
  - Coach
  - Grounded & Real
  - Contemplative & Spacious
  - Philosophical & Existential
  - Creative & Playful

- **12 therapeutic modalities** (up from 1):
  - CBT (Cognitive Behavioral Therapy)
  - ACT (Acceptance and Commitment Therapy)
  - CFT (Compassion-Focused Therapy)
  - DBT Skills
  - IFS (Internal Family Systems)
  - Lifespan Integration
  - Motivational Interviewing
  - Narrative Therapy
  - Polyvagal-Informed Work
  - Psychodynamic
  - SFBT (Solution-Focused Brief Therapy)
  - Somatic Experiencing

- **Split-file architecture** — Components now live in `.therapy/` folder for independent updates
- **Self-contained therapist folders** — No need to keep the repo after setup
- **Update command** — Say "update" to check for and apply updates from GitHub
- **Customization commands** — Switch persona, add/remove modalities, change session structure during sessions

### Changed
- Therapist folders now include full library of options for switching styles

---

## [1.0.0] - 2026-01-15

### Initial Release
- Basic AI therapist setup with persistent sessions
- CBT modality
- Warm 4o-Style and Coach personas
- Session notes saved to `sessions/` folder
- Client profile in `profile.md`
- Safety and crisis protocols
