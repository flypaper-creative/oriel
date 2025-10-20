import React, { useEffect, useRef } from "react";
export default function CustomCursor(){
  const d=useRef<HTMLDivElement>(null), r=useRef<HTMLDivElement>(null);
  useEffect(()=>{ if (matchMedia("(pointer: coarse)").matches) return;
    let x=0,y=0, rx=0, ry=0; const ease=.18;
    const mm=(e:MouseEvent)=>{ x=e.clientX; y=e.clientY; };
    const raf=()=>{ rx+=(x-rx)*ease; ry+=(y-ry)*ease;
      r.current!.style.transform=`translate(${rx-12}px,${ry-12}px)`;
      d.current!.style.transform=`translate(${x-2}px,${y-2}px)`;
      requestAnimationFrame(raf);
    }; window.addEventListener("mousemove",mm); raf(); return ()=>window.removeEventListener("mousemove",mm);
  },[]);
  return (<>
    <div ref={r} className="fixed z-[1000] top-0 left-0 w-6 h-6 rounded-full border border-oriel-accent/70 pointer-events-none mix-blend-screen"></div>
    <div ref={d} className="fixed z-[1001] top-0 left-0 w-1.5 h-1.5 rounded-full bg-oriel-accent pointer-events-none mix-blend-screen"></div>
  </>);
}
