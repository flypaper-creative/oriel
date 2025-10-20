/* Auto-generated resonator entity: 01 */
export interface RESONATOR_01 {
  id: string;
  label: string;
  location?: { x:number; y:number; z?:number };
  status?: 'idle'|'active'|'offline'|'error';
  meta?: Record<string, any>;
}

/** factory helper */
export function createResonator_01(label = 'Resonator 01') : RESONATOR_01 {
  return { id: `${label}_${Date.now()}`, label, location: { x:0,y:0 }, status: 'idle', meta: {} };
}

