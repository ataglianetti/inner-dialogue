# Privacy & Security Guide

This guide explains your privacy options—from the basics to maximum protection.

**Quick summary:** Your files already stay on your computer. For most people, that's enough. If you share a computer or want extra protection, read on.

---

## Choose Your Level

| Level | What It Means | Good For |
|-------|---------------|----------|
| **Standard** | Files on your computer, no extra steps | Most people on a personal computer |
| **Password-Protected** | Files locked behind a password | Shared computers, extra peace of mind |
| **Maximum** | Password + offline AI | When privacy is critical |

---

## Standard (Default)

Your therapy files are stored on your computer as regular text files. This is already more private than keeping notes in a cloud app.

**What's protected:**
- Files never leave your computer (unless you sync them somewhere)
- No tracking or data collection by this toolkit
- You can delete everything by removing the folder

**What to be aware of:**
- Anyone who uses your computer could open the files
- Cloud backup services (iCloud, OneDrive, Dropbox) might sync the folder

**Simple steps to improve privacy:**
- Use a login password on your computer
- Turn on disk encryption (FileVault on Mac, BitLocker on Windows)—this protects everything if your computer is lost or stolen
- Don't put your therapy folder in a cloud-synced location

---

## Password-Protected Storage

If you share a computer or want extra protection, you can put your therapy files in a password-protected folder.

### Mac: Built-in Encryption

Macs have this built in—no extra software needed.

**How it works:** Your therapy files go inside an encrypted "disk image." When you want to use them, you enter a password and the folder appears. When you're done, it locks back up.

**To set up manually:**

1. Open **Disk Utility** (search for it in Spotlight)
2. Click **File** → **New Image** → **Blank Image**
3. Name it something like "TherapyVault"
4. Size: 500 MB (it grows as needed)
5. Encryption: **256-bit AES**
6. Click Create and choose a password

**To use:**
1. Double-click the disk image file to open it (enter password)
2. Your files appear in a folder called TherapyVault
3. When done, right-click the folder in Finder and choose "Eject"

**Important:** If you forget your password, your files are gone forever. Use a password manager.

### Windows: VeraCrypt

Windows doesn't have built-in folder encryption, but VeraCrypt is free and works well.

**To set up:**

1. Download VeraCrypt from [veracrypt.fr](https://veracrypt.fr)
2. Open VeraCrypt and click **Create Volume**
3. Choose **Create an encrypted file container**
4. Pick a location and size (500 MB is plenty)
5. Choose a strong password
6. Click Format to create it

**To use:**
1. Open VeraCrypt
2. Pick a drive letter (like T:)
3. Click **Select File** and choose your container
4. Click **Mount** and enter your password
5. Your files appear in the new drive letter
6. When done, click **Dismount**

---

## Maximum Privacy: Offline AI

For when you need your conversations to never leave your computer at all.

### What This Means

When you use Claude or ChatGPT, your messages travel to their servers to be processed. Even with good privacy policies, your words pass through their systems.

With a "local" AI, everything runs on your computer. Nothing is transmitted anywhere.

### The Trade-off

| | Claude/ChatGPT | Local AI |
|---|----------------|----------|
| **Privacy** | Good (not used for training) | Complete (never leaves your computer) |
| **Quality** | Excellent | Good, but not as nuanced |
| **Speed** | Fast | Depends on your computer |
| **Requirements** | Any computer | Newer computer with 16GB+ RAM |

### Getting Started with Local AI

**Easiest option: LM Studio**

[LM Studio](https://lmstudio.ai) gives you a simple app for running AI locally.

1. Download from lmstudio.ai
2. Search for and download a model (try "Llama 3" or "Mistral")
3. Load the model
4. Paste your CLAUDE.md contents as the system prompt
5. Chat locally

**More technical option: Ollama**

[Ollama](https://ollama.ai) runs from the command line and offers more control.

1. Download from ollama.ai
2. Open Terminal and run: `ollama pull llama3.1:8b`
3. Start chatting: `ollama run llama3.1:8b`
4. Paste your CLAUDE.md content when prompted

### Limitations of Local AI

- Less capable than Claude or ChatGPT for nuanced therapeutic conversations
- No automatic file reading (you may need to paste context manually)
- Requires a reasonably powerful computer
- Setup is more hands-on

---

## Understanding Cloud AI Privacy

When you use Claude or ChatGPT through their regular websites, your conversations may be used to improve their AI (unless you opt out).

**Claude Code and API access are different.** When you use Claude Code (what this toolkit uses), your conversations:
- Are **not** used to train the AI
- Are kept for about 30 days for safety monitoring, then deleted
- Are handled under stricter privacy policies

This is true for both Claude (Anthropic) and ChatGPT (OpenAI) when using their APIs.

**Bottom line:** Using Claude Code is more private than chatting on claude.ai or chatgpt.com directly.

---

## Avoiding Cloud Sync

If you use iCloud, OneDrive, Dropbox, or Google Drive, be careful where you put your therapy folder.

**The issue:** These services automatically upload files to the cloud. Your therapy notes could end up on their servers without you realizing it.

**Simple fix:** Put your therapy folder somewhere that doesn't sync.

**Mac:** Avoid putting it in Documents or Desktop if they sync to iCloud. Instead, create a folder directly in your home folder (like `~/Sage`).

**Windows:** Avoid the OneDrive folder. Create your therapy folder directly in `C:\Users\YourName\` instead.

**Or:** Use password-protected storage (see above). Even if the encrypted file syncs, no one can read it without your password.

---

## Backing Up Safely

Your therapy notes are valuable. Here's how to back them up without compromising privacy:

**If using password protection:**
Your encrypted container can be backed up anywhere (even cloud storage). Without your password, it's unreadable.

**If not using password protection:**
- Back up to an encrypted USB drive you keep somewhere safe
- Don't email session notes to yourself
- Don't back up to cloud services without encryption

**Important:** Store your encryption password in a password manager, not in a file next to your therapy folder.

---

## Quick Privacy Checklist

**Basics (everyone should do these):**
- [ ] Put therapy folder outside cloud-synced locations
- [ ] Use a login password on your computer
- [ ] Turn on disk encryption (protects if your computer is lost/stolen)
  - Mac: System Settings → Privacy & Security → FileVault
  - Windows: Search "BitLocker" in Settings

**For shared computers:**
- [ ] Use password-protected storage (see above)
- [ ] Lock the folder when not in use
- [ ] Store your password in a password manager

**For maximum privacy:**
- [ ] All of the above
- [ ] Use a local AI instead of Claude/ChatGPT

---

*Questions? Open an issue on [GitHub](https://github.com/ataglianetti/inner-dialogue/issues).*
