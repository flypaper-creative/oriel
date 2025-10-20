import { motion } from "framer-motion";
import { useStore } from "@/state/store";
import { Play, Pause, Upload, Download, WandSparkles } from "lucide-react";

export function ModuleGrid(){
  const { running, setRunning, reso } = useStore(s=>({ running:s.running, setRunning:s.setRunning, reso:s.reso }));

  const modules = [
    { key:"world", name:"World", desc:"Entities, roles, continuities", accent:"bg-ink-700" },
    { key:"shards", name:"Shards", desc:"Events, durations, lineage", accent:"bg-ink-700" },
    { key:"timeline", name:"Timeline", desc:"Chronology, zoom, reso", accent:"bg-ink-700" },
    { key:"linkage", name:"Linkage", desc:"Graph fibers, constraints", accent:"bg-ink-700" },
    { key:"versions", name:"Branches", desc:"Decision A/B, diffs", accent:"bg-ink-700" },
    { key:"ai", name:"AI", desc:"Stub/live, prompts, tools", accent:"bg-ink-700" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {modules.map((m,i)=>(
        <motion.div key={m.key} className={`card p-4 ${m.accent} hover:shadow-neon cursor-pointer`}
          initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:i*0.03}}>
          <div className="text-sm font-semibold">{m.name}</div>
          <div className="text-[12px] text-slate-400 mt-1">{m.desc}</div>
          <div className="mt-4 flex gap-2">
            <button className="btn btn-prim text-xs"><WandSparkles size={14}/>Open</button>
            <button className="btn btn-ghost text-xs"><Upload size={14}/>Import</button>
            <button className="btn btn-ghost text-xs"><Download size={14}/>Export</button>
          </div>
        </motion.div>
      ))}
      <div className="card p-4 flex items-center justify-between">
        <div className="text-[12px] text-slate-400">Reso</div>
        <div className="text-sm">{new Date(reso).toLocaleTimeString()}</div>
        <button className="btn btn-prim" onClick={()=> useStore.getState().setRunning(!running)}>
          {running? <Pause size={16}/> : <Play size={16}/>}
          <span className="text-xs">{running?"Pause":"Play"}</span>
        </button>
      </div>
    </div>
  );
}
