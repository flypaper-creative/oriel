import React, { useMemo, useRef } from 'react'
import type { Shard } from '@/state/store'

export function Timeline({
  shards, reso, setReso, viewStart, viewEnd, onSelect
}:{
  shards:Shard[]; reso:number; setReso:(n:number)=>void;
  viewStart:number; viewEnd:number; onSelect?:(id:string)=>void;
}) {
  const ref = useRef<HTMLDivElement|null>(null)
  const domain = Math.max(1, viewEnd - viewStart)
  const toPct = (ms:number)=> ((ms - viewStart)/domain)*100
  const toMs  = (px:number)=> {
    const rect = ref.current!.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (px-rect.left)/rect.width))
    return viewStart + frac*domain
  }
  const onDragReso = (e:React.MouseEvent)=> {
    e.preventDefault()
    const move = (ev:MouseEvent)=> setReso(toMs(ev.clientX))
    const up = ()=> { window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up) }
    window.addEventListener('mousemove',move); window.addEventListener('mouseup',up)
  }
  const onBgDown = (e:React.MouseEvent)=> { if ((e.target as HTMLElement).dataset.handle==='reso') return; setReso(toMs(e.clientX)) }
  const onWheel = (e:React.WheelEvent)=> {
    e.preventDefault()
    const focus = toMs(e.clientX)
    const z = Math.exp(-Math.sign(e.deltaY)*0.15)
    const newSpan = Math.max(5_000, (viewEnd - viewStart)*z)
    const ratio = (focus - viewStart)/(viewEnd - viewStart)
    const newStart = focus - newSpan*ratio
    const newEnd   = newStart + newSpan
    ;(window as any).__setView?.(newStart,newEnd)
  }
  const ticks = useMemo(()=>{ const arr:number[]=[]; const steps=8; for(let i=0;i<=steps;i++) arr.push(viewStart + (domain*i/steps)); return arr },[viewStart, viewEnd])
  return (
    <div ref={ref} onMouseDown={onBgDown} onWheel={onWheel}
      className="relative h-56 rounded-2xl border overflow-hidden select-none"
      style={{ borderColor:'#23252a', background:'#101216' }}>
      <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize:'100% 28px' }}/>
      {ticks.map((t,i)=>(
        <div key={i} className="absolute top-0 bottom-0" style={{ left:`${toPct(t)}%`, borderLeft:'1px solid rgba(255,255,255,.07)' }}>
          <div className="absolute top-0 -translate-x-1/2 text-[10px] text-gray-400 px-1">{new Date(t).toLocaleTimeString()}</div>
        </div>
      ))}
      <div className="absolute inset-x-0 top-8">
        {shards.slice(0,72).map((s,idx)=>{
          const L = toPct(s.t0), R = toPct(s.t1), W = Math.max(.5, R-L)
          return (
            <button key={s.id} title={s.label} onClick={()=> onSelect?.(s.id)}
              className="absolute h-7 rounded-md shadow hover:brightness-110 focus:outline-none"
              style={{ left:`${L}%`, width:`${W}%`, top:(idx%7)*28, background:s.color }}>
              <div className="px-2 text-[11px] truncate text-black/80 font-medium">{s.label}</div>
            </button>
          )
        })}
      </div>
      <div data-handle="reso" onMouseDown={onDragReso}
        className="absolute top-0 bottom-0 w-[3px] cursor-ew-resize"
        style={{ left:`${toPct(reso)}%`, background:'#22c55e', boxShadow:'0 0 16px #22c55e88' }}/>
    </div>
  )
}
