# Getting Started

This guide walks you through setting up your AI therapist from scratch. No technical experience needed.

---

## Step 1: Get Claude Code

Claude Code is what lets your AI therapist read your profile, remember past sessions, and save notes. You need it before you can set up your therapist.

### Option A: Claude Pro ($20/month, simplest)

1. Go to [claude.ai](https://claude.ai) and sign up for Claude Pro
2. Download Claude Code from [claude.ai/code](https://claude.ai/code)
3. Run the installer
4. Open **Terminal** (Mac) or **PowerShell** (Windows)
5. Type `claude` and press Enter
6. Sign in with your Claude account when prompted

Done! Move to Step 2.

### Option B: Pay-per-use (no subscription)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add a payment method
3. Click **API Keys** → **Create new key**
4. Copy the key (it starts with `sk-ant-`)
5. Download Claude Code from [claude.ai/code](https://claude.ai/code)
6. Run the installer
7. Open **Terminal** (Mac) or **PowerShell** (Windows)
8. Type `claude` and paste your API key when prompted

Typical cost: $5-20/month depending on how often you chat.

---

## Step 2: Download Inner Dialogue

Open Terminal (Mac) or PowerShell (Windows) and run these commands:

```
git clone https://github.com/ataglianetti/inner-dialogue.git
cd inner-dialogue
```

**Don't have git?** Go to the [GitHub page](https://github.com/ataglianetti/inner-dialogue), click the green "Code" button, choose "Download ZIP", and extract it somewhere you'll remember.

---

## Step 3: Run Setup

From the inner-dialogue folder:

**Mac/Linux:** Double-click `setup.command`

**Windows:** Double-click `setup.bat`

**Or from Terminal/PowerShell:**
```
claude -p "start"
```

Claude will guide you through setup by asking a few questions:

1. **Therapist name** — What to call your AI therapist (e.g., Sage, Willow, Quinn)
2. **Communication style** — Warm 4o-style or direct & challenging (more available with Expansion Pack)
3. **Therapeutic approaches** — CBT by default (Expansion Pack adds ACT, DBT Skills, and more)
4. **Storage location** — Where to save your session files
5. **Import history** (optional) — Bring in notes from ChatGPT or other tools

### Importing Existing Notes

If you've been using ChatGPT for therapy-like conversations, you can import that history:

1. In ChatGPT: Go to Settings → Data Controls → Export
2. You'll get a ZIP file
3. During setup, tell Claude you want to import and provide the file path

Your AI therapist will read these notes to understand your background.

---

## Step 4: Start a Session

At the end of setup, Claude will ask if you want to start your first session. Say yes!

### Future Sessions

**Easiest way:** Double-click the launcher script in your therapy folder:
- Mac/Linux: `start-session.command`
- Windows: `start-session.bat`

Tip: Drag this to your Dock (Mac) or taskbar (Windows) for one-click access.

**Or use Terminal:**
```
cd ~/Sage && claude
```
(Replace `Sage` with your therapist's name/folder)

### During a Session

Just talk naturally. Say hello, share what's on your mind. Your AI therapist will:
- Welcome you or pick up where you left off
- Remember everything from previous sessions
- Save notes when you're done

To end a session, say goodbye or just close the window.

---

## Viewing Your Notes

Your sessions are saved as regular text files. You can open them with any text editor (TextEdit, Notepad, etc.).

For a nicer reading experience, try [Obsidian](https://obsidian.md) (free):
1. Download Obsidian
2. Open your therapy folder as a "vault"
3. Browse sessions, search across notes, see connections between topics

---

## Troubleshooting

**"command not found: claude"**
Make sure you installed Claude Code and restarted your terminal.

**Claude doesn't seem like a therapist**
Make sure you're in your therapy folder before running `claude`. Check that `CLAUDE.md` exists in that folder.

**Setup didn't start automatically**
Make sure you're in the `inner-dialogue` folder (not your therapy folder) when first running `claude`.

---

## Updating Your Therapist

Inner Dialogue periodically receives updates—improved safety protocols, refined therapeutic techniques, bug fixes. Here's how to get them:

### Check for Updates

During any session, just say: **"update my therapist"** or **"check for updates"**

Your therapist will:
- Fetch the latest versions from GitHub
- Compare your installed versions with the latest
- Show what's changed
- Apply updates you approve

No need to keep the Inner Dialogue repo after setup—your therapist folder is self-contained and updates directly from GitHub.

### What Gets Updated

| Component | Updated? | Notes |
|-----------|----------|-------|
| Safety protocols | Yes (recommended) | Crisis resources, safety guidelines |
| Modalities | Yes | Therapeutic technique refinements |
| Session structures | Yes | Session flow improvements |
| Your profile.md | Never | Your personal data is untouched |
| Your sessions/ | Never | Your session history is untouched |
| Your CLAUDE.md | Never | Your therapist's persona stays the same |

### Safety Protocol Updates

**Always accept safety protocol updates.** These contain crisis resources and guidelines that should never be stale. Claude will specifically recommend these updates.

---

## Migrating from an Older Version

If you set up your therapist before version 1.0.0 (the split-file architecture), you can migrate to the new format:

1. Open the inner-dialogue repo in Claude Code
2. Say: **"migrate my existing therapist"**
3. Claude will:
   - Read your existing CLAUDE.md to understand your setup
   - Create the new `.therapy/` folder structure
   - Preserve all your sessions and profile data

Benefits of migrating:
- Smaller CLAUDE.md = faster session startup
- Independent component updates
- Better organized files

---

## Customizing After Setup

You can change your therapist's configuration anytime—just ask during a session. Your therapist knows where to find the source files.

### Switch Communication Style

Say: **"switch persona"**

Choose from:
- Warm 4o-Style
- Direct & Challenging

With the [Expansion Pack](#expansion-pack): Warm & Supportive, Coach, Grounded & Real

This changes how your therapist communicates without affecting their memory of you.

### Add or Remove Therapeutic Approaches

Say: **"add modality"** or **"remove modality"**

Core includes CBT. With the [Expansion Pack](#expansion-pack), you can add ACT, DBT Skills, Somatic Experiencing, Lifespan Integration, and Psychodynamic.

### Change Session Structure

Say: **"change session structure"**

Switch between Structured, Moderate, or Freeform session styles.

### Self-Contained After Setup

After setup completes, your therapist folder is fully self-contained. You can safely delete the inner-dialogue repo if you want—all customization options are stored in your therapist's `.therapy/library/` folder, and updates are fetched directly from GitHub.

---

## More Questions?

See the [FAQ in the README](../README.md#faq) for common questions about cost, privacy, and customization.
