import { create } from "zustand";

export type Shard = { id:string; label:string; t0:number; t1:number; color?:string };

type UI = { showSettings:boolean; showPalette:boolean; toast?:string|null };

type AppState = {
  running:boolean;
  reso:number;
  shards:Shard[];
  log:string[];
  ui:UI;

  // timeline viewport (relative 0..1 + zoom factor)
  zoom:number;     // 1..10 (10 = most zoomed in)
  offset:number;   // 0..1 left→right across base domain

  setRunning(v:boolean):void;
  setReso(t:number):void;
  tick(dt:number):void;
  setShards(s:Shard[]):void;
  pushLog(x:string):void;

  setZoom(z:number):void;
  setOffset(o:number):void;

  toggleSettings():void;
  togglePalette():void;
  toast(m?:string|null):void;
};

export const useAppStore = create<AppState>((set)=>({
  running:false,
  reso: Date.now(),
  shards:[],
  log:[],
  ui:{showSettings:false, showPalette:false, toast:null},
  zoom: 1,
  offset: 0,

  setRunning:(v)=>set({running:v}),
  setReso:(t)=>set({reso:t}),
  tick:(dt)=>set((s)=>({ reso: s.reso + dt })),
  setShards:(s)=>set({shards:s}),
  pushLog:(x)=>set((st)=>({log:[x,...st.log].slice(0,500)})),
  setZoom:(z)=>set({zoom:z}),
  setOffset:(o)=>set({offset:o}),

  toggleSettings:()=>set((st)=>({ui:{...st.ui,showSettings:!st.ui.showSettings}})),
  togglePalette:()=>set((st)=>({ui:{...st.ui,showPalette:!st.ui.showPalette}})),
  toast:(m)=>set((st)=>({ui:{...st.ui,toast:m??null}})),
}));
