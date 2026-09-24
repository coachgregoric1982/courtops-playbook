const DEFAULT = "#d4a017";

export function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function lum(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function toHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function mix(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

export function normalizeAccent(hex: string): string {
  const rgb = parseHex(hex) ?? parseHex(DEFAULT)!;
  if (lum(rgb.r, rgb.g, rgb.b) < 0.14) {
    const lifted = mix(rgb, { r: 255, g: 255, b: 255 }, 0.42);
    return toHex(lifted.r, lifted.g, lifted.b);
  }
  return toHex(rgb.r, rgb.g, rgb.b);
}

export function paletteFrom(hex: string): {
  accent: string;
  accentFg: string;
  accent2: string;
} {
  const accent = normalizeAccent(hex);
  const rgb = parseHex(accent)!;
  const accentFg = lum(rgb.r, rgb.g, rgb.b) > 0.42 ? "#140e04" : "#f4f1ea";
  const lifted = mix(rgb, { r: 255, g: 245, b: 220 }, 0.32);
  return {
    accent,
    accentFg,
    accent2: toHex(lifted.r, lifted.g, lifted.b),
  };
}

export function applyBrandColor(hex: string): void {
  if (typeof document === "undefined") return;
  const p = paletteFrom(hex);
  const root = document.documentElement;
  root.style.setProperty("--color-accent", p.accent);
  root.style.setProperty("--color-accent-fg", p.accentFg);
  root.style.setProperty("--color-accent-2", p.accent2);
}

export function resizeLogoFile(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }
    if (file.size > 4_000_000) {
      reject(new Error("Image is too large"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("No canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

export function drawDefaultMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fill: string,
  ink = "#140e04",
): void {
  const cx = x + size / 2;
  ctx.save();
  roundClip(ctx, x, y, size, size, size * 0.22);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1.4, size / 16);
  ctx.lineCap = "round";
  const top = y + size * 0.22;
  const left = x + size * 0.18;
  const right = x + size * 0.82;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.stroke();
  const keyW = size * 0.3;
  const keyH = size * 0.28;
  ctx.strokeRect(cx - keyW / 2, top, keyW, keyH);
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.quadraticCurveTo(cx, y + size * 0.72, right, top);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, top + size * 0.07, size * 0.07, 0, Math.PI * 2);
  ctx.stroke();
  if (size >= 22) {
    ctx.fillStyle = ink;
    ctx.font = `700 ${Math.round(size * 0.22)}px "Barlow Condensed", "Arial Narrow", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CO", cx, y + size * 0.78);
  }
  ctx.restore();
}

export async function drawBrandMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  logoDataUrl: string | undefined,
  fill: string,
  ink = "#140e04",
): Promise<void> {
  if (logoDataUrl) {
    try {
      const img = await loadImage(logoDataUrl);
      ctx.save();
      roundClip(ctx, x, y, size, size, size * 0.12);
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
      return;
    } catch {
      /* fall through */
    }
  }
  drawDefaultMark(ctx, x, y, size, fill, ink);
}

function roundClip(
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
  ctx.clip();
}

export function defaultMarkSvg(fill: string, ink = "#140e04"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="${fill}"/><g fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"><path d="M12 14h40"/><rect x="22" y="14" width="20" height="18"/><path d="M12 14c0 24 40 24 40 0"/><circle cx="32" cy="18.5" r="3.4"/></g><text x="32" y="52" text-anchor="middle" font-size="13" font-family="Arial Narrow, sans-serif" font-weight="700" fill="${ink}">CO</text></svg>`;
}
