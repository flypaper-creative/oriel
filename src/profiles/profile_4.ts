export interface Profile4 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_4: Profile4 = { id: 'p4', name: 'Profile 4', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

