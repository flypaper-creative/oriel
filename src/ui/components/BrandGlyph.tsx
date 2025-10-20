import React, { useEffect, useRef } from "react";
export default function BrandGlyph(){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{ const c=ref.current!; const x=c.getContext("2d")!; let t=0, id=0;
    const loop=()=>{ const w=c.width=96, h=c.height=32; x.clearRect(0,0,w,h); t+=0.015;
      for(let i=0;i<24;i++){ const X=i*(w/24)+2; const Y=h/2+Math.sin(t*3+i*.4)*8;
        x.fillStyle=`hsla(${50+(i*4)%360},90%,60%,${0.5+0.35*Math.sin(t+i*.2)})`; x.fillRect(X,Y,2,h-Y); }
      id=requestAnimationFrame(loop); };
    loop(); return ()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} className="hidden sm:block" style={{filter:"drop-shadow(0 0 8px rgba(255,215,97,.35))"}}/>;
}
