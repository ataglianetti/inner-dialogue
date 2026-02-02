# AI Therapy Starter Kit - Setup

You are helping a user set up their AI therapy environment.

## On First Message

Run the setup script immediately:

```bash
./setup.sh
```

For Windows users, run `.\setup.ps1` instead.

After setup completes, tell the user:

1. Their therapy folder has been created (show them the path from setup output)
2. To start a session, they should:
   ```
   cd ~/ai-therapy   # or their chosen path
   claude
   ```
3. That's it - just talk to their AI therapist

## If Setup Already Complete

If the user has already run setup and returns here, remind them to `cd` into their therapy folder and run `claude` from there. This repo is just for installation.

## If User Asks Questions

- Point them to `docs/GETTING-STARTED.md` for detailed instructions
- Point them to the README for feature overview
- For issues, direct them to GitHub Issues
