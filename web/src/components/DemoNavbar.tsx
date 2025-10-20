import React from "react";
export default function DemoNavbar(){
  return (
    <header className="glass flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#06b6d4] shadow-lg"></div>
        <h1 className="text-white font-semibold text-lg">Oriel</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 text-sm text-white bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] rounded-md">Demo mode</button>
      </div>
    </header>
  );
}
