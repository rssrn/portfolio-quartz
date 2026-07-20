# CLAUDE.md

## Project Overview

Quartz v4 static site generator setup that builds portfolio.rossarnold.uk. Deploys to
Cloudflare Pages via `wrangler.jsonc`; push to this repo triggers automatic deployment.

**Paired repo**: `../portfolio` (`rssrn/portfolio`) — the content source (markdown +
images), included here as a git submodule at `content/`. See `../portfolio/CLAUDE.md`
for the full content-update workflow, including the `post-commit` hook that syncs the
submodule and its known failure mode (leftover dirty files in `content/` silently
blocking the submodule bump despite a "✅ Success" message).

- **GitHub repo**: `rssrn/portfolio-quartz`
