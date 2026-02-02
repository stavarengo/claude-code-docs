# Claude Code Documentation Mirror

-it's just the docs, updated daily

A minimal, clean copy of Claude Code documentation for easy integration with AI agents.
Content is crawled daily from [code.claude.com](https://code.claude.com) using [stavarengo/claude-code-docs-crawler](https://github.com/stavarengo/claude-code-docs-crawler).

> I created this repository because I wanted a clean copy of the Claude Code documentation that I could use as a git submodule. The other repos I found on GitHub usually also include scripts, tooling, and other files that can confuse AI assistants when added to a project context. This repo solves that - it's just the docs, updated daily. I use it to give my local AI agents access to up-to-date Claude Code documentation without noise. Feel free to use it the same way.

## What This Is

- A daily-crawled copy of Claude Code docs, output by [stavarengo/claude-code-docs-crawler](https://github.com/stavarengo/claude-code-docs-crawler)
- Updated automatically at 5:15am UTC via GitHub Actions
- Contains only documentation - minimal noise: no scripts, no tooling (besides this README and the minimal GitHub Actions workflow itself)
- Includes an agent-friendly navigation index (`content/docs/index.md`) for fast lookups

## Usage

- **Clone it:** `git clone https://github.com/stavarengo/claude-code-docs`
- **Or add as a submodule:** `git submodule add https://github.com/stavarengo/claude-code-docs claude-code-docs`
- **Then point your AI agent to it:** `claude "Based on the docs in ./claude-code-docs, explain extended thinking"`

## How It Works

The sync is driven by [.github/workflows/sync-content.sh](.github/workflows/sync-content.sh). Each run:

1. Clones [stavarengo/claude-code-docs-crawler](https://github.com/stavarengo/claude-code-docs-crawler)
2. Runs the crawler (`npm run crawl`) to fetch docs from code.claude.com
3. Generates the navigation index (`npm run generateIndex`)
4. Copies the `content/` output into this repo and commits

## Credits

- **Documentation source:** [Anthropic](https://docs.anthropic.com)
- **Crawler:** [stavarengo/claude-code-docs-crawler](https://github.com/stavarengo/claude-code-docs-crawler)

## Disclaimer

Unofficial mirror for educational purposes. For official docs, visit [docs.anthropic.com](https://docs.anthropic.com). For commercial use, consult Anthropic's [terms](https://www.anthropic.com/legal/commercial-terms).
