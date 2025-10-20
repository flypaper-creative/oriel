export interface Profile8 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_8: Profile8 = { id: 'p8', name: 'Profile 8', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

