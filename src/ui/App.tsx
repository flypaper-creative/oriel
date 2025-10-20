import React, { useEffect } from "react";
import { ModuleGrid } from "./components/ModuleGrid";
import { Timeline } from "./components/Timeline";
import { ShardInspector } from "./components/ShardInspector";
import { useStore } from "@/state/store";

export default function App(){
  const { running, setReso, shards, setShards, pushLog } = useStore(s=>({
    running: s.running, setReso: s.setReso, shards: s.shards, setShards: s.setShards, pushLog: s.pushLog
  }));

  // demo seed (keeps UI testable without user data; no "Viscera" strings)
  useEffect(()=>{
    if(shards.length) return;
    const t = Date.now();
    const demo = Array.from({length:24}).map((_,i)=>({
      id: `s_${i}`, label: `Shard ${i+1}`,
      t0: t - 10*60_000 + i*60_000,
      t1: t - 9*60_000 + i*60_000,
      color: i%3===0? "#22c55e" : i%3===1? "#fbbf24" : "#60a5fa",
    }));
    setShards(demo);
    pushLog("seeded demo shards");
  },[]);

  // world-clock tick
  useEffect(()=>{
    if(!running) return;
    const id = setInterval(()=> setReso(Date.now()), 1000);
    return ()=> clearInterval(id);
  },[running]);

  return (
    <>
      <div className="h-12 bg-ink-800 border-b border-white/10 flex items-center px-3 justify-between">
        <div className="text-sm font-semibold">oriel • resonance editor</div>
        <div className="text-[11px] text-slate-400">v4.6 UI Overhaul</div>
      </div>

      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <ModuleGrid/>
          <Timeline/>
        </div>
        <div className="space-y-3">
          <ShardInspector/>
          <div className="card p-3 h-56 overflow-auto scroll-slim">
            <div className="text-sm text-slate-300 mb-2">Activity</div>
            {useStore.getState().log.map((x,i)=>(
              <div key={i} className="text-[12px] text-slate-400 leading-6">{x}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
