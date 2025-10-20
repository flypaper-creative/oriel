import React, { useMemo, useRef, useState } from "react";
import { useOrielStore } from "../../state/store";
import { clamp } from "../../utils/format";

type DragShard = null | { id:string; mode:"move"|"l"|"r"; x0:number; t0:number; t1:number };

export function Timeline(){
  const ref = useRef<HTMLDivElement|null>(null);
  const { shards, setShards, reso, setReso, viewStart, viewEnd, setView, setSelected, pushLog } = useOrielStore();
  const [dragReso, setDragReso] = useState<null | {x:number, t:number}>(null);
  const [dragPan, setDragPan] = useState<null | {x:number, start:number, end:number}>(null);
  const [dragShard, setDragShard] = useState<DragShard>(null);

  const domain = Math.max(1, viewEnd - viewStart);
  const toPct = (ms:number)=> ((ms - viewStart) / domain) * 100;
  const w = ()=> ref.current?.clientWidth || 1;
  const fromX = (x:number)=> viewStart + (x / w()) * domain;

  const ticks = useMemo(()=> { const arr:number[]=[]; const steps=8; for(let i=0;i<=steps;i++) arr.push(viewStart + domain*i/steps); return arr; }, [viewStart, viewEnd]);

  // pinch support
  const pts = useRef(new Map<number, {x:number,y:number}>());
  const pinch = useRef<null | {d0:number; centerT:number; startSpan:number}>(null);

  function pointerDown(e:React.PointerEvent){
    const el = ref.current!; el.setPointerCapture(e.pointerId);
    pts.current.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if(pts.current.size===2){
      const a=[...pts.current.values()];
      const d0=Math.hypot(a[0].x-a[1].x, a[0].y-a[1].y);
      const cx=(a[0].x+a[1].x)/2;
      pinch.current = { d0, centerT: fromX(cx), startSpan: domain };
    }
  }
  function pointerMove(e:React.PointerEvent){
    if(!ref.current) return;
    if(pts.current.has(e.pointerId)){ pts.current.set(e.pointerId, {x:e.clientX, y:e.clientY}); }
    // pinch zoom
    if(pinch.current && pts.current.size===2){
      const a=[...pts.current.values()];
      const d1=Math.hypot(a[0].x-a[1].x, a[0].y-a[1].y);
      if(d1>0){
        const k = clamp(pinch.current.d0 / d1, 0.25, 4);
        let span = clamp(pinch.current.startSpan * k, 5_000, 6*60*60*1000);
        const c = pinch.current.centerT;
        setView(c - span/2, c + span/2);
      }
      return;
    }
    // pan
    if(dragPan){
      const dx = e.clientX - dragPan.x;
      const dt = (dx / w()) * domain;
      setView(dragPan.start - dt, dragPan.end - dt);
    }
    // drag reso
    if(dragReso){
      const dx = e.clientX - dragReso.x;
      const dt = (dx / w()) * domain;
      setReso(clamp(dragReso.t + dt, viewStart, viewEnd));
    }
    // shard move/resize
    if(dragShard){
      const dx = e.clientX - dragShard.x0;
      const dt = (dx / w()) * domain;
      setShards(shards.map(s => {
        if(s.id!==dragShard.id) return s;
        if(dragShard.mode==="move") return ({...s, t0: dragShard.t0 + dt, t1: dragShard.t1 + dt});
        if(dragShard.mode==="l")   return ({...s, t0: Math.min(dragShard.t1-1000, dragShard.t0 + dt)});
        return ({...s, t1: Math.max(dragShard.t0+1000, dragShard.t1 + dt)});
      }));
    }
  }
  function pointerUp(e:React.PointerEvent){
    const el = ref.current!; try{ el.releasePointerCapture(e.pointerId); }catch{}
    pts.current.delete(e.pointerId);
    if(pts.current.size<2) pinch.current=null;
    setDragReso(null); setDragPan(null); setDragShard(null);
  }

  const onPanStart = (e:React.PointerEvent)=> { if(e.button===0) setDragPan({ x:e.clientX, start:viewStart, end:viewEnd }); };
  const onResoStart = (e:React.PointerEvent)=> { setDragReso({ x:e.clientX, t:reso }); e.stopPropagation(); };
  const onShardStart = (s:any, mode:"move"|"l"|"r")=>(e:React.PointerEvent)=> { setDragShard({ id:s.id, mode, x0:e.clientX, t0:s.t0, t1:s.t1 }); e.stopPropagation(); };
  const onShardClick = (s:any)=>{ setSelected(s); pushLog(`focus ${s.label}`); };

  return (
    <div
      ref={ref}
      className="relative h-72 rounded-2xl border border-ink-800 card overflow-hidden select-none touch-none"
      style={{touchAction:"none"}}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}
      onMouseDown={onPanStart}
    >
      {/* grid */}
      <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize:"100% 32px" }} />
      {ticks.map((t,i)=>(
        <div key={i} className="absolute top-0 bottom-0 border-l border-ink-800" style={{left:`${toPct(t)}%`}}>
          <div className="absolute top-0 -translate-x-1/2 text-[10px] text-ink-300 px-1">{new Date(t).toLocaleTimeString()}</div>
        </div>
      ))}

      {/* shards */}
      <div className="absolute top-10 left-0 right-0">
        {shards.slice(0,600).map((s,idx)=>{
          const L=toPct(s.t0), R=toPct(s.t1), W=Math.max(0.75,R-L), top=(idx%6)*32;
          return (
            <div key={s.id} className="absolute" style={{ left:`${L}%`, width:`${W}%`, top }}>
              <div
                className="h-6 rounded-md shadow ring-1 ring-black/10 cursor-grab active:cursor-grabbing"
                style={{ background: s.color||"#8b5cf6" }}
                onPointerDown={onShardStart(s,"move")} onClick={()=>onShardClick(s)} title={`${s.label}`}
              >
                <div className="px-2 text-[11px] truncate text-black/80 font-medium">{s.label}</div>
              </div>
              {/* resize handles */}
              <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize" onPointerDown={onShardStart(s,"l")} />
              <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize" onPointerDown={onShardStart(s,"r")} />
            </div>
          );
        })}
      </div>

      {/* reso bar */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-[#22c55e] shadow-[0_0_16px_#22c55e88] cursor-ew-resize"
        style={{ left:`${toPct(reso)}%` }}
        onPointerDown={onResoStart}
      />

      {/* mini scrollbar strip */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-ink-900/70">
        <div className="h-full bg-ink-700/60 rounded-full" style={{ width:`${Math.min(100,Math.max(10, 100*(600000/domain)))}%` }} />
      </div>
    </div>
  );
}
