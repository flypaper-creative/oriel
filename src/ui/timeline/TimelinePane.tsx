import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

type Shard = { id:string; label:string; t0:number; t1:number; color?:string };

export default function TimelinePane(){
  const reso = useAppStore(s=>s.reso);
  const setReso = useAppStore(s=>s.setReso || ((v:number)=>{}));
  const [zoom,setZoom]=useState(1);           // 1 = 15 min window
  const [offset,setOffset]=useState(0);       // ms offset from now
  const [shards,setShards]=useState<Shard[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  // window
  const base = 15*60*1000;
  const span = base/zoom;
  const viewStart = useMemo(()=> reso - span*0.4 + offset, [reso,span,offset]);
  const viewEnd   = useMemo(()=> viewStart + span, [viewStart,span]);
  const domain = useMemo(()=> Math.max(1, viewEnd - viewStart), [viewStart,viewEnd]);

  const toPct = (ms:number)=> ((ms - viewStart)/domain)*100;

  // keyboard scrubbing
  useEffect(()=>{ const onKey=(e:KeyboardEvent)=>{ if(e.key==='ArrowLeft'){ setReso(reso- (e.shiftKey?10000:1000)); }
    if(e.key==='ArrowRight'){ setReso(reso+ (e.shiftKey?10000:1000)); } }; window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey); },[reso,setReso]);

  // mouse wheel zoom
  useEffect(()=>{ const el=railRef.current; if(!el) return; const onWheel=(e:WheelEvent)=>{ if(e.ctrlKey||e.metaKey){ e.preventDefault();
        const k=Math.exp(-e.deltaY*0.0012); setZoom(z=>Math.min(8,Math.max(0.25,z*k))); } else { setOffset(o=>o + e.deltaY*12); } };
    el.addEventListener('wheel',onWheel,{passive:false}); return()=>el.removeEventListener('wheel',onWheel); },[]);

  const onDragReso=(e:React.MouseEvent)=>{ const startX=e.clientX; const startT=reso; const rect=railRef.current!.getBoundingClientRect(); const W=rect.width;
    const move=(ev:MouseEvent)=>{ const dx=ev.clientX-startX; const dt=(dx/W)*domain; setReso(startT+dt); };
    const up=()=>{ window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up); };
    window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  };

  // import strict canon JSON (filters noise)
  const importJSON=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{
      const raw = JSON.parse(String(r.result));
      const list = Array.isArray(raw)? raw : (Array.isArray(raw?.shards)? raw.shards : []);
      const cleaned:Shard[] = list
        .filter(x=> x && typeof x==='object')
        .map((x,i)=>({
          id: String(x.id || `s_${i}_${Math.random().toString(36).slice(2)}`),
          label: String(x.label || x.title || x.name || "event"),
          t0: new Date(x.t0 || x.start || x.begin || Date.now()).getTime(),
          t1: new Date(x.t1 || x.end   || x.finish|| (Date.now()+1000)).getTime(),
          color: x.color || "#a855f7"
        }))
        .filter(s=> Number.isFinite(s.t0) && Number.isFinite(s.t1) && s.t1>=s.t0);
      setShards(cleaned);
      if(cleaned.length){ const min=Math.min(...cleaned.map(s=>s.t0)); const max=Math.max(...cleaned.map(s=>s.t1)); setOffset(min - (reso - span*0.4) - 60000); setZoom(Math.min(6, Math.max(.25, (base/(max-min+1))*0.8))); }
    }catch{ alert("Invalid JSON"); } }; r.readAsText(f);
  };

  const ticks = useMemo(()=>{ const arr:number[]=[]; const steps=10; for(let i=0;i<=steps;i++) arr.push(viewStart + domain*i/steps); return arr; },[viewStart,domain]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs">
        <label className="inline-flex items-center gap-2">Zoom<input type="range" min="0.25" max="8" step="0.01" value={zoom} onChange={e=>setZoom(parseFloat(e.target.value))}/></label>
        <button className="px-2 py-1 rounded bg-oriel-surface hover:bg-oriel-surface/80" onClick={()=>{setOffset(0);setZoom(1);}}>Fit</button>
        <button className="px-2 py-1 rounded bg-oriel-accent text-black" onClick={()=>setOffset(0)}>Now</button>
        <label className="ml-auto px-2 py-1 rounded bg-oriel-surface hover:bg-oriel-surface/80 cursor-pointer">Import<input type="file" className="hidden" accept="application/json" onChange={importJSON}/></label>
      </div>

      <div ref={railRef} className="relative h-64 rounded-xl overflow-hidden border border-oriel-surface bg-oriel-surface/60">
        {/* grid + ticks */}
        <div className="absolute inset-0 pointer-events-none">
          {ticks.map((t,i)=>(
            <div key={i} className="absolute top-0 bottom-0" style={{ left: toPct(t)+"%", borderLeft: "1px solid rgba(255,255,255,.07)"}}>
              <div className="absolute top-0 -translate-x-1/2 text-[10px] text-oriel-mute px-1 py-0.5">{new Date(t).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        {/* shards */}
        <div className="absolute inset-0 top-6">
          {shards.slice(0,200).map((s,idx)=>{
            const L = toPct(s.t0), R = toPct(s.t1), W = Math.max(0.5, R-L);
            return (
              <div key={s.id} title={s.label}
                className="absolute h-6 rounded shadow"
                style={{ left: L+"%", width: W+"%", top: (idx%8)*28, background: s.color||"#a855f7" }}>
                <div className="px-2 text-[11px] truncate text-black/80 font-medium">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* reso (green) */}
        <div className="absolute top-0 bottom-0 w-[3px] cursor-ew-resize"
             style={{ left: toPct(reso)+"%", background:"#22c55e", boxShadow:"0 0 16px #22c55e88" }}
             onMouseDown={onDragReso} />
        {/* scroll hint */}
        <div className="absolute right-2 bottom-2 text-[10px] text-oriel-mute bg-black/30 px-2 py-1 rounded">Wheel to scroll • Ctrl/Cmd+Wheel to zoom • ←/→ to scrub</div>
      </div>
    </div>
  );
}
