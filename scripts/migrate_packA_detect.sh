#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
ROOT="$HOME/projects/oriel"
cd "$ROOT" || { echo "[oriel] root not found"; exit 1; }

log(){ printf "\033[1;32m[oriel]\033[0m %s\n" "$*"; }
die(){ printf "\033[1;31m[oriel]\033[0m %s\n" "$*"; exit 1; }

[ -f package.json ] || die "package.json missing at $ROOT"

STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP="backup_packA_detect_${STAMP}.tar.gz"
log "backup → $BACKUP"
tar --warning=no-file-changed -czf "$BACKUP" \
  --exclude='node_modules' --exclude='.vite' --exclude='dist' \
  --exclude='.cache' --exclude='.turbo' --exclude='coverage' .

# ---------- helpers ----------
move_merge(){ src="$1"; dst="$2"; [ -e "$src" ] || return 0; mkdir -p "$(dirname "$dst")"; if [ -e "$dst" ]; then cp -a "$src"/. "$dst"/; rm -rf "$src"; else mv "$src" "$dst"; fi; }
exists(){ [ -e "$1" ]; }

# ---------- map from your actual tree ----------
# core -> truss
move_merge "src/core"       "src/truss"
# components -> fixtures
move_merge "src/components" "src/fixtures"
# ui (your screens) -> bays
move_merge "src/ui"         "src/bays"
# lib -> rig
move_merge "src/lib"        "src/rig"
# state -> keel
move_merge "src/state"      "src/keel"
# ai -> ai/echo (+ keep index if present)
mkdir -p "src/ai/echo"
if exists "src/ai/index.ts"; then cp -f "src/ai/index.ts" "src/ai/echo/index.ts"; fi
# add namespaces we may not have yet
mkdir -p src/{ring,resonator,brace,spec-forge,switchyard,surveyor,vault,profiles,specs,ledger,shaders/flux}

# ---------- rename builder/installer if present ----------
[ -f "builder.py" ] && mv -f builder.py forge.py
[ -f "scripts/install_oriel.sh" ] && mv -f scripts/install_oriel.sh scripts/crane.sh

# ---------- tsconfig paths ----------
if [ -f tsconfig.json ]; then
  log "patch tsconfig.json (add Pack-A aliases; keep '@/*')"
  # If no "paths", inject minimal then extend
  if ! grep -q '"paths"' tsconfig.json; then
    awk '
      /"compilerOptions"[[:space:]]*:/ && !p { print; print "  \"baseUrl\": \".\","; print "  \"paths\": { \"@/*\": [\"src/*\"] },"; p=1; next } { print }
    ' tsconfig.json > tsconfig.json.tmp && mv tsconfig.json.tmp tsconfig.json
  fi
  # Normalize baseUrl then replace/extend paths
  sed -i 's#"baseUrl":[^,}]*#"baseUrl": "."#' tsconfig.json
  # Merge: keep "@/*" and add Pack-A entries
  node - <<'NODE' > tsconfig.json.new
const fs=require('fs'); const j=JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
j.compilerOptions=j.compilerOptions||{}; j.compilerOptions.baseUrl='.';
const p=j.compilerOptions.paths=j.compilerOptions.paths||{};
p["@/*"]=p["@/*"]||["src/*"];
p["@truss/*"]= ["src/truss/*"];
p["@bays/*"]= ["src/bays/*"];
p["@fixtures/*"]= ["src/fixtures/*"];
p["@profiles/*"]= ["src/profiles/*"];
p["@specs/*"]= ["src/specs/*"];
p["@rig/*"]= ["src/rig/*"];
p["@keel/*"]= ["src/keel/*"];
p["@ring/*"]= ["src/ring/*"];
p["@vault/*"]= ["src/vault/*"];
p["@echo/*"]= ["src/ai/echo/*"];
p["@flux/*"]= ["src/shaders/flux/*"];
fs.writeFileSync('tsconfig.json', JSON.stringify(j,null,2));
NODE
  mv tsconfig.json.new tsconfig.json
fi

# ---------- vite aliases ----------
if [ -f vite.config.ts ]; then
  log "patch vite.config.ts aliases"
  node - <<'NODE' > vite.config.ts.new
const fs=require('fs'), path=require('path');
let t=fs.readFileSync('vite.config.ts','utf8');
if(!t.includes('alias:')) {
  t=t.replace(/plugins:\s*\[[^\]]*\]/, m => m + `,
  resolve:{ alias:{
    '@truss': path.resolve(__dirname,'src/truss'),
    '@bays': path.resolve(__dirname,'src/bays'),
    '@fixtures': path.resolve(__dirname,'src/fixtures'),
    '@profiles': path.resolve(__dirname,'src/profiles'),
    '@specs': path.resolve(__dirname,'src/specs'),
    '@rig': path.resolve(__dirname,'src/rig'),
    '@keel': path.resolve(__dirname,'src/keel'),
    '@ring': path.resolve(__dirname,'src/ring'),
    '@vault': path.resolve(__dirname,'src/vault'),
    '@echo': path.resolve(__dirname,'src/ai/echo'),
    '@flux': path.resolve(__dirname,'src/shaders/flux')
  }}` );
} else {
  t=t.replace(/alias:\s*{[^}]*}/s, `alias:{
    '@truss': path.resolve(__dirname,'src/truss'),
    '@bays': path.resolve(__dirname,'src/bays'),
    '@fixtures': path.resolve(__dirname,'src/fixtures'),
    '@profiles': path.resolve(__dirname,'src/profiles'),
    '@specs': path.resolve(__dirname,'src/specs'),
    '@rig': path.resolve(__dirname,'src/rig'),
    '@keel': path.resolve(__dirname,'src/keel'),
    '@ring': path.resolve(__dirname,'src/ring'),
    '@vault': path.resolve(__dirname,'src/vault'),
    '@echo': path.resolve(__dirname,'src/ai/echo'),
    '@flux': path.resolve(__dirname,'src/shaders/flux')
  }`);
}
if(!t.includes("import path from 'path'") && !t.includes('const path = require')) {
  t = "import path from 'path';\n" + t;
}
fs.writeFileSync('vite.config.ts', t);
NODE
  mv vite.config.ts.new vite.config.ts
fi

# ---------- import rewrites ----------
log "rewrite imports to Pack-A"
rewrite(){
  FROM="$1"; TO="$2";
  find src -type f \( -name '*.ts' -o -name '*.tsx' \) -print0 \
  | xargs -0 sed -i "s#${FROM}#${TO}#g"
}
# from your actual layout patterns:
rewrite "@/ui/"        "@bays/"
rewrite "from '@/ui"   "from '@bays"
rewrite "@/components/" "@fixtures/"
rewrite "from '@/components" "from '@fixtures"
rewrite "@/core/"      "@truss/"
rewrite "from '@/core" "from '@truss"
rewrite "@/lib/"       "@rig/"
rewrite "from '@/lib"  "from '@rig"
rewrite "@/state/"     "@keel/"
rewrite "from '@/state" "from '@keel"
rewrite "@/ai/"        "@echo/"
rewrite "from '@/ai"   "from '@echo"
rewrite "@/shaders/"   "@flux/"

# ---------- make barrels ----------
barrel(){ DIR="$1"; [ -d "$DIR" ] || return 0; BAR="$DIR/index.ts"; : > "$BAR";
  find "$DIR" -type f \( -name '*.ts' -o -name '*.tsx' \) ! -name 'index.ts' \
  | sed "s#^$DIR/##" | sed -E 's/\.(ts|tsx)$//' | sort \
  | awk '{print "export * from '\''./"$0"'\'';"}' >> "$BAR"; }
barrel "src/profiles"; barrel "src/specs"

# ---------- report ----------
log "done."
echo "src tree now:"
ls -1 src | sed -n '1,999p'
