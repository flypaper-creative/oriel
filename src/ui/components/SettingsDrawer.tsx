import React, { useState } from "react";
export function SettingsDrawer(){
  const [hc,setHc]=useState(false);
  return (
    <div className="p-3 text-sm space-y-2">
      <label className="flex items-center gap-2"><input type="checkbox" checked={hc} onChange={()=>setHc(v=>!v)}/>High-contrast mode</label>
      <div className="text-white/50 text-xs">More settings coming online.</div>
    </div>
  );
}
