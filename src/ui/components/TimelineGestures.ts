import { RefObject, useEffect, useRef } from "react";

type Opts = {
  ref: RefObject<HTMLElement>;
  onZoom: (scale:number, centerX:number)=>void;
  onPan: (dxPx:number)=>void;
  onTapShard: (id:string)=>void;
};

export function useTimelineGestures({ ref, onZoom, onPan, onTapShard }: Opts){
  const state = useRef<{touches: PointerEvent[]; scale:number; lastX:number}>({ touches:[], scale:1, lastX:0 });

  useEffect(()=>{
    const el = ref.current as HTMLElement;
    if(!el) return;
    el.style.touchAction = "none";

    function getShardId(t: EventTarget | null){
      return (t as HTMLElement)?.closest?.("[data-shard-id]")?.getAttribute("data-shard-id");
    }

    const onDown = (e:PointerEvent)=>{
      el.setPointerCapture?.(e.pointerId);
      state.current.touches.push(e);
      state.current.lastX = e.clientX;
    };

    const onMove = (e:PointerEvent)=>{
      const s = state.current;
      const idx = s.touches.findIndex(t=>t.pointerId===e.pointerId);
      if(idx>=0) s.touches[idx] = e;

      if(s.touches.length===1){
        const dx = e.clientX - s.lastX;
        s.lastX = e.clientX;
        onPan(dx);
      } else if (s.touches.length===2) {
        const [a,b] = s.touches;
        const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
        const prev = (s as any)._dist || dist;
        (s as any)._dist = dist;
        const delta = dist/prev;
        s.scale = Math.max(0.1, Math.min(20, s.scale * delta));
        const midX = (a.clientX + b.clientX)/2;
        onZoom(s.scale, midX);
      }
    };

    const onUp = (e:PointerEvent)=>{
      const s = state.current;
      s.touches = s.touches.filter(t=>t.pointerId!==e.pointerId);
      if(s.touches.length===0){
        const id = getShardId(e.target);
        if(id) onTapShard(id);
      }
    };

    const onWheel = (e:WheelEvent)=>{
      e.preventDefault();
      const dir = e.deltaY>0 ? 0.9 : 1.1;
      state.current.scale = Math.max(0.1, Math.min(20, state.current.scale * dir));
      onZoom(state.current.scale, e.clientX);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive:false });

    return ()=> {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel as any);
    };
  }, [ref, onZoom, onPan, onTapShard]);
}
