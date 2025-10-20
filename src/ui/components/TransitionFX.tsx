import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** CSS-driven radial reveal on route change (no deps) */
export default function TransitionFX(){
  const ref = useRef<HTMLDivElement>(null);
  const loc = useLocation();
  useEffect(()=> {
    const el = ref.current; if(!el) return;
    el.classList.remove("opacity-0"); el.classList.add("opacity-100");
    el.animate([
      { clipPath: 'circle(0% at 50% 50%)', opacity: 1 },
      { clipPath: 'circle(140% at 50% 50%)', opacity: 0 }
    ], { duration: 600, easing: 'cubic-bezier(.25,1,.5,1)' }).onfinish = () => {
      el.classList.add("opacity-0"); el.classList.remove("opacity-100");
    };
  }, [loc.pathname]);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-[55] opacity-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,97,.25),transparent_60%)]" />
    </div>
  );
}
