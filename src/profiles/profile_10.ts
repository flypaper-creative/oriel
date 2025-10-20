export interface Profile10 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_10: Profile10 = { id: 'p10', name: 'Profile 10', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

