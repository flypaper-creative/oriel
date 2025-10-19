import React from 'react'
import type { Shard } from '@/state/store'
export function Inspector({selected, onUpdate}:{selected:Shard|null; onUpdate:(s:Shard)=>void}){
  if(!selected) return <div className="p-3 text-sm text-gray-400">Select a shard to edit.</div>
  return (
    <div className="p-3 text-sm space-y-2">
      <div className="text-gray-300 font-semibold">{selected.label}</div>
      <label className="block">
        <span className="text-gray-400 text-xs">Label</span>
        <input className="mt-1 w-full bg-ink-800 border border-white/10 rounded p-2 text-xs" defaultValue={selected.label}
          onChange={(e)=> onUpdate({...selected, label:e.target.value})}/>
      </label>
      <label className="block">
        <span className="text-gray-400 text-xs">Start</span>
        <input className="mt-1 w-full bg-ink-800 border border-white/10 rounded p-2 text-xs" defaultValue={new Date(selected.t0).toISOString()}
          onChange={(e)=> onUpdate({...selected, t0: Date.parse(e.target.value)})}/>
      </label>
      <label className="block">
        <span className="text-gray-400 text-xs">End</span>
        <input className="mt-1 w-full bg-ink-800 border border-white/10 rounded p-2 text-xs" defaultValue={new Date(selected.t1).toISOString()}
          onChange={(e)=> onUpdate({...selected, t1: Date.parse(e.target.value)})}/>
      </label>
      <label className="block">
        <span className="text-gray-400 text-xs">Color</span>
        <input type="color" className="mt-1 w-24 h-8 bg-transparent" defaultValue={selected.color}
          onChange={(e)=> onUpdate({...selected, color:e.target.value})}/>
      </label>
    </div>
  )
}
