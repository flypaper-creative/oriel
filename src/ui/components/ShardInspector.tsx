import { useStore } from "@/state/store";

export function ShardInspector(){
  const { selected } = useStore(s=>({ selected: s.selected }));
  if(!selected) return (
    <div className="card p-4">
      <div className="text-sm text-slate-300">Inspector</div>
      <div className="text-[12px] text-slate-400 mt-2">Tap a shard to inspect.</div>
    </div>
  );
  return (
    <div className="card p-4">
      <div className="text-sm text-slate-300 mb-2">Inspector</div>
      <div className="text-[13px] space-y-1 text-slate-200">
        <div><span className="text-slate-400">Label:</span> {selected.label}</div>
        <div><span className="text-slate-400">Start:</span> {new Date(selected.t0).toLocaleString()}</div>
        <div><span className="text-slate-400">End:</span> {new Date(selected.t1).toLocaleString()}</div>
        <div className="h-2 rounded mt-2" style={{ background: selected.color }}/>
      </div>
    </div>
  );
}
