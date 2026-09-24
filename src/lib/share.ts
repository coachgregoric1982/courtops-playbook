import type {
  CourtType,
  Drawing,
  DrawType,
  Play,
  Player,
  PlayStep,
  PlayTag,
  RosterLabel,
  SlotN,
} from "./types";
import { PLAY_TAGS } from "./types";
import { uid } from "./utils";

export const SHARE_LIMIT = 6000;

const DRAW_TYPES: DrawType[] = ["pass", "dribble", "cut", "screen", "shot", "handoff"];

type Packed = {
  n: string;
  c: "h" | "f";
  t: string[];
  o: string;
  s: Array<{
    n: string;
    p: Array<[number, 0 | 1, number, number]>;
    d: Array<[number, number[]]>;
    b?: [number, 0 | 1];
  }>;
  r?: 1;
  l?: "n" | "a";
  m?: Record<string, string>;
};

function q(n: number) {
  return Math.round(n * 1000) / 1000;
}

function packPayload(play: Play): Packed {
  return {
    n: play.name,
    c: play.court === "full" ? "f" : "h",
    t: play.tags,
    o: play.note,
    s: play.steps.map((st) => {
      const holder = st.players.find((p) => p.id === st.ballId);
      const packed: Packed["s"][number] = {
        n: st.note,
        p: st.players.map(
          (pl) =>
            [pl.n, pl.side === "defense" ? 1 : 0, q(pl.x), q(pl.y)] as [
              number,
              0 | 1,
              number,
              number,
            ],
        ),
        d: st.drawings.map((d) => [
          DRAW_TYPES.indexOf(d.type),
          d.points.flatMap((pt) => [q(pt.x), q(pt.y)]),
        ]),
      };
      if (holder) packed.b = [holder.n, holder.side === "defense" ? 1 : 0];
      return packed;
    }),
    r: play.useRosterNames ? 1 : undefined,
    l: play.rosterLabel === "name" ? "a" : play.useRosterNames ? "n" : undefined,
    m: play.rosterSlots && Object.keys(play.rosterSlots).length
      ? (play.rosterSlots as Record<string, string>)
      : undefined,
  };
}

function unpackPayload(raw: Packed): Play {
  const tags = (raw.t ?? []).filter((t): t is PlayTag =>
    (PLAY_TAGS as readonly string[]).includes(t),
  );
  const steps: PlayStep[] = (raw.s ?? []).map((st) => {
    const players: Player[] = (st.p ?? [])
      .map((row): Player | null => {
        const n = row[0] as 1 | 2 | 3 | 4 | 5;
        if (![1, 2, 3, 4, 5].includes(n)) return null;
        return {
          id: uid(row[1] ? "d" : "o"),
          n,
          side: row[1] ? "defense" : "offense",
          x: Number(row[2]) || 0,
          y: Number(row[3]) || 0,
        };
      })
      .filter((p): p is Player => !!p);
    const drawings = (st.d ?? [])
      .map((row): Drawing | null => {
        const type = DRAW_TYPES[row[0]];
        const pts = row[1] ?? [];
        if (!type || pts.length < 2) return null;
        const points = [];
        for (let i = 0; i + 1 < pts.length; i += 2) {
          points.push({ x: pts[i], y: pts[i + 1] });
        }
        return { id: uid("dr"), type, points };
      })
      .filter((d): d is Drawing => !!d);
    const ball = st.b
      ? players.find(
          (p) => p.n === st.b![0] && p.side === (st.b![1] ? "defense" : "offense"),
        )
      : players.find((p) => p.side === "offense" && p.n === 1);
    return {
      id: uid("st"),
      note: st.n ?? "",
      players,
      drawings,
      ballId: ball?.id,
    };
  });
  const court: CourtType = raw.c === "f" ? "full" : "half";
  const rosterLabel: RosterLabel = raw.l === "a" ? "name" : "number";
  const rosterSlots: Play["rosterSlots"] = {};
  if (raw.m) {
    for (const [k, v] of Object.entries(raw.m)) {
      const n = Number(k) as SlotN;
      if ([1, 2, 3, 4, 5].includes(n) && v) rosterSlots[n] = v;
    }
  }
  return {
    id: uid("play"),
    name: raw.n || "Shared play",
    court,
    tags,
    note: raw.o ?? "",
    steps: steps.length ? steps : [{ id: uid("st"), players: [], drawings: [], note: "" }],
    updatedAt: Date.now(),
    useRosterNames: raw.r === 1,
    rosterLabel,
    rosterSlots,
  };
}

function bytesToB64url(bytes: Uint8Array): string {
  let s = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(b64: string): Uint8Array {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function gzipToB64(text: string): Promise<string> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  const buf = await new Response(stream).arrayBuffer();
  return bytesToB64url(new Uint8Array(buf));
}

async function gunzipFromB64(b64: string): Promise<string> {
  const bytes = b64urlToBytes(b64);
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const stream = new Blob([ab]).stream().pipeThrough(
    new DecompressionStream("gzip"),
  );
  const buf = await new Response(stream).arrayBuffer();
  return new TextDecoder().decode(buf);
}

function rawToB64(text: string): string {
  return bytesToB64url(new TextEncoder().encode(text));
}

function rawFromB64(b64: string): string {
  return new TextDecoder().decode(b64urlToBytes(b64));
}

export function shareBase(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.origin}${window.location.pathname.replace(/\/(playbook|practices|settings).*$/, "/")}`;
}

export async function packPlay(
  play: Play,
): Promise<{ url: string; tooLong: boolean; payload: string }> {
  const json = JSON.stringify(packPayload(play));
  let payload = `r1.${rawToB64(json)}`;
  try {
    if (typeof CompressionStream !== "undefined") {
      payload = `h1.${await gzipToB64(json)}`;
    }
  } catch {
    payload = `r1.${rawToB64(json)}`;
  }
  const url = `${shareBase()}#hp=${payload}`;
  return { url, tooLong: url.length > SHARE_LIMIT, payload };
}

export async function unpackPlay(payload: string): Promise<Play> {
  const trimmed = payload.trim();
  let json: string;
  if (trimmed.startsWith("h1.")) {
    json = await gunzipFromB64(trimmed.slice(3));
  } else if (trimmed.startsWith("r1.")) {
    json = rawFromB64(trimmed.slice(3));
  } else {
    json = rawFromB64(trimmed);
  }
  const raw = JSON.parse(json) as Packed;
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.s)) {
    throw new Error("Not a play");
  }
  return unpackPayload(raw);
}

export function readShareParam(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (hash.startsWith("#hp=")) return decodeURIComponent(hash.slice(4));
  const q = new URLSearchParams(window.location.search).get("hp");
  return q;
}

export function clearShareParam(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("hp");
  url.hash = "";
  window.history.replaceState(null, "", url.pathname + url.search);
}

export function playToJson(play: Play): string {
  return JSON.stringify(play, null, 2);
}

export function parsePlayFile(text: string): Play {
  const raw = JSON.parse(text) as Partial<Play>;
  if (!raw || typeof raw !== "object") throw new Error("Not a play file");
  if (!Array.isArray(raw.steps)) throw new Error("Play is missing steps");
  const court: CourtType = raw.court === "full" ? "full" : "half";
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is PlayTag => (PLAY_TAGS as readonly string[]).includes(t))
    : [];
  const steps: PlayStep[] = raw.steps.map((st) => {
    const players = Array.isArray(st.players)
      ? st.players
          .filter((p) => p && [1, 2, 3, 4, 5].includes(p.n))
          .map((p) => ({
            id: uid(p.side === "defense" ? "d" : "o"),
            n: p.n as 1 | 2 | 3 | 4 | 5,
            side: (p.side === "defense" ? "defense" : "offense") as Player["side"],
            x: Number(p.x) || 0,
            y: Number(p.y) || 0,
          }))
      : [];
    const srcBall = Array.isArray(st.players)
      ? st.players.find((p) => p && p.id === st.ballId)
      : undefined;
    const ballId = srcBall
      ? players.find((p) => p.n === srcBall.n && p.side === (srcBall.side === "defense" ? "defense" : "offense"))?.id
      : players.find((p) => p.side === "offense" && p.n === 1)?.id;
    return {
      id: uid("st"),
      note: typeof st.note === "string" ? st.note : "",
      players,
      drawings: Array.isArray(st.drawings)
        ? st.drawings
            .filter((d) => d && DRAW_TYPES.includes(d.type) && Array.isArray(d.points))
            .map((d) => ({
              id: uid("dr"),
              type: d.type,
              points: d.points.map((pt) => ({ x: Number(pt.x) || 0, y: Number(pt.y) || 0 })),
            }))
        : [],
      ballId,
    };
  });
  return {
    id: uid("play"),
    name: typeof raw.name === "string" && raw.name ? raw.name : "Imported play",
    court,
    tags,
    note: typeof raw.note === "string" ? raw.note : "",
    steps: steps.length ? steps : [{ id: uid("st"), players: [], drawings: [], note: "" }],
    updatedAt: Date.now(),
    useRosterNames: !!raw.useRosterNames,
    rosterLabel: raw.rosterLabel === "name" ? "name" : "number",
    rosterSlots: raw.rosterSlots ?? {},
  };
}
