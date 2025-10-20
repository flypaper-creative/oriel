export const clamp = (v:number, a:number, b:number)=> Math.max(a, Math.min(b, v));
export const lerp = (a:number,b:number,t:number)=> a+(b-a)*t;
export const fmt = (ms:number)=> new Date(ms).toLocaleTimeString();
