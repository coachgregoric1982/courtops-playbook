import type { Play, Player, RosterPlayer, SlotN } from "./types";
import { uid } from "./utils";

export type CsvError = { row: number; message: string };

const SLOTS: SlotN[] = [1, 2, 3, 4, 5];

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else q = false;
      } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function headerIndex(cells: string[]): {
  number: number;
  name: number;
  position: number;
} | null {
  const lower = cells.map((c) => c.replace(/^\uFEFF/, "").trim().toLowerCase());
  const number = lower.findIndex((c) => c === "number" || c === "no" || c === "#");
  const name = lower.findIndex((c) => c === "name" || c === "player");
  const position = lower.findIndex(
    (c) => c === "position" || c === "pos" || c === "spot",
  );
  if (number < 0 || name < 0 || position < 0) return null;
  return { number, name, position };
}

function validNumber(n: string): boolean {
  if (!/^\d{1,2}$/.test(n)) return false;
  const v = Number(n);
  return v >= 0 && v <= 99;
}

export function parseRosterCsv(text: string): {
  players: RosterPlayer[];
  errors: CsvError[];
} {
  const errors: CsvError[] = [];
  const players: RosterPlayer[] = [];
  const raw = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = raw.split("\n");
  if (!lines.length || lines.every((l) => !l.trim())) {
    return { players, errors: [{ row: 1, message: "File is empty" }] };
  }
  let headerRow = 0;
  while (headerRow < lines.length && !lines[headerRow].trim()) headerRow += 1;
  if (headerRow >= lines.length) {
    return { players, errors: [{ row: 1, message: "File is empty" }] };
  }
  const idx = headerIndex(parseCsvLine(lines[headerRow]));
  if (!idx) {
    return {
      players,
      errors: [
        {
          row: headerRow + 1,
          message: "Need a header row with columns number, name, position",
        },
      ],
    };
  }
  for (let i = headerRow + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const number = (cells[idx.number] ?? "").trim();
    const name = (cells[idx.name] ?? "").trim();
    const position = (cells[idx.position] ?? "").trim();
    const row = i + 1;
    if (!number && !name && !position) continue;
    const problems: string[] = [];
    if (!validNumber(number)) problems.push("number must be 0–99");
    if (!name) problems.push("missing name");
    if (name.length > 40) problems.push("name is too long");
    if (position.length > 12) problems.push("position is too long");
    if (problems.length) {
      errors.push({ row, message: problems.join("; ") });
      continue;
    }
    players.push({
      id: uid("rp"),
      number,
      name,
      position,
    });
  }
  if (!players.length && !errors.length) {
    errors.push({ row: headerRow + 1, message: "No player rows found" });
  }
  return { players, errors };
}

export function rosterToCsv(roster: RosterPlayer[]): string {
  const lines = ["number,name,position"];
  for (const p of roster) {
    const name = /[",\n]/.test(p.name) ? `"${p.name.replace(/"/g, '""')}"` : p.name;
    lines.push(`${p.number},${name},${p.position}`);
  }
  return `${lines.join("\n")}\n`;
}

export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 8);
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export function labelForPlayer(
  player: Player,
  play: Play,
  roster: RosterPlayer[],
): string {
  if (player.side !== "offense" || !play.useRosterNames) return String(player.n);
  const id = play.rosterSlots?.[player.n];
  const rp =
    (id ? roster.find((r) => r.id === id) : undefined) ??
    roster.find((r) => r.number === String(player.n));
  if (!rp) return String(player.n);
  if (play.rosterLabel === "name") {
    const s = shortName(rp.name);
    if (s.length <= 5) return s;
    return rp.number || String(player.n);
  }
  return rp.number || String(player.n);
}

export function makeLabeler(play: Play, roster: RosterPlayer[]) {
  return (p: Player) => labelForPlayer(p, play, roster);
}

export function defaultRosterSlots(
  roster: RosterPlayer[],
): Partial<Record<SlotN, string>> {
  const slots: Partial<Record<SlotN, string>> = {};
  roster.slice(0, 5).forEach((r, i) => {
    slots[SLOTS[i]] = r.id;
  });
  return slots;
}

export const SLOT_LIST = SLOTS;
