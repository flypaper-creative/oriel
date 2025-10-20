/* Auto-generated brace entity: 06 */
export interface BRACE_06 {
  id: string;
  label: string;
  location?: { x:number; y:number; z?:number };
  status?: 'idle'|'active'|'offline'|'error';
  meta?: Record<string, any>;
}

/** factory helper */
export function createBrace_06(label = 'Brace 06') : BRACE_06 {
  return { id: `${label}_${Date.now()}`, label, location: { x:0,y:0 }, status: 'idle', meta: {} };
}

