import React from "react";
import { useStore } from "@/state/store";
export function Logs(){
  const { log } = useStore();
  return (
    <div className="card p-2 h-40 overflow-auto text-[12px]">
      {log.slice(-200).map((l,i)=>(<div key={i} className="leading-5 text-white/70">{l}</div>))}
    </div>
  );
}
