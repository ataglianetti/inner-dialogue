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

## Step 2: Download the Starter Kit

Open Terminal (Mac) or PowerShell (Windows) and run these commands:

```
git clone https://github.com/ataglianetti/ai-therapy-kit.git
cd ai-therapy-kit
```

**Don't have git?** Go to the [GitHub page](https://github.com/ataglianetti/ai-therapy-kit), click the green "Code" button, choose "Download ZIP", and extract it somewhere you'll remember.

---

## Step 3: Run Setup

From the ai-therapy-kit folder, type:

```
claude
```

Claude will guide you through setup by asking a few questions:

1. **Therapist name** — What to call your AI therapist (e.g., Sage, Willow, Quinn)
2. **Communication style** — Warm, direct, coach-like, or down-to-earth
3. **Therapeutic approaches** — Which methods to use (CBT, ACT, DBT, etc.)
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
Make sure you're in the `ai-therapy-kit` folder (not your therapy folder) when first running `claude`.

---

## More Questions?

See the [FAQ in the README](../README.md#faq) for common questions about cost, privacy, and customization.
