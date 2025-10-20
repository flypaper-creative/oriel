import React from "react";
import DemoNavbar from "./components/DemoNavbar";
import Sidebar from "./components/Sidebar";
import Workspace from "./pages/Workspace";

export default function App(){
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--glass-bg),_#001021)] p-6">
      <DemoNavbar />
      <div className="max-w-7xl mx-auto mt-6 grid md:grid-cols-6 gap-6">
        <Sidebar />
        <main className="md:col-span-4">
          <Workspace />
        </main>
        <aside className="md:col-span-1 hidden md:block">
          <div className="glass p-4 text-gray-300">Inspector</div>
        </aside>
      </div>
    </div>
  );
}
