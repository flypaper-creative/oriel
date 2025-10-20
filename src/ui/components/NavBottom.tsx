import React from "react";
export function NavBottom(){
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 border-t border-ink-800 bg-ink-900/70 backdrop-blur z-20">
      <div className="grid grid-cols-4 h-full text-xs">
        {["timeline","lore","scribe","settings"].map(x=>(
          <button key={x} className="text-ink-300 capitalize">{x}</button>
        ))}
      </div>
    </nav>
  );
}
