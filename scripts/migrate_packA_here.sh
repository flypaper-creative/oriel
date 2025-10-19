#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# ---------- target ----------
TARGET="$HOME/projects/oriel"
cd "$TARGET" || { echo "[oriel] ERROR: ~/projects/oriel not found"; exit 1; }

log(){ printf "\033[1;32m[oriel]\033[0m %s\n" "$*"; }
warn(){ printf "\033[1;33m[oriel]\033[0m %s\n" "$*"; }
die(){ printf "\033[1;31m[oriel]\033[0m %s\n" "$*"; exit 1; }

[ -f package.json ] || die "package.json missing in $TARGET"

STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP="backup_packA_${STAMP}.tar.gz"
log "backup → $BACKUP (excludes node_modules/.vite/dist caches)"
tar -czf "$BACKUP" \
  --exclude='node_modules' --exclude='.vite' --exclude='dist' \
  --exclude='.cache' --exclude='.turbo' --exclude='coverage' .

# ---------- helpers ----------
move_if_exists(){ [ -e "$1" ] || return 0; mkdir -p "$(dirname "$2")"; if [ -e "$2" ]; then cp -a "$1"/. "$2"/; rm -rf "$1"; else mv "$1" "$2"; fi; }
safe_sed(){
  # sed in-place for many files; args: pattern replacement
  PAT="$1"; REP="$2"
  while IFS= read -r -d '' f; do
    sed -i "s#${PAT}#${REP}#g" "$f"
  done < <(find src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.mts' -o -name '*.cts' \) -print0)
}

# ---------- ensure src exists ----------
mkdir -p src

# ---------- folder moves to Pack A ----------
move_if_exists "src/core"              "src/truss"
move_if_exists "src/modules"           "src/bays"
move_if_exists "src/components"        "src/fixtures"
move_if_exists "src/utils"             "src/rig"
move_if_exists "src/types"             "src/specs"
move_if_exists "src/shards/types"      "src/profiles"
move_if_exists "src/shards/data"       "src/ledger"
[ -d "src/shards" ] && rmdir src/shards 2>/dev/null || true

# services namespaces (create if missing)
mkdir -p src/{keel,ring,resonator,brace,spec-forge,switchyard,surveyor,vault}

# AI → echo
mkdir -p src/ai/echo
if [ -f "src/ai/index.ts" ] && [ ! -f "src/ai/echo/index.ts" ]; then
  cp "src/ai/index.ts" "src/ai/echo/index.ts"
fi

# shaders → flux
mkdir -p src/shaders/flux
# keep existing shader files; user may organize later

# ---------- rename builder/installer ----------
[ -f "builder.py" ] && mv -f builder.py forge.py
[ -f "scripts/install_oriel.sh" ] && mv -f scripts/install_oriel.sh scripts/crane.sh
mkdir -p scripts

# ---------- patch tsconfig.json ----------
if [ -f tsconfig.json ]; then
  log "patch tsconfig.json"
  # ensure baseUrl and inject/replace paths block
  sed -i 's#"baseUrl":[^,}]*#"baseUrl": "."#' tsconfig.json || true
  if grep -q '"paths"' tsconfig.json; then
    # replace existing paths object
    awk '
      BEGIN{repl="  \"paths\": {\n    \"@truss/*\": [\"src/truss/*\"],\n    \"@bays/*\": [\"src/bays/*\"],\n    \"@fixtures/*\": [\"src/fixtures/*\"],\n    \"@profiles/*\": [\"src/profiles/*\"],\n    \"@specs/*\": [\"src/specs/*\"],\n    \"@rig/*\": [\"src/rig/*\"],\n    \"@keel/*\": [\"src/keel/*\"],\n    \"@ring/*\": [\"src/ring/*\"],\n    \"@vault/*\": [\"src/vault/*\"],\n    \"@echo/*\": [\"src/ai/echo/*\"],\n    \"@flux/*\": [\"src/shaders/flux/*\"]\n  }"}
      /"paths"[[:space:]]*:/ {inpaths=1; print repl; next}
      inpaths && /\}/ {inpaths=0; next}
      !inpaths {print}
    ' tsconfig.json > tsconfig.json.tmp && mv tsconfig.json.tmp tsconfig.json
  else
    # inject after baseUrl or compilerOptions
    awk '
      /"baseUrl"/ && !done {
        print; 
        print "  ,\"paths\": {";
        print "    \"@truss/*\": [\"src/truss/*\"],";
        print "    \"@bays/*\": [\"src/bays/*\"],";
        print "    \"@fixtures/*\": [\"src/fixtures/*\"],";
        print "    \"@profiles/*\": [\"src/profiles/*\"],";
        print "    \"@specs/*\": [\"src/specs/*\"],";
        print "    \"@rig/*\": [\"src/rig/*\"],";
        print "    \"@keel/*\": [\"src/keel/*\"],";
        print "    \"@ring/*\": [\"src/ring/*\"],";
        print "    \"@vault/*\": [\"src/vault/*\"],";
        print "    \"@echo/*\": [\"src/ai/echo/*\"],";
        print "    \"@flux/*\": [\"src/shaders/flux/*\"]";
        print "  }";
        done=1; next
      }
      {print}
    ' tsconfig.json > tsconfig.json.tmp && mv tsconfig.json.tmp tsconfig.json
  fi
fi

# ---------- patch vite.config.ts ----------
if [ -f vite.config.ts ]; then
  log "patch vite.config.ts"
  # require('path') style for broad compatibility
  if grep -q "alias:" vite.config.ts; then
    awk '
      BEGIN{
        repl="      alias: {\
\\n        \"@truss\": require(\"path\").resolve(__dirname, \"src/truss\"),\
\\n        \"@bays\": require(\"path\").resolve(__dirname, \"src/bays\"),\
\\n        \"@fixtures\": require(\"path\").resolve(__dirname, \"src/fixtures\"),\
\\n        \"@profiles\": require(\"path\").resolve(__dirname, \"src/profiles\"),\
\\n        \"@specs\": require(\"path\").resolve(__dirname, \"src/specs\"),\
\\n        \"@rig\": require(\"path\").resolve(__dirname, \"src/rig\"),\
\\n        \"@keel\": require(\"path\").resolve(__dirname, \"src/keel\"),\
\\n        \"@ring\": require(\"path\").resolve(__dirname, \"src/ring\"),\
\\n        \"@vault\": require(\"path\").resolve(__dirname, \"src/vault\"),\
\\n        \"@echo\": require(\"path\").resolve(__dirname, \"src/ai/echo\"),\
\\n        \"@flux\": require(\"path\").resolve(__dirname, \"src/shaders/flux\")\
\\n      }"
      }
      /alias[[:space:]]*:/ {inalias=1; print "      "repl; next}
      inalias && /}/ {inalias=0; next}
      {print}
    ' vite.config.ts > vite.config.ts.tmp && mv vite.config.ts.tmp vite.config.ts
  else
    # add resolve section after plugins
    awk '
      /plugins:[^]]*]/ && !added {
        print
        print "  ,resolve:{"
        print "    alias:{"
        print "      \"@truss\": require(\"path\").resolve(__dirname,\"src/truss\"),"
        print "      \"@bays\": require(\"path\").resolve(__dirname,\"src/bays\"),"
        print "      \"@fixtures\": require(\"path\").resolve(__dirname,\"src/fixtures\"),"
        print "      \"@profiles\": require(\"path\").resolve(__dirname,\"src/profiles\"),"
        print "      \"@specs\": require(\"path\").resolve(__dirname,\"src/specs\"),"
        print "      \"@rig\": require(\"path\").resolve(__dirname,\"src/rig\"),"
        print "      \"@keel\": require(\"path\").resolve(__dirname,\"src/keel\"),"
        print "      \"@ring\": require(\"path\").resolve(__dirname,\"src/ring\"),"
        print "      \"@vault\": require(\"path\").resolve(__dirname,\"src/vault\"),"
        print "      \"@echo\": require(\"path\").resolve(__dirname,\"src/ai/echo\"),"
        print "      \"@flux\": require(\"path\").resolve(__dirname,\"src/shaders/flux\")"
        print "    }"
        print "  }"
        added=1; next
      }
      {print}
    ' vite.config.ts > vite.config.ts.tmp && mv vite.config.ts.tmp vite.config.ts
  fi
fi

# ---------- rewrite imports ----------
log "rewrite imports → Pack A"
safe_sed "@/core/"        "@truss/"
safe_sed "@/modules/"     "@bays/"
safe_sed "@/components/"  "@fixtures/"
safe_sed "@/utils/"       "@rig/"
safe_sed "@/types/"       "@specs/"
safe_sed "@/shards/types/" "@profiles/"
safe_sed "@/shards/data/"  "@ledger/"
safe_sed "@/ai/"           "@echo/"
safe_sed "@/shaders/"      "@flux/"
safe_sed "from \"@/core"   "from \"@truss"
safe_sed "from '@/core"    "from '@truss"

# ---------- docs touch-ups ----------
for doc in README.md blueprint.md; do
  [ -f "$doc" ] || continue
  sed -i 's/builder\.py/forge.py/g' "$doc"
  sed -i 's/install_oriel\.sh/crane.sh/g' "$doc"
  sed -i 's/\bmodules\b/bays/g' "$doc"
  sed -i 's/\bcomponents\b/fixtures/g' "$doc"
  sed -i 's/\butils\b/rig/g' "$doc"
  sed -i 's|\bshaders/?\b|shaders/flux|g' "$doc" || true
done

# ---------- barrels for profiles/specs ----------
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

# ---------- summary ----------
log "Pack A migration complete for $TARGET"
log "Backup: $BACKUP"
echo
echo "Next:"
echo "  cd \"$TARGET\""
echo "  npm install    # if imports changed or after fresh clone"
echo "  npm run dev"
