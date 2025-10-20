import React, { useEffect } from "react";
import { Play, Pause, Upload, Download, Command, Settings } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

function exportJSON(shards:any[]){ const payload=JSON.stringify(shards.map(s=>({...s,t0:new Date(s.t0).toISOString(),t1:new Date(s.t1).toISOString()})),null,2);
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([payload],{type:"application/json"})); a.download="oriel_shards.json"; a.click(); }

export default function HeaderBar(){
  const running=useAppStore(s=>s.running), setRunning=useAppStore(s=>s.setRunning);
  const tick=useAppStore(s=>s.tick);
  const shards=useAppStore(s=>s.shards);
  const toggleSettings=useAppStore(s=>s.toggleSettings);
  const togglePalette=useAppStore(s=>s.togglePalette);

  // drive reso when running
  useEffect(()=>{ if(!running) return; const id=setInterval(()=>tick(1000), 1000); return ()=>clearInterval(id); },[running,tick]);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-oriel-surface backdrop-blur-md sticky top-0 z-40 bg-oriel-bg/70">
      <div className="flex items-center gap-3">
        <span className="text-base md:text-lg font-semibold tracking-wide">oriel</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full bg-oriel-surface hover:shadow-glow" onClick={()=>setRunning(!running)} aria-label="Play/Pause">
          {running? <Pause size={18}/> : <Play size={18}/>}
        </button>
        <label className="p-2 rounded-full bg-oriel-surface hover:shadow-glow cursor-pointer" title="Import shards JSON">
          <Upload size={18}/><input id="oriel-file" type="file" className="hidden" accept="application/json"/>
        </label>
        <button className="p-2 rounded-full bg-oriel-surface hover:shadow-glow" onClick={()=>exportJSON(shards)} title="Export shards JSON"><Download size={18}/></button>
        <button className="p-2 rounded-full bg-oriel-surface hover:shadow-glow" onClick={togglePalette} title="Command Palette (Ctrl+K)"><Command size={18}/></button>
        <button className="p-2 rounded-full bg-oriel-surface hover:shadow-glow" onClick={toggleSettings} title="Settings"><Settings size={18}/></button>
      </div>
    </header>
  );
}
