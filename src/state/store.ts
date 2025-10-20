import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Shard = { id: string; label: string; t0: number; t1: number; color: string; };

type UIState = {
  running: boolean;
  reso: number;
  viewStart: number;
  viewEnd: number;
  shards: Shard[];
  selected: Shard | null;
  log: string[];
  setRunning(v:boolean): void;
  setReso(v:number): void;
  setView(s:number, e:number): void;
  setShards(a:Shard[]): void;
  setSelected(s:Shard|null): void;
  pushLog(x:string): void;
};

export const useStore = create<UIState>()(immer((set)=>({
  running: false,
  reso: Date.now(),
  viewStart: Date.now()-5*60_000,
  viewEnd: Date.now()+10*60_000,
  shards: [],
  selected: null,
  log: [],
  setRunning: (v)=> set(s=>{ s.running=v; }),
  setReso: (v)=> set(s=>{ s.reso=v; }),
  setView: (a,b)=> set(s=>{ s.viewStart=a; s.viewEnd=b; }),
  setShards: (arr)=> set(s=>{ s.shards = arr; }),
  setSelected: (sel)=> set(s=>{ s.selected = sel; }),
  pushLog: (x)=> set(s=>{ s.log.unshift(`${new Date().toLocaleTimeString()} — ${x}`); s.log = s.log.slice(0,200); }),
})));
