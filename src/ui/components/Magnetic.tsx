import React, { useRef } from "react";
export default function Magnetic({ children }:{children:React.ReactNode}){
  const r = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={r}
      onMouseMove={(e)=>{
        const el = r.current!; const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width/2)) * 0.08;
        const dy = (e.clientY - (rect.top + rect.height/2)) * 0.08;
        el.style.transform = `translate(${dx}px,${dy}px)`;
      }}
      onMouseLeave={()=>{ const el=r.current!; el.style.transform="translate(0,0)"; }}
      className="inline-flex"
    >{children}</div>
  );
}
