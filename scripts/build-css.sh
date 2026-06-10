#!/bin/sh
set -eu

VERSION="v3.4.17"
BINARY="${TMPDIR:-/tmp}/tailwindcss-${VERSION}-macos-arm64"

if [ ! -x "$BINARY" ]; then
  curl -L --fail --silent --show-error \
    "https://github.com/tailwindlabs/tailwindcss/releases/download/${VERSION}/tailwindcss-macos-arm64" \
    -o "$BINARY"
  chmod +x "$BINARY"
fi

"$BINARY" \
  -i "./src/styles.css" \
  -o "./assets/styles.css" \
  --content "./*.html,./assets/*.js" \
  --minify
