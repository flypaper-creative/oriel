import React, { useEffect, useState } from "react"; import { useAppStore } from "../../store/useAppStore";
export default function CommandPalette(){ const open=useAppStore(s=>s.ui.showPalette); const toggle=useAppStore(s=>s.togglePalette);
  const [q,setQ]=useState(""); const commands=["Open Timeline","Open Inspector","Open Resonance","Toggle Theme","Save Snapshot"];
  useEffect(()=>{ const k=(e:KeyboardEvent)=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();toggle();}}; window.addEventListener("keydown",k); return ()=>window.removeEventListener("keydown",k);},[toggle]);
  const results=commands.filter(c=>c.toLowerCase().includes(q.toLowerCase())); if(!open) return null;
  return (<div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50" onClick={toggle}>
    <div className="w-96 bg-oriel-surface rounded-2xl p-3 shadow-xl" onClick={(e)=>e.stopPropagation()}>
      <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Type a command…" className="w-full px-3 py-2 rounded-lg bg-oriel-bg text-sm focus:outline-none"/>
      <ul className="mt-2 max-h-60 overflow-auto text-sm">{results.map(r=><li key={r} className="px-3 py-1 hover:bg-oriel-accent/20 cursor-pointer rounded">{r}</li>)}</ul>
    </div></div>);
}
