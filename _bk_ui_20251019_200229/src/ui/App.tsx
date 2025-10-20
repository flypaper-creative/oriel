import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Command, Play, Pause } from "lucide-react";
import { Timeline } from "./components/Timeline";
import { ShaderScene } from "./components/ShaderScene";
import { CommandPalette } from "./components/CommandPalette";
import { useOrielStore } from "../state/store";

export function App() {
  const { running, toggleRun, reso } = useOrielStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCmd, setShowCmd] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <div className="h-12 border-b border-ink-800 px-3 flex items-center gap-2">
        <button onClick={toggleRun} className="px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 transition">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="text-xs text-ink-300">reso {new Date(reso).toLocaleTimeString()}</div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowCmd(true)} className="px-2 py-1 rounded bg-ink-800 hover:bg-ink-700">
            <Command className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSettings(true)} className="px-2 py-1 rounded bg-ink-800 hover:bg-ink-700">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr_320px] grid-cols-1 h-[calc(100vh-3rem)]">
        <aside className="hidden lg:block border-r border-ink-800 overflow-y-auto">
          <Dock />
        </aside>

        <main className="relative">
          <ShaderScene />
          <div className="absolute inset-0 p-3 flex flex-col gap-3 pointer-events-none">
            <motion.div className="pointer-events-auto" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
              <Timeline />
            </motion.div>
            <div className="pointer-events-auto flex-1 rounded-2xl border border-ink-800 bg-ink-900/60 backdrop-blur-sm overflow-hidden">
              <LiveLog />
            </div>
          </div>
        </main>

        <aside className="hidden lg:block border-l border-ink-800 overflow-y-auto">
          <Inspector />
        </aside>
      </div>

      <AnimatePresence>
        {showCmd && <CommandPalette onClose={() => setShowCmd(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showSettings && <SettingsDrawer onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Dock(){
  const { modules } = useOrielStore();
  return (
    <div className="p-3 space-y-2">
      <h3 className="text-sm font-semibold text-ink-200 mb-1">modules</h3>
      <div className="grid grid-cols-1 gap-2">
        {modules.map(m => (
          <button key={m.id} className="p-2 rounded-xl bg-ink-900 border border-ink-800 hover:border-brand-base text-left">
            <div className="text-xs text-ink-300">{m.category}</div>
            <div className="text-sm">{m.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Inspector(){
  const { selected } = useOrielStore();
  if(!selected) return <div className="p-4 text-ink-400 text-sm">Select a shard or segment on the timeline to inspect.</div>;
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-semibold text-ink-200">inspector</h3>
      <div className="rounded-xl border border-ink-800 bg-ink-900 p-3">
        <div className="text-xs text-ink-400 mb-1">label</div>
        <div className="text-sm">{selected.label}</div>
        <div className="text-xs text-ink-400 mt-3">time</div>
        <div className="text-sm">{new Date(selected.t0).toLocaleString()} → {new Date(selected.t1).toLocaleString()}</div>
        <div className="text-xs text-ink-400 mt-3">links</div>
        <div className="text-sm">{(selected.links||[]).join(", ")||"—"}</div>
      </div>
    </div>
  );
}

function LiveLog(){
  const { log } = useOrielStore();
  return <div className="h-full overflow-auto p-3 space-y-1 text-xs text-ink-300">{log.map((l,i)=> <div key={i}>{l}</div>)}</div>;
}

function SettingsDrawer({ onClose }:{ onClose:()=>void }){
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-ink-900 border-l border-ink-800 p-4">
        <h3 className="text-sm font-semibold text-ink-200 mb-3">settings</h3>
        <div className="text-xs text-ink-400">Theme, A11y, Performance, Data…</div>
      </div>
    </div>
  );
}
