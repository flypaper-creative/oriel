import React from 'react'
import { Play, Pause, Upload, Download } from 'lucide-react'
export function Toolbar({running, setRunning, onImport, onExport}:{running:boolean; setRunning:(b:boolean)=>void; onImport:(f:File)=>void; onExport:()=>void}){
  return (
    <div className="h-12 border-b flex items-center gap-2 px-2" style={{ borderColor:'#23252a', background:'#0c0d10' }}>
      <button className="btn" onClick={()=> setRunning(!running)}>{running? <Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}</button>
      <label className="btn cursor-pointer"><Upload className="w-4 h-4"/><input type="file" className="hidden" accept="application/json" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) onImport(f) }}/></label>
      <button className="btn" onClick={onExport}><Download className="w-4 h-4"/></button>
      <div className="ml-auto text-[11px] text-gray-500">oriel v4.5</div>
      <style>{`.btn{display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:.6rem;background:#27272a;color:#e4e4e7;border:1px solid #3f3f46;font-size:.75rem}.btn:hover{background:#3a3a42}`}</style>
    </div>
  )
}
