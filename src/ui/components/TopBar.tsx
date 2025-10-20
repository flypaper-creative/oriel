import React from "react";
import { useOrielState } from "../../state/store";

export function TopBar(){
  const { importShards, reso } = useOrielState() as any;

  const onImport=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>{ try{ const obj=JSON.parse(String(r.result)); const n=importShards(obj); alert(`Imported ${n} shards`); }catch{ alert("Invalid JSON"); } };
    r.readAsText(f);
  };

  const onExport=()=>{
    const shards = (useOrielState.getState() as any).shards;
    const payload = JSON.stringify({ shards }, null, 2);
    const blob=new Blob([payload],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="oriel_shards.json"; a.click();
  };

  return (
    <div className="h-12 px-3 flex items-center gap-2 border-b border-white/10 bg-ink-900/60 backdrop-blur">
      <div className="text-sm font-semibold tracking-wide">oriel</div>
      <label className="btn cursor-pointer">import<input type="file" accept="application/json" className="hidden" onChange={onImport}/></label>
      <button className="btn" onClick={onExport}>export</button>
      <div className="ml-auto text-[11px] text-white/60">reso {new Date(reso).toLocaleTimeString()}</div>
    </div>
  );
}
