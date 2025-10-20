import React from "react";
import { useAppStore } from "../../store/useAppStore";
export default function SidebarMetrics(){
  const shards = useAppStore(s=>s.shards);
  return (
    <aside className="hidden xl:flex flex-col gap-2 w-64 shrink-0 border-r border-oriel-surface p-3">
      <div className="text-sm font-semibold">metrics</div>
      <div className="text-xs text-oriel-mute">shards <span className="text-oriel-accent">{shards.length}</span></div>
      <div className="text-xs text-oriel-mute">autosave <span className="text-oriel-accent">on</span></div>
    </aside>
  );
}
