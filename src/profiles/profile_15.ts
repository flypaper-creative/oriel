export interface Profile15 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_15: Profile15 = { id: 'p15', name: 'Profile 15', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

