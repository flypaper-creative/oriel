export interface Profile3 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_3: Profile3 = { id: 'p3', name: 'Profile 3', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

