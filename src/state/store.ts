import { create } from 'zustand'
export type Shard = { id:string; label:string; t0:number; t1:number; color:string }
type State = { shards: Shard[]; reso:number; viewStart:number; viewEnd:number; setShards:(s:Shard[])=>void; setReso:(n:number)=>void; setView:(a:number,b:number)=>void }
const now = Date.now()
export const useStore = create<State>((set)=> ({
  shards: [
    { id:'a', label:'Opening',  t0: now-5*60_000, t1: now-3*60_000, color:'#a855f7' },
    { id:'b', label:'Inciting', t0: now-2*60_000, t1: now-60_000,  color:'#22c55e' },
    { id:'c', label:'Decision', t0: now+30_000,  t1: now+90_000,  color:'#caff2c' }
  ],
  reso: now, viewStart: now-6*60_000, viewEnd: now+6*60_000,
  setShards: (s)=> set({ shards: s }),
  setReso:   (n)=> set({ reso: n }),
  setView:   (a,b)=> set({ viewStart:a, viewEnd:b })
}))
