import React from "react";
import { NavLink } from "react-router-dom";
const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/timeline",  label: "Timeline" },
  { to: "/inspector", label: "Inspector" },
  { to: "/decision",  label: "Decisions" },
  { to: "/resonance", label: "Resonance" },
  { to: "/linkage",   label: "Linkage" },
  { to: "/storyboard",label: "Storyboard" },
  { to: "/auditor",   label: "Auditor" },
  { to: "/ai",        label: "AI" },
];
export default function SidebarNav(){
  return (
    <aside className="hidden lg:block w-56 shrink-0 border-r border-oriel-surface/80 bg-oriel-bg/60 backdrop-blur-md">
      <div className="px-4 py-3 text-xs uppercase tracking-widest text-oriel-mute">oriel</div>
      <nav className="px-2 py-2 space-y-1">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({isActive}) => `block px-3 py-2 rounded-lg text-sm ${isActive?'bg-oriel-accent text-black':'hover:bg-oriel-surface/70'}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
