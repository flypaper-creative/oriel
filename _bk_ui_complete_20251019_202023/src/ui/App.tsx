import React, { useEffect, useMemo, useState } from "react";
import { useOrielStore, seedIfEmpty } from "../state/store";
import { Play, Pause, Settings, Command } from "lucide-react";
import { Timeline } from "./components/Timeline";
import { ShaderScene } from "./components/ShaderScene";

export function App(){
  const { running, toggleRun, reso } = useOrielStore();
  const [showCmd,setShowCmd] = useState(false);
  const [showSettings,setShowSettings] = useState(false);

  useEffect(()=>{ seedIfEmpty(); },[]);

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <header className="h-14 px-4 border-b border-ink-800 flex items-center gap-2"
        style={{background:"linear-gradient(90deg,#0f1522,#101826,#0f1522)"}}>
        <button onClick={toggleRun} className="px-3 py-1.5 rounded-xl bg-ink-800 hover:bg-ink-700 transition">
          {running? <Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}
        </button>
        <div className="text-xs text-ink-300">reso {new Date(reso).toLocaleTimeString()}</div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>setShowCmd(true)} className="px-2 py-1 rounded-xl bg-ink-800 hover:bg-ink-700"><Command className="w-4 h-4"/></button>
          <button onClick={()=>setShowSettings(true)} className="px-2 py-1 rounded-xl bg-ink-800 hover:bg-ink-700"><Settings className="w-4 h-4"/></button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr_320px] grid-cols-1 h-[calc(100vh-3.5rem)] relative">
        {/* background shader */}
        <ShaderScene/>

        {/* left dock */}
        <aside className="hidden lg:block border-r border-ink-800 overflow-y-auto relative z-10">
          <Dock/>
        </aside>

        {/* main */}
        <main className="relative z-10 p-3 flex flex-col gap-3">
          <StatsStrip/>
          <Timeline/>
          <LogPane/>
        </main>

        {/* inspector */}
        <aside className="hidden lg:block border-l border-ink-800 overflow-y-auto relative z-10">
          <Inspector/>
        </aside>
      </div>

      {showCmd && <Overlay onClose={()=>setShowCmd(false)}><CmdPalette/></Overlay>}
      {showSettings && <Overlay onClose={()=>setShowSettings(false)}><SettingsPane/></Overlay>}
    </div>
  );
}

function Overlay({children,onClose}:{children:React.ReactNode; onClose:()=>void}){
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[92vw] max-w-3xl">{children}</div>
    </div>
  );
}

function Dock(){
  const modules = useMemo(()=>[
    { id:"chrono", name:"Chronology", category:"Structure" },
    { id:"graph", name:"Link Graph", category:"Structure" },
    { id:"scribe", name:"Scribe", category:"Authoring" },
    { id:"cast", name:"Cast", category:"Lore" },
    { id:"atlas", name:"Atlas", category:"Lore" },
    { id:"pulse", name:"Simulation", category:"System" },
  ],[]);
  return (
    <div className="p-3 space-y-2">
      <h3 className="text-sm font-semibold text-ink-200 mb-1">modules</h3>
      {modules.map(m=>(
        <button key={m.id} className="card w-full p-3 rounded-2xl hover:border-aqua/60 transition text-left">
          <div className="text-[11px] text-ink-300">{m.category}</div>
          <div className="text-sm">{m.name}</div>
        </button>
      ))}
    </div>
  );
}

function StatsStrip(){
  const { shards } = useOrielStore();
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <div className="card rounded-2xl p-3">
        <div className="text-xs text-ink-300">shards</div>
        <div className="text-2xl font-semibold">{shards.length}</div>
      </div>
      <div className="card rounded-2xl p-3">
        <div className="text-xs text-ink-300">coverage</div>
        <div className="text-2xl font-semibold">live</div>
      </div>
      <div className="card rounded-2xl p-3">
        <div className="text-xs text-ink-300">quality</div>
        <div className="text-2xl font-semibold">stable</div>
      </div>
    </div>
  );
}

function LogPane(){
  const { log } = useOrielStore();
  return (
    <div className="card rounded-2xl border border-ink-800 overflow-hidden flex-1">
      <div className="p-3 text-xs text-ink-300 h-full overflow-auto space-y-1">
        {log.length? log.map((l,i)=><div key={i}>{l}</div>): <div className="opacity-60">system ready.</div>}
      </div>
    </div>
  );
}

function Inspector(){
  const { selected } = useOrielStore();
  return (
    <div className="p-3">
      <div className="card rounded-2xl p-3">
        <h3 className="text-sm font-semibold text-ink-200 mb-2">inspector</h3>
        {!selected && <div className="text-xs text-ink-400">Select a shard on the timeline.</div>}
        {selected && (
          <div className="space-y-2 text-sm">
            <div className="text-ink-300">label</div>
            <div>{selected.label}</div>
            <div className="text-ink-300 mt-2">time</div>
            <div>{new Date(selected.t0).toLocaleString()} → {new Date(selected.t1).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CmdPalette(){
  return (
    <div className="card rounded-2xl border border-ink-800 overflow-hidden">
      <input className="w-full px-3 py-2 bg-transparent border-b border-ink-800 text-sm" placeholder="Command… (e.g., add shard)" autoFocus/>
      <div className="p-2 text-xs text-ink-300">Type to search commands.</div>
    </div>
  );
}

function SettingsPane(){
  return (
    <div className="card rounded-2xl border border-ink-800 p-3">
      <div className="text-sm font-semibold text-ink-200 mb-2">settings</div>
      <div className="text-xs text-ink-400">Theme · Accessibility · Performance</div>
    </div>
  );
}
