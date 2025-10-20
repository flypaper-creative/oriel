export interface Profile13 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_13: Profile13 = { id: 'p13', name: 'Profile 13', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

