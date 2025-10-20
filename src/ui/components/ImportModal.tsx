import React, { useRef, useState } from "react";
import { useOrielStore } from "../../state/store";

export function ImportModal(){
  const { closeImport, setShards, setView, toast, pushLog } = useOrielStore();
  const [count,setCount]=useState(0);
  const inputRef = useRef<HTMLInputElement|null>(null);

  const onPick = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ()=>{
      try{
        const data = JSON.parse(String(r.result));
        const parsed = Array.isArray(data)? data : (Array.isArray(data?.shards)? data.shards : []);
        const clean = parsed.filter((x:any)=> x && x.label && x.t0 && x.t1).map((x:any,i:number)=>({
          id: String(x.id || "s_imp_"+i),
          label: String(x.label), t0: new Date(x.t0).getTime(), t1: new Date(x.t1).getTime(),
          color: x.color || ["#b2f200","#00e6b8","#8b5cf6","#22c55e","#f59e0b"][i%5],
        }));
        setCount(clean.length);
        if(clean.length){
          setShards(clean);
          const min = Math.min(...clean.map((s:any)=>s.t0));
          const max = Math.max(...clean.map((s:any)=>s.t1));
          setView(min-60000,max+60000);
          pushLog(`imported ${clean.length} shards`);
          toast("imported shards");
        }
      }catch{ toast("invalid json"); }
    };
    r.readAsText(f);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={closeImport}/>
      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl card rounded-2xl p-4 border border-ink-800">
        <div className="text-sm font-semibold mb-2">import shards</div>
        <input ref={inputRef} type="file" className="block w-full text-xs" accept="application/json" onChange={onPick}/>
        <div className="text-xs text-ink-400 mt-2">{count? `${count} valid items` : "Choose a JSON file containing shards."}</div>
      </div>
    </div>
  );
}
