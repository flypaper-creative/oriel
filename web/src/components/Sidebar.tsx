import React from "react";
export default function Sidebar(){
  return (
    <aside className="glass p-4 hidden md:block w-64">
      <nav className="flex flex-col gap-2 text-gray-200">
        <a className="p-2 rounded hover:bg-white/5">Dashboard</a>
        <a className="p-2 rounded hover:bg-white/5">Workspace</a>
        <a className="p-2 rounded hover:bg-white/5">Projects</a>
      </nav>
    </aside>
  );
}
