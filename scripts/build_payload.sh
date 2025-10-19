#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
ROOT="$HOME/projects/oriel_payload_full"
rm -rf "$ROOT"; mkdir -p "$ROOT"
cd "$ROOT"

log(){ printf "\033[1;32m[payload]\033[0m %s\n" "$*"; }

# ---------------- schema + type files ----------------
mkdir -p schemas shard_types
for i in $(seq 1 300); do
  f=$(printf "Type_%03d.ts" "$i")
  echo "export interface Type_$i { id: string; label: string; meta?: string }" > "schemas/$f"
  echo "export interface ShardType_$i extends Type_$i {}" > "shard_types/$f"
done

# ---------------- modules ----------------
MODULES=(rail bay manifold crosscut surveyor vault echo spec-forge timeline linkage continuity presentation)
for m in "${MODULES[@]}"; do
  mkdir -p "modules/$m"
  echo "import React from 'react';\nexport default function ${m^}() {return (<div>${m^} module loaded</div>)}" > "modules/$m/index.tsx"
done

# ---------------- modes ----------------
mkdir -p modes
for mode in fiction screenplay analysis meta; do
  echo "export const mode = '$mode';" > "modes/$mode.ts"
done

# ---------------- components ----------------
mkdir -p components/extra
for i in $(seq 1 40); do
  f=$(printf "Component_%02d.tsx" "$i")
  echo "import React from 'react';\nexport function Component_$i(){return (<div>Component_$i</div>)}" > "components/extra/$f"
done

# ---------------- shaders ----------------
mkdir -p shaders
SHADERS=(grid glow noise pulse linkfield selection fluxwave scanline chroma blur particle fog ember ripple glitch)
for s in "${SHADERS[@]}"; do
  echo "// $s shader\nvoid main(){gl_FragColor=vec4(${#s}/50.0,0.2,0.5,1.0);}" > "shaders/$s.glsl"
done

# ---------------- assets ----------------
mkdir -p assets
echo "placeholder asset" > assets/readme.txt

# ---------------- zip it ----------------
ZIP="/storage/emulated/0/Download/oriel_payload_full.zip"
cd "$ROOT/.."
rm -f "$ZIP"
zip -qr "$ZIP" "oriel_payload_full"
log "payload zip ready → $ZIP"
