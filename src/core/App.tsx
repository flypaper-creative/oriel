import React, { useEffect, useState } from 'react'
import { useStore, type Shard } from '@/state/store'
import { Timeline } from '@/ui/Timeline'
import { Toolbar } from '@/components/Toolbar'
import { Sidebar } from '@/components/Sidebar'
import { Inspector } from '@/components/Inspector'
import { parseCanonJson } from '@/lib/canon'

export function App(){
  const { shards, reso, viewStart, viewEnd, setShards, setReso, setView } = useStore()
  const [running, setRunning] = useState(false)
  const [selected, setSelected] = useState<Shard|null>(null)

  useEffect(()=>{ if(!running) return; const id = setInterval(()=> setReso(r=> r+1000), 1000); return ()=> clearInterval(id) }, [running, setReso])
  useEffect(()=>{ (window as any).__setView = (a:number,b:number)=> setView(a,b) }, [setView])

  const onImportFile = (file:File)=>{ const r = new FileReader(); r.onload = ()=> { const text = String(r.result || ''); const parsed = parseCanonJson(text); if(parsed.length){ setShards(parsed) } else { alert('No valid canon shards found in file.') } }; r.readAsText(file) }
  const onExport = ()=>{ const payload = JSON.stringify(shards.map(s=> ({ id:s.id, label:s.label, t0:new Date(s.t0).toISOString(), t1:new Date(s.t1).toISOString(), color:s.color })), null, 2); const blob = new Blob([payload], { type:'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'oriel_shards.json'; a.click() }

  const updateSelected = (s:Shard)=>{ setShards(shards.map(x=> x.id===s.id? s : x)); setSelected(s) }

  return (
    <div className="min-h-screen bg-ink-900">
      <Toolbar running={running} setRunning={setRunning} onImport={onImportFile} onExport={onExport} />
      <div className="flex" style={{ height:'calc(100vh - 48px)' }}>
        <Sidebar count={shards.length} />
        <div className="flex-1 p-3 flex gap-3">
          <div className="flex-1 flex flex-col gap-3">
            <div className="rounded-2xl bg-ink-800 border border-white/10 shadow-soft p-2">
              <Timeline
                shards={shards} reso={reso} setReso={setReso} viewStart={viewStart} viewEnd={viewEnd}
                onSelect={(id)=> setSelected(shards.find(s=> s.id===id) || null)}
              />
            </div>
            <div className="rounded-2xl bg-ink-800 border border-white/10 shadow-soft p-3 text-xs text-gray-300">
              view: {new Date(viewStart).toLocaleTimeString()} → {new Date(viewEnd).toLocaleTimeString()}
            </div>
          </div>
          <div className="w-80 rounded-2xl bg-ink-800 border border-white/10 shadow-soft overflow-auto">
            <Inspector selected={selected} onUpdate={updateSelected} />
          </div>
        </div>
      </div>
    </div>
  )
}
