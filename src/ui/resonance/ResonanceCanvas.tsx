import React, { useEffect, useRef } from "react";
export default function ResonanceCanvas(){ const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{ const ctx=ref.current?.getContext("2d"); if(!ctx) return; let raf=0,t=0;
    const draw=()=>{ const c=ref.current!, w=c.width=c.clientWidth, h=c.height=c.clientHeight; t+=.02; ctx.clearRect(0,0,w,h);
      for(let i=0;i<64;i++){ const y=h*.5+Math.sin(t+i/8)*h*.25; ctx.fillStyle=`hsl(${(t*40+i*6)%360},80%,55%)`; ctx.fillRect(i*(w/64),y,w/64-2,h-y); }
      raf=requestAnimationFrame(draw); }; draw(); return ()=>cancelAnimationFrame(raf);
  },[]); return (<div className="flex flex-col min-h-0 h-full"><h2 className="text-lg font-medium mb-2 px-4 pt-3">Resonance</h2><div className="h-64 md:h-full"><canvas ref={ref} className="w-full h-full"/></div></div>);
}
