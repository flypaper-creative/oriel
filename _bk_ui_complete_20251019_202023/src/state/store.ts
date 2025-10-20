import { create } from "zustand";

export type Shard = { id:string; label:string; t0:number; t1:number; color?:string; links?:string[] };

type OrielState = {
  running:boolean; reso:number; shards:Shard[]; selected?:Shard|null;
  viewStart:number; viewEnd:number; log:string[];
  toggleRun:()=>void; setReso:(t:number)=>void; setShards:(s:Shard[])=>void;
  setSelected:(s:Shard|null)=>void; setView:(a:number,b:number)=>void; pushLog:(m:string)=>void;
};

export const useOrielStore = create<OrielState>((set,get)=>({
  running:false,
  reso:Date.now(),
  shards:[],
  selected:null,
  viewStart:Date.now()-5*60*1000,
  viewEnd:Date.now()+10*60*1000,
  log:[],
  toggleRun:()=> set(s=>({running:!s.running})),
  setReso:(t)=> set({reso:t}),
  setShards:(s)=> set({shards:s}),
  setSelected:(s)=> set({selected:s}),
  setView:(a,b)=> set({viewStart:a, viewEnd:b}),
  pushLog:(m)=> set(s=>({log:[...s.log, m]})),
}));

export function seedIfEmpty(){
  const { shards } = useOrielStore.getState();
  if(shards.length>0) return;
  const t0 = Date.now()-30*60*1000;
  const seeded:Shard[] = Array.from({length:36}).map((_,i)=>{
    const s = t0 + i*2.5*60*1000;
    return { id:"s"+i, label:`beat ${i+1}`, t0:s, t1:s+90*1000, color: i%5===0?"#b2f200": i%5===1?"#00e6b8": i%5===2?"#8b5cf6": i%5===3?"#22c55e":"#f59e0b" };
  });
  useOrielStore.getState().setShards(seeded);
  const pad = 60*1000;
  useOrielStore.getState().setView(seeded[0].t0-pad, seeded.at(-1)!.t1+pad);
}
