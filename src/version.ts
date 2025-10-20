export const ORIEL_VERSION = "4.6.0"; // UI mega upgrade (25x)
export const MODULE_VERSIONS = {
  timeline: "2.4.0",
  inspector: "1.3.0",
  graph: "1.2.0",
  scheduler: "0.9.0",
  settings: "1.1.0"
} as const;
export type ModuleKey = keyof typeof MODULE_VERSIONS;
