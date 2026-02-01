# Security Guide

This guide covers privacy and security options for your AI therapy data.

---

## Security Tiers

| Tier | What It Does | Best For |
|------|--------------|----------|
| **Standard** | Local files, no sync | Most users |
| **Encrypted** | Password-protected folder | Shared computers, privacy-conscious |
| **Maximum** | Encrypted + local LLM | High-stakes privacy needs |

---

## Standard Security (Default)

Your therapy files are stored locally in plain markdown. This is sufficient for most users on a personal computer.

**What's protected:**
- Files never leave your machine (unless you sync them)
- `.gitignore` excludes sensitive files from version control
- No telemetry or data collection

**What's not protected:**
- Anyone with access to your computer can read the files
- If your computer is compromised, files are exposed
- Cloud backups (iCloud, OneDrive) may sync the folder

**Recommendations:**
- Use your OS login password
- Enable full-disk encryption (FileVault on Mac, BitLocker on Windows)
- Exclude the therapy folder from cloud sync

---

## Encrypted Storage

For shared computers or heightened privacy needs.

### macOS: Encrypted Disk Image

macOS includes built-in encryption. No additional software needed.

**During setup:** Select "Encrypted" when prompted for security level. The script creates an encrypted sparse bundle automatically.

**Manual setup:**

```bash
# Create encrypted disk image (500MB, grows as needed)
hdiutil create -size 500m -encryption AES-256 -type SPARSEBUNDLE \
  -fs "APFS" -volname "TherapyVault" ~/therapy-vault.sparsebundle

# Mount (prompts for password)
hdiutil attach ~/therapy-vault.sparsebundle

# Your files go in /Volumes/TherapyVault/
# Unmount when done
hdiutil detach /Volumes/TherapyVault
```

**Daily usage:**
1. Double-click `mount-therapy.command` on Desktop (created by setup)
2. Open Claude Code: `cd /Volumes/TherapyVault/ai-therapy && claude`
3. When done, double-click `unmount-therapy.command`

**Password recovery:** Not possible. If you forget your password, your data is gone. Use a password manager.

### Windows: VeraCrypt

VeraCrypt is free, open-source, and provides strong encryption.

**Install:** Download from [veracrypt.fr](https://veracrypt.fr)

**Create encrypted container:**

1. Open VeraCrypt
2. Click **Create Volume**
3. Select **Create an encrypted file container**
4. Select **Standard VeraCrypt volume**
5. Choose location: `C:\Users\[you]\therapy-vault.hc`
6. Encryption: AES (default is fine)
7. Size: 500MB or more
8. Password: Choose a strong one
9. Format the volume

**Mount the volume:**

1. Open VeraCrypt
2. Select a drive letter (e.g., `T:`)
3. Click **Select File**, choose your `.hc` file
4. Click **Mount**, enter password
5. Your files go in `T:\ai-therapy\`

**Unmount when done:**
1. Select the mounted drive in VeraCrypt
2. Click **Dismount**

**Auto-mount script (optional):**

Create `mount-therapy.bat`:
```batch
@echo off
"C:\Program Files\VeraCrypt\VeraCrypt.exe" /v "%USERPROFILE%\therapy-vault.hc" /l T /a /q
echo Therapy vault mounted on T:
pause
```

---

## Maximum Privacy: Local LLM

For users who need data to never leave their machine.

### Why Local?

Cloud LLMs (Claude, GPT) process your messages on remote servers. Even with good privacy policies, your words pass through their infrastructure.

Local LLMs run entirely on your computer. Nothing is transmitted.

### Trade-offs

| | Cloud LLM | Local LLM |
|---|-----------|-----------|
| **Privacy** | Subject to provider policies | Complete |
| **Quality** | State-of-the-art | Good, not quite as capable |
| **Speed** | Fast | Depends on hardware |
| **Hardware** | Any computer | 16GB+ RAM recommended |

### Setup with Ollama

[Ollama](https://ollama.ai) is the easiest way to run local LLMs.

**Install:**
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: Download from ollama.ai
```

**Pull a capable model:**
```bash
# Good balance of quality and speed
ollama pull llama3.1:8b

# Better quality, needs more RAM (16GB+)
ollama pull llama3.1:70b

# Smaller, faster, less capable
ollama pull llama3.1:3b
```

**Use with your therapy setup:**

Option 1: Ollama's built-in chat
```bash
cd ~/ai-therapy
cat CLAUDE.md  # Copy this as system prompt
ollama run llama3.1:8b
# Paste your CLAUDE.md content when prompted
```

Option 2: Use a local LLM frontend like [Open WebUI](https://github.com/open-webui/open-webui)

**Limitations:**
- No automatic file reading (you may need to manually paste session context)
- Less capable than Claude/GPT for nuanced therapeutic responses
- Slower on modest hardware

### Setup with LM Studio

[LM Studio](https://lmstudio.ai) provides a GUI for running local models.

1. Download from lmstudio.ai
2. Search for and download a model (Llama 3.1, Mistral, etc.)
3. Load the model
4. Paste your CLAUDE.md as system prompt
5. Chat locally

---

## API Privacy Comparison

If using cloud LLMs, understand their policies:

### Claude API (Anthropic)

- **Training:** Data not used for training by default
- **Retention:** Prompts retained for 30 days for trust & safety, then deleted
- **Policy:** [anthropic.com/privacy](https://www.anthropic.com/privacy)

### OpenAI API

- **Training:** API data not used for training by default (since March 2023)
- **Retention:** Data retained for 30 days for abuse monitoring
- **Policy:** [openai.com/policies/privacy-policy](https://openai.com/policies/privacy-policy)

### Key Difference from Consumer Products

API access (what Claude Code uses) has different policies than consumer chat interfaces:
- Consumer ChatGPT may use data for training (unless opted out)
- API access typically does not

---

## Excluding from Cloud Sync

If you use iCloud, OneDrive, Dropbox, or similar, exclude your therapy folder:

### iCloud (macOS)

Don't store therapy files in `~/Documents` or `~/Desktop` if they sync to iCloud.

**Recommended locations:**
- `~/ai-therapy` (outside synced folders)
- Encrypted disk image anywhere (iCloud can't read encrypted content)

### OneDrive (Windows)

Right-click the therapy folder → **Free up space** or move outside OneDrive folder.

**Recommended locations:**
- `C:\Users\[you]\ai-therapy` (not in OneDrive folder)
- Encrypted VeraCrypt container

### General Rule

Store therapy files outside any cloud-synced folder, or use encryption.

---

## Backup Recommendations

Even private data needs backup. Options:

### Encrypted Backup

1. Keep your encrypted container/disk image in a backed-up location
2. The backup is useless without your password
3. Consider a separate backup of the password in a password manager

### Manual Export

Periodically copy your therapy folder to an encrypted USB drive stored securely.

### What NOT to Do

- Don't backup unencrypted therapy files to cloud services
- Don't email yourself session notes
- Don't store passwords in plain text alongside encrypted files

---

## Threat Model

Consider what you're protecting against:

| Threat | Mitigation |
|--------|------------|
| Casual snooping (family, roommate) | Encryption |
| Device theft | Full-disk encryption + container encryption |
| Cloud provider access | Local storage, no sync |
| LLM provider access | Local LLM |
| Legal subpoena | Consult a lawyer; encryption helps but has limits |
| Sophisticated attacker | Beyond scope; seek professional security advice |

For most users, encrypted local storage with a cloud LLM provides excellent privacy.

---

## Security Checklist

**Minimum (everyone):**
- [ ] Store therapy files locally, not in cloud-synced folders
- [ ] Use your OS login password
- [ ] Enable full-disk encryption (FileVault/BitLocker)

**Recommended (shared computer or privacy-conscious):**
- [ ] Use encrypted container (built into setup)
- [ ] Unmount encrypted volume when not in use
- [ ] Use a password manager for your encryption password

**Maximum (high-stakes privacy):**
- [ ] All of the above
- [ ] Use local LLM (Ollama, LM Studio)
- [ ] Air-gapped computer for sessions (extreme)

---

*Questions about security? Open an issue on GitHub.*
