/* Auto-generated resonator entity: 02 */
export interface RESONATOR_02 {
  id: string;
  label: string;
  location?: { x:number; y:number; z?:number };
  status?: 'idle'|'active'|'offline'|'error';
  meta?: Record<string, any>;
}

/** factory helper */
export function createResonator_02(label = 'Resonator 02') : RESONATOR_02 {
  return { id: `${label}_${Date.now()}`, label, location: { x:0,y:0 }, status: 'idle', meta: {} };
}

