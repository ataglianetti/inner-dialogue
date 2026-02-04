# Asset Capture Instructions

This folder needs three visual assets for the README. Two style options are available - choose the one that best represents your product.

---

## Style Options

| Style | Vibe | Best For |
|-------|------|----------|
| **Traditional** | Professional therapist voice | Users who want structure |
| **Warm 4o** | Casual friend who asks good questions | Users who want connection |

Pick one style for consistency across all assets, or create both sets if you want to show range.

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

### Content
See `sample-session-content.md` - choose Style A (Traditional) or Style B (Warm 4o).

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
Open the appropriate sample file in a markdown viewer:
- **Traditional**: `sample-session-notes.md`
- **Warm 4o**: `sample-session-notes-4o.md`

Good viewers:
- **VS Code** with markdown preview (Cmd+Shift+V)
- **Marked 2** (Mac)
- **Typora**
- **GitHub** (commit the file, screenshot it there)

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

## Reference Files in This Folder

| File | Purpose |
|------|---------|
| `sample-session-content.md` | Conversation scripts (both styles) |
| `sample-session-notes.md` | Session notes - Traditional style |
| `sample-session-notes-4o.md` | Session notes - Warm 4o style |

---

## After Capturing

1. Add the three image files to this folder:
   - `session-screenshot.png`
   - `session-notes.png`
   - `demo.gif`

2. Optionally delete the instruction/sample files (or keep for future reference)

3. Verify in README that images load correctly on GitHub

---

## Quick Checklist

- [ ] Chose a style (Traditional or Warm 4o)
- [ ] Screenshots are clean (no personal info, no clutter)
- [ ] Text is readable at normal zoom
- [ ] GIF is under 5MB
- [ ] All three assets added to `assets/`
- [ ] README images render on GitHub
