#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
termux-setup-storage >/dev/null 2>&1 || true
DL="$HOME/storage/downloads"
[ -d "$DL" ] || DL="/storage/emulated/0/Download"
ZIP="$DL/oriel_export.zip"
TARGET="$HOME/projects/oriel"
TMP="$HOME/projects/_oriel_tmp"
echo "[crane] installing from $ZIP"
rm -rf "$TARGET"/* "$TARGET"/.[!.]* "$TARGET"/..?* 2>/dev/null || true
mkdir -p "$TMP" "$TARGET"
unzip -q "$ZIP" -d "$TMP"
SRC="$(find "$TMP" -maxdepth 2 -type f -name package.json | head -n1)"
[ -n "$SRC" ] || { echo "[crane] package.json not found in zip"; exit 1; }
cp -a "$(dirname "$SRC")"/. "$TARGET"/
rm -rf "$TMP"
cd "$TARGET"
if [ -f package-lock.json ]; then
  npm ci --prefer-offline --no-fund --no-audit
else
  npm install --prefer-offline --no-fund --no-audit
fi
[ -f .env ] || printf "OPENAI_API_KEY=\nVITE_OPENAI_API_KEY=\n" > .env
echo "[crane] ready. Run: npm run dev"
