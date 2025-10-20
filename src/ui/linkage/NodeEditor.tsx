import React, { useEffect, useRef, useState } from "react";
type Node = { id:string; x:number; y:number; w:number; h:number; title:string; inputs:number; outputs:number; };
type Link = { from:{id:string; idx:number}; to:{id:string; idx:number} };

function ioPos(n:Node, idx:number, io:"in"|"out"){ const gap=n.h/(io==="in"?(n.inputs+1):(n.outputs+1)); const y=n.y+gap*(idx+1); const x=io==="in"?n.x:n.x+n.w; return {x,y}; }
function uid(){ return Math.random().toString(36).slice(2); }

export default function NodeEditor(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>(()=>[
    { id:"n1", x:120, y:140, w:170, h:120, title:"Character", inputs:1, outputs:2 },
    { id:"n2", x:380, y:230, w:170, h:120, title:"Event",     inputs:2, outputs:1 },
  ]);
  const [links, setLinks] = useState<Link[]>([{ from:{id:"n1",idx:1}, to:{id:"n2",idx:0} }]);
  const [drag, setDrag] = useState<{id:string; dx:number; dy:number}|null>(null);
  const [draft, setDraft] = useState<{x1:number;y1:number;x2:number;y2:number}|null>(null);
  const [pan, setPan] = useState({x:0,y:0,z:1});

  useEffect(()=>{ const c=canvasRef.current!, ctx=c.getContext("2d")!; let raf=0;
    const draw=()=>{ const w=c.width=c.clientWidth, h=c.height=c.clientHeight;
      ctx.clearRect(0,0,w,h); ctx.save(); ctx.translate(pan.x,pan.y); ctx.scale(pan.z,pan.z);
      // grid
      const step=24; ctx.strokeStyle="rgba(255,255,255,.05)"; ctx.lineWidth=1;
      for(let x=-1000;x<w+1000;x+=step){ ctx.beginPath(); ctx.moveTo(x,-1000); ctx.lineTo(x,h+1000); ctx.stroke(); }
      for(let y=-1000;y<h+1000;y+=step){ ctx.beginPath(); ctx.moveTo(-1000,y); ctx.lineTo(w+1000,y); ctx.stroke(); }

      // links
      ctx.strokeStyle="rgba(255,215,97,.9)"; ctx.lineWidth=2;
      for(const L of links){ const a=nodes.find(n=>n.id===L.from.id)!; const b=nodes.find(n=>n.id===L.to.id)!;
        const p1=ioPos(a,L.from.idx,"out"), p2=ioPos(b,L.to.idx,"in"); const mx=(p1.x+p2.x)/2;
        ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.bezierCurveTo(mx,p1.y,mx,p2.y,p2.x,p2.y); ctx.stroke(); }
      if(draft){ const {x1,y1,x2,y2}=draft; const mx=(x1+x2)/2; ctx.strokeStyle="rgba(255,215,97,.5)"; ctx.beginPath();
        ctx.moveTo(x1,y1); ctx.bezierCurveTo(mx,y1,mx,y2,x2,y2); ctx.stroke(); }

      // nodes
      for(const n of nodes){
        ctx.fillStyle="#1B1C22"; ctx.strokeStyle="#2a2b31"; ctx.lineWidth=1.5; (ctx as any).roundRect(n.x,n.y,n.w,n.h,12); ctx.fill(); ctx.stroke();
        ctx.fillStyle="#EAEAEA"; ctx.font="12px Inter, system-ui, Arial"; ctx.fillText(n.title, n.x+10, n.y+18);
        ctx.fillStyle="#FFD761";
        for(let i=0;i<n.inputs;i++){ const p=ioPos(n,i,"in"); ctx.beginPath(); ctx.arc(p.x-6,p.y,5,0,Math.PI*2); ctx.fill(); }
        for(let o=0;o<n.outputs;o++){ const p=ioPos(n,o,"out"); ctx.beginPath(); ctx.arc(p.x+6,p.y,5,0,Math.PI*2); ctx.fill(); }
      }
      ctx.restore(); raf=requestAnimationFrame(draw);
    }; draw(); return ()=>cancelAnimationFrame(raf);
  },[nodes,links,draft,pan]);

  const pick=(x:number,y:number)=> nodes.findLast(n=>x>=n.x&&x<=n.x+n.w&&y>=n.y&&y<=n.y+n.h);
  const onDown=(e:React.MouseEvent)=>{ const r=(e.target as HTMLCanvasElement).getBoundingClientRect(); const x=(e.clientX-r.left-pan.x)/pan.z, y=(e.clientY-r.top-pan.y)/pan.z;
    const hit=pick(x,y); if(hit){ setDrag({id:hit.id, dx:x-hit.x, dy:y-hit.y}); return; }
    for(const n of nodes){ for(let o=0;o<n.outputs;o++){ const p=ioPos(n,o,"out"); const dx=x-(p.x+6), dy=y-p.y; if(dx*dx+dy*dy<81){ setDraft({x1:p.x+6,y1:p.y,x2:x,y2:y}); (e.target as any)._from={id:n.id,idx:o}; return; } } }
    (e.target as any)._pan={sx:e.clientX,sy:e.clientY,ox:pan.x,oy:pan.y};
  };
  const onMove=(e:React.MouseEvent)=>{ const r=(e.target as HTMLCanvasElement).getBoundingClientRect(); const x=(e.clientX-r.left-pan.x)/pan.z, y=(e.clientY-r.top-pan.y)/pan.z;
    if(drag){ setNodes(ns=>ns.map(n=>n.id===drag.id?{...n,x:x-drag.dx,y:y-drag.dy}:n)); return; }
    if(draft){ setDraft(p=>p?{...p,x2:x,y2:y}:null); return; }
    if((e.target as any)._pan){ const s=(e.target as any)._pan; setPan(p=>({...p,x:s.ox+(e.clientX-s.sx),y:s.oy+(e.clientY-s.sy)})); }
  };
  const onUp=(e:React.MouseEvent)=>{ const r=(e.target as HTMLCanvasElement).getBoundingClientRect(); const x=(e.clientX-r.left-pan.x)/pan.z, y=(e.clientY-r.top-pan.y)/pan.z;
    if(drag){ setDrag(null); return; }
    if(draft){ const from=(e.target as any)._from; setDraft(null);
      let target: {id:string; idx:number}|null=null; let best=1e9;
      for(const n of nodes){ for(let i=0;i<n.inputs;i++){ const p=ioPos(n,i,"in"); const d=(x-(p.x-6))**2+(y-p.y)**2; if(d<best && d<22*22){ best=d; target={id:n.id,idx:i}; } } }
      if(target) setLinks(ls=>[...ls,{from,to:target!}]); (e.target as any)._from=null; return;
    }
    (e.target as any)._pan=null;
  };
  const onWheel=(e:React.WheelEvent)=>{ if(e.ctrlKey||e.metaKey){ e.preventDefault(); const k=Math.exp(-e.deltaY*0.0015); setPan(p=>({...p,z:Math.min(2.2,Math.max(.5,p.z*k))})); } };

  // toolbar actions
  const addNode=()=> setNodes(ns=>[...ns,{ id:uid(), x:180+Math.random()*240, y:120+Math.random()*160, w:170, h:120, title:"Node", inputs:1, outputs:1 }]);
  const exportJSON=()=>{ const payload=JSON.stringify({nodes,links},null,2); const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([payload],{type:'application/json'})); a.download='linkage.json'; a.click(); };
  const importJSON=(e:React.ChangeEvent<HTMLInputElement>)=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{
        const o=JSON.parse(String(r.result)); if(o?.nodes&&o?.links){ setNodes(o.nodes); setLinks(o.links); }
      }catch{} }; r.readAsText(f); };

  return (
    <div className="rounded-2xl border border-oriel-surface overflow-hidden bg-oriel-surface/60">
      <div className="flex items-center justify-between px-3 py-2 border-b border-oriel-surface">
        <div className="text-lg font-medium">Linkage (node editor)</div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={addNode} className="px-2 py-1 rounded bg-oriel-accent text-black">+ Node</button>
          <button onClick={exportJSON} className="px-2 py-1 rounded bg-oriel-surface hover:bg-oriel-surface/80">Export</button>
          <label className="px-2 py-1 rounded bg-oriel-surface hover:bg-oriel-surface/80 cursor-pointer">
            Import<input type="file" className="hidden" accept="application/json" onChange={importJSON}/>
          </label>
        </div>
      </div>
      <div className="relative h-[360px]">
        <canvas ref={canvasRef} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onWheel={onWheel}
          className="absolute inset-0 w-full h-full cursor-crosshair" />
      </div>
    </div>
  );
}
