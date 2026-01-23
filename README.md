# Claude Code Documentation Mirror

-it's just the docs, updated daily  

A minimal, clean mirror of Claude Code documentation - nothing else.
Just a clean copy for easy integration with AI agents.

> **From the author:** I created this repository because I wanted a clean copy of the Claude Code documentation that I could use as a git submodule. The original source at [thevibeworks/claude-code-docs](https://github.com/thevibeworks/claude-code-docs) does an amazing job fetching and organizing the docs, but it also includes scripts, tooling, and other files that can confuse AI assistants when added to a project context. This repo solves that - it's just the docs, updated daily. I use it to give my local AI agents access to up-to-date Claude Code documentation without noise. Feel free to use it the same way.

Thanks to [thevibeworks/claude-code-docs](https://github.com/thevibeworks/claude-code-docs) - all the hard work happens there.


## What This Is

- A daily-synced copy of the `content/` folder from [thevibeworks/claude-code-docs](https://github.com/thevibeworks/claude-code-docs)
- Updated automatically at 5am UTC via GitHub Actions
- Contains only documentation - minimal noise: no scripts, no tooling (besides this README and the minimal GitHub Actions workflow itself)

## Usage

**Clone it:**
```bash
git clone https://github.com/stavarengo/claude-code-docs
```

**Or add as a submodule:**
```bash
git submodule add https://github.com/stavarengo/claude-code-docs claude-code-docs
```

**Then point your AI agent to it:**
```bash
claude "Based on the docs in ./claude-code-docs, explain extended thinking"
```

## How It Works

The entire sync mechanism is a single 41-line bash script: [.github/workflows/sync-content.sh](.github/workflows/sync-content.sh)

It does three things:
1. Clones the source repo
2. Copies the `content/` folder
3. Commits and pushes

## Credits

- **Documentation source:** [Anthropic](https://docs.anthropic.com)
- **Fetching & organization:** [thevibeworks/claude-code-docs](https://github.com/thevibeworks/claude-code-docs) - all the hard work happens there

## Disclaimer

Unofficial mirror for educational purposes. For official docs, visit [docs.anthropic.com](https://docs.anthropic.com). For commercial use, consult Anthropic's [terms](https://www.anthropic.com/legal/commercial-terms).
