import type {
  CourtType,
  Drawing,
  Player,
  PlayStep,
  Point,
} from "./types";

export const THEME = {
  woodA: "#2a1c12",
  woodB: "#23180f",
  woodC: "#331f14",
  paint: "rgba(92, 48, 28, 0.45)",
  line: "#e6d7b8",
  lineDim: "rgba(230, 215, 184, 0.4)",
  hoop: "#d4a017",
  net: "rgba(244, 241, 234, 0.75)",
  rim: "#c45c4a",
  offense: "#e8b84a",
  offenseInk: "#140e04",
  defense: "#4a8fb8",
  defenseInk: "#071018",
  pass: "#e07040",
  dribble: "#f4f1ea",
  cut: "#f4f1ea",
  screen: "#d4a017",
  shot: "#e07060",
  handoff: "#f4f1ea",
  select: "#f4f1ea",
  ball: "#c45c2a",
  ballSeam: "#1a1008",
  handle: "#f4f1ea",
} as const;

type CourtTheme = { [K in keyof typeof THEME]: string };

const PRINT_THEME: CourtTheme = {
  woodA: "#ffffff",
  woodB: "#f4f4f4",
  woodC: "#ffffff",
  paint: "rgba(0, 0, 0, 0.06)",
  line: "#111111",
  lineDim: "rgba(17, 17, 17, 0.35)",
  hoop: "#111111",
  net: "rgba(17, 17, 17, 0.55)",
  rim: "#111111",
  offense: "#111111",
  offenseInk: "#ffffff",
  defense: "#ffffff",
  defenseInk: "#111111",
  pass: "#c45c18",
  dribble: "#111111",
  cut: "#111111",
  screen: "#111111",
  shot: "#111111",
  handoff: "#111111",
  select: "#111111",
  ball: "#ffffff",
  ballSeam: "#111111",
  handle: "#111111",
};

let currentTheme: CourtTheme = THEME;

function withTheme<T>(print: boolean | undefined, fn: () => T): T {
  const prev = currentTheme;
  currentTheme = print ? PRINT_THEME : THEME;
  try {
    return fn();
  } finally {
    currentTheme = prev;
  }
}

/** FIBA meters */
const F = {
  length: 28,
  width: 15,
  half: 14,
  basket: 1.575,
  threeR: 6.75,
  corner: 0.9,
  keyW: 4.9,
  keyL: 5.8,
  ftR: 1.8,
  noCharge: 1.25,
  ccR: 1.8,
  bbW: 1.8,
  bbFromBase: 1.2,
  rimR: 0.225,
};

export type Layout = {
  type: CourtType;
  ox: number;
  oy: number;
  cw: number;
  ch: number;
  toX: (nx: number) => number;
  toY: (ny: number) => number;
  fromX: (px: number) => number;
  fromY: (py: number) => number;
  mX: (meters: number) => number;
  mY: (meters: number) => number;
};

export function layoutFor(
  type: CourtType,
  w: number,
  h: number,
  pad = 10,
): Layout {
  const innerW = Math.max(1, w - pad * 2);
  const innerH = Math.max(1, h - pad * 2);
  const aspect = type === "half" ? 15 / 14 : 28 / 15;
  let cw: number;
  let ch: number;
  if (innerW / innerH > aspect) {
    ch = innerH;
    cw = ch * aspect;
  } else {
    cw = innerW;
    ch = cw / aspect;
  }
  const ox = (w - cw) / 2;
  const oy = (h - ch) / 2;
  return {
    type,
    ox,
    oy,
    cw,
    ch,
    toX: (nx) => ox + nx * cw,
    toY: (ny) => oy + ny * ch,
    fromX: (px) => (px - ox) / cw,
    fromY: (py) => (py - oy) / ch,
    mX: (m) =>
      type === "half" ? ox + (m / 15) * cw : ox + (m / 28) * cw,
    mY: (m) =>
      type === "half" ? oy + (m / 14) * ch : oy + (m / 15) * ch,
  };
}

export function playerRadius(L: Layout): number {
  return Math.max(9, Math.min(14, Math.min(L.cw, L.ch) * 0.033));
}

export function hoopNorm(
  type: CourtType,
  nx = 0.5,
  ny = 0.5,
): Point {
  if (type === "half") return { x: 0.5, y: F.basket / 14 };
  if (nx < 0.5) return { x: F.basket / 28, y: 0.5 };
  return { x: 1 - F.basket / 28, y: 0.5 };
}

export function drawCourt(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  print = false,
): void {
  withTheme(print, () => {
    ctx.save();
    roundRect(ctx, L.ox, L.oy, L.cw, L.ch, 6);
    ctx.clip();
    drawWood(ctx, L, print);
    if (L.type === "half") drawHalf(ctx, L);
    else drawFull(ctx, L);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = currentTheme.line;
    ctx.lineWidth = Math.max(2, L.cw / 220);
    roundRect(ctx, L.ox, L.oy, L.cw, L.ch, 6);
    ctx.stroke();
    ctx.restore();
  });
}

function drawWood(ctx: CanvasRenderingContext2D, L: Layout, print: boolean) {
  const boards = L.type === "half" ? 15 : 28;
  const along = L.cw;
  const across = L.ch;
  const bw = along / boards;
  for (let i = 0; i < boards; i++) {
    const shade = i % 2 === 0 ? currentTheme.woodA : currentTheme.woodB;
    ctx.fillStyle = shade;
    ctx.fillRect(L.ox + i * bw, L.oy, bw + 0.5, across);
  }
  if (print) return;
  const g = ctx.createRadialGradient(
    L.ox + L.cw / 2,
    L.oy + L.ch / 2,
    Math.min(L.cw, L.ch) * 0.2,
    L.ox + L.cw / 2,
    L.oy + L.ch / 2,
    Math.max(L.cw, L.ch) * 0.72,
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = g;
  ctx.fillRect(L.ox, L.oy, L.cw, L.ch);
}

function lineW(L: Layout) {
  return Math.max(1.4, L.cw / 260);
}

function drawHalf(ctx: CanvasRenderingContext2D, L: Layout) {
  const X = (m: number) => L.mX(m);
  const Y = (m: number) => L.mY(m);
  const lw = lineW(L);
  ctx.strokeStyle = currentTheme.line;
  ctx.fillStyle = currentTheme.paint;
  ctx.lineWidth = lw;

  const keyLeft = 7.5 - F.keyW / 2;
  ctx.fillRect(X(keyLeft), Y(0), X(keyLeft + F.keyW) - X(keyLeft), Y(F.keyL) - Y(0));
  ctx.strokeRect(X(keyLeft), Y(0), X(keyLeft + F.keyW) - X(keyLeft), Y(F.keyL) - Y(0));

  const ftcx = X(7.5);
  const ftcy = Y(F.keyL);
  const ftr = (X(7.5 + F.ftR) - X(7.5));
  ctx.beginPath();
  ctx.arc(ftcx, ftcy, ftr, 0, Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.arc(ftcx, ftcy, ftr, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(X(0), Y(14));
  ctx.lineTo(X(15), Y(14));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(7.5), Y(14), X(7.5 + F.ccR) - X(7.5), Math.PI, 0, true);
  ctx.stroke();

  drawThreeHalf(ctx, L, X, Y);
  drawHoopHalf(ctx, L, X, Y);
}

function drawThreeHalf(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  X: (m: number) => number,
  Y: (m: number) => number,
) {
  const bx = 7.5;
  const by = F.basket;
  const dx = F.width / 2 - F.corner;
  const dy = Math.sqrt(F.threeR * F.threeR - dx * dx);
  const meetY = by + dy;
  ctx.strokeStyle = currentTheme.line;
  ctx.lineWidth = lineW(L);
  ctx.beginPath();
  ctx.moveTo(X(F.corner), Y(0));
  ctx.lineTo(X(F.corner), Y(meetY));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(X(15 - F.corner), Y(0));
  ctx.lineTo(X(15 - F.corner), Y(meetY));
  ctx.stroke();

  const cx = X(bx);
  const cy = Y(by);
  const r = X(bx + F.threeR) - X(bx);
  const aL = Math.atan2(Y(meetY) - cy, X(F.corner) - cx);
  const aR = Math.atan2(Y(meetY) - cy, X(15 - F.corner) - cx);
  ctx.beginPath();
  ctx.arc(cx, cy, r, aR, aL);
  ctx.stroke();
}

function drawHoopHalf(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  X: (m: number) => number,
  Y: (m: number) => number,
) {
  const lw = lineW(L);
  ctx.strokeStyle = currentTheme.line;
  ctx.lineWidth = lw + 1;
  ctx.beginPath();
  ctx.moveTo(X(7.5 - F.bbW / 2), Y(F.bbFromBase));
  ctx.lineTo(X(7.5 + F.bbW / 2), Y(F.bbFromBase));
  ctx.stroke();

  const cx = X(7.5);
  const cy = Y(F.basket);
  const ncr = X(7.5 + F.noCharge) - X(7.5);
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.arc(cx, cy, ncr, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - ncr, cy);
  ctx.lineTo(cx - ncr, Y(F.bbFromBase));
  ctx.moveTo(cx + ncr, cy);
  ctx.lineTo(cx + ncr, Y(F.bbFromBase));
  ctx.stroke();

  const rr = X(7.5 + F.rimR) - X(7.5);
  ctx.strokeStyle = currentTheme.rim;
  ctx.lineWidth = lw + 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = currentTheme.net;
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * (i + 0.5)) / 6 + Math.PI * 0.15;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    ctx.lineTo(cx + Math.cos(a) * rr * 0.3, cy + rr * 1.7);
    ctx.stroke();
  }
}

function drawFull(ctx: CanvasRenderingContext2D, L: Layout) {
  const X = (m: number) => L.mX(m);
  const Y = (m: number) => L.mY(m);
  const lw = lineW(L);
  ctx.strokeStyle = currentTheme.line;
  ctx.lineWidth = lw;

  ctx.beginPath();
  ctx.moveTo(X(14), Y(0));
  ctx.lineTo(X(14), Y(15));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(14), Y(7.5), X(14 + F.ccR) - X(14), 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(14), Y(7.5), Math.max(3, lw * 1.4), 0, Math.PI * 2);
  ctx.fillStyle = currentTheme.line;
  ctx.fill();

  drawEndFull(ctx, L, "left");
  drawEndFull(ctx, L, "right");
}

function drawEndFull(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  end: "left" | "right",
) {
  const X = (m: number) => L.mX(end === "left" ? m : 28 - m);
  const Y = (m: number) => L.mY(m);
  const lw = lineW(L);
  const keyTop = 7.5 - F.keyW / 2;
  ctx.fillStyle = currentTheme.paint;
  ctx.strokeStyle = currentTheme.line;
  ctx.lineWidth = lw;
  const x0 = X(0);
  const x1 = X(F.keyL);
  ctx.fillRect(
    Math.min(x0, x1),
    Y(keyTop),
    Math.abs(x1 - x0),
    Y(keyTop + F.keyW) - Y(keyTop),
  );
  ctx.strokeRect(
    Math.min(x0, x1),
    Y(keyTop),
    Math.abs(x1 - x0),
    Y(keyTop + F.keyW) - Y(keyTop),
  );

  const ftcx = X(F.keyL);
  const ftcy = Y(7.5);
  const ftr = Math.abs(X(F.keyL + F.ftR) - X(F.keyL));
  const facing = end === "left" ? 0 : Math.PI;
  ctx.beginPath();
  ctx.arc(ftcx, ftcy, ftr, facing - Math.PI / 2, facing + Math.PI / 2);
  ctx.stroke();
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.arc(ftcx, ftcy, ftr, facing + Math.PI / 2, facing - Math.PI / 2);
  ctx.stroke();
  ctx.restore();

  const bx = F.basket;
  const by = 7.5;
  const dx = F.width / 2 - F.corner;
  const dy = Math.sqrt(F.threeR * F.threeR - dx * dx);
  const meet = bx + dy;
  ctx.beginPath();
  ctx.moveTo(X(0), Y(F.corner));
  ctx.lineTo(X(meet), Y(F.corner));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(X(0), Y(15 - F.corner));
  ctx.lineTo(X(meet), Y(15 - F.corner));
  ctx.stroke();

  const cx = X(bx);
  const cy = Y(by);
  const r = Math.abs(X(bx + F.threeR) - X(bx));
  const a1 = Math.atan2(Y(F.corner) - cy, X(meet) - cx);
  const a2 = Math.atan2(Y(15 - F.corner) - cy, X(meet) - cx);
  ctx.beginPath();
  if (end === "left") ctx.arc(cx, cy, r, a1, a2);
  else ctx.arc(cx, cy, r, a2, a1);
  ctx.stroke();

  ctx.lineWidth = lw + 1;
  ctx.beginPath();
  ctx.moveTo(X(F.bbFromBase), Y(7.5 - F.bbW / 2));
  ctx.lineTo(X(F.bbFromBase), Y(7.5 + F.bbW / 2));
  ctx.stroke();

  const ncr = Math.abs(X(bx + F.noCharge) - X(bx));
  ctx.lineWidth = lw;
  ctx.beginPath();
  if (end === "left") ctx.arc(cx, cy, ncr, -Math.PI / 2, Math.PI / 2);
  else ctx.arc(cx, cy, ncr, Math.PI / 2, -Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - ncr);
  ctx.lineTo(X(F.bbFromBase), cy - ncr);
  ctx.moveTo(cx, cy + ncr);
  ctx.lineTo(X(F.bbFromBase), cy + ncr);
  ctx.stroke();

  const rr = Math.abs(X(bx + F.rimR) - X(bx));
  ctx.strokeStyle = currentTheme.rim;
  ctx.lineWidth = lw + 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function lerpPlayers(
  from: Player[],
  to: Player[],
  t: number,
  drawings?: Drawing[],
): Player[] {
  const e = easeInOut(t);
  return to.map((p) => {
    const src = from.find((q) => q.side === p.side && q.n === p.n);
    if (!src) return p;
    const path = drawings ? moveDrawingFor(src, drawings) : undefined;
    if (path) {
      const dest = path.points[path.points.length - 1];
      if (Math.hypot(dest.x - p.x, dest.y - p.y) < 0.1) {
        const pt = pointOnDrawing(path, e);
        return { ...p, x: pt.x, y: pt.y };
      }
    }
    return {
      ...p,
      x: src.x + (p.x - src.x) * e,
      y: src.y + (p.y - src.y) * e,
    };
  });
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function dist2(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function nearestPlayer(players: Player[], pt: Point, max = 0.2): Player | undefined {
  let best: Player | undefined;
  let bestD = max * max;
  for (const p of players) {
    const d = dist2(p, pt);
    if (d <= bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

function moveDrawingFor(player: Player, drawings: Drawing[]): Drawing | undefined {
  return drawings.find(
    (d) =>
      (d.type === "cut" || d.type === "dribble" || d.type === "screen") &&
      d.points.length >= 2 &&
      dist2(d.points[0], player) <= 0.16 * 0.16,
  );
}

export function pointOnDrawing(d: Drawing, t: number): Point {
  const a = d.points[0];
  const b = d.points[d.points.length - 1];
  const u = Math.max(0, Math.min(1, t));
  if (d.points.length >= 3) {
    const c = d.points[1];
    const s = 1 - u;
    return {
      x: s * s * a.x + 2 * s * u * c.x + u * u * b.x,
      y: s * s * a.y + 2 * s * u * c.y + u * u * b.y,
    };
  }
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
}

/** Advance players/ball according to this step's drawings (cuts, dribbles, passes). */
export function applyStepMoves(step: PlayStep): { players: Player[]; ballId?: string } {
  const origin = step.players;
  const players = step.players.map((p) => ({ ...p }));
  let ballId = step.ballId ?? holderFor(step)?.id;
  for (const d of step.drawings) {
    if (d.points.length < 2) continue;
    const start = d.points[0];
    const end = d.points[d.points.length - 1];
    if (d.type === "cut" || d.type === "dribble" || d.type === "screen") {
      const who = nearestPlayer(origin, start, 0.2);
      const live = who ? players.find((p) => p.id === who.id) : undefined;
      if (live) {
        live.x = end.x;
        live.y = end.y;
      }
    } else if (d.type === "pass" || d.type === "handoff") {
      const recv = nearestPlayer(origin, end, 0.24) ?? nearestPlayer(players, end, 0.24);
      if (recv) ballId = recv.id;
    }
  }
  return { players, ballId };
}

export function lerpBallPos(
  from: PlayStep,
  to: PlayStep,
  t: number,
): Point | undefined {
  const fromH = holderFor(from);
  const toH = holderFor(to);
  if (!fromH && !toH) return undefined;
  const e = easeInOut(t);
  if (fromH && toH && t < 1) {
    if (fromH.n === toH.n && fromH.side === toH.side) {
      const drib = from.drawings.find(
        (d) =>
          (d.type === "dribble" || d.type === "handoff") &&
          d.points.length >= 2 &&
          dist2(d.points[0], fromH) <= 0.12 * 0.12,
      );
      if (drib) return pointOnDrawing(drib, e);
    }
    const pass = from.drawings.find(
      (d) =>
        (d.type === "pass" || d.type === "handoff") &&
        d.points.length >= 2 &&
        dist2(d.points[0], fromH) <= 0.16 * 0.16,
    );
    if (pass) return pointOnDrawing(pass, e);
    return {
      x: fromH.x + (toH.x - fromH.x) * e,
      y: fromH.y + (toH.y - fromH.y) * e,
    };
  }
  const h = toH ?? fromH;
  return h ? { x: h.x, y: h.y } : undefined;
}

export function drawDrawings(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  drawings: Drawing[],
  alpha = 1,
  print = false,
) {
  withTheme(print, () => {
    ctx.save();
    ctx.globalAlpha = alpha;
    for (const d of drawings) {
      if (d.points.length < 1) continue;
      if (d.type === "screen") drawScreen(ctx, L, d);
      else if (d.type === "shot") drawShot(ctx, L, d);
      else if (d.type === "handoff") drawHandoff(ctx, L, d);
      else drawPath(ctx, L, d);
    }
    ctx.restore();
  });
}

function pts(L: Layout, points: Point[]) {
  return points.map((p) => ({ x: L.toX(p.x), y: L.toY(p.y) }));
}

function quad(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

/** Pixel samples along a straight or quadratic drawing. */
export function pathPixels(L: Layout, d: Drawing): Point[] {
  const p = pts(L, d.points);
  if (p.length <= 2) return p;
  if (p.length > 3) return p;
  const a = p[0];
  const c = p[1];
  const b = p[2];
  const n = 28;
  const out: Point[] = [];
  for (let i = 0; i <= n; i++) out.push(quad(a, c, b, i / n));
  return out;
}

export function midNorm(d: Drawing): Point {
  if (d.points.length >= 3) return d.points[1];
  const a = d.points[0];
  const b = d.points[d.points.length - 1] ?? a;
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function strokeSmooth(ctx: CanvasRenderingContext2D, L: Layout, d: Drawing) {
  const p = pts(L, d.points);
  if (p.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);
  if (p.length === 2) ctx.lineTo(p[1].x, p[1].y);
  else if (p.length === 3) {
    ctx.quadraticCurveTo(p[1].x, p[1].y, p[2].x, p[2].y);
  } else {
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
  }
  ctx.stroke();
}

function drawPath(ctx: CanvasRenderingContext2D, L: Layout, d: Drawing) {
  const samples = pathPixels(L, d);
  if (samples.length < 2) return;
  const w = Math.max(2, L.cw / 180);
  const head = Math.max(13, L.cw / 24);
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (d.type === "pass") {
    ctx.strokeStyle = currentTheme.pass;
    ctx.setLineDash([7, 7]);
    strokeSmooth(ctx, L, d);
    ctx.setLineDash([]);
    arrowHead(ctx, samples, currentTheme.pass, head);
  } else if (d.type === "cut") {
    ctx.strokeStyle = currentTheme.cut;
    ctx.setLineDash([]);
    strokeSmooth(ctx, L, d);
    arrowHead(ctx, samples, currentTheme.cut, head);
  } else {
    ctx.strokeStyle = currentTheme.dribble;
    ctx.setLineDash([]);
    strokeZigzag(ctx, samples, Math.max(5, L.cw / 58));
    arrowHead(ctx, samples, currentTheme.dribble, head);
  }
}

function strokeZigzag(ctx: CanvasRenderingContext2D, p: Point[], amp: number) {
  const spaced: Point[] = [];
  let acc = 0;
  const step = Math.max(9, amp * 1.35);
  spaced.push(p[0]);
  for (let i = 1; i < p.length; i++) {
    let ax = p[i - 1].x;
    let ay = p[i - 1].y;
    const bx = p[i].x;
    const by = p[i].y;
    let dx = bx - ax;
    let dy = by - ay;
    let len = Math.hypot(dx, dy);
    while (len > 0.001) {
      const need = step - acc;
      if (len < need) {
        acc += len;
        break;
      }
      const t = need / len;
      ax += dx * t;
      ay += dy * t;
      spaced.push({ x: ax, y: ay });
      acc = 0;
      dx = bx - ax;
      dy = by - ay;
      len = Math.hypot(dx, dy);
    }
  }
  spaced.push(p[p.length - 1]);
  ctx.beginPath();
  for (let i = 0; i < spaced.length; i++) {
    const cur = spaced[i];
    const nxt = spaced[Math.min(i + 1, spaced.length - 1)];
    const dx = nxt.x - cur.x;
    const dy = nxt.y - cur.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len;
    const py = dx / len;
    const end = i === 0 || i === spaced.length - 1;
    const sign = i % 2 === 0 ? 1 : -1;
    const x = cur.x + (end ? 0 : px * amp * sign);
    const y = cur.y + (end ? 0 : py * amp * sign);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function arrowHead(
  ctx: CanvasRenderingContext2D,
  p: Point[],
  color: string,
  size: number,
) {
  if (p.length < 2) return;
  const a = p[p.length - 2];
  const b = p[p.length - 1];
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const spread = 0.52;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(
    b.x - size * Math.cos(ang - spread),
    b.y - size * Math.sin(ang - spread),
  );
  ctx.lineTo(
    b.x - size * Math.cos(ang + spread),
    b.y - size * Math.sin(ang + spread),
  );
  ctx.closePath();
  ctx.fill();
}

function endAngle(samples: Point[]): number {
  if (samples.length < 2) return 0;
  const b = samples[samples.length - 1];
  let a = samples[samples.length - 2];
  for (let i = samples.length - 2; i >= 0; i--) {
    if (Math.hypot(b.x - samples[i].x, b.y - samples[i].y) >= 10) {
      a = samples[i];
      break;
    }
  }
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function drawScreen(ctx: CanvasRenderingContext2D, L: Layout, d: Drawing) {
  const samples = pathPixels(L, d);
  const b = samples[samples.length - 1] ?? samples[0];
  const ang = endAngle(samples);
  const bar = Math.max(14, L.cw / 18);
  const w = Math.max(3, L.cw / 140);
  ctx.strokeStyle = currentTheme.screen;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = w;
  strokeSmooth(ctx, L, d);
  const px = Math.cos(ang + Math.PI / 2);
  const py = Math.sin(ang + Math.PI / 2);
  ctx.lineWidth = w + 1.4;
  ctx.beginPath();
  ctx.moveTo(b.x - px * bar * 0.5, b.y - py * bar * 0.5);
  ctx.lineTo(b.x + px * bar * 0.5, b.y + py * bar * 0.5);
  ctx.stroke();
}

function drawHandoff(ctx: CanvasRenderingContext2D, L: Layout, d: Drawing) {
  const samples = pathPixels(L, d);
  if (samples.length < 1) return;
  const b = samples[samples.length - 1];
  const ang = endAngle(samples);
  const w = Math.max(2.6, L.cw / 150);
  ctx.strokeStyle = currentTheme.handoff;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = w;
  strokeSmooth(ctx, L, d);
  const px = Math.cos(ang + Math.PI / 2);
  const py = Math.sin(ang + Math.PI / 2);
  const tx = Math.cos(ang);
  const ty = Math.sin(ang);
  const h = Math.max(16, L.cw / 15);
  const gap = Math.max(8, L.cw / 28);
  ctx.lineWidth = w + 1.1;
  ctx.beginPath();
  ctx.moveTo(b.x - tx * gap - px * h * 0.5, b.y - ty * gap - py * h * 0.5);
  ctx.lineTo(b.x - tx * gap + px * h * 0.5, b.y - ty * gap + py * h * 0.5);
  ctx.moveTo(b.x + tx * gap - px * h * 0.5, b.y + ty * gap - py * h * 0.5);
  ctx.lineTo(b.x + tx * gap + px * h * 0.5, b.y + ty * gap + py * h * 0.5);
  ctx.moveTo(b.x - tx * gap, b.y - ty * gap);
  ctx.lineTo(b.x + tx * gap, b.y + ty * gap);
  ctx.stroke();
}

function drawShot(ctx: CanvasRenderingContext2D, L: Layout, d: Drawing) {
  const hoop = hoopNorm(L.type, d.points[0].x, d.points[0].y);
  const base: Drawing =
    d.points.length >= 2
      ? d
      : { ...d, points: [d.points[0], hoop] };
  const p = pts(L, base.points);
  const a = p[0];
  const b = p[p.length - 1];
  ctx.strokeStyle = currentTheme.shot;
  ctx.lineWidth = Math.max(2, L.cw / 180);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  if (p.length >= 3) {
    ctx.quadraticCurveTo(p[1].x, p[1].y, b.x, b.y);
  } else {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - Math.max(18, L.ch / 14);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
  }
  ctx.stroke();
  arrowHead(ctx, pathPixels(L, base), currentTheme.shot, Math.max(13, L.cw / 24));
}

export function holderFor(step: PlayStep): Player | undefined {
  if (step.ballId) {
    const hit = step.players.find((p) => p.id === step.ballId);
    if (hit) return hit;
  }
  return (
    step.players.find((p) => p.side === "offense" && p.n === 1) ??
    step.players.find((p) => p.side === "offense")
  );
}

export function ballAnchor(
  L: Layout,
  nx: number,
  ny: number,
): { x: number; y: number; r: number } {
  const r = playerRadius(L);
  return {
    x: L.toX(nx) + r * 0.78,
    y: L.toY(ny) - r * 0.78,
    r: Math.max(4.2, r * 0.62),
  };
}

export function hitBall(
  step: PlayStep,
  L: Layout,
  px: number,
  py: number,
): Player | undefined {
  const holder = holderFor(step);
  if (!holder) return undefined;
  const a = ballAnchor(L, holder.x, holder.y);
  const hit = Math.max(18, a.r * 2.6);
  const dx = a.x - px;
  const dy = a.y - py;
  if (dx * dx + dy * dy <= hit * hit) return holder;
  return undefined;
}

export function drawBall(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  nx: number,
  ny: number,
  print = false,
  selected = false,
) {
  withTheme(print, () => {
    const a = ballAnchor(L, nx, ny);
    const { x, y, r: br } = a;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, br + 1, 0, Math.PI * 2);
    ctx.fillStyle = print ? "transparent" : "rgba(0,0,0,0.35)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, br, 0, Math.PI * 2);
    ctx.fillStyle = currentTheme.ball;
    ctx.fill();
    ctx.strokeStyle = currentTheme.ballSeam;
    ctx.lineWidth = Math.max(1, br * 0.22);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, br, 0, Math.PI * 2);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(x, y - br);
    ctx.lineTo(x, y + br);
    ctx.moveTo(x - br, y);
    ctx.quadraticCurveTo(x - br * 0.15, y, x + br, y);
    ctx.moveTo(x - br * 0.7, y - br * 0.55);
    ctx.quadraticCurveTo(x, y - br * 0.15, x + br * 0.7, y - br * 0.55);
    ctx.moveTo(x - br * 0.7, y + br * 0.55);
    ctx.quadraticCurveTo(x, y + br * 0.15, x + br * 0.7, y + br * 0.55);
    ctx.stroke();
    ctx.restore();
    if (selected && !print) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, br + 4, 0, Math.PI * 2);
      ctx.strokeStyle = currentTheme.select;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  });
}

export function drawMidHint(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  d: Drawing,
) {
  if (d.points.length < 2) return;
  const m = pts(L, [midNorm(d)])[0];
  ctx.save();
  ctx.beginPath();
  ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = currentTheme.screen;
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = currentTheme.handle;
  ctx.stroke();
  ctx.restore();
}

export function drawHandles(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  d: Drawing,
) {
  if (d.points.length < 2) return;
  const start = pts(L, [d.points[0]])[0];
  const end = pts(L, [d.points[d.points.length - 1]])[0];
  const mid = pts(L, [midNorm(d)])[0];
  const dot = (p: Point, r: number, fill: string, stroke: string, width: number) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  };
  ctx.save();
  dot(start, 5.5, currentTheme.woodA, currentTheme.handle, 1.8);
  dot(end, 5.5, currentTheme.woodA, currentTheme.handle, 1.8);
  ctx.beginPath();
  ctx.arc(mid.x, mid.y, 12, 0, Math.PI * 2);
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = currentTheme.screen;
  ctx.fill();
  ctx.globalAlpha = 1;
  dot(mid, 8, currentTheme.screen, currentTheme.handle, 2);
  ctx.restore();
}

export function hitHandle(
  d: Drawing,
  L: Layout,
  px: number,
  py: number,
): "start" | "mid" | "end" | null {
  const mid = midNorm(d);
  const spots: ["start" | "mid" | "end", Point, number][] = [
    ["mid", { x: L.toX(mid.x), y: L.toY(mid.y) }, 26],
    [
      "end",
      {
        x: L.toX(d.points[d.points.length - 1].x),
        y: L.toY(d.points[d.points.length - 1].y),
      },
      20,
    ],
    ["start", { x: L.toX(d.points[0].x), y: L.toY(d.points[0].y) }, 20],
  ];
  for (const [name, p, r] of spots) {
    const dx = p.x - px;
    const dy = p.y - py;
    if (dx * dx + dy * dy <= r * r) return name;
  }
  return null;
}

export function hitAnyHandle(
  drawings: Drawing[],
  L: Layout,
  px: number,
  py: number,
  selectedId?: string | null,
): { drawing: Drawing; which: "start" | "mid" | "end" } | null {
  const sel = selectedId
    ? drawings.find((d) => d.id === selectedId)
    : undefined;
  if (!sel || sel.points.length < 2) return null;
  const which = hitHandle(sel, L, px, py);
  if (which) return { drawing: sel, which };
  return null;
}

export function hitDrawing(
  drawings: Drawing[],
  L: Layout,
  px: number,
  py: number,
): Drawing | undefined {
  const thresh = 18;
  for (let i = drawings.length - 1; i >= 0; i--) {
    const d = drawings[i];
    const samples = pathPixels(L, d);
    for (let k = 1; k < samples.length; k++) {
      if (distToSeg(px, py, samples[k - 1], samples[k]) <= thresh) return d;
    }
  }
  return undefined;
}

function distToSeg(px: number, py: number, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - a.x) * dx + (py - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const x = a.x + dx * t;
  const y = a.y + dy * t;
  return Math.hypot(px - x, py - y);
}

export function setDrawingHandle(
  d: Drawing,
  which: "start" | "mid" | "end",
  pt: Point,
): Drawing {
  const a = d.points[0];
  const b = d.points[d.points.length - 1];
  if (which === "start") {
    if (d.points.length >= 3) return { ...d, points: [pt, d.points[1], b] };
    return { ...d, points: [pt, b] };
  }
  if (which === "end") {
    if (d.points.length >= 3) return { ...d, points: [a, d.points[1], pt] };
    return { ...d, points: [a, pt] };
  }
  return { ...d, points: [a, pt, b] };
}

export type PlayerDrawOpts = {
  selectedId?: string | null;
  labelFor?: (p: Player) => string;
  print?: boolean;
};

export function drawPlayers(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  players: Player[],
  opts?: string | null | PlayerDrawOpts,
) {
  const resolved: PlayerDrawOpts =
    opts && typeof opts === "object" ? opts : { selectedId: opts as string | null };
  withTheme(resolved.print, () => {
    const r = playerRadius(L);
    const ordered = [
      ...players.filter((p) => p.side === "defense"),
      ...players.filter((p) => p.side === "offense"),
    ];
    for (const p of ordered) {
      const x = L.toX(p.x);
      const y = L.toY(p.y);
      const fill = p.side === "offense" ? currentTheme.offense : currentTheme.defense;
      const ink = p.side === "offense" ? currentTheme.offenseInk : currentTheme.defenseInk;
      const label = resolved.labelFor?.(p) ?? String(p.n);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r + 1.2, 0, Math.PI * 2);
      ctx.fillStyle = resolved.print ? "transparent" : "rgba(0,0,0,0.35)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      if (p.side === "defense" || resolved.print) {
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = resolved.print ? "#111111" : "rgba(7,16,24,0.45)";
        ctx.stroke();
      }
      if (resolved.selectedId === p.id) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = currentTheme.select;
        ctx.stroke();
      }
      ctx.fillStyle = ink;
      const size = label.length > 2 ? Math.max(7, r * 0.78) : Math.max(8, r * 1.15);
      ctx.font = `600 ${Math.round(size)}px "Barlow Condensed", "Arial Narrow", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y + 0.4);
      ctx.restore();
    }
  });
}

export function hitPlayer(
  players: Player[],
  L: Layout,
  px: number,
  py: number,
): Player | undefined {
  const r = Math.max(20, playerRadius(L) * 2.4);
  const ordered = [
    ...players.filter((p) => p.side === "defense"),
    ...players.filter((p) => p.side === "offense"),
  ];
  for (let i = ordered.length - 1; i >= 0; i--) {
    const p = ordered[i];
    const dx = L.toX(p.x) - px;
    const dy = L.toY(p.y) - py;
    if (dx * dx + dy * dy <= r * r) return p;
  }
  return undefined;
}

export function drawStep(
  ctx: CanvasRenderingContext2D,
  L: Layout,
  step: PlayStep,
  opts?: {
    selectedId?: string | null;
    playerOverride?: Player[];
    labelFor?: (p: Player) => string;
    print?: boolean;
  },
) {
  withTheme(opts?.print, () => {
    drawCourt(ctx, L, opts?.print);
    drawDrawings(ctx, L, step.drawings, 1, opts?.print);
    const players = opts?.playerOverride ?? step.players;
    drawPlayers(ctx, L, players, {
      selectedId: opts?.selectedId,
      labelFor: opts?.labelFor,
      print: opts?.print,
    });
    const holder = holderFor({ ...step, players });
    if (holder) drawBall(ctx, L, holder.x, holder.y, opts?.print);
  });
}

export function snapshotStep(opts: {
  court: CourtType;
  step: PlayStep;
  w: number;
  h: number;
  print?: boolean;
  labelFor?: (p: Player) => string;
  pad?: number;
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = opts.w;
  canvas.height = opts.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.fillStyle = opts.print ? "#ffffff" : "#070b12";
  ctx.fillRect(0, 0, opts.w, opts.h);
  const L = layoutFor(opts.court, opts.w, opts.h, opts.pad ?? 12);
  drawStep(ctx, L, opts.step, { print: opts.print, labelFor: opts.labelFor });
  return canvas;
}

export function exportStepPng(
  playName: string,
  court: CourtType,
  step: PlayStep,
  stepIndex: number,
  extra?: {
    logoDataUrl?: string;
    teamName?: string;
    labelFor?: (p: Player) => string;
    accent?: string;
  },
): void {
  const w = court === "half" ? 1200 : 1400;
  const h = court === "half" ? 1120 : 760;
  const canvas = snapshotStep({
    court,
    step,
    w,
    h,
    pad: 48,
    labelFor: extra?.labelFor,
  });
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#f4f1ea";
  ctx.font = '600 28px "Barlow Condensed", sans-serif';
  ctx.textAlign = "left";
  const titleX = extra?.logoDataUrl || extra?.teamName ? 92 : 36;
  ctx.fillText(playName.toUpperCase(), titleX, 32);
  ctx.fillStyle = extra?.accent ?? "#d4a017";
  ctx.font = '500 18px "DM Sans", sans-serif';
  ctx.fillText(`Step ${stepIndex + 1}  ·  CourtOps`, 36, h - 18);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a");
    const safe = playName.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
    a.href = URL.createObjectURL(blob);
    a.download = `${safe || "play"}-step-${stepIndex + 1}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");
}
