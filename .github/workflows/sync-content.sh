#!/bin/bash
set -e

CRAWLER_REPO="https://github.com/stavarengo/claude-code-docs-crawler.git"
TEMP_DIR="/tmp/crawler-repo"

# Clone crawler repository
echo "Cloning crawler repository..."
rm -rf "$TEMP_DIR"
git clone --depth 1 "$CRAWLER_REPO" "$TEMP_DIR"

# Install dependencies and run crawler
echo "Installing dependencies..."
cd "$TEMP_DIR"
npm install
echo "Running crawl..."
npm run crawl
echo "Generating index..."
npm run generateIndex
cd -

# Sync content folder
echo "Syncing content folder..."
rm -rf content/
cp -r "$TEMP_DIR/content/" content/

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

# Clean up temp folder if not running in CI
if [ "$CI" != "true" ]; then
  echo "Cleaning up temp folder... ($TEMP_DIR)"
  rm -rf "$TEMP_DIR"
fi

echo "Done!"
