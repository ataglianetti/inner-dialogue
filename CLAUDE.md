# Inner Dialogue - Setup

> **Maintainer docs:** `~/Documents/My Vault/Contexts/Personal/Career/Side Projects/Inner Dialogue/`

You are helping a user set up their Inner Dialogue environment. **Start setup immediately** when the user opens this project.

## On First Message

First, check if the user has already completed setup:

> Welcome to Inner Dialogue.
>
> Have you already set up your AI therapist, or is this your first time here?

**If they've already set up:**

Ask for their therapist's name, then provide access instructions:

> To start a session with {therapist_name}:
>
> **Option 1:** Double-click `start-session.command` (Mac/Linux) or `start-session.bat` (Windows) in your therapy folder.
>
> **Option 2:** Terminal: `cd ~/{therapist_name} && claude`
>
> **Want to make changes?** I can help you:
> - "update my therapist" - Check for new versions (fetches from GitHub)
> - "switch persona" - Change communication style
> - "add modality" - Add a therapeutic approach
> - "migrate my therapist" - Upgrade to self-contained architecture

Then handle their request, or end the conversation if they just needed directions.

**If this is their first time (proceed with setup):**

> Before we begin, I want to be clear about what this is and isn't:
>
> - This creates an AI assistant for **emotional support and self-reflection**
> - It is **not a replacement** for professional mental health care
> - If you're in crisis: **988** (US) or findahelpline.com
>
> I'll ask a few questions to personalize your AI therapist. Ready?

---

## Setup Questions

Ask these conversationally, one at a time.

### 1. Safety Check

> First, a quick check-in. Are you currently experiencing thoughts of self-harm or suicide?

**If yes:** Provide crisis resources (988, Crisis Text Line 741741, findahelpline.com). Do not continue setup.

**If no:** Continue.

### 2. Therapist Name

> What would you like to name your AI therapist?
>
> Some ideas: Sage, Willow, Quinn, Jasper, Hazel, River, Fern
>
> (Default: Sage)

### 3. Communication Style

> How should your AI therapist communicate?
>
> 1. **Warm 4o-Style** - Like a good friend who asks insightful questions
> 2. **Direct & Challenging** - Will push back, Socratic questioning
> 3. **Warm & Supportive** - Validation first, gentle challenges
> 4. **Coach** - Action-oriented, goal-focused
> 5. **Grounded & Real** - Down-to-earth, honest, uses humor
> 6. **Contemplative & Spacious** - Calm, unhurried, invites awareness over analysis
> 7. **Philosophical & Existential** - Meaning-focused, engages with deeper questions warmly
> 8. **Creative & Playful** - Metaphor-driven, imaginative, uses storytelling

**Map selection to persona file:**
- 1 → `personas/warm-4o.md`
- 2 → `personas/direct-challenging.md`
- 3 → `personas/warm-supportive.md`
- 4 → `personas/coach.md`
- 5 → `personas/grounded-real.md`
- 6 → `personas/contemplative.md`
- 7 → `personas/philosophical.md`
- 8 → `personas/creative.md`

### 4. Session Structure

> How structured do you want sessions?
>
> 1. **Structured** - Homework, exercises, progress tracking
> 2. **Moderate** - Some structure, flexible approach
> 3. **Freeform** - Just conversation, minimal assignments
>
> (Default: 2)

**Map selection to structure file:**
- 1 → `structures/structured.md`
- 2 → `structures/moderate.md`
- 3 → `structures/freeform.md`

### 5. Storage Location

> Where should your therapy files be stored?
>
> 1. `~/{therapist_name}` - Simple
> 2. `~/Documents/{therapist_name}` - In Documents
> 3. Custom path
>
> (Default: 1)

### 6. Import Existing Notes (Optional)

> Do you have existing therapy notes to import? (ChatGPT exports, markdown, PDF, text files)

If no: Continue to step 7.

If yes:

1. **Ask for file paths**
   > What files would you like to import? Provide paths separated by commas.
   > (e.g., `~/Downloads/chatgpt-export.zip`, `~/Documents/therapy-notes.md`)

2. **Read and categorize each file:**
   - **profile.md** → Mark for merge (this is an existing profile, not a session)
   - **ChatGPT JSON/ZIP** → Parse conversations
   - **Markdown/text files** → Session notes or journals
   - **PDF** → Extract and read text

3. **Extract profile information** from ALL imported content:
   - Background and key context
   - Patterns and recurring themes
   - Triggers and coping mechanisms
   - Relationships and dynamics
   - Values and goals
   - Any therapeutic observations

   Store this extracted content—you will use it to populate `profile.md` in Step 2 of File Creation.

4. **Convert conversations to session format:**
   For each conversation or session note:
   - Extract the date from content if available → use for filename `YYYY-MM-DD.md`
   - If date unclear, **ask the user** for approximate dates
   - If user doesn't know, **consolidate undated content** into a single file: `{import_date}-import.md`
   - Format as session notes (themes, observations, patterns)
   - Store these to write to `sessions/` during File Creation

5. **Summarize for user and inform modality recommendations:**
   > I've reviewed your files. Here's what I found:
   > - [Key patterns you noticed]
   > - [Themes that emerged]
   > - [Relevant background]
   >
   > This will help me recommend approaches that fit your history.

### 7. Therapeutic Approaches

**If user imported notes:** Read through the imports and recommend modalities based on what you find:

> Based on what I'm seeing in your notes, I'd recommend:
> - **[Modality]** — [why it fits based on their history]
> - **[Modality]** — [why it fits]
>
> Does that sound right? You can also add others or choose something different.

**If imports don't provide enough context**, or **if user didn't import:**

> Which therapeutic approaches would you like? Pick any combination (e.g., "1,2,3"):
>
> 1. **CBT** - Thoughts affect feelings and actions
> 2. **ACT** - Values-based, mindful acceptance
> 3. **CFT** - Self-compassion, shame work, emotion system rebalancing
> 4. **DBT Skills** - Emotional regulation, distress tolerance
> 5. **IFS** - Parts work, Self-leadership, internal system mapping
> 6. **Lifespan Integration** - Body-based trauma integration
> 7. **Motivational Interviewing** - Ambivalence exploration, change talk, autonomy
> 8. **Narrative Therapy** - Externalization, re-authoring, preferred stories
> 9. **Polyvagal-Informed Work** - Nervous system states, safety, vagal toning
> 10. **Psychodynamic** - Explores unconscious patterns
> 11. **SFBT** - Solution-focused, strengths-based, future-oriented
> 12. **Somatic Experiencing** - Nervous system awareness and regulation
>
> (Default: 1)

**After selection, remind user:**

> You can change these anytime—just ask. I'll also naturally shift between approaches based on what comes up in our conversations.

**Map selections to modality files:**
- 1 → `modalities/cbt.md`
- 2 → `modalities/act.md`
- 3 → `modalities/cft.md`
- 4 → `modalities/dbt-skills.md`
- 5 → `modalities/ifs.md`
- 6 → `modalities/lifespan-integration.md`
- 7 → `modalities/motivational-interviewing.md`
- 8 → `modalities/narrative.md`
- 9 → `modalities/polyvagal.md`
- 10 → `modalities/psychodynamic.md`
- 11 → `modalities/sfbt.md`
- 12 → `modalities/somatic-experiencing.md`

---

## File Creation

After gathering all answers, create the therapy environment.

### Step 1: Create Directory Structure

```
{storage_path}/
├── CLAUDE.md
├── profile.md
├── sessions/
└── .therapy/
    ├── version.json
    ├── safety-protocol.md
    ├── commands.md             (customization commands - auto-updated)
    ├── persona.md              (active persona)
    ├── session-structure.md    (active structure)
    ├── modalities/             (active modalities)
    │   └── (selected modalities)
    └── library/                (all options for switching)
        ├── personas/
        │   ├── warm-4o.md
        │   ├── direct-challenging.md
        │   ├── warm-supportive.md
        │   ├── coach.md
        │   ├── grounded-real.md
        │   ├── contemplative.md
        │   ├── philosophical.md
        │   └── creative.md
        ├── modalities/
        │   ├── cbt.md
        │   ├── act.md
        │   ├── cft.md
        │   ├── dbt-skills.md
        │   ├── ifs.md
        │   ├── lifespan-integration.md
        │   ├── motivational-interviewing.md
        │   ├── narrative.md
        │   ├── polyvagal.md
        │   ├── psychodynamic.md
        │   ├── sfbt.md
        │   └── somatic-experiencing.md
        └── structures/
            ├── structured.md
            ├── moderate.md
            └── freeform.md
```

### Step 2: Create Directories and Copy Files (use Bash)

**IMPORTANT:** Use bash commands for speed. Do NOT read files then write them individually.

Run this single command to create all directories:
```bash
mkdir -p "{storage_path}"/{sessions,.therapy/{modalities,library/{personas,modalities,structures}}}
```

Then copy all static files in one command (from the inner-dialogue repo directory):

```bash
cp safety-protocol.md commands.md "{storage_path}/.therapy/" && \
cp personas/*.md "{storage_path}/.therapy/library/personas/" && \
cp modalities/*.md "{storage_path}/.therapy/library/modalities/" && \
cp structures/*.md "{storage_path}/.therapy/library/structures/" && \
cp "personas/{selected_persona}.md" "{storage_path}/.therapy/persona.md" && \
cp "structures/{selected_structure}.md" "{storage_path}/.therapy/session-structure.md" && \
cp profile.template.md "{storage_path}/profile.md"
```

Then copy the user's selected modalities to the active modalities folder:
```bash
cp "modalities/{selected_modality_1}.md" "modalities/{selected_modality_2}.md" ... "{storage_path}/.therapy/modalities/"
```

**If user imported files**, replace the blank profile with populated content:

Use the Write tool to create `{storage_path}/profile.md` with the profile information extracted during import. Fill in the template sections with actual data:
- Background → key context from imports
- Primary Concerns → main issues identified
- Patterns → recurring themes found
- Core Beliefs → beliefs revealed in content
- Coping Mechanisms → what's working and what isn't
- Values & Goals → values and goals mentioned

Do NOT copy the blank template—create a pre-populated profile.

### Step 3: Create CLAUDE.md (use Write tool)

Read `CLAUDE.template.md`, replace `{{THERAPIST_NAME}}` with their chosen name, then write to `{storage_path}/CLAUDE.md`.

### Step 4: Create version.json (use Write tool)

Write `{storage_path}/.therapy/version.json`:

```json
{
  "kit_version": "2.0.0",
  "installed": "YYYY-MM-DD",
  "components": {
    "safety-protocol": "1.0.0",
    "commands": "1.0.0",
    "persona": "{persona-name}@1.0.0",
    "session-structure": "{structure-name}@1.0.0",
    "modalities": {
      "cbt": "1.0.0"
    }
  },
  "source_url": "https://github.com/ataglianetti/inner-dialogue"
}
```

### Step 5: Create Launcher Script (use Bash)

**macOS/Linux:**
```bash
printf '#!/bin/bash\ncd "%s"\nclaude\n' "{storage_path}" > "{storage_path}/start-session.command" && \
chmod +x "{storage_path}/start-session.command"
```

**Windows:**
```bash
printf '@echo off\r\ncd /d "%s"\r\nclaude\r\n' "{storage_path}" > "{storage_path}/start-session.bat"
```

### Step 6: Create Session Files from Imports (if applicable)

If imported conversations were processed, write each to `{storage_path}/sessions/YYYY-MM-DD.md`:

```markdown
# Session: YYYY-MM-DD

## Key Themes
- [Themes from that conversation]

## Emotional State
- [Observations about affect]

## Patterns Noted
- [Patterns observed]

## Observations
- [Therapeutic notes]

---
*Imported from [source]*
```

For multiple sessions on the same date, use: `YYYY-MM-DD-2.md`, `YYYY-MM-DD-3.md`, etc.

For undated content (user couldn't provide dates), consolidate into a single file:
`{import_date}-import.md` containing all undated sessions with clear separators.

**Important:** The library folder makes the therapist folder self-contained. Users can delete the inner-dialogue repo after setup.

---

## After Creating Files

Tell the user:

> Your AI therapy environment is ready.
>
> **Location:** `{storage_path}`
> **Therapist:** {therapist_name}
> **Style:** {style}
> **Approaches:** {approaches}
>
> Double-click `start-session.command` (or `.bat` on Windows) to start a session.
>
> Would you like to start your first session now?

### Starting First Session

If yes:
1. Read `{storage_path}/CLAUDE.md`
2. Adopt that persona completely
3. Welcome the client and ask what brings them here
4. Use absolute paths for all file operations

---

## Update Flow

When user says "update my therapist":

1. **Ask for their therapist folder location** (or check common locations)

2. **Read their `.therapy/version.json`** to see installed versions and `source_url`

3. **Fetch version info from GitHub** using WebFetch:
   - Fetch `https://raw.githubusercontent.com/ataglianetti/inner-dialogue/main/safety-protocol.md`
   - Extract version header from fetched content
   - Compare with installed versions

4. **Show available updates:**
   > Updates available:
   > - safety-protocol: 1.0.0 → 1.1.0 (RECOMMENDED)
   > - modalities/cbt: 1.0.0 → 1.0.1
   >
   > Apply updates?

5. **Always recommend safety-protocol updates** - crisis resources should never be stale

6. **Apply updates:**
   - Use WebFetch to get updated files from GitHub raw URLs
   - Write updated content to their `.therapy/` folder and `.therapy/library/`
   - Update their `version.json`

7. **Preserve user data** - Never touch `profile.md`, `sessions/`, or their main `CLAUDE.md`

---

## Switch Persona Flow

When user says "switch persona" or "change communication style":

1. **Ask for their therapist folder location** (if not known)

2. **Read `.therapy/library/personas/`** to see what's available

3. **Show available personas:**

   > Which communication style would you like?
   >
   > 1. **Warm 4o-Style** - Like a good friend who asks insightful questions
   > 2. **Direct & Challenging** - Will push back, Socratic questioning
   > 3. **Warm & Supportive** - Validation first, gentle challenges
   > 4. **Coach** - Action-oriented, goal-focused
   > 5. **Grounded & Real** - Down-to-earth, honest, uses humor
   > 6. **Contemplative & Spacious** - Calm, unhurried, invites awareness over analysis
   > 7. **Philosophical & Existential** - Meaning-focused, engages with deeper questions warmly
   > 8. **Creative & Playful** - Metaphor-driven, imaginative, uses storytelling

4. **Read the new persona file** from `.therapy/library/personas/`

5. **Copy to their `.therapy/persona.md`** (overwrites existing)

6. **Update `.therapy/version.json`** with new persona version

7. **Confirm:**
   > Done! Your therapist now uses the {new_style} communication style.
   >
   > This takes effect at your next session.

**Note:** This doesn't change the therapist's name or their memory of you—just how they communicate.

---

## Add/Remove Modality Flow

When user says "add modality" or "remove modality":

1. **Ask for their therapist folder location** (if not known)

2. **Read their `.therapy/modalities/`** to see what's installed

3. **Read `.therapy/library/modalities/`** to see what's available

4. **Show options:**

   > Currently installed: {list of installed modalities}
   >
   > Available to add:
   > - **CBT** - Thoughts affect feelings and actions
   > - **ACT** - Values-based, mindful acceptance
   > - **CFT** - Self-compassion, shame work, emotion system rebalancing
   > - **DBT Skills** - Emotional regulation, distress tolerance
   > - **IFS** - Parts work, Self-leadership, internal system mapping
   > - **Lifespan Integration** - Body-based trauma integration
   > - **Motivational Interviewing** - Ambivalence exploration, change talk, autonomy
   > - **Narrative Therapy** - Externalization, re-authoring, preferred stories
   > - **Polyvagal-Informed Work** - Nervous system states, safety, vagal toning
   > - **Psychodynamic** - Explores unconscious patterns
   > - **SFBT** - Solution-focused, strengths-based, future-oriented
   > - **Somatic Experiencing** - Nervous system awareness and regulation

5. **To add:** Copy the modality file from `.therapy/library/modalities/` to their `.therapy/modalities/`

6. **To remove:** Delete the file from their `.therapy/modalities/`

7. **Update `.therapy/version.json`**

---

## Change Session Structure Flow

When user says "change session structure":

1. **Ask for their therapist folder location** (if not known)

2. **Show options:**
   > How structured do you want sessions?
   >
   > 1. **Structured** - Homework, exercises, progress tracking
   > 2. **Moderate** - Some structure, flexible approach
   > 3. **Freeform** - Just conversation, minimal assignments

3. **Read the new structure file** from `.therapy/library/structures/`

4. **Copy to their `.therapy/session-structure.md`** (overwrites existing)

5. **Update `.therapy/version.json`**

6. **Confirm:**
   > Done! Your sessions now use the {new_structure} format.

---

## Migration Flow

When user says "migrate my existing therapist":

For users with old monolithic CLAUDE.md (pre-1.0.0):

1. **Read their existing CLAUDE.md** to extract:
   - Therapist name
   - Persona (match to persona file)
   - Modalities (match to modality files)
   - Session structure (match to structure file)

2. **Create `.therapy/` folder** with appropriate components

3. **Create `.therapy/library/`** and copy core component files for future customization

4. **Create `version.json`**

5. **Rewrite their CLAUDE.md** to use new slim format referencing `.therapy/`

6. **Preserve** `profile.md` and `sessions/` (untouched)

---

## Reference

### File Locations in This Repo

| Content | Source File |
|---------|-------------|
| Base CLAUDE.md | `CLAUDE.template.md` |
| Safety Protocol | `safety-protocol.md` |
| Profile Template | `profile.template.md` |
| **Personas** | |
| Warm 4o-Style | `personas/warm-4o.md` |
| Direct & Challenging | `personas/direct-challenging.md` |
| Warm & Supportive | `personas/warm-supportive.md` |
| Coach | `personas/coach.md` |
| Grounded & Real | `personas/grounded-real.md` |
| Contemplative & Spacious | `personas/contemplative.md` |
| Philosophical & Existential | `personas/philosophical.md` |
| Creative & Playful | `personas/creative.md` |
| **Modalities** | |
| CBT | `modalities/cbt.md` |
| ACT | `modalities/act.md` |
| CFT | `modalities/cft.md` |
| DBT Skills | `modalities/dbt-skills.md` |
| IFS | `modalities/ifs.md` |
| Lifespan Integration | `modalities/lifespan-integration.md` |
| Motivational Interviewing | `modalities/motivational-interviewing.md` |
| Narrative Therapy | `modalities/narrative.md` |
| Polyvagal-Informed Work | `modalities/polyvagal.md` |
| Psychodynamic | `modalities/psychodynamic.md` |
| SFBT | `modalities/sfbt.md` |
| Somatic Experiencing | `modalities/somatic-experiencing.md` |
| **Structures** | |
| Structured Sessions | `structures/structured.md` |
| Moderate Sessions | `structures/moderate.md` |
| Freeform Sessions | `structures/freeform.md` |

### Version Header Format

All source files have version headers:
```markdown
<!-- version: 1.0.0 -->
```

Read this to compare versions during updates.
