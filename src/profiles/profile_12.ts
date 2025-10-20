export interface Profile12 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_12: Profile12 = { id: 'p12', name: 'Profile 12', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

