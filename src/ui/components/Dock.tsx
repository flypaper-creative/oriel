import React from "react";
export function Dock(){
  const modules = [
    { id:"chrono", name:"Chronology", category:"Structure" },
    { id:"graph", name:"Link Graph", category:"Structure" },
    { id:"scribe", name:"Scribe", category:"Authoring" },
    { id:"cast", name:"Cast", category:"Lore" },
    { id:"atlas", name:"Atlas", category:"Lore" },
    { id:"pulse", name:"Simulation", category:"System" },
  ];
  return (
    <div className="p-3 space-y-2">
      <h3 className="text-sm font-semibold text-ink-200 mb-1">modules</h3>
      {modules.map(m=>(
        <button key={m.id} className="card w-full p-3 rounded-2xl hover:border-aqua/60 transition text-left">
          <div className="text-[11px] text-ink-300">{m.category}</div>
          <div className="text-sm">{m.name}</div>
        </button>
      ))}
    </div>
  );
}
