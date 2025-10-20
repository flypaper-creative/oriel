#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
termux-setup-storage >/dev/null 2>&1 || true

PROJECT="$HOME/projects/oriel"
DL="/storage/emulated/0/Download"
STAMP=$(date +%Y%m%d_%H%M%S)
ZIP="$DL/oriel_full_build_${STAMP}.zip"

echo "[oriel] expanding full build payload…"
python3 scripts/generate_full_payload.py

echo "[oriel] zipping project → $ZIP"
cd "$HOME/projects"
zip -r "$ZIP" oriel -x "oriel/node_modules/*" "oriel/dist/*" "oriel/.cache/*" "oriel/.vite/*" "*.log" "*.tar.gz"
echo "[✓] Saved zip to: $ZIP"
echo "[✓] Now commit and push manually:"
echo "    cd ~/projects/oriel && git add -A && git commit -m 'Full build ${STAMP}' && git push origin main"
