# AI Therapy Starter Kit

A private, persistent AI therapist that lives on your computer.

Your sessions stay local. Your AI remembers everything. Works with Claude, GPT, or any AI.

---

## Why This Exists

If you've used ChatGPT or Claude for emotional support, you've probably hit these problems:

- **Sessions disappear.** Start a new chat, lose all context.
- **Privacy concerns.** Your deepest thoughts on someone else's servers.
- **Platform lock-in.** Build a relationship with one AI, then it changes or goes away.
- **Inconsistent quality.** Sometimes helpful, sometimes generic.

This toolkit solves all of them.

---

## What You Get

**Your AI remembers** — Sessions and insights accumulate in files on your computer. Your AI therapist remembers everything, forever.

**Real privacy** — All files stay on your machine. Optional password protection for shared computers.

**Portable** — Works with Claude, ChatGPT, or any AI that can read files. Switch anytime without losing your history.

**Evidence-based** — Built-in therapeutic approaches (CBT, ACT, DBT, and more). Real frameworks, not just conversation.

**Customizable** — Choose your therapist's name and communication style. Make it yours.

---

## Get Started

**Ready to set up your AI therapist?** See the [Getting Started Guide](docs/GETTING-STARTED.md) for step-by-step instructions.

Setup takes about 10 minutes and requires:
- A computer (Mac or Windows)
- Claude Code (included with Claude Pro, or pay-per-use)

---

## Features

### Communication Styles

During setup, you choose how your AI therapist communicates:

| Style | Description |
|-------|-------------|
| **Warm & Supportive** | Validation first, gentle challenges, nurturing |
| **Direct & Challenging** | Will push back, asks probing questions |
| **Coach** | Action-oriented, goal-focused, accountability |
| **Grounded & Real** | Down-to-earth, honest, uses humor |

### Therapeutic Approaches

Your AI therapist can draw from multiple evidence-based approaches:

- **CBT** — Identify and challenge unhelpful thought patterns
- **ACT** — Values-based action, mindful acceptance
- **DBT Skills** — Emotional regulation, distress tolerance
- **Lifespan Integration** — Body-based trauma integration
- **Somatic Experiencing** — Nervous system awareness and regulation
- **Psychodynamic** — Understanding patterns from the past

### How Sessions Work

Your AI therapist:
- Remembers everything from previous sessions
- Takes notes at the end of each conversation
- Updates your profile as new insights emerge
- Follows up on anything you committed to try

### Your Files

Everything is stored as simple text files you can read anytime:

```
your-therapist-folder/
├── CLAUDE.md        # Your therapist's personality
├── profile.md       # Your ongoing profile
└── sessions/
    ├── 2024-01-15.md
    ├── 2024-01-18.md
    └── ...
```

No special software needed to view your own notes.

---

## Safety & Limitations

**This tool is for self-reflection and emotional support. It is not a replacement for professional mental health care.**

Your AI therapist:
- Cannot diagnose mental health conditions
- Cannot prescribe or advise on medication
- Will connect you to crisis resources if needed
- Will recommend professional help when appropriate

**If you're in crisis:**
- **988** — Suicide & Crisis Lifeline (call or text, US)
- **741741** — Crisis Text Line (text HOME)
- **911** — Immediate emergencies
- **[findahelpline.com](https://findahelpline.com)** — International

---

## Privacy

All your files stay on your computer. Nothing is uploaded by this toolkit.

When you chat, your messages go through the AI provider you're using (Claude or ChatGPT). Their privacy policies apply, but API access is more private than their consumer chat apps—your conversations aren't used to train their models.

**Want more privacy options?** See [SECURITY.md](SECURITY.md) for:
- Password-protected folders
- Running a fully local AI (nothing leaves your computer)

---

## Known Limitations

### AI Safety Filters

All major AIs (Claude, ChatGPT) have built-in safety filters that can affect therapy conversations:

**Topics where the AI may seem hesitant:**
- Sexual trauma and assault
- Abuse (especially detailed descriptions)
- Self-harm specifics
- Violent experiences

**What this looks like:**
- Generic responses instead of engaging deeply
- Redirecting the conversation
- Extra disclaimers or suggestions to seek professional help

**This is not the AI judging you.** It's hitting automatic filters it can't control.

**What helps:**
- Focus on feelings and impact rather than graphic details
- Rephrase: "I want to process how this affected me emotionally"
- Know that some trauma processing needs a human therapist who can hold space for the full story

---

## FAQ

**Can I use ChatGPT instead of Claude?**
Yes. Copy the contents of your CLAUDE.md file into ChatGPT's Custom Instructions or create a GPT with it. You won't get automatic session saving, but the therapeutic framework works the same.

**What if I'm already seeing a therapist?**
This tool works well as a supplement between sessions. Consider mentioning it to your therapist.

**Can I customize my AI therapist?**
Yes. You can edit the CLAUDE.md file directly to adjust the approach, style, or focus areas.

**What if I need more than self-reflection?**
This is designed for everyday emotional support. For severe symptoms, trauma, or crisis situations, please work with a professional. Your AI therapist will also suggest this when appropriate.

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

## Support

This isn't my full-time gig, but I want to keep improving it based on community feedback. If you find it helpful, consider [buying me a coffee](https://buymeacoffee.com/ataglianetti).

---

## Acknowledgments

Built with inspiration from the [r/therapyGPT](https://reddit.com/r/therapyGPT) community and their creative workarounds for AI therapy persistence.

This project incorporates principles from evidence-based therapeutic approaches including Cognitive Behavioral Therapy, Acceptance and Commitment Therapy, and Dialectical Behavior Therapy.

---

*Take care of yourself.* 💚
