export interface Profile11 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_11: Profile11 = { id: 'p11', name: 'Profile 11', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

