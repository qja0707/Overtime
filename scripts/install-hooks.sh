#!/bin/sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$ROOT_DIR/.git/hooks"
SRC_DIR="$ROOT_DIR/scripts/hooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "No .git/hooks directory found." >&2
  exit 1
fi

for hook in pre-commit pre-push; do
  if [ -f "$SRC_DIR/$hook" ]; then
    cp "$SRC_DIR/$hook" "$HOOKS_DIR/$hook"
    chmod +x "$HOOKS_DIR/$hook"
  fi
done

echo "Git hooks installed."
