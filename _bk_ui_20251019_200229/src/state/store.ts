import { create } from "zustand";
export type Shard = { id:string; label:string; t0:number; t1:number; color?:string; links?:string[] };
type ModuleCard = { id:string; name:string; category:string };
type OrielState = {
  running:boolean; reso:number; shards:Shard[]; selected?:Shard|null;
  modules:ModuleCard[]; log:string[]; viewStart:number; viewEnd:number;
  toggleRun:()=>void; setReso:(t:number)=>void; setShards:(s:Shard[])=>void;
  setSelected:(s:Shard|null)=>void; setView:(a:number,b:number)=>void; pushLog:(m:string)=>void;
};
export const useOrielStore = create<OrielState>((set,get)=>({
  running:false, reso:Date.now(), shards:[], selected:null,
  modules:[
    { id:"chrono", name:"Chronology", category:"Structure" },
    { id:"graph",  name:"Link Graph", category:"Structure" },
    { id:"scribe", name:"Scribe",     category:"Authoring" },
    { id:"cast",   name:"Cast",       category:"Lore" },
    { id:"atlas",  name:"Atlas",      category:"Lore" },
    { id:"pulse",  name:"Simulation", category:"System" },
  ],
  log:[], viewStart:Date.now()-5*60*1000, viewEnd:Date.now()+10*60*1000,
  toggleRun:()=> set(s=>({running:!s.running})),
  setReso:(t)=> set({reso:t}),
  setShards:(s)=> set({shards:s}),
  setSelected:(s)=> set({selected:s}),
  setView:(a,b)=> set({viewStart:a,viewEnd:b}),
  pushLog:(m)=> set(s=>({log:[...s.log,m]}))
}));
