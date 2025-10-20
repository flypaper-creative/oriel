import React from "react";
export default function DiffView({a,b}:{a:string,b:string}){
  // Very small diff highlight: show both side-by-side
  return <div className="grid grid-cols-2 gap-4">
    <div className="glass p-3"><div className="text-xs text-gray-300">Previous</div><pre className="text-white">{a}</pre></div>
    <div className="glass p-3"><div className="text-xs text-gray-300">Current</div><pre className="text-white">{b}</pre></div>
  </div>
}
