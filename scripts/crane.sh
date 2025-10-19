#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
termux-setup-storage || true

ZIP="/storage/emulated/0/Download/oriel_export.zip"
PROJECT_ROOT="$HOME/projects"
TARGET="$PROJECT_ROOT/oriel"
TMP="$PROJECT_ROOT/_oriel_tmp/app"

log(){ printf "\033[1;32m[crane]\033[0m %s\n" "$*"; }
die(){ printf "\033[1;31m[crane]\033[0m %s\n" "$*"; exit 1; }

[ -f "$ZIP" ] || die "missing app zip: $ZIP"

mkdir -p "$PROJECT_ROOT" "$TARGET"
log "clearing $TARGET"
rm -rf "$TARGET"/* "$TARGET"/.[!.]* "$TARGET"/..?* 2>/dev/null || true

log "extracting $ZIP"
rm -rf "$TMP" && mkdir -p "$TMP"
unzip -q "$ZIP" -d "$TMP"

APP_SRC="$(find "$TMP" -maxdepth 2 -type f -name package.json -printf '%h\n' | head -n1)"
[ -n "$APP_SRC" ] || die "no package.json found in app zip"

log "installing into $TARGET"
cp -a "$APP_SRC"/. "$TARGET"/
rm -rf "$TMP"

cd "$TARGET"
if [ -f package-lock.json ]; then
  log "npm ci"
  npm ci --prefer-offline --no-fund --no-audit
else
  log "npm install"
  npm install --prefer-offline --no-fund --no-audit
fi

# auto-run builder if present and a payload exists
PAYLOAD=""
for c in "/storage/emulated/0/Download/oriel_builder_payload.zip" \
          "/storage/emulated/0/Download/oriel_retail_v4.3_u1.zip" \
          "/storage/emulated/0/Download/the_full_android_20251017_001811.zip" \
          "/storage/emulated/0/Download/the_full_android.zip"; do
  [ -f "$c" ] && { PAYLOAD="$c"; break; }
done

if [ -f forge.py ] && [ -n "$PAYLOAD" ]; then
  log "running forge.py against $PAYLOAD"
  python forge.py --project "$TARGET" --source "$PAYLOAD" --force || log "forge.py completed with warnings"
else
  log "no builder payload or forge.py missing—skipping builder"
fi

# ensure .env exists
[ -f .env ] || printf "OPENAI_API_KEY=\nVITE_OPENAI_API_KEY=\n" > .env

log "dev server: npm run dev"
npm run dev
