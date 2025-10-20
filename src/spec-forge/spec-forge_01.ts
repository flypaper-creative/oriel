/* Auto-generated spec-forge entity: 01 */
export interface SPEC-FORGE_01 {
  id: string;
  label: string;
  location?: { x:number; y:number; z?:number };
  status?: 'idle'|'active'|'offline'|'error';
  meta?: Record<string, any>;
}

/** factory helper */
export function createSpec-forge_01(label = 'Spec-forge 01') : SPEC-FORGE_01 {
  return { id: `${label}_${Date.now()}`, label, location: { x:0,y:0 }, status: 'idle', meta: {} };
}

