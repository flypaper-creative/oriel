import React from "react"; import { useAppStore } from "../../store/useAppStore";
export default function InspectorPane(){ const shards=useAppStore(s=>s.shards); const f=shards[0];
  return (<div className="space-y-2"><h2 className="text-lg font-medium">Shard Inspector</h2>
    {f? (<div className="text-sm space-y-1">
      <div className="flex justify-between"><span>ID</span><code>{f.id}</code></div>
      <div className="flex justify-between"><span>Label</span><span className="truncate max-w-[260px]">{f.label}</span></div>
      <div className="flex justify-between"><span>Start</span><code>{new Date(f.t0).toLocaleString()}</code></div>
      <div className="flex justify-between"><span>End</span><code>{new Date(f.t1).toLocaleString()}</code></div>
    </div>): <div className="text-sm text-oriel-mute">No shards loaded</div>}</div>);
}
