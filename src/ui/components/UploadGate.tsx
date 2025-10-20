import React, { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { nanoid } from "nanoid";
export default function UploadGate(){
  const setShards=useAppStore(s=>s.setShards); const pushLog=useAppStore(s=>s.pushLog); const toast=useAppStore(s=>s.toast);
  const [preview,setPreview]=useState<any[]|null>(null);
  useEffect(()=>{ const inp=document.getElementById("oriel-file") as HTMLInputElement|null; if(!inp) return;
    const on=(e:Event)=>{ const f=(e.target as HTMLInputElement).files?.[0]; if(!f) return;
      const r=new FileReader(); r.onload=()=>{ try{ const data=JSON.parse(String(r.result)); const parsed=Array.isArray(data)?data.filter((x:any)=>x && x.t0 && x.t1 && x.label):[]; setPreview(parsed.slice(0,60)); }catch{ alert("Invalid JSON"); } };
      r.readAsText(f);
    }; inp.addEventListener("change",on); return ()=>inp.removeEventListener("change",on);
  },[]);
  if(!preview) return null;
  return (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-2xl bg-oriel-surface rounded-2xl p-4">
      <h3 className="text-lg font-medium mb-2">Import Preview</h3>
      <div className="h-56 overflow-auto text-xs bg-oriel-bg rounded p-2 border border-oriel-surface">{preview.map((p,i)=><div key={i} className="truncate">{p.label}</div>)}</div>
      <div className="flex justify-end gap-2 mt-3">
        <button className="px-3 py-2 rounded bg-oriel-surface" onClick={()=>setPreview(null)}>Cancel</button>
        <button className="px-3 py-2 rounded bg-oriel-accent text-black" onClick={()=>{
          const inp=document.getElementById("oriel-file") as HTMLInputElement|null; if(!inp||!inp.files?.[0]) return;
          const r=new FileReader(); r.onload=()=>{ try{ const data=JSON.parse(String(r.result));
            const parsed=(Array.isArray(data)?data:[]).filter((x:any)=>x && x.t0 && x.t1 && x.label)
              .map((x:any)=>({id:x.id||nanoid(),label:String(x.label),t0:new Date(x.t0).getTime(),t1:new Date(x.t1).getTime(),color:x.color||"#a855f7"}));
            setPreview(null); setShards(parsed); pushLog(`imported ${parsed.length} shards`); toast("Import successful");
          }catch{ alert("Invalid JSON data"); } }; r.readAsText(inp.files[0]);
        }}>Approve & Import</button>
      </div>
    </div></div>);
}
