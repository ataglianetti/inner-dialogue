# Getting Started

This guide is for people who have never used Claude Code or similar tools. If you've only used ChatGPT through the web, start here.

## What is Claude Code?

Claude Code is a terminal application that lets Claude read and write files on your computer. This is what makes persistent therapy sessions possible: your AI therapist can read your profile and past sessions, then save notes after each conversation.

---

## Step 1: Get Claude Code Access

### Option A: Claude Pro Subscription (Simplest)

If you have a **Claude Pro subscription** ($20/month), Claude Code is included:

1. Go to [claude.ai](https://claude.ai) and sign up for Pro
2. Download Claude Code from [claude.ai/code](https://claude.ai/code)
3. Run the installer
4. Open Terminal (Mac) or PowerShell (Windows) and type `claude`
5. Sign in with your Claude account when prompted

That's it. You're ready for Step 2.

### Option B: API Key (Pay-per-use)

If you want usage-based pricing instead of a subscription:

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add a payment method
3. Go to API Keys → Create new key
4. Copy the key (starts with `sk-ant-`)
5. Download Claude Code from [claude.ai/code](https://claude.ai/code)
6. Run `claude` and paste your API key when prompted

API pricing is usage-based. Typical therapy use: $5-20/month depending on session length and frequency.

> **Privacy note:** Both options keep conversations off training data. API has shorter retention.

---

## Step 2: Download the Starter Kit

Open Terminal (Mac) or PowerShell (Windows) and run:

```bash
git clone https://github.com/ataglianetti/ai-therapy-kit.git
cd ai-therapy-kit
```

**Don't have git?** Download the ZIP from the GitHub page and extract it somewhere you'll remember.

---

## Step 3: Run Setup

From the ai-therapy-kit folder, run:

```bash
claude
```

Claude will walk you through setup conversationally:
- What to name your AI therapist
- Communication style (warm, direct, coach, or grounded)
- Which therapeutic approaches to use
- Where to store your session files
- Whether to import existing notes (optional)

**Importing existing notes:** If you've been using ChatGPT or another tool for therapy, you can import that history. Claude accepts:
- ChatGPT exports (Settings → Data Controls → Export gives you a ZIP file)
- Markdown or text files
- PDFs

Your AI therapist will read these to understand your background and update your profile automatically.

This creates your personalized therapy folder with a `CLAUDE.md` file that shapes how your AI therapist behaves.

---

## Step 4: Start a Session

At the end of setup, Claude will ask if you want to start your first session right away. Say yes!

For future sessions, you have two options:

**Option A: Launcher script (easiest)**
If you chose to create a launcher during setup, just double-click `start-session.command` (Mac/Linux) or `start-session.bat` (Windows) in your therapy folder. You can drag this to your Dock or taskbar for quick access.

**Option B: Terminal**
```bash
cd ~/sage && claude   # replace with your folder name
```

Just talk. Say hello, share what's on your mind. Your AI therapist will:
- Welcome you (first session) or pick up where you left off
- Remember everything from previous sessions
- Save notes when you're done

To end a session, just say goodbye or close the terminal.

---

## Viewing Your Sessions (Optional)

Your sessions are saved as plain text files. You can read them with any text editor, or use [Obsidian](https://obsidian.md) (free) for a nicer experience:

1. Download Obsidian
2. Open your therapy folder as a "vault"
3. Browse sessions, search across all notes, see connections

---

## Troubleshooting

**"command not found: claude"**
- Make sure you installed Claude Code and restarted your terminal

**Claude doesn't know it's a therapist**
- Make sure you're in your therapy folder (`cd ~/ai-therapy`) before running `claude`
- Check that `CLAUDE.md` exists in that folder

**Setup didn't start**
- Make sure you're in the `ai-therapy-kit` folder when running `claude`
- Check that `CLAUDE.md` exists in the repo

---

## Questions

**How much does this cost?**
- Claude Pro: $20/month (includes Claude Code)
- API: ~$5-20/month depending on usage

**Can I use ChatGPT instead?**
- Yes. Copy the contents of `CLAUDE.md` into ChatGPT's Custom Instructions or a GPT Project. You won't get automatic session saving, but the therapeutic framework still works.

**Is this private?**
- Your files stay on your computer
- Conversations go through Anthropic's servers but aren't used for training
- For maximum privacy, use a local LLM (advanced)
