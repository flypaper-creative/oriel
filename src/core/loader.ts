/* loader utility to import shards */ 
export async function loadShard(path:string) { try { const mod = await import(path); return mod; } catch(e){ console.error('load error',path,e); return null; } }
