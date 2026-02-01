# AI Therapy Starter Kit

A local-first, privacy-focused toolkit for AI-assisted therapy and self-reflection.

Your sessions stay on your computer. Your data is yours. Works with Claude, GPT, or any LLM.

---

## Why This Exists

If you've used ChatGPT or Claude for emotional support, you've probably hit these problems:

- **Sessions disappear.** Start a new chat, lose all context. Copy-paste to Google Docs? That gets old fast.
- **Privacy concerns.** Your deepest thoughts, stored on someone else's servers, potentially reviewed by humans.
- **Platform lock-in.** Build a relationship with 4o, then OpenAI deprecates it. Start over.
- **Inconsistent quality.** Sometimes helpful, sometimes reads from a script. No therapeutic framework.

This toolkit solves all of them.

---

## What You Get

**Persistent memory** — Sessions and insights accumulate in local markdown files. Your AI therapist remembers everything, across sessions, forever.

**Real privacy** — Files live on your machine. Optional encryption (AES-256) for sensitive data. Use a local LLM for maximum privacy.

**Portable** — Works with Claude Code, ChatGPT API, or any LLM that can read files. Switch providers without losing your history.

**Evidence-based framework** — Built-in CBT, ACT, and DBT skills. Structured therapeutic approaches, not just vibes.

**Customizable** — Choose your therapist's communication style. Add modalities. Make it yours.

---

## Quick Start

### Prerequisites

- [Claude Code](https://claude.ai/code) (recommended) or another LLM interface
- macOS or Windows
- 10 minutes for setup

### Installation

**macOS:**
```bash
git clone https://github.com/ataglianetti/ai-therapy-kit.git
cd ai-therapy-kit
./setup.sh
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/ataglianetti/ai-therapy-kit.git
cd ai-therapy-kit
.\setup.ps1
```

The setup script will guide you through:
1. Choosing a therapist name and communication style
2. Selecting therapeutic approaches (CBT, ACT, DBT skills)
3. Setting up storage location
4. Optional encryption

### Start a Session

```bash
cd ~/ai-therapy   # or your chosen location
claude            # or your preferred LLM interface
```

Just talk. Your AI therapist will maintain context, take notes, and remember everything for next time.

---

## Features

### Three Communication Styles

| Style | Best For |
|-------|----------|
| **Warm & Supportive** | Validation-first, gentle challenges, nurturing presence |
| **Direct & Challenging** | Socratic questioning, will push back, insight-focused |
| **Coach** | Action-oriented, goal-focused, accountability |

### Three Therapeutic Approaches (Free)

- **CBT** (Cognitive Behavioral Therapy) — Identify and challenge unhelpful thought patterns
- **ACT** (Acceptance & Commitment Therapy) — Values-based action, mindful acceptance
- **DBT Skills** — Emotional regulation, distress tolerance, interpersonal effectiveness

### Session Continuity

Your AI therapist automatically:
- Reads your profile and recent sessions at the start
- Takes structured notes at the end
- Updates your profile as insights emerge
- Tracks homework and follows up

### Optional Encryption

For shared computers or maximum privacy:
- **macOS:** Encrypted disk image (built-in, no install)
- **Windows:** VeraCrypt container (free, open-source)

Setup walks you through it.

---

## How It Works

```
ai-therapy/
├── CLAUDE.md        # Your therapist's personality and approach
├── profile.md       # Cumulative client profile (builds over time)
└── sessions/
    ├── 2024-01-15.md
    ├── 2024-01-18.md
    └── ...
```

**CLAUDE.md** — Instructions that shape your AI therapist's behavior. Generated during setup based on your preferences.

**profile.md** — Your ongoing profile. Background, patterns, insights, goals. Updated across sessions.

**sessions/** — Session notes in dated markdown files. Themes, emotional state, homework, threads to revisit.

Everything is plain text. Readable, portable, yours.

---

## Safety Features

This toolkit includes built-in safety protocols:

### Crisis Response
- Recognizes crisis language (suicidal ideation, self-harm, psychosis)
- Provides immediate crisis resources (988, Crisis Text Line)
- Does not attempt to "treat" acute crises

### Scope Limitations
- Will not diagnose conditions
- Will not advise on medication
- Recommends professional help when appropriate

### Ethical Guidelines
- Maintains appropriate therapeutic boundaries
- Promotes autonomy, not dependency
- Acknowledges AI limitations honestly

---

## Important Disclaimer

**This tool is for self-reflection and emotional support. It is not a replacement for professional mental health care.**

- The AI cannot diagnose mental health conditions
- The AI cannot prescribe or advise on medication
- If you're in crisis, contact a crisis line or emergency services
- Consider sharing that you use this tool with your therapist

**Crisis Resources:**
- **988** — Suicide & Crisis Lifeline (call or text, US)
- **741741** — Crisis Text Line (text HOME)
- **911** — Immediate emergencies
- **[findahelpline.com](https://findahelpline.com)** — International directory

---

## Expansion Packs

The core kit is free. Additional modalities and personas available:

### Modality Packs ($5+ each)
- **Schema Therapy** — Early maladaptive schemas, parts work, reparenting
- **IFS (Internal Family Systems)** — Parts work, exiles/protectors, self-leadership
- **Somatic/Trauma-Informed** — Body-based awareness, window of tolerance
- **Psychodynamic** — Defense mechanisms, unconscious patterns, insight-oriented

### Persona Packs ($3+ each)
- **Peer/Friend** — Casual, non-clinical, conversational
- **Narrative Therapist** — Story-focused, externalization
- **Existential** — Meaning-focused, philosophical
- **Mindfulness Guide** — Meditation-integrated, present-moment

**Get them at:** [gumroad.com/ataglianetti](https://gumroad.com/ataglianetti)

---

## Support This Project

This toolkit is free and open source. If it helps you, consider supporting development:

☕ **[Buy Me a Coffee](https://buymeacoffee.com/ataglianetti)** — One-time donation

💚 **[Gumroad](https://gumroad.com/ataglianetti)** — Name-your-price or expansion packs

Your support helps me maintain the project and create new content.

---

## Privacy & Security

### Your Data

- All files stored locally on your machine
- Nothing uploaded, synced, or transmitted by this toolkit
- No analytics, telemetry, or tracking
- Delete anytime by removing the folder

### API Considerations

If using a cloud LLM (Claude, GPT), your messages go through their API:
- **Claude API:** [Anthropic's privacy policy](https://www.anthropic.com/privacy) — Data not used for training
- **OpenAI API:** [OpenAI's privacy policy](https://openai.com/policies/privacy-policy)

For maximum privacy, use a local LLM (Ollama, LM Studio). See [SECURITY.md](SECURITY.md) for setup.

### Encryption

Optional but recommended for shared computers. Setup script walks you through it.

---

## FAQ

**Can I use this with ChatGPT instead of Claude?**

Yes. The CLAUDE.md file works as a system prompt for any LLM. For ChatGPT, paste it into Custom Instructions or a GPT Project.

**What if I'm already in therapy?**

Great! This tool works well as a supplement. Consider sharing that you use it with your therapist.

**Is this HIPAA compliant?**

This is not a healthcare product and doesn't fall under HIPAA. You're running it on your own computer. We don't store or access any of your data.

**Can I customize the therapeutic approach?**

Yes. Edit CLAUDE.md directly, or purchase expansion packs for additional modalities.

**What if I need more than self-reflection?**

This tool is designed for everyday emotional support. If you're dealing with severe symptoms, trauma, or crisis situations, please seek professional help. The AI will also recommend this when appropriate.

---

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

Areas of interest:
- Additional modalities (with clinical grounding)
- Improved crisis detection
- Local LLM integration guides
- Translations

---

## License

MIT License. See [LICENSE](LICENSE).

---

## Acknowledgments

Built with inspiration from the [r/therapyGPT](https://reddit.com/r/therapyGPT) community and their creative workarounds for AI therapy persistence.

This project incorporates principles from evidence-based therapeutic approaches including Cognitive Behavioral Therapy, Acceptance and Commitment Therapy, and Dialectical Behavior Therapy.

---

*Take care of yourself.* 💚
