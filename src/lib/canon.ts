import type { Shard } from '@/state/store'
export function parseCanonJson(text:string): Shard[] {
  try {
    const data = JSON.parse(text)
    if (Array.isArray(data)) {
      return data.filter(x=>x&&x.label&&x.t0&&x.t1).map((x,i)=>({
        id:String(x.id??`s_${i}`),
        label:String(x.label),
        t0:new Date(x.t0).getTime(),
        t1:new Date(x.t1).getTime(),
        color:String(x.color??'#a855f7')
      }))
    }
  } catch {}
  const clean = text.split('\n').filter(l=>!/^\s*(begin file|end file)\s*$/i.test(l)).join('\n')
  try {
    const data = JSON.parse(clean)
    if (Array.isArray(data)) {
      return data.filter(x=>x&&x.label&&x.t0&&x.t1).map((x,i)=>({
        id:String(x.id??`s_${i}`),
        label:String(x.label),
        t0:new Date(x.t0).getTime(),
        t1:new Date(x.t1).getTime(),
        color:String(x.color??'#a855f7')
      }))
    }
  } catch {}
  return []
}
