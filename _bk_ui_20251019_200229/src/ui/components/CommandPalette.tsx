import React, { useEffect } from "react";
export function CommandPalette({ onClose }:{ onClose:()=>void }){
  useEffect(()=>{ const k=(e:KeyboardEvent)=> e.key==="Escape"&&onClose(); window.addEventListener("keydown",k); return()=>window.removeEventListener("keydown",k); },[onClose]);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl bg-ink-900 border border-ink-800 overflow-hidden">
        <input className="w-full bg-ink-900 px-3 py-2 text-sm outline-none border-b border-ink-800" placeholder="Type a command…" autoFocus />
        <div className="max-h-64 overflow-auto p-2 text-sm text-ink-300">Common actions…</div>
      </div>
    </div>
  );
}
