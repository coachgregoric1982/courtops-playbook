import { drawBrandMark, defaultMarkSvg, normalizeAccent } from "./brand";
import { snapshotStep } from "./court";
import type { Play, Player, PlayStep, PracticePlan, Settings } from "./types";
import { downloadBlob, escHtml, formatDateLabel, slugFile } from "./utils";

export function keySteps(play: Play, max = 4): { step: PlayStep; index: number }[] {
  const steps = play.steps;
  if (!steps.length) return [];
  if (steps.length <= max) return steps.map((step, index) => ({ step, index }));
  const out: { step: PlayStep; index: number }[] = [];
  for (let i = 0; i < max; i++) {
    const index = Math.round((i * (steps.length - 1)) / (max - 1));
    out.push({ step: steps[index], index });
  }
  return out;
}

export function courtSnapSize(court: Play["court"], width: number) {
  const aspect = court === "half" ? 15 / 14 : 28 / 15;
  return { w: width, h: Math.round(width / aspect) };
}

export function stepDataUrl(
  play: Play,
  step: PlayStep,
  labelFor: ((p: Player) => string) | undefined,
  width: number,
  print = true,
): string {
  const { w, h } = courtSnapSize(play.court, width);
  return snapshotStep({
    court: play.court,
    step,
    w,
    h,
    print,
    labelFor,
    pad: print ? 10 : 12,
  }).toDataURL("image/png");
}

function waitImages(doc: Document): Promise<void> {
  const imgs = [...doc.images];
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        }),
    ),
  ).then(() => undefined);
}

function printHtml(html: string): void {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  const run = async () => {
    await waitImages(doc);
    await new Promise((r) => setTimeout(r, 50));
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    const cleanup = () => iframe.remove();
    iframe.contentWindow?.addEventListener("afterprint", cleanup);
    window.setTimeout(cleanup, 1500);
  };
  void run();
}

function printShell(title: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${escHtml(title)}</title>
<style>
  @page { size: auto; margin: 12mm; }
  html, body { margin: 0; padding: 0; background: #fff; color: #111; font-family: "DM Sans", "Helvetica Neue", Arial, sans-serif; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .sheet { width: 100%; }
  .head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .head img, .head svg { width: 44px; height: 44px; object-fit: contain; }
  .kicker { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #444; margin: 0; }
  h1 { font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-size: 32px; margin: 0; letter-spacing: -0.02em; line-height: 1.05; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 14px; }
  .tag { border: 1px solid #111; border-radius: 999px; padding: 2px 8px; font-size: 11px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .frame { border: 1px solid #111; padding: 6px; }
  .frame img { width: 100%; height: auto; display: block; }
  .cap { font-size: 11px; margin: 4px 0 0; color: #333; }
  .note { margin-top: 14px; font-size: 13px; line-height: 1.45; }
  .foot { margin-top: 16px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #666; }
  ol.timeline { list-style: none; padding: 0; margin: 0; }
  ol.timeline li { display: grid; grid-template-columns: 54px 1fr; gap: 10px; padding: 8px 0; border-bottom: 1px solid #ddd; }
  .min { font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-size: 22px; }
  .type { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #555; }
  .cue { font-style: italic; }
  .bench { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .cell { border: 1px solid #111; padding: 6px; }
  .cell h2 { font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-size: 16px; margin: 6px 0 0; }
  @media print { html, body { background: #fff; } }
</style></head><body><div class="sheet">${body}</div></body></html>`;
}

function logoHtml(settings: Settings): string {
  if (settings.logoDataUrl?.startsWith("data:image/")) {
    return `<img src="${settings.logoDataUrl}" alt=""/>`;
  }
  return defaultMarkSvg("#111111", "#ffffff");
}

export function printPlaySheet(
  play: Play,
  settings: Settings,
  labelFor?: (p: Player) => string,
): void {
  const frames = keySteps(play, 4);
  const grid = frames
    .map(({ step, index }) => {
      const src = stepDataUrl(play, step, labelFor, 720, true);
      const cap = step.note ? escHtml(step.note) : `Step ${index + 1}`;
      return `<figure class="frame"><img src="${src}" alt="Step ${index + 1}"/><figcaption class="cap">${index + 1}. ${cap}</figcaption></figure>`;
    })
    .join("");
  const tags = play.tags.map((t) => `<span class="tag">${escHtml(t)}</span>`).join("");
  const club = settings.shortClubName || settings.teamName;
  const body = `
    <header class="head">${logoHtml(settings)}
      <div>
        <p class="kicker">${escHtml(settings.teamName)}${club ? ` · ${escHtml(club)}` : ""}</p>
        <h1>${escHtml(play.name)}</h1>
      </div>
    </header>
    <div class="tags">${tags}</div>
    <div class="grid">${grid}</div>
    ${play.note ? `<p class="note">${escHtml(play.note)}</p>` : ""}
    <p class="foot">CourtOps Playbook · ${escHtml(play.court === "half" ? "Half court" : "Full court")}</p>`;
  printHtml(printShell(play.name, body));
}

export function printPlanSheet(
  plan: PracticePlan,
  plays: Play[],
  settings: Settings,
): void {
  const total = plan.blocks.reduce((s, b) => s + (Number(b.minutes) || 0), 0);
  const rows = plan.blocks
    .map((b) => {
      const linked = b.playId ? plays.find((p) => p.id === b.playId) : undefined;
      return `<li>
        <div class="min">${b.minutes}m</div>
        <div>
          <div class="type">${escHtml(b.type)}</div>
          <strong>${escHtml(b.title)}</strong>
          ${linked ? `<div>Play: ${escHtml(linked.name)}</div>` : ""}
          ${b.cue ? `<div class="cue">${escHtml(b.cue)}</div>` : ""}
          ${b.equipment ? `<div>Equip: ${escHtml(b.equipment)}</div>` : ""}
          ${b.notes ? `<div>${escHtml(b.notes)}</div>` : ""}
        </div>
      </li>`;
    })
    .join("");
  const body = `
    <header class="head">${logoHtml(settings)}
      <div>
        <p class="kicker">${escHtml(settings.teamName)} · ${escHtml(formatDateLabel(plan.date))}</p>
        <h1>${escHtml(plan.name)}</h1>
        <p class="cap">${total} / ${plan.targetMinutes} min · ${plan.blocks.length} blocks</p>
      </div>
    </header>
    <ol class="timeline">${rows}</ol>
    <p class="foot">CourtOps gym sheet</p>`;
  printHtml(printShell(plan.name, body));
}

export function benchPlays(plan: PracticePlan, plays: Play[], max = 6): Play[] {
  const seen = new Set<string>();
  const out: Play[] = [];
  for (const b of plan.blocks) {
    if (!b.playId || seen.has(b.playId)) continue;
    const p = plays.find((x) => x.id === b.playId);
    if (!p) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= max) return out;
  }
  for (const p of plays) {
    if (seen.has(p.id)) continue;
    out.push(p);
    if (out.length >= 4) break;
  }
  return out.slice(0, max);
}

export function printBenchCard(
  plan: PracticePlan,
  plays: Play[],
  settings: Settings,
  labelForPlay: (play: Play) => ((p: Player) => string) | undefined,
): void {
  const chosen = benchPlays(plan, plays, 6);
  const cells = chosen
    .map((play) => {
      const step = play.steps[0];
      if (!step) return "";
      const src = stepDataUrl(play, step, labelForPlay(play), 420, true);
      return `<div class="cell"><img src="${src}" alt=""/><h2>${escHtml(play.name)}</h2></div>`;
    })
    .join("");
  const club = settings.shortClubName || settings.teamName;
  const body = `
    <header class="head">${logoHtml(settings)}
      <div>
        <p class="kicker">${escHtml(club)} bench card · ${escHtml(formatDateLabel(plan.date))}</p>
        <h1>${escHtml(plan.name)}</h1>
      </div>
    </header>
    <div class="bench">${cells}</div>
    <p class="foot">CourtOps Playbook</p>`;
  printHtml(printShell(`${plan.name} bench card`, body));
}

export async function downloadPlaySheetPng(
  play: Play,
  settings: Settings,
  labelFor?: (p: Player) => string,
): Promise<void> {
  const W = 1275;
  const H = 1650;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const accent = normalizeAccent(settings.primaryColor || "#111111");
  await drawBrandMark(ctx, 48, 40, 56, settings.logoDataUrl, "#111111", "#ffffff");
  ctx.fillStyle = "#444444";
  ctx.font = '600 16px "DM Sans", sans-serif';
  ctx.textAlign = "left";
  const club = [settings.teamName, settings.shortClubName].filter(Boolean).join(" · ");
  ctx.fillText(club.toUpperCase(), 118, 62);
  ctx.fillStyle = "#111111";
  ctx.font = '700 48px "Barlow Condensed", "Arial Narrow", sans-serif';
  ctx.fillText(play.name, 118, 108);
  let tagX = 48;
  ctx.font = '500 14px "DM Sans", sans-serif';
  for (const tag of play.tags) {
    const tw = ctx.measureText(tag).width + 20;
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 1;
    ctx.strokeRect(tagX, 126, tw, 22);
    ctx.fillText(tag, tagX + 10, 142);
    tagX += tw + 8;
  }
  const frames = keySteps(play, 4);
  const cols = frames.length === 1 ? 1 : 2;
  const gap = 16;
  const gridX = 48;
  const gridY = 168;
  const gridW = W - 96;
  const cellW = cols === 1 ? gridW : (gridW - gap) / 2;
  frames.forEach(({ step, index }, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const { w, h } = courtSnapSize(play.court, Math.round(cellW));
    const snap = snapshotStep({
      court: play.court,
      step,
      w,
      h,
      print: true,
      labelFor,
      pad: 10,
    });
    const x = gridX + col * (cellW + gap);
    const y = gridY + row * (h + 36);
    ctx.drawImage(snap, x, y, cellW, (cellW / w) * h);
    ctx.strokeStyle = "#111111";
    ctx.strokeRect(x, y, cellW, (cellW / w) * h);
    ctx.fillStyle = "#333333";
    ctx.font = '500 14px "DM Sans", sans-serif';
    const cap = step.note || `Step ${index + 1}`;
    ctx.fillText(`${index + 1}. ${cap}`, x, y + (cellW / w) * h + 18);
  });
  if (play.note) {
    ctx.fillStyle = "#111111";
    ctx.font = '400 18px "DM Sans", sans-serif';
    wrapText(ctx, play.note, 48, H - 120, W - 96, 24);
  }
  ctx.fillStyle = accent;
  ctx.font = '600 12px "DM Sans", sans-serif';
  ctx.fillText("HOOPPLAYBOOK", 48, H - 36);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), "image/png"),
  );
  if (blob) downloadBlob(`${slugFile(play.name)}.png`, blob);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}
