import React, { useEffect, useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
export default function Hero(){
  const bg=useRef<HTMLCanvasElement>(null); useScrollReveal("[data-reveal]");
  useEffect(()=>{ const c=bg.current!, ctx=c.getContext("2d")!; let t=0, id=0;
    const loop=()=>{ const w=c.width=c.clientWidth, h=c.height=c.clientHeight; t+=.008; ctx.clearRect(0,0,w,h);
      for(let y=0;y<h;y+=2){ const hue=50+Math.sin(t+y*.01)*25; ctx.fillStyle=`hsl(${hue},70%,10%)`; ctx.fillRect(0,y,w,2); }
      ctx.globalCompositeOperation="lighter";
      for(let i=0;i<36;i++){ ctx.fillStyle=`hsla(${50+i*8},95%,55%,.08)`; const r=(Math.sin(t*2+i)*.5+.5)*Math.min(w,h)*.15+30;
        ctx.beginPath(); ctx.arc((i*53+t*130)%(w+120)-60, h/2+Math.sin(t*1.2+i)*h*.25, r, 0, Math.PI*2); ctx.fill(); }
      ctx.globalCompositeOperation="source-over"; id=requestAnimationFrame(loop); }; loop(); return ()=>cancelAnimationFrame(id);
  },[]);
  return (<section className="relative rounded-2xl overflow-hidden border border-oriel-surface p-6 md:p-10">
    <canvas ref={bg} className="absolute inset-0 w-full h-full opacity-60"/>
    <div className="relative z-10 grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="uppercase tracking-widest text-xs text-oriel-mute" data-reveal>oriel</div>
        <h1 className="text-2xl md:text-4xl font-semibold leading-tight" data-reveal>The living writing engine</h1>
        <p className="text-sm md:text-base text-oriel-mute max-w-prose" data-reveal>Build a world. Import your canon. Oriel simulates life, locks continuity, and previews decisions before you commit.</p>
        <a href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-oriel-accent text-black shadow-glow" data-reveal>Enter workspace →</a>
      </div>
      <div className="rounded-2xl bg-oriel-surface/60 border border-oriel-surface p-4" data-reveal>
        <div className="text-sm text-oriel-mute">Preview</div>
        <div className="mt-2 grid grid-cols-3 gap-2">{Array.from({length:9}).map((_,i)=><div key={i} className="aspect-video rounded bg-gradient-to-br from-oriel-accent/15 to-transparent"/>)}</div>
      </div>
    </div></section>);
}
