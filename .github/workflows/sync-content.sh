#!/bin/bash
set -e

CRAWLER_REPO="https://github.com/stavarengo/claude-code-docs-crawler.git"
CRAWLER_DIR="crawler"

# Clone crawler into this repo's workspace and strip its .git so that
# git rev-parse --show-toplevel resolves to THIS repo root.
# The crawler's default CONTENT_DIR is path.join(REPO_ROOT, "content"),
# which then points directly to ./content here — no copy step needed.
echo "Cloning crawler..."
rm -rf "$CRAWLER_DIR"
git clone --depth 1 "$CRAWLER_REPO" "$CRAWLER_DIR"
rm -rf "$CRAWLER_DIR/.git"

# Install dependencies and run crawler
echo "Installing dependencies..."
cd "$CRAWLER_DIR"
npm install
echo "Running crawl..."
npm run crawl
echo "Generating index..."
npm run generateIndex
cd -

# Clean up crawler source (not part of this repo)
rm -rf "$CRAWLER_DIR"

# Configure git
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

# Stage changes
git add content/

# Commit and push
echo "Committing changes..."
if git diff --staged --quiet; then
  git commit --allow-empty -m "chore: empty commit no content changes"
else
  git commit -m "chore: sync content from stavarengo/claude-code-docs-crawler"
fi

echo "Pushing changes..."
git push

echo "Done!"
