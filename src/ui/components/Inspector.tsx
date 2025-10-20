import React from "react";
import { useStore } from "@/state/store";
import dayjs from "dayjs";

export function Inspector(){
  const { selected, updateShard } = useStore();
  if(!selected) return <div className="text-white/60">Select a shard to inspect.</div>;

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold">Inspector</div>
      <div className="grid gap-2">
        <label className="text-xs text-white/60">Label</label>
        <input className="bg-ink-800 rounded-lg px-2 py-1 text-sm"
          value={selected.label}
          onChange={e=> updateShard(selected.id, { label:e.target.value })}/>
        <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
          <div>T0: {dayjs(selected.t0).format("HH:mm:ss")}</div>
          <div>T1: {dayjs(selected.t1).format("HH:mm:ss")}</div>
        </div>
      </div>
    </div>
  );
}
