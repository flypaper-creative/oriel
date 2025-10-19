#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
termux-setup-storage || true
ZIP_SRC="/storage/emulated/0/Download/oriel_export.zip"
CANDIDATES=("/storage/emulated/0/Download/oriel_builder_payload.zip" "/storage/emulated/0/Download/oriel_retail_v4.3_u1.zip" "/storage/emulated/0/Download/the_full_android_20251017_001811.zip" "/storage/emulated/0/Download/the_full_android.zip")
BUILDER_PAYLOAD=""; for c in "${CANDIDATES[@]}"; do [ -f "$c" ] && { BUILDER_PAYLOAD="$c"; break; }; done
PROJECT_ROOT="$HOME/projects"; TARGET_DIR="$PROJECT_ROOT/oriel"; TMPDIR="$PROJECT_ROOT/_oriel_tmp"
log(){ printf "\033[1;32m[oriel]\033[0m %s\n" "$*"; }; die(){ printf "\033[1;31m[oriel]\033[0m %s\n" "$*"; exit 1; }
[ -f "$ZIP_SRC" ] || die "missing app zip: $ZIP_SRC"; [ -n "$BUILDER_PAYLOAD" ] || die "missing builder payload zip"
mkdir -p "$PROJECT_ROOT" "$TARGET_DIR" "$TMPDIR"
log "clearing $TARGET_DIR"; rm -rf "$TARGET_DIR"/* ; rm -rf "$TARGET_DIR"/.[!.]* "$TARGET_DIR"/..?* || true
log "unpacking app"; rm -rf "$TMPDIR/app" && mkdir -p "$TMPDIR/app"; unzip -q "$ZIP_SRC" -d "$TMPDIR/app"
APP_SRC="$(find "$TMPDIR/app" -maxdepth 2 -type f -name package.json -printf '%h\n' | head -n1)"; [ -n "${APP_SRC:-}" ] || { echo "no package.json in app zip"; exit 1; }
log "installing app into $TARGET_DIR"; cp -a "$APP_SRC"/. "$TARGET_DIR"/
cd "$TARGET_DIR"; if [ -f package-lock.json ]; then npm ci --prefer-offline --no-fund --no-audit; else npm install --prefer-offline --no-fund --no-audit; fi
[ -f builder.py ] || echo "[oriel] WARN: builder.py missing."
log "running builder against: $BUILDER_PAYLOAD"; python builder.py --project "$TARGET_DIR" --source "$BUILDER_PAYLOAD" --force
[ -f .env ] || printf "OPENAI_API_KEY=\nVITE_OPENAI_API_KEY=\n" > .env
log "done. run: cd $TARGET_DIR && npm run dev"
