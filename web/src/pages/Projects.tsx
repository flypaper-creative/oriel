import React from "react";
import projects from "../../../src_demo_seed/demo-projects.json";

export default function Projects(){
  return <div>
    <h2 className="text-white text-xl mb-4">Projects</h2>
    <div className="grid gap-3">
      {projects.map((p:any)=>{
        return <div key={p.id} className="glass p-3">
          <div className="text-white font-semibold">{p.name}</div>
          <div className="text-gray-300 text-sm">{p.description}</div>
        </div>
      })}
    </div>
  </div>
}
