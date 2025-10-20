export interface Profile7 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_7: Profile7 = { id: 'p7', name: 'Profile 7', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

