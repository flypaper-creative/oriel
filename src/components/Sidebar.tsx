import React from 'react'
export function Sidebar({count}:{count:number}){
  return (
    <div className="h-full w-64 shrink-0 border-r" style={{ borderColor:'#23252a', background:'#0e1116' }}>
      <div className="p-3 text-sm font-semibold text-gray-200">oriel</div>
      <div className="px-3 text-xs text-gray-400">shards: <span className="text-gray-200">{count}</span></div>
    </div>
  )
}
