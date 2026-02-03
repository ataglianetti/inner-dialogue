# Asset Capture Instructions

This folder needs three visual assets for the README. Follow these instructions to create them.

---

## Required Assets

| File | Description | Target Size |
|------|-------------|-------------|
| `session-screenshot.png` | Terminal showing therapy conversation | ~800x500px |
| `session-notes.png` | Markdown file in a viewer | ~600x400px |
| `demo.gif` | Animated demo of starting a session | Under 5MB |

---

## 1. Session Screenshot (`session-screenshot.png`)

### Setup
1. Open terminal with a clean theme (dark background recommended)
2. Navigate to a test Sage folder
3. Run `claude`

### Content to Use
See `sample-session-content.md` for the exact conversation.

### Capture
- **Mac**: Cmd+Shift+4, then press Space to capture just the window
- **Windows**: Alt+PrintScreen or Win+Shift+S
- Crop to remove any personal info from title bar if needed

### Tips
- Font size 14-16pt for readability
- Ensure text is crisp and readable
- No personal paths visible in prompt

---

## 2. Session Notes Screenshot (`session-notes.png`)

### Setup
Open `sample-session-notes.md` in one of these viewers:
- **VS Code** with markdown preview (Cmd+Shift+V)
- **Marked 2** (Mac)
- **Typora**
- **GitHub** (commit the file, screenshot it there)

### Content
Use `sample-session-notes.md` exactly as written.

### Capture
- Show the rendered markdown, not raw text
- Clean, minimal theme preferred
- Crop to just the content area

---

## 3. Demo GIF (`demo.gif`)

### Tools
- **Mac**: QuickTime (record) + Gifski (convert)
- **Windows**: ScreenToGif, ShareX
- **Any**: Kap, LICEcap

### What to Record
1. Show desktop with launcher script visible
2. Double-click `start-session.command`
3. Terminal opens
4. Sage's greeting appears
5. Type: "I've been feeling overwhelmed at work lately"
6. Response streams in
7. End after first response completes

### Settings
- Resolution: 800x500 or similar
- Frame rate: 10-15 fps (keeps file small)
- Duration: 15-30 seconds
- Loop: yes

### Optimization
Target under 5MB. If too large:
```bash
# Using gifski (install via: brew install gifski)
gifski --fps 10 --width 800 -o demo.gif recording.mov

# Using ffmpeg
ffmpeg -i recording.mov -vf "fps=10,scale=800:-1" -loop 0 demo.gif
```

---

## After Capturing

1. Add the three files to this folder:
   - `session-screenshot.png`
   - `session-notes.png`
   - `demo.gif`

2. Delete these instruction files:
   - `CAPTURE-INSTRUCTIONS.md`
   - `sample-session-content.md`
   - `sample-session-notes.md`

3. Verify in README that images load correctly

---

## Quick Checklist

- [ ] Screenshots are clean (no personal info, no clutter)
- [ ] Text is readable at normal zoom
- [ ] GIF is under 5MB
- [ ] All three assets added to `assets/`
- [ ] README images render on GitHub
