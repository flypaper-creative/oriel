import React, { useEffect, useRef, useState } from "react";
type KF = { t:number; x:number; y:number; z:number; rot:number };
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;

export default function CineStage(){
  const [kfs,setK]=useState<KF[]>([{t:0,x:0,y:0,z:1,rot:0},{t:4,x:-40,y:0,z:1.08,rot:-3},{t:8,x:20,y:-6,z:1.12,rot:4}]);
  const [t,setT]=useState(0); const [running,setRun]=useState(false); const last=useRef<number>(0);
  useEffect(()=>{ if(!running) return; let raf=0; const loop=(now:number)=>{ const dt = last.current? (now-last.current)/1000 : 0; last.current=now; setT(v=> (v+dt)%kfs[kfs.length-1].t ); raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop); return()=>cancelAnimationFrame(raf); },[running,kfs]);
  const total=kfs[kfs.length-1].t;
  const sample=()=>{ let i=0; while(i<kfs.length-1 && t>kfs[i+1].t) i++; const a=kfs[i], b=kfs[Math.min(i+1,kfs.length-1)];
    const tt = a===b?0: (t-a.t)/(b.t-a.t); return { x:lerp(a.x,b.x,tt), y:lerp(a.y,b.y,tt), z:lerp(a.z,b.z,tt), rot:lerp(a.rot,b.rot,tt) }; };
  const cam=sample();
  const addKF=()=> setK(ks=> [...ks,{ t:Math.min(total+2, total+2), x:0,y:0,z:1,rot:0 }]);
  const seek=(v:number)=>{ setT(v); };

  return (
    <div className="rounded-2xl border border-oriel-surface overflow-hidden bg-oriel-surface/60">
      <div className="flex items-center justify-between px-3 py-2 border-b border-oriel-surface">
        <div className="text-lg font-medium">Storyboard (CineStage)</div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={()=>setRun(r=>!r)} className="px-2 py-1 rounded bg-oriel-accent text-black">{running?'Pause':'Play'}</button>
          <button onClick={addKF} className="px-2 py-1 rounded bg-oriel-surface hover:bg-oriel-surface/80">+ Keyframe</button>
        </div>
      </div>
      <div className="p-4">
        <div className="relative perspective-[1200px] h-[240px] mb-3">
          <div className="absolute inset-0 [transform-style:preserve-3d]"
               style={{ transform:`translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.z}) rotateY(${cam.rot}deg)` }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} className="aspect-video rounded-2xl border border-oriel-surface bg-gradient-to-br from-oriel-accent/18 to-transparent shadow-md overflow-hidden">
                  <div className="p-2 text-[11px] text-oriel-mute">Scene {i+1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <input type="range" min={0} max={total} step={0.01} value={t} onChange={e=>seek(parseFloat(e.target.value))}
               className="w-full"/>
        <div className="mt-1 flex justify-between text-[11px] text-oriel-mute"><span>0s</span><span>{total.toFixed(1)}s</span></div>
      </div>
    </div>
  );
}
