# Changelog

All notable changes to Inner Dialogue.

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
