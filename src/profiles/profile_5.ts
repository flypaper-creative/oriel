export interface Profile5 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_5: Profile5 = { id: 'p5', name: 'Profile 5', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

