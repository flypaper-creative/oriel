import React, { useMemo, useRef, useState } from "react";
import { useOrielStore } from "../../state/store";

export function Timeline(){
  const ref = useRef<HTMLDivElement|null>(null);
  const { shards, reso, setReso, viewStart, viewEnd, setView, setSelected } = useOrielStore();
  const [dragging, setDragging] = useState<null | {x:number, t:number}>(null);
  const [down, setDown] = useState<null | {x:number, start:number, end:number}>(null);
  const domain = Math.max(1, viewEnd - viewStart);
  const toPct = (ms:number)=> ((ms - viewStart) / domain) * 100;
  const fromX = (x:number)=> {
    const el = ref.current!; const W = el.clientWidth;
    const t = viewStart + (x / W) * domain;
    return t;
  }

  const ticks = useMemo(()=> {
    const arr:number[] = []; const steps = 8;
    for (let i=0; i<=steps; i++) arr.push(viewStart + domain*i/steps);
    return arr;
  }, [viewStart, viewEnd]);

  const onResoDown = (e:React.MouseEvent)=> { setDragging({ x: e.clientX, t: reso }); e.preventDefault(); };
  const onMouseMove = (e:React.MouseEvent)=> {
    if (dragging) {
      const dx = e.clientX - dragging.x;
      const W = ref.current!.clientWidth;
      const dt = (dx / W) * domain;
      setReso(Math.min(viewEnd, Math.max(viewStart, dragging.t + dt)));
    }
    if (down) {
      const dx = e.clientX - down.x;
      const W = ref.current!.clientWidth;
      const dt = (dx / W) * domain;
      const start = down.start - dt;
      const end = down.end - dt;
      setView(start, end);
    }
  };
  const onMouseUp = ()=> { setDragging(null); setDown(null); };
  const onPanStart = (e:React.MouseEvent)=> { if (e.button===0) setDown({ x:e.clientX, start:viewStart, end:viewEnd }); };
  const onWheel = (e:React.WheelEvent)=>{
    const factor = (e.ctrlKey || e.metaKey) ? 0.15 : 0.08;
    const dir = Math.sign(e.deltaY);
    const center = fromX((e.nativeEvent as any).offsetX ?? (ref.current!.clientWidth/2));
    const span = domain * (1 + dir*factor);
    const start = Math.min(center - span/2, center - 1000);
    const end = Math.max(center + span/2, center + 1000);
    setView(start, end);
    e.preventDefault();
  };
  const onShardClick = (s:any)=> {
    setSelected(s);
    const span = s.t1 - s.t0;
    const pad = Math.max(15000, span * 0.5);
    setView(s.t0 - pad, s.t1 + pad);
  };

  return (
    <div
      ref={ref}
      className="relative h-64 rounded-2xl border border-ink-800 bg-ink-900/60 backdrop-blur-sm overflow-hidden select-none"
      onMouseMove={onMouseMove} onMouseUp={onMouseUp} onWheel={onWheel} onMouseDown={onPanStart}
    >
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "100% 32px" }} />
      {ticks.map((t,i)=> (
        <div key={i} className="absolute top-0 bottom-0 border-l border-ink-800" style={{ left: `${toPct(t)}%` }}>
          <div className="absolute top-0 -translate-x-1/2 text-[10px] text-ink-300 px-1">{new Date(t).toLocaleTimeString()}</div>
        </div>
      ))}
      <div className="absolute top-10 left-0 right-0">
        {shards.slice(0, 200).map((s, idx) => {
          const L = toPct(s.t0); const R = toPct(s.t1); const W = Math.max(0.5, R - L);
          const top = (idx % 6) * 32;
          return (
            <div
              key={s.id}
              className="absolute h-6 rounded-md shadow ring-1 ring-black/10 cursor-pointer hover:ring-brand-base"
              style={{ left: `${L}%`, width: `${W}%`, top, background: s.color || "#a855f7" }}
              onClick={()=> onShardClick(s)}
              title={s.label}
            >
              <div className="px-2 text-[11px] truncate text-black/80 font-medium">{s.label}</div>
            </div>
          );
        })}
      </div>
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-[rgba(34,197,94,1)] shadow-[0_0_16px_#22c55e88] cursor-ew-resize"
        style={{ left: `${toPct(reso)}%` }}
        onMouseDown={onResoDown}
      />
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-ink-900/80">
        <div
          className="h-full bg-ink-700/60 rounded-full"
          style={{
            width: `${Math.max(5, (ref.current ? (ref.current.clientWidth / (ref.current.clientWidth * (domain / 600000))) : 20))}%`,
            transform: `translateX(${Math.min(100, Math.max(0, ((reso - viewStart) / domain) * 100))}%)`
          }}
        />
      </div>
    </div>
  );
}
