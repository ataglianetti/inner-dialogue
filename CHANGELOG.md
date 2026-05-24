# Changelog

All notable changes to Inner Dialogue.

---

## [2.4.1] - 2026-05-23

### Fixed
- **`update` now refreshes active files, not just the library.** Previously, running `update` would refresh the reference copies under `.therapy/library/` but leave the active files your session actually loads (`.therapy/persona.md`, `.therapy/session-structure.md`, `.therapy/modalities/*.md`) on the prior version. Result: users who ran `update` after the v2.4.0 release got the new modality library content but their sessions kept loading the v1.0.0 files. This was a latent bug going back further — any prior library content release had the same gap — it just became loud with v2.4.0's substantial rewrites.
- **Active files are now hash-gated like library files.** Refresh happens only when the on-disk content matches either the explicitly-recorded active hash, the previously-recorded library hash, or (for persona/session-structure) any library file's known hash of the same kind. Customized active files are preserved and reported in `skipped_user_edited` — re-run with `--force` to overwrite.
- **Legacy installs (no active entries in version.json) are now backfilled.** For modalities, the active filename gives the library source directly. For persona and session-structure, hash-matching identifies the source. Once refreshed, version.json gains the active entries for cleaner future updates.

### Known Limitation
If you ran `update` against v2.4.0 (which refreshed the library to 1.1.0 but left the active files at 1.0.0), your `version.json` no longer remembers the 1.0.0 library hashes. The 2.4.1 update flow will mark your active modality/persona files as "customized" rather than auto-refreshing them. Re-run with `--force` to overwrite, or manually copy from `.therapy/library/` to the active slots.

---

## [2.4.0] - 2026-05-23

### Changed
- **All 12 modality files comprehensively rewritten** to bring every modality to operational parity with DBT skills (previously the only modality with named, mnemonically packaged protocols). Each file now contains:
  - **Named protocols** — IFS's 6 F's; CBT's Socratic dialogue + 10 distortions with reframes + Behavioral Activation + Thought Record + Exposure Hierarchy; ACT's three iconic metaphors (Tug of War, Passengers on the Bus, Leaves on a Stream) in full dialogue form; CFT's Compassionate Self protocol + Inner Critic dialogue + Soothing Rhythm Breathing; Psychodynamic's Interpretive Sequence + Transference Recognition; Polyvagal's three state-specific intervention menus; SE's Resourcing + Pendulation + Discharge Recognition scripts; MI's five-level reflection ladder + Change Talk amplification; Narrative's Externalization dialogue + Unique Outcomes protocol; SFBT's Miracle → Scaling → Exceptions chain; Lifespan Integration's Timeline Construction Protocol with explicit AI-limitation framing.
  - **Signaling cues** — verbatim client language patterns each modality should listen for, pushing activation criteria into the modality files themselves rather than living only in the template router.
  - **Example AI interventions** — 4–7 full reflections per modality in actual therapist voice, replacing thin "key questions" lists.
  - **Integrates with** — cross-modality routing rules (e.g., "with compulsive behaviors, IFS leads, CBT follows downstream") so the system stops reinventing composition logic session-by-session.
  - **Pacing & limitations** including modality-specific AI honesty (SE/LI/IFS depend on real-time tracking text can't fully do) and a generic "Working alongside an external therapist" note positioning Sage to deepen rather than compete with human treatment.
  - **Homework / between-session work** — 4–6 concrete practices per modality.
- **7 of 8 persona files padded to warm-4o's depth bar.** Same structural pattern; denser content per section. New across the set: expanded Tone Qualities with nuance, Language Patterns subdivided into 6–9 categories with example phrasings, Challenge Style with a moves table, Conversation Arc as a 5-beat structure tuned to each persona's natural flow, Energy Matching for 5–6 client states. Distinct voices preserved (Coach: action-forward; Contemplative: spacious; Creative: playful/metaphor-rich; Direct-Challenging: sharp/uncompromising; Philosophical: existential; Warm-Supportive: steady reassuring presence; Grounded & Real: direct + warm).
- **Per-file version bumps `1.0.0 → 1.1.0`** across all 12 modalities and 7 personas (warm-4o was already at 1.1.0 from a prior pass).
- **`manifest.json` bumped `1.1.0 → 1.2.0`** to reflect the content release.

### For Existing Users
The `update` CLI detects per-file version changes and rolls them out cleanly:
- Files you haven't customized are upgraded automatically.
- Files you've customized are skipped with a warning — your edits are preserved. Re-run with `--force` to overwrite if you want the new versions.
- `profile.md`, `sessions/`, and `CLAUDE.md` are never touched by `update`.

If you've been using the framework in active sessions, expect noticeably sharper modality work — most of all in IFS, where the previous file stopped at naming parts; the rewrite adds the 6 F's protocol, manager-appreciation scripts, firefighter-as-part framing (vs. CBT habit-substitution), and an Exile-trust protocol for when the wounded part rejects the Self's offering.

---

## [2.3.1] - 2026-05-23

### Changed
- **README "How Sessions Work" section updated** to describe the organic profile structure shipped in 2.3.0. Surfaces the seed-then-evolve model and modality-aware sections so users understand the new behavior without having to read the changelog.

---

## [2.3.0] - 2026-05-23

### Changed
- **Profile structure is now organic, not template-driven.** New installs ship with a minimal seed (`Background`, `Current Focus`, `Notes`) instead of a fixed 6-section template. The LLM is explicitly instructed to add H2 sections as themes emerge across sessions and to organize structure around active modalities — IFS work surfaces a `Parts` section, somatic work surfaces `Body & Nervous System`, narrative work surfaces `Preferred Stories`, etc.
- **CLAUDE.template.md profile-update logic rewritten** to invite section creation when themes consolidate, consolidate fragmented content into dedicated H2s, and preserve H3 substructure (per-person relationship sections, etc.).
- **`doctor` validates structure presence, not template adherence.** A profile with 4+ H2 sections is assumed to have evolved its own coherent structure and isn't second-guessed. Smaller profiles get a soft warning if they lack a Background section (or equivalent).

### For Existing Users
Your folder isn't affected by this release — the LLM-behavior change lives in `CLAUDE.template.md`, which is generated at install time and never modified by `update` (it's user-owned). Your existing profile and CLAUDE.md keep working as they have been. If you want the new profile-evolution behavior for your therapist, either:
- Re-install over your folder with `npx inner-dialogue install --force --path <your-folder> ...` (regenerates `CLAUDE.md` from the new template; preserves `profile.md` and `sessions/`), or
- Manually copy the new "How to update profile.md" block from this repo's `CLAUDE.template.md` into your therapist's `CLAUDE.md`.

Most existing users won't need to do either — your therapist has likely already been creating H2 sections organically (the old "don't create new H2s" instruction was widely ignored in practice once profiles got rich enough).

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
