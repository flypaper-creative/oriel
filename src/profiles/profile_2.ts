export interface Profile2 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_2: Profile2 = { id: 'p2', name: 'Profile 2', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

