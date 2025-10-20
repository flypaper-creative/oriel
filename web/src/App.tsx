import React, { useState } from "react";
import DemoNavbar from "./components/DemoNavbar";
import Workspace from "./pages/Workspace";

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#021124] p-6">
      <DemoNavbar />
      <div className="max-w-7xl mx-auto mt-6">
        <Workspace />
      </div>
    </div>
  );
}
