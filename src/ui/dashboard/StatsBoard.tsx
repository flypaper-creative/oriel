import React from "react";
import { useAppStore } from "../../store/useAppStore";
function Bars({data}:{data:number[]}){ const max=Math.max(...data,1);
  return (<svg className="w-full h-20">{data.map((v,i)=>{ const h=(v/max)*70; return <rect key={i} x={i*14+4} y={80-h} width="10" height={h} rx="2" fill="#FFD761"/>;})}</svg>);
}
function Radial({value}:{value:number}){ const R=34, C=2*Math.PI*R, P=C*(value/100);
  return (<svg width="90" height="90" viewBox="0 0 100 100"><circle cx="50" cy="50" r={R} fill="none" stroke="#2a2b31" strokeWidth="10"/>
    <circle cx="50" cy="50" r={R} fill="none" stroke="#FFD761" strokeWidth="10" strokeDasharray={`${P} ${C}`} strokeLinecap="round" transform="rotate(-90 50 50)"/>
    <text x="50" y="54" textAnchor="middle" className="fill-current" fontSize="14">{value}%</text></svg>);
}
export default function StatsBoard(){
  const shards=useAppStore(s=>s.shards);
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-4 bg-oriel-surface rounded-2xl p-4">
        <div className="text-sm text-oriel-mute">Shards</div>
        <div className="text-3xl font-semibold">{shards.length}</div>
        <Bars data={Array.from({length:12}).map(()=> Math.floor(Math.random()*10)+1)} />
      </div>
      <div className="col-span-12 md:col-span-4 bg-oriel-surface rounded-2xl p-4 flex items-center justify-between">
        <div><div className="text-sm text-oriel-mute">Continuity score</div><div className="text-3xl font-semibold">92</div></div>
        <Radial value={92}/>
      </div>
      <div className="col-span-12 md:col-span-4 bg-oriel-surface rounded-2xl p-4">
        <div className="text-sm text-oriel-mute">Recent activity</div>
        <ul className="text-xs mt-2 space-y-1 max-h-24 overflow-auto">
          {["imported shards","normalized times","linked 4 entities","audit passed"].map((x,i)=><li key={i}>• {x}</li>)}
        </ul>
      </div>
    </div>
  );
}
