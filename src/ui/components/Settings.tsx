import React from "react";
export function Settings(){
  return (
    <details className="relative">
      <summary className="btn cursor-pointer select-none">settings</summary>
      <div className="absolute right-0 mt-2 w-72 card p-3 text-sm">
        <div className="text-white/70">Paste your OpenAI key in .env for live mode.</div>
      </div>
    </details>
  );
}
