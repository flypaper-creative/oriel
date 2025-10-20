import React, { useEffect } from "react";
import Lenis from "lenis";
export default function SmoothScroll({children}:{children:React.ReactNode}){
  useEffect(()=>{
    const lenis = new Lenis({ smoothWheel:true, lerp:0.1, wheelMultiplier:0.9, touchMultiplier:1.1 });
    let id=0; const raf=(t:number)=>{ lenis.raf(t); id=requestAnimationFrame(raf); };
    id=requestAnimationFrame(raf);
    return ()=>{ cancelAnimationFrame(id); lenis.destroy(); };
  },[]);
  return <>{children}</>;
}
