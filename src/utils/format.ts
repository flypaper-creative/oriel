export const clamp = (v:number, a:number, b:number) => Math.max(a, Math.min(b, v));
export const uid = () => Math.random().toString(36).slice(2);
