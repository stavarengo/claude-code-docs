#!/bin/bash
set -e

EXTERNAL_REPO="https://github.com/thevibeworks/claude-code-docs.git"
TEMP_DIR="/tmp/external-repo"

# Clone external repository
echo "Cloning external repository..."
rm -rf "$TEMP_DIR"
git clone --depth 1 "$EXTERNAL_REPO" "$TEMP_DIR"

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
  git commit -m "chore: add content change from thevibeworks/claude-code-docs"
fi

echo "Pushing changes..."
git push

# Clean up temp folder if not running in CI
if [ "$CI" != "true" ]; then
  echo "Cleaning up temp folder... ($TEMP_DIR)"
  rm -rf "$TEMP_DIR"
fi

echo "Done!"
