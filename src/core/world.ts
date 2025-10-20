/* world utilities */ 
export type TimeStamp = number;

export interface WorldState {
  now: TimeStamp;
  timezone?: string;
  title?: string;
}

export function now(): TimeStamp { return Date.now(); }

export const DEFAULT_WORLD: WorldState = { now: Date.now(), timezone: 'UTC', title: 'oriel-world' };
