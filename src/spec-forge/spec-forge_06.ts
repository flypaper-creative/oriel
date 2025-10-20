/* Auto-generated spec-forge entity: 06 */
export interface SPEC-FORGE_06 {
  id: string;
  label: string;
  location?: { x:number; y:number; z?:number };
  status?: 'idle'|'active'|'offline'|'error';
  meta?: Record<string, any>;
}

/** factory helper */
export function createSpec-forge_06(label = 'Spec-forge 06') : SPEC-FORGE_06 {
  return { id: `${label}_${Date.now()}`, label, location: { x:0,y:0 }, status: 'idle', meta: {} };
}

