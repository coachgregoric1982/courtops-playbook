import { create } from "zustand";
import {
  emptyPlan,
  emptyPlay,
  getInitialData,
  INITIAL_SETTINGS,
  SAMPLE_ROSTER,
  youth90Template,
} from "./samples";
import type {
  AppData,
  Play,
  PlayTag,
  PracticeBlock,
  PracticePlan,
  RosterPlayer,
  Settings,
} from "./types";
import { detectLocale, isLocale } from "./i18n";
import { todayISO, uid } from "./utils";

const KEY = "hoopplaybook.v1";

function persist(data: AppData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

function normalizeSettings(raw: Partial<Settings> | undefined): Settings {
  const roster: RosterPlayer[] = Array.isArray(raw?.roster)
    ? raw!.roster.filter((r) => r && typeof r.name === "string").map((r) => ({
        id: r.id || uid("rp"),
        number: String(r.number ?? ""),
        name: r.name,
        position: String(r.position ?? ""),
      }))
    : SAMPLE_ROSTER.map((r) => ({ ...r }));
  return {
    teamName: raw?.teamName ?? INITIAL_SETTINGS.teamName,
    shortClubName: raw?.shortClubName ?? INITIAL_SETTINGS.shortClubName,
    ageGroup: raw?.ageGroup ?? INITIAL_SETTINGS.ageGroup,
    defaultPracticeMinutes:
      raw?.defaultPracticeMinutes ?? INITIAL_SETTINGS.defaultPracticeMinutes,
    primaryColor: raw?.primaryColor ?? INITIAL_SETTINGS.primaryColor,
    logoDataUrl: raw?.logoDataUrl ?? "",
    roster,
    locale: isLocale(raw?.locale) ? raw.locale : detectLocale(),
  };
}

function normalizePlay(play: Play): Play {
  return {
    ...play,
    useRosterNames: !!play.useRosterNames,
    rosterLabel: play.rosterLabel === "name" ? "name" : "number",
    rosterSlots: play.rosterSlots ?? {},
    steps: Array.isArray(play.steps)
      ? play.steps.map((s) => ({
          ...s,
          drawings: s.drawings ?? [],
          players: s.players ?? [],
          note: s.note ?? "",
          ballId: s.ballId,
        }))
      : [],
  };
}

function normalizePlan(plan: PracticePlan): PracticePlan {
  return {
    ...plan,
    blocks: (plan.blocks ?? []).map((b) => ({
      ...b,
      equipment: b.equipment ?? "",
      cue: b.cue ?? "",
    })),
  };
}

function readStorage(): AppData {
  const fallback = getInitialData();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      persist(fallback);
      return fallback;
    }
    const parsed = JSON.parse(raw) as Partial<AppData>;
    if (!Array.isArray(parsed.plays) || !Array.isArray(parsed.plans) || !parsed.settings) {
      persist(fallback);
      return fallback;
    }
    return {
      settings: normalizeSettings(parsed.settings),
      plays: parsed.plays.map((p) => normalizePlay(p as Play)),
      plans: parsed.plans.map((p) => normalizePlan(p as PracticePlan)),
    };
  } catch {
    persist(fallback);
    return fallback;
  }
}

type Store = AppData & {
  ready: boolean;
  hydrate: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setRoster: (roster: RosterPlayer[]) => void;
  createPlay: (name?: string) => string;
  savePlay: (play: Play) => void;
  deletePlay: (id: string) => void;
  duplicatePlay: (id: string) => string | null;
  importPlay: (play: Play) => string;
  createPlan: () => string;
  savePlan: (plan: PracticePlan) => void;
  deletePlan: (id: string) => void;
  duplicatePlan: (id: string) => string | null;
  buildYouth90: () => string;
};

const initial = getInitialData();

export const useAppStore = create<Store>((set, get) => ({
  ...initial,
  ready: false,
  hydrate: () => {
    const data = readStorage();
    persist(data);
    set({ ...data, ready: true });
  },
  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    persist({ settings, plays: get().plays, plans: get().plans });
    set({ settings });
  },
  setRoster: (roster) => {
    const settings = { ...get().settings, roster };
    persist({ settings, plays: get().plays, plans: get().plans });
    set({ settings });
  },
  createPlay: (name?: string) => {
    const play = emptyPlay(uid("play"));
    if (name?.trim()) play.name = name.trim();
    const plays = [play, ...get().plays];
    persist({ settings: get().settings, plays, plans: get().plans });
    set({ plays });
    return play.id;
  },
  savePlay: (play) => {
    const stamped = { ...play, updatedAt: Date.now() };
    const plays = get().plays.map((p) => (p.id === play.id ? stamped : p));
    if (!plays.some((p) => p.id === play.id)) plays.unshift(stamped);
    persist({ settings: get().settings, plays, plans: get().plans });
    set({ plays });
  },
  deletePlay: (id) => {
    const plays = get().plays.filter((p) => p.id !== id);
    const plans = get().plans.map((plan) => ({
      ...plan,
      blocks: plan.blocks.map((b) =>
        b.playId === id ? { ...b, playId: undefined } : b,
      ),
    }));
    persist({ settings: get().settings, plays, plans });
    set({ plays, plans });
  },
  duplicatePlay: (id) => {
    const src = get().plays.find((p) => p.id === id);
    if (!src) return null;
    const copy: Play = {
      ...src,
      id: uid("play"),
      name: `${src.name} (copy)`,
      updatedAt: Date.now(),
      tags: [...src.tags],
      rosterSlots: { ...src.rosterSlots },
      steps: src.steps.map((s) => ({
        ...s,
        id: uid("st"),
        players: s.players.map((pl) => ({ ...pl })),
        drawings: s.drawings.map((d) => ({
          ...d,
          id: uid("dr"),
          points: d.points.map((pt) => ({ ...pt })),
        })),
      })),
    };
    const plays = [copy, ...get().plays];
    persist({ settings: get().settings, plays, plans: get().plans });
    set({ plays });
    return copy.id;
  },
  importPlay: (play) => {
    const copy: Play = {
      ...normalizePlay(play),
      id: uid("play"),
      updatedAt: Date.now(),
    };
    const plays = [copy, ...get().plays];
    persist({ settings: get().settings, plays, plans: get().plans });
    set({ plays });
    return copy.id;
  },
  createPlan: () => {
    const plan = emptyPlan(
      uid("plan"),
      get().settings.defaultPracticeMinutes,
      todayISO(),
    );
    const plans = [plan, ...get().plans];
    persist({ settings: get().settings, plays: get().plays, plans });
    set({ plans });
    return plan.id;
  },
  savePlan: (plan) => {
    const stamped = { ...plan, updatedAt: Date.now() };
    const plans = get().plans.map((p) => (p.id === plan.id ? stamped : p));
    if (!plans.some((p) => p.id === plan.id)) plans.unshift(stamped);
    persist({ settings: get().settings, plays: get().plays, plans });
    set({ plans });
  },
  deletePlan: (id) => {
    const plans = get().plans.filter((p) => p.id !== id);
    persist({ settings: get().settings, plays: get().plays, plans });
    set({ plans });
  },
  duplicatePlan: (id) => {
    const src = get().plans.find((p) => p.id === id);
    if (!src) return null;
    const copy: PracticePlan = {
      ...src,
      id: uid("plan"),
      name: `${src.name} (copy)`,
      date: todayISO(),
      updatedAt: Date.now(),
      blocks: src.blocks.map((b) => ({ ...b, id: uid("bk") })),
    };
    const plans = [copy, ...get().plans];
    persist({ settings: get().settings, plays: get().plays, plans });
    set({ plans });
    return copy.id;
  },
  buildYouth90: () => {
    const firstPlay = get().plays[0]?.id;
    const blocks: PracticeBlock[] = youth90Template(firstPlay).map((b) => ({
      ...b,
      id: uid("bk"),
    }));
    const plan: PracticePlan = {
      id: uid("plan"),
      name: "90-min youth practice",
      date: todayISO(),
      targetMinutes: 90,
      blocks,
      updatedAt: Date.now(),
    };
    const plans = [plan, ...get().plans];
    persist({ settings: get().settings, plays: get().plays, plans });
    set({ plans });
    return plan.id;
  },
}));

export function planMinutes(plan: PracticePlan): number {
  return plan.blocks.reduce((sum, b) => sum + (Number(b.minutes) || 0), 0);
}

export function toggleTag(tags: PlayTag[], tag: PlayTag): PlayTag[] {
  return tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
}
