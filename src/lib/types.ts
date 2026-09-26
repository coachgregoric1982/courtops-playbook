export type CourtType = "half" | "full";

export type PlayerSide = "offense" | "defense";

export type Player = {
  id: string;
  n: 1 | 2 | 3 | 4 | 5;
  side: PlayerSide;
  x: number;
  y: number;
};

export type DrawType = "pass" | "dribble" | "cut" | "screen" | "shot" | "handoff";

export type Point = { x: number; y: number };

export type Drawing = {
  id: string;
  type: DrawType;
  points: Point[];
};

export type PlayStep = {
  id: string;
  players: Player[];
  drawings: Drawing[];
  note: string;
  /** Player id that has the ball this step. Defaults to offense #1. */
  ballId?: string;
};

export const PLAY_TAGS = [
  "BOB",
  "SLOB",
  "ATO",
  "vs man",
  "vs zone",
  "press break",
  "motion",
  "delay",
] as const;

export type PlayTag = (typeof PLAY_TAGS)[number];

export type SlotN = 1 | 2 | 3 | 4 | 5;

export type RosterLabel = "number" | "name";

export type Play = {
  id: string;
  name: string;
  court: CourtType;
  tags: PlayTag[];
  note: string;
  steps: PlayStep[];
  updatedAt: number;
  useRosterNames?: boolean;
  rosterLabel?: RosterLabel;
  rosterSlots?: Partial<Record<SlotN, string>>;
};

export const BLOCK_TYPES = [
  "warmup",
  "teaching",
  "drill",
  "play review",
  "scrimmage",
  "cooldown",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export type PracticeBlock = {
  id: string;
  title: string;
  minutes: number;
  type: BlockType;
  notes: string;
  playId?: string;
  equipment?: string;
  cue?: string;
};

export type PracticePlan = {
  id: string;
  name: string;
  date: string;
  targetMinutes: number;
  blocks: PracticeBlock[];
  updatedAt: number;
};

export const POSITIONS = ["PG", "SG", "SF", "PF", "C", "G", "F", "W"] as const;

export type RosterPlayer = {
  id: string;
  number: string;
  name: string;
  position: string;
};

export type Settings = {
  teamName: string;
  shortClubName: string;
  ageGroup: string;
  defaultPracticeMinutes: number;
  primaryColor: string;
  logoDataUrl: string;
  roster: RosterPlayer[];
  locale: string;
};

export type AppData = {
  settings: Settings;
  plays: Play[];
  plans: PracticePlan[];
};

export const AGE_GROUPS = ["U10", "U12", "U14", "U16", "U18", "Open"] as const;

export const COLOR_PRESETS = [
  "#f07828",
  "#c45c4a",
  "#3d9a6a",
  "#4a8fb8",
  "#e07040",
] as const;
