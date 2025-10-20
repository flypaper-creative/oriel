export interface Profile14 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_14: Profile14 = { id: 'p14', name: 'Profile 14', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

