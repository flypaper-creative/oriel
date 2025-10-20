import React from "react"; import { useAppStore } from "../../store/useAppStore";
export default function StatusFooter(){ const running=useAppStore(s=>s.running); const reso=useAppStore(s=>s.reso);
  return <footer className="p-2 border-t border-oriel-surface text-xs text-center text-oriel-mute mb-12 lg:mb-0"><span className="text-oriel-accent">●</span> {running?"running":"paused"} — reso {new Date(reso).toLocaleTimeString()}</footer>;
}
