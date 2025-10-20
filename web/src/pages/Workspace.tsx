import React, { useState } from "react";
function IterationCard({n, text}:{n:number,text:string}){
  return <div className="glass mb-3">
    <div className="text-xs text-gray-300">Round {n}</div>
    <div className="mt-2 text-white whitespace-pre-wrap">{text}</div>
  </div>;
}

export default function Workspace(){
  const [input, setInput] = useState("Write a short product description for a space-age notebook.");
  const [history, setHistory] = useState<Array<{n:number,text:string}>>([]);
  const run = async ()=>{
    # demo local iterations (client-side) to avoid LLM keys
    const rounds = 3;
    let seed = input;
    const newHistory = [];
    for (let i=1;i<=rounds;i++){
      seed = seed + " (refined "+i+")";
      newHistory.push({n:i, text: seed});
      await new Promise(r=>setTimeout(r,350));
    }
    setHistory(newHistory);
  };
  return <>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="glass">
          <label className="text-gray-300 text-sm">Input</label>
          <textarea rows={6} className="w-full mt-2 p-3 rounded-md bg-transparent border border-transparent focus:border-accent" value={input} onChange={e=>setInput(e.target.value)} />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={run} className="px-4 py-2 bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] rounded-md text-white">Run</button>
            <button onClick={()=>{setInput("")}} className="px-3 py-2 border rounded-md text-white">Clear</button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-white text-lg">Iteration History</h3>
          {history.map(h=> <IterationCard key={h.n} n={h.n} text={h.text} />)}
        </div>
      </div>
      <aside className="glass">
        <h4 className="text-white">Controls</h4>
        <div className="text-gray-300 text-sm mt-2">Rounds</div>
        <input type="range" min="1" max="10" defaultValue={3} className="w-full mt-2" />
        <div className="mt-4 text-gray-300 text-sm">Prompt Templates</div>
        <select className="w-full mt-2 p-2 rounded-md bg-transparent">
          <option>Concise</option>
          <option>Creative</option>
          <option>Technical</option>
        </select>
      </aside>
    </div>
  </>;
}
