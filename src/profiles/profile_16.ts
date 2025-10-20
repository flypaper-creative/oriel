export interface Profile16 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_16: Profile16 = { id: 'p16', name: 'Profile 16', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

