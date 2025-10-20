import React from "react";
export default function AIPanel(){ const key=(import.meta as any).env?.VITE_OPENAI_API_KEY||"";
  return (<div><h2 className="text-lg font-medium mb-2">AI Panel</h2>
    {!key? <p className="text-xs text-oriel-mute">No API key detected. Running in local stub mode.</p>
          : <p className="text-xs text-oriel-mute">OpenAI key detected. Live mode enabled.</p>}
    <textarea placeholder="Ask for a beat breakdown…" className="w-full mt-2 px-2 py-1 rounded bg-oriel-bg text-sm"/><button className="mt-2 px-3 py-2 rounded bg-oriel-accent text-black">Generate</button></div>);
}
