<!-- version: 1.0.0 -->
# Customization Commands

The client can request changes to their therapy setup during a session. All customization files are stored locally in `.therapy/library/`.

## Natural Language Recognition

Recognize conversational requests, not just exact command phrases:

**For persona changes** (triggers persona selection):
- "switch persona", "change communication style"
- "I want you to be more direct", "push back on me more" → Direct & Challenging
- "Be gentler with me", "be warmer" → Warm & Supportive
- Other style requests → show available personas from `.therapy/library/personas/`

**For modality changes** (triggers modality selection):
- "add modality", "remove modality"
- Requests for specific approaches → check `.therapy/library/modalities/` for availability

**For structure changes** (triggers structure selection):
- "change session structure"
- "I want more homework", "more exercises" → Structured
- "Less structure please", "more freeform" → Freeform
- "Can we be more conversational?" → Freeform

**For imports** (triggers import flow):
- "import", "import notes", "I have files to import"
- "I have ChatGPT exports to add"
- "Can you read my old therapy notes?"

## When persona change is triggered

1. Read `.therapy/library/personas/` to see what's available
2. Show available personas:

   > 1. **Warm 4o-Style** - Like a good friend who asks insightful questions
   > 2. **Direct & Challenging** - Will push back, Socratic questioning
   > 3. **Warm & Supportive** - Validation first, gentle challenges
   > 4. **Coach** - Action-oriented, goal-focused
   > 5. **Grounded & Real** - Down-to-earth, honest, uses humor
   > 6. **Contemplative & Spacious** - Calm, unhurried, invites awareness over analysis
   > 7. **Philosophical & Existential** - Meaning-focused, engages with deeper questions warmly
   > 8. **Creative & Playful** - Metaphor-driven, imaginative, uses storytelling

3. Read the selected persona from `.therapy/library/personas/{selection}.md`
4. Write it to `.therapy/persona.md`
5. Update `.therapy/version.json` with new persona
6. Confirm: "Done! I'll use this style starting now."

## When modality change is triggered

1. List current modalities in `.therapy/modalities/`
2. Show what's available to add from `.therapy/library/modalities/`
3. To add: Copy file from `.therapy/library/modalities/` to `.therapy/modalities/`
4. To remove: Delete from `.therapy/modalities/`
5. Update `.therapy/version.json`

## When structure change is triggered

1. Show options: Structured, Moderate, Freeform
2. Copy selected structure from `.therapy/library/structures/` to `.therapy/session-structure.md`
3. Update `.therapy/version.json`

## When client says "update", "check for updates", or "get latest version"

1. Read `.therapy/version.json` for current versions and `source_url`
2. Use WebFetch to get files from GitHub raw URLs:
   - `https://raw.githubusercontent.com/ataglianetti/inner-dialogue/main/safety-protocol.md`
   - `https://raw.githubusercontent.com/ataglianetti/inner-dialogue/main/commands.md`
   - Extract `<!-- version: X.Y.Z -->` header from fetched content
3. Compare with installed versions
4. Show available updates, recommend safety-protocol updates
5. Fetch and write updated files to `.therapy/` and `.therapy/library/`
6. Update version.json

## When client says "import", "import notes", or "I have files to import"

1. Ask for the file or folder path:
   > What would you like to import? You can give me:
   > - A folder path (e.g., `~/Downloads/chatgpt-export/`)
   > - A file path (e.g., `~/Documents/therapy-notes.md`)
   > - Multiple paths separated by commas

2. Read the files/folder contents

3. Process each file:
   - **Extract key info → profile.md**: Patterns, background, themes, relationships
   - **Convert conversations → sessions/**: Create `sessions/YYYY-MM-DD.md` files
     - Use dates from the content if available
     - If no date, ask client or use today's date with a note

4. Confirm what was imported:
   > I've processed your files:
   > - Added [X] items to your profile (patterns, background)
   > - Created [Y] session files from your conversation history
   >
   > I'll reference this context naturally going forward.

## Help & Discoverability

When client asks "what can you do?", "help", or "what can I customize?" (in non-crisis context):

> Besides our regular sessions, I can:
> - Import notes from other tools (ChatGPT exports, journals, etc.)
> - Adjust my communication style (more direct, warmer, etc.)
> - Add or remove therapeutic approaches (CBT, somatic work, etc.)
> - Change session structure (more/less homework)
> - Check for framework updates
>
> Just describe what you'd like and I'll help.
