---
description: Auto-commit and push changes to GitHub
---

# Auto-Commit Workflow

This workflow automatically commits and pushes changes to GitHub when files are modified.

## Steps

// turbo-all

1. Stage all changes:
```bash
git add .
```

2. Commit with a descriptive message:
```bash
git commit -m "Auto-commit: Update files"
```

3. Push to origin:
```bash
git push origin main
```

## Notes
- The `// turbo-all` annotation above enables auto-run for all git commands
- Antigravity will automatically execute these commands when you save files
- Make sure you're authenticated with GitHub (credentials cached)
