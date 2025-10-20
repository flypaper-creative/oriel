/* Auto-generated spec-forge entity: 02 */
export interface SPEC-FORGE_02 {
  id: string;
  label: string;
  location?: { x:number; y:number; z?:number };
  status?: 'idle'|'active'|'offline'|'error';
  meta?: Record<string, any>;
}

/** factory helper */
export function createSpec-forge_02(label = 'Spec-forge 02') : SPEC-FORGE_02 {
  return { id: `${label}_${Date.now()}`, label, location: { x:0,y:0 }, status: 'idle', meta: {} };
}

