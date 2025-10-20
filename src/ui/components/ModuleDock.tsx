import React, { useState } from "react";
import { Upload, Download, Play, Pause } from "lucide-react";
import { useStore } from "@/state/store";

export function ModuleDock(){
  const tabs = ["storyboard","scheduler","linkage","import","analytics"] as const;
  const [tab, setTab] = useState<typeof tabs[number]>("storyboard");
  const { shards, addShard, pushLog } = useStore();

  function quickAdd(){
    const t0 = Date.now() + Math.floor(Math.random()*600000);
    const s = { id: "s_"+Math.random().toString(36).slice(2), label: "beat "+(shards.length+1), t0, t1: t0+ 60_000, color:"#22c55e" };
    addShard(s); pushLog("add "+s.label);
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 p-2 border-b border-white/5">
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`btn ${t===tab? "ring-1 ring-pulse/40" : ""}`}>{t}</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="btn" onClick={quickAdd}><Play className="w-4 h-4"/>quick beat</button>
          <label className="btn cursor-pointer">
            <Upload className="w-4 h-4"/><input type="file" className="hidden" accept="application/json"/>
          </label>
          <button className="btn"><Download className="w-4 h-4"/></button>
        </div>
      </div>
      <div className="p-3 text-sm text-white/80">
        {tab==="storyboard" && <div>Drag beats on the timeline. Use pinch/scroll to zoom.</div>}
        {tab==="scheduler"  && <div>Sim loop + constraints (stubbed UI, logic-ready).</div>}
        {tab==="linkage"    && <div>Graph links between shards (coming next pass).</div>}
        {tab==="import"     && <div>JSON/CSV parsers with canon filters (next pass).</div>}
        {tab==="analytics"  && <div>Chronology sanity checks & diffs.</div>}
      </div>
    </div>
  );
}
