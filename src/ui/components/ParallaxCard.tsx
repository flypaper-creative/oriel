import React, { useRef } from "react";
export default function ParallaxCard({children}:{children:React.ReactNode}){
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e)=>{
        const b = ref.current!.getBoundingClientRect();
        const px = (e.clientX - b.left)/b.width - 0.5;
        const py = (e.clientY - b.top)/b.height - 0.5;
        ref.current!.style.transform = `perspective(700px) rotateX(${ -py*8 }deg) rotateY(${ px*10 }deg) translateZ(0)`;
      }}
      onMouseLeave={()=>{ if(ref.current) ref.current.style.transform="perspective(700px) rotateX(0) rotateY(0)"; }}
      className="transition-transform duration-200"
    >{children}</div>
  );
}
