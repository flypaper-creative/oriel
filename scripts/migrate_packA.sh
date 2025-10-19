#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# -------- helpers --------
log(){ printf "\033[1;32m[oriel]\033[0m %s\n" "$*"; }
warn(){ printf "\033[1;33m[oriel]\033[0m %s\n" "$*"; }
die(){ printf "\033[1;31m[oriel]\033[0m %s\n" "$*"; exit 1; }

ROOT="$(pwd)"
[ -f "$ROOT/package.json" ] || die "run this from the project root (package.json not found)."

# -------- backup (reversible) --------
STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP="backup_packA_${STAMP}.tar.gz"
log "creating backup: $BACKUP"
tar -czf "$BACKUP" \
  --exclude='node_modules' \
  --exclude='.vite' \
  --exclude='dist' \
  --exclude='.cache' \
  .

# -------- folder migrations (moves are idempotent) --------
mkdir -p src

move_if_exists(){
  [ -e "$1" ] || return 0
  if [ -e "$2" ]; then
    log "merge $1 -> $2"
    cp -a "$1"/. "$2"/
    rm -rf "$1"
  else
    log "move $1 -> $2"
    mkdir -p "$(dirname "$2")"
    mv "$1" "$2"
  fi
}

# legacy likely names → Pack A structure
move_if_exists "src/core"              "src/truss"
move_if_exists "src/modules"           "src/bays"
move_if_exists "src/components"        "src/fixtures"
move_if_exists "src/utils"             "src/rig"
move_if_exists "src/types"             "src/specs"
move_if_exists "src/shards/types"      "src/profiles"
move_if_exists "src/shards/data"       "src/ledger"
[ -d "src/shards" ] && rmdir "src/shards" 2>/dev/null || true

# AI adapter to echo
move_if_exists "src/ai"                "src/ai"
mkdir -p "src/ai/echo"
# if a flat ai/index.ts exists, keep path and mirror inside echo for clean import
if [ -f "src/ai/index.ts" ] && [ ! -f "src/ai/echo/index.ts" ]; then
  log "relocating AI index.ts to @echo"
  mkdir -p "src/ai/echo"
  cp "src/ai/index.ts" "src/ai/echo/index.ts"
fi

# shader namespace
move_if_exists "src/shaders"           "src/shaders"
mkdir -p "src/shaders/flux"
# if there are shaders directly under shaders/, keep them and also place a barrel
if [ -d "src/shaders" ]; then
  touch "src/shaders/flux/.keep" 2>/dev/null || true
fi

# services likely present in newer builds
mkdir -p src/{keel,ring,resonator,brace,spec-forge,switchyard,surveyor,vault}

# -------- rename scripts --------
if [ -f "builder.py" ]; then
  log "renaming builder.py -> forge.py"
  mv -f builder.py forge.py
fi
mkdir -p scripts
if [ -f "scripts/install_oriel.sh" ]; then
  log "renaming scripts/install_oriel.sh -> scripts/crane.sh"
  mv -f scripts/install_oriel.sh scripts/crane.sh
fi

# -------- tsconfig paths (add Pack A aliases; preserve existing) --------
if [ -f tsconfig.json ]; then
  log "patching tsconfig.json paths"
  # Insert/replace paths block pragmatically via sed (no jq dependency)
  # 1) Ensure "baseUrl": "."
  sed -i 's#"baseUrl":[^,}]*#"baseUrl": "."#' tsconfig.json
  # 2) If "paths" exists, replace; else inject after baseUrl
  if grep -q '"paths"' tsconfig.json; then
    sed -i '/"paths"[[:space:]]*:/,/}/c\
    "paths": {\
      "@truss/*": ["src/truss/*"],\
      "@bays/*": ["src/bays/*"],\
      "@fixtures/*": ["src/fixtures/*"],\
      "@profiles/*": ["src/profiles/*"],\
      "@specs/*": ["src/specs/*"],\
      "@rig/*": ["src/rig/*"],\
      "@keel/*": ["src/keel/*"],\
      "@ring/*": ["src/ring/*"],\
      "@vault/*": ["src/vault/*"],\
      "@echo/*": ["src/ai/echo/*"],\
      "@flux/*": ["src/shaders/flux/*"]\
    }' tsconfig.json
  else
    sed -i 's#"baseUrl":[^,}]*,#"baseUrl": ".",\
    "paths": {\
      "@truss/*": ["src/truss/*"],\
      "@bays/*": ["src/bays/*"],\
      "@fixtures/*": ["src/fixtures/*"],\
      "@profiles/*": ["src/profiles/*"],\
      "@specs/*": ["src/specs/*"],\
      "@rig/*": ["src/rig/*"],\
      "@keel/*": ["src/keel/*"],\
      "@ring/*": ["src/ring/*"],\
      "@vault/*": ["src/vault/*"],\
      "@echo/*": ["src/ai/echo/*"],\
      "@flux/*": ["src/shaders/flux/*"]\
    },#' tsconfig.json
  fi
fi

# -------- vite alias (inject Pack A aliases) --------
if [ -f vite.config.ts ]; then
  log "patching vite.config.ts aliases"
  # ensure alias object exists; then replace or extend it
  if grep -q "alias:" vite.config.ts; then
    sed -i '/alias:[[:space:]]*{/,/}/c\
  alias: {\
    "@truss": require("path").resolve(__dirname, "src/truss"),\
    "@bays": require("path").resolve(__dirname, "src/bays"),\
    "@fixtures": require("path").resolve(__dirname, "src/fixtures"),\
    "@profiles": require("path").resolve(__dirname, "src/profiles"),\
    "@specs": require("path").resolve(__dirname, "src/specs"),\
    "@rig": require("path").resolve(__dirname, "src/rig"),\
    "@keel": require("path").resolve(__dirname, "src/keel"),\
    "@ring": require("path").resolve(__dirname, "src/ring"),\
    "@vault": require("path").resolve(__dirname, "src/vault"),\
    "@echo": require("path").resolve(__dirname, "src/ai/echo"),\
    "@flux": require("path").resolve(__dirname, "src/shaders/flux")\
  }' vite.config.ts
  else
    # add resolve block
    sed -i '/plugins:[^]]*]/a \
  ,resolve:{\
    alias:{\
      "@truss": require("path").resolve(__dirname,"src/truss"),\
      "@bays": require("path").resolve(__dirname,"src/bays"),\
      "@fixtures": require("path").resolve(__dirname,"src/fixtures"),\
      "@profiles": require("path").resolve(__dirname,"src/profiles"),\
      "@specs": require("path").resolve(__dirname,"src/specs"),\
      "@rig": require("path").resolve(__dirname,"src/rig"),\
      "@keel": require("path").resolve(__dirname,"src/keel"),\
      "@ring": require("path").resolve(__dirname,"src/ring"),\
      "@vault": require("path").resolve(__dirname,"src/vault"),\
      "@echo": require("path").resolve(__dirname,"src/ai/echo"),\
      "@flux": require("path").resolve(__dirname,"src/shaders/flux")\
    }\
  }' vite.config.ts
  fi
fi

# -------- import rewrite (common patterns) --------
log "rewriting imports to Pack A aliases (this may take a moment)"

# helper: safe replace in TS/TSX only
replace_all(){
  FROM="$1"; TO="$2"
  # use find -print0 to handle spaces
  while IFS= read -r -d '' f; do
    sed -i "s#${FROM}#${TO}#g" "$f"
  done < <(find src -type f \( -name '*.ts' -o -name '*.tsx' \) -print0)
}

# Old → New mappings
replace_all "@/core/"        "@truss/"
replace_all "@/modules/"     "@bays/"
replace_all "@/components/"  "@fixtures/"
replace_all "@/utils/"       "@rig/"
replace_all "@/types/"       "@specs/"
replace_all "@/shards/types/" "@profiles/"
replace_all "@/shards/data/"  "@ledger/"   # rarely imported, keep for completeness
replace_all "@/ai/"           "@echo/"     # if legacy imported from ai/*
replace_all "@/shaders/"      "@flux/"

# Some projects used bare "@/..." root; map obvious cases
replace_all 'from "@/core'        'from "@truss'
replace_all 'from "@/modules'     'from "@bays'
replace_all 'from "@/components'  'from "@fixtures'
replace_all 'from "@/utils'       'from "@rig'
replace_all 'from "@/types'       'from "@specs'
replace_all 'from "@/shards/types' 'from "@profiles'
replace_all 'from "@/ai'          'from "@echo'
replace_all 'from "@/shaders'     'from "@flux'

# -------- docs patch (README/blueprint names) --------
for doc in README.md blueprint.md; do
  [ -f "$doc" ] || continue
  sed -i 's/builder\.py/forge.py/g' "$doc"
  sed -i 's/install_oriel\.sh/crane.sh/g' "$doc"
  sed -i 's/\bmodules\b/bays/g' "$doc"
  sed -i 's/\bcomponents\b/fixtures/g' "$doc"
  sed -i 's/\butils\b/rig/g' "$doc"
  sed -i 's/\btypes\b/specs/g' "$doc"
  sed -i 's/shaders\/\?/shaders\/flux/g' "$doc"
done

# -------- final touch: ensure barrels exist for profiles/specs --------
make_barrel(){
  DIR="$1"; [ -d "$DIR" ] || return 0
  BAR="$DIR/index.ts"
  : > "$BAR"
  while IFS= read -r -d '' f; do
    rel="${f#$DIR/}"; rel="${rel%.ts}"; rel="${rel%.tsx}"
    base="$(basename "$rel")"
    [ "$base" = "index" ] && continue
    echo "export * from './${rel}';" >> "$BAR"
  done < <(find "$DIR" -type f \( -name '*.ts' -o -name '*.tsx' \) -print0 | sort -z)
}
make_barrel "src/profiles"
make_barrel "src/specs"

log "Pack A migration complete."
log "Backup saved as: $BACKUP"
log "Next: npm install (if needed), then npm run dev"
