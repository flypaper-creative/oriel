import React from "react";
import { Play, Pause, Upload, Settings } from "lucide-react";
import { useOrielStore } from "../../state/store";

export function NavTop(){
  const { running, toggleRun, reso, openImport } = useOrielStore();
  return (
    <header className="h-14 px-3 border-b border-ink-800 flex items-center gap-2 relative z-20"
      style={{background:"linear-gradient(90deg,#0f1522,#0f1724,#0f1522)"}}>
      <div className="text-sm font-semibold tracking-wide">oriel</div>
      <button onClick={toggleRun} className="btn">{running?<Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}</button>
      <div className="text-xs text-ink-300">reso {new Date(reso).toLocaleTimeString()}</div>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={openImport} className="btn"><Upload className="w-4 h-4"/></button>
        <button className="btn"><Settings className="w-4 h-4"/></button>
      </div>
    </header>
  );
}
