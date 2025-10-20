import React from "react";
import { useOrielState } from "../../state/store";

export function ShardDrawer(){
  const { selected, setSelected } = useOrielState() as any;
  if(!selected) return null;
  return (
    <div className="fixed right-3 bottom-3 w-[360px] max-w-[92vw] card p-3 shadow-glow">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{selected.label}</div>
        <button className="btn" onClick={()=>setSelected(null)}>close</button>
      </div>
      <div className="mt-2 text-[12px] text-white/70 space-y-2">
        <div>start: {new Date(selected.t0).toLocaleString()}</div>
        <div>end: {new Date(selected.t1).toLocaleString()}</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background:selected.color||'#8b5cf6' }} />
          <div className="text-white/60">color</div>
        </div>
      </div>
    </div>
  );
}
