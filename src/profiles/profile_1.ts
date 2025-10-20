export interface Profile1 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_1: Profile1 = { id: 'p1', name: 'Profile 1', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

