import type {
  AppData,
  Drawing,
  DrawType,
  Player,
  Play,
  PlayStep,
  PracticePlan,
  RosterPlayer,
  Settings,
} from "./types";
import { uid } from "./utils";

const T0 = Date.parse("2026-09-18T12:00:00+08:00");

function off(
  spots: [number, number][],
): Player[] {
  return spots.map((p, i) => ({
    id: `o${i + 1}`,
    n: (i + 1) as 1 | 2 | 3 | 4 | 5,
    side: "offense" as const,
    x: p[0],
    y: p[1],
  }));
}

function withDefense(
  offense: Player[],
  hoop = { x: 0.5, y: 0.112 },
  t = 0.22,
): Player[] {
  const def: Player[] = offense.map((p) => ({
    id: `d${p.n}`,
    n: p.n,
    side: "defense",
    x: p.x + (hoop.x - p.x) * t,
    y: p.y + (hoop.y - p.y) * t,
  }));
  return [...offense, ...def];
}

function D(
  id: string,
  type: DrawType,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): Drawing {
  return { id, type, points: [{ x: x1, y: y1 }, { x: x2, y: y2 }] };
}

function st(
  id: string,
  players: Player[],
  drawings: Drawing[] = [],
  note = "",
  ballId?: string,
): PlayStep {
  const ball =
    ballId ??
    players.find((p) => p.side === "offense" && p.n === 1)?.id ??
    players.find((p) => p.side === "offense")?.id;
  return { id, players, drawings, note, ballId: ball };
}

function play(
  partial: Omit<Play, "updatedAt"> & { updatedAt?: number },
): Play {
  return { updatedAt: T0, ...partial };
}

const HORNS_1 = off([
  [0.5, 0.7],
  [0.88, 0.2],
  [0.12, 0.2],
  [0.64, 0.4],
  [0.36, 0.4],
]);
const HORNS_2 = off([
  [0.58, 0.5],
  [0.78, 0.36],
  [0.14, 0.22],
  [0.64, 0.4],
  [0.7, 0.28],
]);
const HORNS_3 = off([
  [0.46, 0.22],
  [0.8, 0.42],
  [0.18, 0.24],
  [0.6, 0.42],
  [0.68, 0.2],
]);
const HORNS_4 = off([
  [0.42, 0.16],
  [0.78, 0.4],
  [0.22, 0.28],
  [0.56, 0.38],
  [0.62, 0.16],
]);

const BOB_1 = off([
  [0.5, 0.04],
  [0.5, 0.28],
  [0.5, 0.4],
  [0.5, 0.52],
  [0.5, 0.64],
]);
const BOB_2 = off([
  [0.5, 0.04],
  [0.88, 0.2],
  [0.78, 0.42],
  [0.22, 0.38],
  [0.5, 0.22],
]);
const BOB_3 = off([
  [0.62, 0.18],
  [0.9, 0.18],
  [0.8, 0.44],
  [0.2, 0.36],
  [0.42, 0.16],
]);

const SLOB_1 = off([
  [0.02, 0.42],
  [0.38, 0.22],
  [0.62, 0.22],
  [0.38, 0.48],
  [0.62, 0.48],
]);
const SLOB_2 = off([
  [0.02, 0.42],
  [0.22, 0.2],
  [0.78, 0.38],
  [0.42, 0.36],
  [0.58, 0.28],
]);
const SLOB_3 = off([
  [0.18, 0.4],
  [0.14, 0.18],
  [0.82, 0.4],
  [0.4, 0.34],
  [0.52, 0.2],
]);

const ATO_1 = off([
  [0.5, 0.66],
  [0.18, 0.42],
  [0.82, 0.42],
  [0.38, 0.4],
  [0.62, 0.4],
]);
const ATO_2 = off([
  [0.42, 0.58],
  [0.5, 0.52],
  [0.84, 0.4],
  [0.42, 0.4],
  [0.58, 0.4],
]);
const ATO_3 = off([
  [0.36, 0.56],
  [0.5, 0.62],
  [0.86, 0.38],
  [0.4, 0.4],
  [0.6, 0.4],
]);

const ZONE_1 = off([
  [0.5, 0.72],
  [0.18, 0.38],
  [0.82, 0.38],
  [0.38, 0.42],
  [0.62, 0.42],
]);
const ZONE_2 = off([
  [0.28, 0.62],
  [0.12, 0.22],
  [0.88, 0.36],
  [0.42, 0.28],
  [0.62, 0.42],
]);
const ZONE_3 = off([
  [0.22, 0.58],
  [0.12, 0.2],
  [0.88, 0.34],
  [0.48, 0.18],
  [0.66, 0.4],
]);

const PRESS_HOOP = { x: 0.056, y: 0.5 };
const PRESS_1 = off([
  [0.04, 0.5],
  [0.22, 0.28],
  [0.22, 0.72],
  [0.48, 0.5],
  [0.78, 0.5],
]);
const PRESS_2 = off([
  [0.06, 0.5],
  [0.28, 0.38],
  [0.22, 0.72],
  [0.55, 0.42],
  [0.82, 0.5],
]);
const PRESS_3 = off([
  [0.12, 0.5],
  [0.4, 0.42],
  [0.28, 0.7],
  [0.68, 0.48],
  [0.9, 0.5],
]);

function pressPlayers(spots: Player[]): Player[] {
  return withDefense(spots, PRESS_HOOP, 0.18);
}

const DELAY_1 = off([
  [0.5, 0.68],
  [0.88, 0.38],
  [0.12, 0.38],
  [0.78, 0.18],
  [0.5, 0.4],
]);
const DELAY_2 = off([
  [0.28, 0.6],
  [0.88, 0.36],
  [0.18, 0.42],
  [0.78, 0.18],
  [0.5, 0.38],
]);
const DELAY_3 = off([
  [0.22, 0.52],
  [0.86, 0.34],
  [0.22, 0.38],
  [0.8, 0.2],
  [0.48, 0.36],
]);

const SPAIN_1 = off([
  [0.5, 0.68],
  [0.86, 0.36],
  [0.14, 0.36],
  [0.38, 0.4],
  [0.58, 0.48],
]);
const SPAIN_2 = off([
  [0.64, 0.5],
  [0.86, 0.34],
  [0.14, 0.34],
  [0.52, 0.32],
  [0.6, 0.42],
]);
const SPAIN_3 = off([
  [0.7, 0.38],
  [0.88, 0.32],
  [0.16, 0.32],
  [0.58, 0.62],
  [0.52, 0.22],
]);

export const SAMPLE_ROSTER: RosterPlayer[] = [
  { id: "rp1", number: "4", name: "Maya Chen", position: "PG" },
  { id: "rp2", number: "12", name: "Jordan Lee", position: "SG" },
  { id: "rp3", number: "21", name: "Sam Rivera", position: "SF" },
  { id: "rp4", number: "33", name: "Alex Kim", position: "PF" },
  { id: "rp5", number: "15", name: "Riley Park", position: "C" },
  { id: "rp6", number: "7", name: "Casey Nguyen", position: "G" },
  { id: "rp7", number: "23", name: "Quinn Brooks", position: "F" },
];

const DEFAULT_SLOTS = {
  1: "rp1",
  2: "rp2",
  3: "rp3",
  4: "rp4",
  5: "rp5",
} as const;

export const SAMPLE_PLAYS: Play[] = [
  play({
    id: "play-horns",
    name: "Horns Floppy",
    court: "half",
    tags: ["motion", "vs man"],
    note: "4 receives and holds. 5 screens down for 2. 1 cuts to the rim after the pass.",
    useRosterNames: true,
    rosterLabel: "number",
    rosterSlots: { ...DEFAULT_SLOTS },
    steps: [
      st("h1", withDefense(HORNS_1), [], "Horns: 4 and 5 at the elbows.", "o1"),
      st(
        "h2",
        withDefense(HORNS_2),
        [
          D("h2p", "pass", 0.5, 0.7, 0.64, 0.4),
          D("h2s", "screen", 0.36, 0.4, 0.7, 0.28),
          D("h2c", "cut", 0.88, 0.2, 0.78, 0.36),
        ],
        "1 to 4. 5 down-screens for 2.",
        "o4",
      ),
      st(
        "h3",
        withDefense(HORNS_3),
        [
          D("h3p", "pass", 0.64, 0.4, 0.8, 0.42),
          D("h3c", "cut", 0.58, 0.5, 0.46, 0.22),
        ],
        "Extra to 2. 1 cuts. 5 pops.",
        "o2",
      ),
      st(
        "h4",
        withDefense(HORNS_4),
        [
          D("h4s", "shot", 0.78, 0.4, 0.55, 0.16),
          D("h4c", "cut", 0.46, 0.22, 0.42, 0.16),
        ],
        "2 hunts the three. 1 rebounds weak side.",
        "o2",
      ),
    ],
  }),
  play({
    id: "play-bob",
    name: "BOB Stack",
    court: "half",
    tags: ["BOB", "vs man"],
    note: "4 inbounds. Stack breaks on the slap: 2 corner, 3 wing, 5 to ball, 1 rim.",
    steps: [
      st("b1", withDefense(BOB_1), [], "Stack on the nail. 4 ready to inbound."),
      st(
        "b2",
        withDefense(BOB_2),
        [
          D("b2c1", "cut", 0.5, 0.28, 0.88, 0.2),
          D("b2c2", "cut", 0.5, 0.4, 0.78, 0.42),
          D("b2c3", "cut", 0.5, 0.52, 0.22, 0.38),
          D("b2c4", "cut", 0.5, 0.64, 0.5, 0.22),
        ],
        "Break the stack on the slap.",
      ),
      st(
        "b3",
        withDefense(BOB_3),
        [
          D("b3p", "pass", 0.5, 0.04, 0.42, 0.16),
          D("b3s", "shot", 0.42, 0.16, 0.5, 0.12),
        ],
        "Hit 5 on the short roll. 4 steps in.",
      ),
    ],
    updatedAt: T0 + 3600_000,
  }),
  play({
    id: "play-slob",
    name: "SLOB Box Stagger",
    court: "half",
    tags: ["SLOB", "vs man"],
    note: "4 inbounds from the side. Stagger away for 3. 2 clears the corner.",
    steps: [
      st("s1", withDefense(SLOB_1), [], "Box in the key. 4 on the sideline."),
      st(
        "s2",
        withDefense(SLOB_2),
        [
          D("s2c", "cut", 0.62, 0.22, 0.78, 0.38),
          D("s2s", "screen", 0.62, 0.48, 0.58, 0.28),
          D("s2c2", "cut", 0.38, 0.22, 0.22, 0.2),
        ],
        "Stagger for 3. 2 clears corner.",
      ),
      st(
        "s3",
        withDefense(SLOB_3),
        [
          D("s3p", "pass", 0.02, 0.42, 0.82, 0.4),
          D("s3s", "shot", 0.82, 0.4, 0.55, 0.16),
        ],
        "Skip to 3. Shot or drive closeout.",
      ),
    ],
    updatedAt: T0 + 7200_000,
  }),
  play({
    id: "play-ato",
    name: "ATO Elevator",
    court: "half",
    tags: ["ATO", "vs man"],
    note: "2 sprints through the 4–5 elevator. 1 must wait for the doors to close.",
    steps: [
      st("a1", withDefense(ATO_1), [], "2 on the weak wing. 4 and 5 are the doors."),
      st(
        "a2",
        withDefense(ATO_2),
        [
          D("a2c", "cut", 0.18, 0.42, 0.5, 0.52),
          D("a2s1", "screen", 0.38, 0.4, 0.42, 0.4),
          D("a2s2", "screen", 0.62, 0.4, 0.58, 0.4),
        ],
        "2 through the elevator.",
      ),
      st(
        "a3",
        withDefense(ATO_3),
        [
          D("a3p", "pass", 0.42, 0.58, 0.5, 0.62),
          D("a3s", "shot", 0.5, 0.62, 0.5, 0.18),
        ],
        "1 hits 2 at the nail for three.",
      ),
    ],
    updatedAt: T0 + 10800_000,
  }),
  play({
    id: "play-zone",
    name: "1-4 High vs Zone",
    court: "half",
    tags: ["vs zone", "motion"],
    note: "High-low with 4 and 5. Skip opposite before the zone recovers.",
    steps: [
      st("z1", withDefense(ZONE_1), [], "1-4 high. Punish the top of the 2-3."),
      st(
        "z2",
        withDefense(ZONE_2),
        [
          D("z2p", "pass", 0.5, 0.72, 0.28, 0.62),
          D("z2c", "cut", 0.38, 0.42, 0.42, 0.28),
          D("z2d", "dribble", 0.5, 0.72, 0.28, 0.62),
        ],
        "Shift left. 4 dives the short middle.",
      ),
      st(
        "z3",
        withDefense(ZONE_3),
        [
          D("z3p", "pass", 0.28, 0.62, 0.42, 0.28),
          D("z3p2", "pass", 0.42, 0.28, 0.12, 0.2),
          D("z3s", "shot", 0.12, 0.2, 0.5, 0.12),
        ],
        "High-low, then kick the corner.",
      ),
    ],
    updatedAt: T0 + 14400_000,
  }),
  play({
    id: "play-press",
    name: "Press Break 1-4",
    court: "full",
    tags: ["press break"],
    note: "4 inbounds. 1 is the outlet. 3 is the safety. Do not hold the ball.",
    steps: [
      st("p1", pressPlayers(PRESS_1), [], "1-4 spread. 4 takes the ball out."),
      st(
        "p2",
        pressPlayers(PRESS_2),
        [
          D("p2p", "pass", 0.04, 0.5, 0.28, 0.38),
          D("p2c", "cut", 0.48, 0.5, 0.55, 0.42),
        ],
        "Hit 1. 4 steps in. 3 presents middle.",
      ),
      st(
        "p3",
        pressPlayers(PRESS_3),
        [
          D("p3p", "pass", 0.28, 0.38, 0.4, 0.42),
          D("p3d", "dribble", 0.4, 0.42, 0.68, 0.48),
          D("p3p2", "pass", 0.68, 0.48, 0.9, 0.5),
        ],
        "Advance middle, finish to 5.",
      ),
    ],
    updatedAt: T0 + 18000_000,
  }),
  play({
    id: "play-delay",
    name: "Delay 4-Out",
    court: "half",
    tags: ["delay", "vs man"],
    note: "Eat clock. 5 is the only post. Reverse twice before a hunt.",
    steps: [
      st("d1", withDefense(DELAY_1), [], "4-out, 5 at the high post."),
      st(
        "d2",
        withDefense(DELAY_2),
        [
          D("d2d", "dribble", 0.5, 0.68, 0.28, 0.6),
          D("d2h", "handoff", 0.28, 0.6, 0.18, 0.42),
          D("d2p", "pass", 0.28, 0.6, 0.18, 0.42),
        ],
        "Slow dribble entry. Reverse to 3.",
      ),
      st(
        "d3",
        withDefense(DELAY_3),
        [
          D("d3p", "pass", 0.18, 0.42, 0.22, 0.38),
          D("d3c", "cut", 0.5, 0.4, 0.48, 0.36),
        ],
        "Hold. 5 shows as the relief.",
      ),
    ],
    updatedAt: T0 + 21600_000,
  }),
  play({
    id: "play-spain",
    name: "Spain Pick and Roll",
    court: "half",
    tags: ["vs man", "ATO"],
    note: "5 ballscreens. 4 backscreens the 5-man. 1 turns the corner.",
    steps: [
      st("sp1", withDefense(SPAIN_1), [], "5 at the right slot. 4 is the Spain screener."),
      st(
        "sp2",
        withDefense(SPAIN_2),
        [
          D("sp2d", "dribble", 0.5, 0.68, 0.64, 0.5),
          D("sp2s", "screen", 0.58, 0.48, 0.6, 0.42),
          D("sp2s2", "screen", 0.38, 0.4, 0.52, 0.32),
        ],
        "Ballscreen + backscreen (Spain).",
      ),
      st(
        "sp3",
        withDefense(SPAIN_3),
        [
          D("sp3c", "cut", 0.6, 0.42, 0.52, 0.22),
          D("sp3c2", "cut", 0.52, 0.32, 0.58, 0.62),
          D("sp3s", "shot", 0.7, 0.38, 0.52, 0.16),
        ],
        "5 dives. 4 pops. 1 scores or kicks.",
      ),
    ],
    updatedAt: T0 + 25200_000,
  }),
];

export const SAMPLE_PLANS: PracticePlan[] = [
  {
    id: "plan-tue",
    name: "Tue Install — U14",
    date: "2026-09-22",
    targetMinutes: 90,
    updatedAt: T0 + 4000_000,
    blocks: [
      {
        id: "tb1",
        title: "Dynamic warmup",
        minutes: 10,
        type: "warmup",
        notes: "Jog, skips, closeouts, two-line layups.",
        equipment: "Cones",
        cue: "Talk on every closeout.",
      },
      {
        id: "tb2",
        title: "Ball-handling series",
        minutes: 12,
        type: "drill",
        notes: "Stationary pound, on-move change of direction, 1-on-1 hold.",
        equipment: "1 ball each",
        cue: "Eyes up.",
      },
      {
        id: "tb3",
        title: "Form shooting",
        minutes: 15,
        type: "drill",
        notes: "Partner form, 5 spots, make-it-take-it closeouts.",
        equipment: "2 balls per pair",
        cue: "Hold the follow-through.",
      },
      {
        id: "tb4",
        title: "Teach Horns Floppy",
        minutes: 20,
        type: "play review",
        notes: "Walk-through, then 5-on-0, then 5-on-5 live.",
        playId: "play-horns",
        cue: "4 holds. 5 down-screens.",
      },
      {
        id: "tb5",
        title: "4-on-4 breakdown",
        minutes: 15,
        type: "teaching",
        notes: "Help, recover, and the extra pass. No dribble live if they rush.",
        cue: "See both — man and ball.",
      },
      {
        id: "tb6",
        title: "Controlled scrimmage",
        minutes: 12,
        type: "scrimmage",
        notes: "Stop for the Horns cue. First to 8.",
        cue: "Call Horns live.",
      },
      {
        id: "tb7",
        title: "Shoot-off + stretch",
        minutes: 6,
        type: "cooldown",
        notes: "Free throws in pairs. Then hip / calf stretch.",
        equipment: "1 ball per pair",
      },
    ],
  },
  {
    id: "plan-sat",
    name: "Saturday Tune-up",
    date: "2026-09-26",
    targetMinutes: 75,
    updatedAt: T0 + 8000_000,
    blocks: [
      {
        id: "sb1",
        title: "Warmup games",
        minutes: 8,
        type: "warmup",
        notes: "3-line layups and a short 3-on-2 / 2-on-1.",
        cue: "Sprint the floor.",
      },
      {
        id: "sb2",
        title: "Shooting circuit",
        minutes: 15,
        type: "drill",
        notes: "Corner-wing-top. Track makes. No standing.",
        equipment: "3 balls, 6 cones",
        cue: "Catch ready.",
      },
      {
        id: "sb3",
        title: "Teach BOB Stack",
        minutes: 8,
        type: "play review",
        notes: "Baseline inbound vs man. Live after two makes.",
        playId: "play-bob",
        cue: "Slap. Break. Do not stand.",
      },
      {
        id: "sb4",
        title: "Teach SLOB Box",
        minutes: 8,
        type: "play review",
        notes: "Sideline inbound. Skip vs overplay.",
        playId: "play-slob",
        cue: "Stagger away. Skip if denied.",
      },
      {
        id: "sb5",
        title: "Press break 1-4",
        minutes: 12,
        type: "play review",
        notes: "Full court vs 1-2-1-1. 4-second inbounds.",
        playId: "play-press",
        equipment: "Full court",
        cue: "Do not hold the ball.",
      },
      {
        id: "sb6",
        title: "Scrimmage",
        minutes: 18,
        type: "scrimmage",
        notes: "Special-situation stops: BOB, SLOB, ATO.",
        cue: "Dead ball = set play.",
      },
      {
        id: "sb7",
        title: "Cooldown FT",
        minutes: 6,
        type: "cooldown",
        notes: "Make 2 in a row to leave. Quiet stretch.",
      },
    ],
  },
];

export const INITIAL_SETTINGS: Settings = {
  teamName: "U14 Phoenix",
  shortClubName: "PHX",
  ageGroup: "U14",
  defaultPracticeMinutes: 90,
  primaryColor: "#f07828",
  logoDataUrl: "",
  roster: SAMPLE_ROSTER.map((r) => ({ ...r })),
  locale: "en",
};

export function getInitialData(): AppData {
  return {
    settings: {
      ...INITIAL_SETTINGS,
      roster: SAMPLE_ROSTER.map((r) => ({ ...r })),
    },
    plays: SAMPLE_PLAYS.map((p) => ({
      ...p,
      tags: [...p.tags],
      rosterSlots: p.rosterSlots ? { ...p.rosterSlots } : undefined,
      steps: p.steps.map((s) => ({
        ...s,
        players: s.players.map((pl) => ({ ...pl })),
        drawings: s.drawings.map((d) => ({
          ...d,
          points: d.points.map((pt) => ({ ...pt })),
        })),
      })),
    })),
    plans: SAMPLE_PLANS.map((plan) => ({
      ...plan,
      blocks: plan.blocks.map((b) => ({ ...b })),
    })),
  };
}

export function emptyPlay(id: string): Play {
  return {
    id,
    name: "New set play or drill",
    court: "half",
    tags: [],
    note: "",
    updatedAt: Date.now(),
    useRosterNames: false,
    rosterLabel: "number",
    rosterSlots: {},
    steps: [
      {
        id: uid("st"),
        players: [],
        drawings: [],
        note: "",
        ballId: undefined,
      },
    ],
  };
}

export function emptyPlan(
  id: string,
  targetMinutes: number,
  date: string,
): PracticePlan {
  return {
    id,
    name: "New practice",
    date,
    targetMinutes,
    blocks: [],
    updatedAt: Date.now(),
  };
}

export function youth90Template(playId?: string) {
  return [
    {
      title: "Dynamic warmup",
      minutes: 10,
      type: "warmup" as const,
      notes: "Jog, skips, closeouts, two-line layups.",
      equipment: "Cones",
      cue: "Talk on every closeout.",
    },
    {
      title: "Ball-handling series",
      minutes: 12,
      type: "drill" as const,
      notes: "Pound series, on-move Crossover / between, weak-hand finish.",
      equipment: "1 ball each",
      cue: "Eyes up.",
    },
    {
      title: "Shooting",
      minutes: 15,
      type: "drill" as const,
      notes: "Form, then 5-spot. Track makes.",
      equipment: "2 balls per pair",
      cue: "Hold the follow-through.",
    },
    {
      title: playId ? "Play install" : "Play install",
      minutes: 20,
      type: "play review" as const,
      notes: "Walk-through, 5-on-0, then live.",
      playId,
      cue: "Walk it. Then live.",
    },
    {
      title: "Breakdown",
      minutes: 15,
      type: "teaching" as const,
      notes: "4-on-4 help and recover. Teach the extra pass.",
      cue: "See both — man and ball.",
    },
    {
      title: "Scrimmage",
      minutes: 12,
      type: "scrimmage" as const,
      notes: "Stop for the cue. Keep score.",
      cue: "Call the set live.",
    },
    {
      title: "Cooldown",
      minutes: 6,
      type: "cooldown" as const,
      notes: "Free throws, then stretch.",
      equipment: "1 ball per pair",
    },
  ];
}
