import React from "react";
import { useOrielStore } from "../../state/store";
export function StatsStrip(){
  const { shards } = useOrielStore();
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <div className="card rounded-2xl p-3">
        <div className="text-xs text-ink-300">shards</div>
        <div className="text-2xl font-semibold">{shards.length}</div>
      </div>
      <div className="card rounded-2xl p-3">
        <div className="text-xs text-ink-300">coverage</div>
        <div className="text-2xl font-semibold">live</div>
      </div>
      <div className="card rounded-2xl p-3">
        <div className="text-xs text-ink-300">quality</div>
        <div className="text-2xl font-semibold">stable</div>
      </div>
    </div>
  );
}
