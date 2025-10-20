import React from "react";
import { NavLink } from "react-router-dom";
const TABS=[{to:"/dashboard",label:"Desk"},{to:"/timeline",label:"Time"},{to:"/linkage",label:"Links"},{to:"/ai",label:"AI"}];
export default function MobileTabBar(){
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-oriel-surface/95 backdrop-blur-md border-t border-oriel-surface">
      <div className="grid grid-cols-4">
        {TABS.map(t=>(
          <NavLink key={t.to} to={t.to} className={({isActive})=>
            `text-center py-2 text-xs ${isActive?'text-black bg-oriel-accent':'text-oriel-mute'}`}>{t.label}</NavLink>
        ))}
      </div>
    </nav>
  );
}
