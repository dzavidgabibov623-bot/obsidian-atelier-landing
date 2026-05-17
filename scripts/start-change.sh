#!/bin/zsh

set -euo pipefail

label="${1:-update}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit or stash current changes first." >&2
  exit 1
fi

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Switch to main before starting a new change." >&2
  exit 1
fi

timestamp="$(date +%Y%m%d-%H%M)"
slug="$(printf '%s' "$label" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"

if [[ -z "$slug" ]]; then
  slug="update"
fi

branch_name="work/${timestamp}-${slug}"
tag_name="snapshot/${timestamp}-${slug}"

git tag -a "$tag_name" -m "Snapshot before ${label}"
git switch -c "$branch_name"
git push -u origin "$branch_name"

echo "Created branch: $branch_name"
echo "Created snapshot tag: $tag_name"
