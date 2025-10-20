import React, { useState } from "react";
import DiffView from "../components/DiffView";
export default function Workspace(){
  const [input, setInput] = useState("Write a short product description for a space-age notebook.");
  const [history, setHistory] = useState<Array<{n:number,text:string}>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const run = async ()=>{
    const rounds = 3;
    let seed = input;
    const newHistory: Array<{n:number,text:string}> = [];
    for (let i=1;i<=rounds;i++){
      seed = seed + " (refined "+i+")";
      newHistory.push({n:i, text: seed});
      await new Promise(r=>setTimeout(r,200));
    }
    setHistory(newHistory);
    setSelectedIndex(newHistory.length-1);
  };
  const current = history[selectedIndex ?? 0]?.text ?? "";
  const previous = history[selectedIndex! - 1]?.text ?? "";
  return <>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass">
          <label className="text-gray-300 text-sm">Input</label>
          <textarea rows={6} className="w-full mt-2 p-3 rounded-md bg-transparent border border-transparent focus:border-accent" value={input} onChange={e=>setInput(e.target.value)} />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={run} className="px-4 py-2 bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] rounded-md text-white">Run</button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-white text-lg">Iteration History</h3>
          {history.map(h=> <div key={h.n} className="glass p-2 mb-2 cursor-pointer" onClick={()=>setSelectedIndex(h.n-1)}>
            <div className="text-xs text-gray-300">Round {h.n}</div>
            <div className="text-white">{h.text}</div>
          </div>)}
        </div>
      </div>
      <aside className="glass p-4">
        <h4 className="text-white">Preview</h4>
        <div className="mt-3">
          <DiffView a={previous} b={current} />
        </div>
      </aside>
    </div>
  </>;
}
