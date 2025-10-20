import React from "react";
export default function DecisionMatrix(){
  return (<div><h2 className="text-lg font-medium mb-2">Decision Matrix</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {["Path A","Path B"].map((p)=>(
        <div key={p} className="rounded-2xl bg-oriel-surface/70 border border-oriel-surface p-3">
          <h3 className="text-oriel-accent font-medium mb-1">{p}</h3>
          <p className="text-xs text-oriel-mute leading-snug">Outcome summary</p>
        </div>))}</div></div>);
}
