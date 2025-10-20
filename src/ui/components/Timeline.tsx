import React, { useCallback, useMemo, useRef } from "react";
import { useStore } from "@/state/store";
import { useTimelineGestures } from "./TimelineGestures";
import { motion } from "framer-motion";

const BAR_H = 28;

export function Timeline(){
  const ref = useRef<HTMLDivElement>(null);
  const { shards, reso, viewStart, viewEnd, setReso, setView, setSelected, pushLog } = useStore((s)=>({
    shards: s.shards, reso: s.reso, viewStart: s.viewStart, viewEnd: s.viewEnd,
    setReso: s.setReso, setView: s.setView, setSelected: s.setSelected, pushLog: s.pushLog
  }));

  const domain = Math.max(1, viewEnd - viewStart);
  const toPct = (ms:number)=> ((ms - viewStart)/domain) * 100;
  const toMs  = (px:number)=> viewStart + (px/(ref.current?.clientWidth||1))*domain;

  const onZoom = useCallback((scale:number, cx:number)=>{
    const centerTime = toMs(cx);
    const span = (viewEnd - viewStart) / scale;
    const half = span/2;
    const a = Math.floor(centerTime - half);
    const b = Math.ceil(centerTime + half);
    setView(a, b);
  }, [viewStart, viewEnd]);

  const onPan = useCallback((dx:number)=>{
    const dt = (dx/(ref.current?.clientWidth||1))*domain;
    setView(viewStart - dt, viewEnd - dt);
  }, [viewStart, viewEnd]);

  const onTapShard = useCallback((id:string)=>{
    const sel = shards.find(s=>s.id===id) || null;
    if(sel){ setSelected(sel); pushLog(`focus ${sel.label}`); }
  }, [shards]);

  useTimelineGestures({ ref, onZoom, onPan, onTapShard });

  const ticks = useMemo(()=>{
    const result:number[] = [];
    const steps = 8;
    for(let i=0;i<=steps;i++) result.push(viewStart + (domain*i/steps));
    return result;
  }, [viewStart, viewEnd]);

  const onDragReso = (e:React.MouseEvent)=>{
    const startX = e.clientX;
    const start = reso;
    const rect = ref.current!.getBoundingClientRect();
    const W = rect.width;
    const move = (ev:MouseEvent)=> {
      const dx = ev.clientX - startX;
      const dt = (dx/W)*domain;
      setReso(start + dt);
    };
    const up = ()=> {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      pushLog("set world clock");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div className="card overflow-hidden p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-slate-300">Timeline</div>
        <div className="text-[11px] text-slate-400">
          {new Date(viewStart).toLocaleTimeString()} — {new Date(viewEnd).toLocaleTimeString()}
        </div>
      </div>
      <div ref={ref} className="relative h-56 rounded-lg bg-ink-800 overflow-hidden scroll-slim">
        {/* grid */}
        <div className="absolute inset-0 pointer-events-none"
             style={{background:"linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize:"100% 28px"}}/>
        {/* ticks */}
        {ticks.map((t,i)=>(
          <div key={i} className="absolute top-0 bottom-0 border-l border-white/10"
               style={{ left: `${toPct(t)}%` }}>
            <div className="absolute top-0 -translate-x-1/2 text-[10px] text-slate-400 px-1 py-0.5 bg-ink-900/60 rounded">
              {new Date(t).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {/* shards */}
        <div className="absolute inset-0 pt-6">
          {shards.slice(0,200).map((s, idx)=>{
            const L = toPct(s.t0);
            const R = toPct(s.t1);
            const W = Math.max(0.35, R-L);
            return (
              <motion.div
                key={s.id}
                data-shard-id={s.id}
                className="absolute h-[26px] rounded-md cursor-pointer"
                title={s.label}
                style={{ left:`${L}%`, width:`${W}%`, top: (idx%6)*BAR_H }}
                initial={{ opacity:.0, y:4 }} animate={{ opacity:1, y:0 }}
              >
                <div className="h-full w-full rounded-md"
                     style={{ background: s.color, boxShadow:"0 2px 8px rgba(0,0,0,.3)" }}>
                  <div className="px-2 text-[11px] truncate text-black/80 font-semibold leading-[26px]">
                    {s.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* world clock / reso */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-limepulse-500 shadow-neon cursor-ew-resize"
          style={{ left: `${toPct(reso)}%` }}
          onMouseDown={onDragReso}
        />
      </div>
    </div>
  );
}
