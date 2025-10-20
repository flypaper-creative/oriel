export interface Profile9 {
  id: string;
  name: string;
  role?: string;
  stats?: { charisma?:number; intellect?:number; will?:number };
}
export const SAMPLE_PROFILE_9: Profile9 = { id: 'p9', name: 'Profile 9', role: 'npc', stats: { charisma:5, intellect:6, will:7 } };

