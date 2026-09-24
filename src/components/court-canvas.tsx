import { useCallback, useEffect, useRef } from "react";
import {
  drawBall,
  drawCourt,
  drawDrawings,
  drawHandles,
  drawPlayers,
  hitAnyHandle,
  hitBall,
  hitDrawing,
  hitPlayer,
  holderFor,
  hoopNorm,
  layoutFor,
  lerpBallPos,
  lerpPlayers,
  playerRadius,
  setDrawingHandle,
  THEME,
  type Layout,
} from "@/lib/court";
import type {
  CourtType,
  Drawing,
  DrawType,
  Player,
  PlayerSide,
  PlayStep,
  Point,
} from "@/lib/types";
import { uid } from "@/lib/utils";

export type Tool = "select" | "ball" | DrawType;

type Drag =
  | { kind: "player"; playerId: string }
  | { kind: "draw"; type: DrawType; start: Point; end: Point }
  | { kind: "handle"; drawingId: string; which: "start" | "mid" | "end" }
  | { kind: "ball"; nx: number; ny: number };

type Props = {
  court: CourtType;
  step: PlayStep;
  prevStep?: PlayStep | null;
  blend?: number;
  tool?: Tool;
  placeSide?: PlayerSide;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onChange?: (step: PlayStep) => void;
  onTool?: (tool: Tool) => void;
  className?: string;
  labelFor?: (p: Player) => string;
};

function clamp01(n: number) {
  return Math.max(0.02, Math.min(0.98, n));
}

function snapToPlayer(
  players: Player[],
  n: Point,
  L: Layout,
): Point {
  const r = playerRadius(L) * 1.85;
  let best: Player | undefined;
  let bestD = r * r;
  for (const p of players) {
    const dx = L.toX(p.x) - L.toX(n.x);
    const dy = L.toY(p.y) - L.toY(n.y);
    const d = dx * dx + dy * dy;
    if (d <= bestD) {
      bestD = d;
      best = p;
    }
  }
  return best ? { x: best.x, y: best.y } : n;
}

function nearestPlayer(
  players: Player[],
  n: Point,
  L: Layout,
): Player | undefined {
  let best: Player | undefined;
  let bestD = Infinity;
  for (const p of players) {
    const dx = L.toX(p.x) - L.toX(n.x);
    const dy = L.toY(p.y) - L.toY(n.y);
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

export function CourtCanvas({
  court,
  step,
  prevStep,
  blend = 1,
  tool = "select",
  placeSide = "offense",
  interactive = false,
  selectedId,
  onSelect,
  onChange,
  onTool,
  className,
  labelFor,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutRef = useRef<Layout | null>(null);
  const floorRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const previewRef = useRef<Drawing | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const sideRef = useRef(placeSide);
  sideRef.current = placeSide;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const skipTapRef = useRef(0);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 2 || h < 2) return;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      floorRef.current = null;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const L = layoutFor(court, w, h, 8);
    layoutRef.current = L;

    if (
      !floorRef.current ||
      floorRef.current.width !== canvas.width ||
      floorRef.current.height !== canvas.height
    ) {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d");
      if (octx) {
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawCourt(octx, L);
        floorRef.current = off;
      }
    }
    if (floorRef.current) ctx.drawImage(floorRef.current, 0, 0, w, h);

    const t = blend;
    const drawings =
      prevStep && t < 0.55 ? prevStep.drawings : step.drawings;
    const alpha = prevStep && t < 0.55 ? 1 - t * 0.4 : t < 1 ? 0.55 + t * 0.45 : 1;
    drawDrawings(ctx, L, drawings, alpha);
    if (previewRef.current) {
      drawDrawings(ctx, L, [previewRef.current], 0.95);
      const s = previewRef.current.points[0];
      ctx.beginPath();
      ctx.arc(L.toX(s.x), L.toY(s.y), 4.5, 0, Math.PI * 2);
      ctx.fillStyle = THEME.handle;
      ctx.fill();
    }
    const players =
      prevStep && t < 1
        ? lerpPlayers(prevStep.players, step.players, t, prevStep.drawings)
        : step.players;
    drawPlayers(ctx, L, players, { selectedId, labelFor });

    const drag = dragRef.current;
    if (drag?.kind === "ball") {
      drawBall(ctx, L, drag.nx, drag.ny, false, true);
    } else if (prevStep && t < 1) {
      const bp = lerpBallPos(prevStep, step, t);
      if (bp) drawBall(ctx, L, bp.x, bp.y);
    } else {
      const bp = lerpBallPos(step, step, 1);
      if (bp) {
        const holder = holderFor(step);
        drawBall(
          ctx,
          L,
          bp.x,
          bp.y,
          false,
          selectedId === "__ball__" || (!!holder && selectedId === holder.id),
        );
      }
    }

    if (interactive && selectedId) {
      const sel = step.drawings.find((d) => d.id === selectedId);
      if (sel) drawHandles(ctx, L, sel);
    }
  }, [blend, court, interactive, labelFor, prevStep, selectedId, step]);

  useEffect(() => {
    floorRef.current = null;
    paint();
  }, [court, paint]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => paint());
    ro.observe(wrap);
    paint();
    return () => ro.disconnect();
  }, [paint]);

  const eventPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const L = layoutRef.current;
    if (!canvas || !L) return null;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return { x, y, nx: clamp01(L.fromX(x)), ny: clamp01(L.fromY(y)), L };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const hit = eventPoint(e);
    if (!hit) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    if (performance.now() < skipTapRef.current) return;
    const cur = stepRef.current;
    const t = toolRef.current;
    const handle = hitAnyHandle(
      cur.drawings,
      hit.L,
      hit.x,
      hit.y,
      selectedRef.current,
    );

    if (t !== "select" && t !== "ball") {
      if (handle) {
        onSelect?.(handle.drawing.id);
        dragRef.current = {
          kind: "handle",
          drawingId: handle.drawing.id,
          which: handle.which,
        };
        return;
      }
      dragRef.current = {
        kind: "draw",
        type: t,
        start: { x: hit.nx, y: hit.ny },
        end: { x: hit.nx, y: hit.ny },
      };
      previewRef.current = {
        id: "preview",
        type: t,
        points: [
          { x: hit.nx, y: hit.ny },
          { x: hit.nx, y: hit.ny },
        ],
      };
      paint();
      return;
    }

    if (handle) {
      onSelect?.(handle.drawing.id);
      dragRef.current = {
        kind: "handle",
        drawingId: handle.drawing.id,
        which: handle.which,
      };
      return;
    }

    const ballHolder = hitBall(cur, hit.L, hit.x, hit.y);
    if (ballHolder) {
      onSelect?.("__ball__");
      dragRef.current = { kind: "ball", nx: hit.nx, ny: hit.ny };
      return;
    }

    if (t === "ball") {
      const player = hitPlayer(cur.players, hit.L, hit.x, hit.y);
      if (player) {
        onChange?.({ ...cur, ballId: player.id });
        onSelect?.(player.id);
      }
      return;
    }

    const player = hitPlayer(cur.players, hit.L, hit.x, hit.y);
    if (player) {
      dragRef.current = { kind: "player", playerId: player.id };
      onSelect?.(player.id);
      return;
    }

    const drawing = hitDrawing(cur.drawings, hit.L, hit.x, hit.y);
    if (drawing) {
      onSelect?.(drawing.id);
      return;
    }

    onSelect?.(null);
    const side = sideRef.current;
    const count = cur.players.filter((p) => p.side === side).length;
    if (count < 5) {
      const used = new Set(
        cur.players.filter((p) => p.side === side).map((p) => p.n),
      );
      const n = ([1, 2, 3, 4, 5] as const).find((k) => !used.has(k)) ?? 1;
      const next: Player = {
        id: uid(side === "offense" ? "o" : "d"),
        n,
        side,
        x: hit.nx,
        y: hit.ny,
      };
      const ballId =
        cur.ballId ??
        (side === "offense" && n === 1 ? next.id : cur.ballId);
      onChange?.({ ...cur, players: [...cur.players, next], ballId });
      onSelect?.(next.id);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || !dragRef.current) return;
    const hit = eventPoint(e);
    if (!hit) return;
    const cur = stepRef.current;
    const drag = dragRef.current;
    if (drag.kind === "player") {
      onChange?.({
        ...cur,
        players: cur.players.map((p) =>
          p.id === drag.playerId ? { ...p, x: hit.nx, y: hit.ny } : p,
        ),
      });
      return;
    }
    if (drag.kind === "handle") {
      const pt = { x: hit.nx, y: hit.ny };
      onChange?.({
        ...cur,
        drawings: cur.drawings.map((d) =>
          d.id === drag.drawingId ? setDrawingHandle(d, drag.which, pt) : d,
        ),
      });
      return;
    }
    if (drag.kind === "ball") {
      drag.nx = hit.nx;
      drag.ny = hit.ny;
      paint();
      return;
    }
    drag.end = { x: hit.nx, y: hit.ny };
    previewRef.current = {
      id: "preview",
      type: drag.type,
      points: [drag.start, drag.end],
    };
    paint();
  };

  const onPointerUp = () => {
    if (!interactive || !dragRef.current) return;
    const drag = dragRef.current;
    dragRef.current = null;
    previewRef.current = null;
    const cur = stepRef.current;
    const L = layoutRef.current;
    if (drag.kind === "ball") {
      const n = { x: drag.nx, y: drag.ny };
      const target = L ? nearestPlayer(cur.players, n, L) : undefined;
      if (target) {
        onChange?.({ ...cur, ballId: target.id });
        onSelect?.(target.id);
      }
      paint();
      return;
    }
    if (drag.kind !== "draw") {
      paint();
      return;
    }
    let start = drag.start;
    let end = drag.end;
    if (L) {
      start = snapToPlayer(cur.players, start, L);
      end = snapToPlayer(cur.players, end, L);
    }
    const dist = Math.hypot(end.x - start.x, end.y - start.y);
    if (drag.type === "shot" && dist < 0.03) {
      end = hoopNorm(court, start.x, start.y);
    } else if (dist < 0.02) {
      const tap = L
        ? hitDrawing(cur.drawings, L, L.toX(end.x), L.toY(end.y))
        : undefined;
      if (tap) {
        onSelect?.(tap.id);
        onTool?.("select");
      }
      paint();
      return;
    }
    const drawing: Drawing = {
      id: uid("dr"),
      type: drag.type,
      points:
        drag.type === "shot"
          ? [
              start,
              {
                x: (start.x + end.x) / 2,
                y: Math.min(start.y, end.y) - 0.08,
              },
              end,
            ]
          : [start, end],
    };
    onChange?.({ ...cur, drawings: [...cur.drawings, drawing] });
    onSelect?.(null);
    onTool?.("select");
    skipTapRef.current = performance.now() + 400;
    paint();
  };

  return (
    <div
      ref={wrapRef}
      className={
        className ??
        (court === "half" ? "relative aspect-half w-full" : "relative aspect-full w-full")
      }
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-none rounded-lg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerCancel={onPointerUp}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}
