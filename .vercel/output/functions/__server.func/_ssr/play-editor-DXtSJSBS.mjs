import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatDateLabel, b as drawBrandMark, c as prefersReducedMotion, d as useAppStore, g as PLAY_TAGS, i as escHtml, l as slugFile, n as downloadBlob, r as downloadText, t as cn, u as uid, x as normalizeAccent, y as defaultMarkSvg } from "./store-D1YpRH0R.mjs";
import { a as SkipForward, c as Printer, d as Pause, f as Link2, h as Copy, i as Trash2, l as Plus, m as Download, s as Redo, u as Play, v as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as packPlay, s as playToJson } from "./router-BTQHqHHs.mjs";
import { i as makeLabeler, n as SLOT_LIST, r as defaultRosterSlots, t as Button } from "./roster-qGFIfom1.mjs";
import { a as snapshotStep, n as Dialog, r as DialogContent, t as CourtCanvas } from "./court-canvas-VaLaLgUs.mjs";
import { i as Textarea, n as Label, r as NativeSelect, t as Input } from "./label-bLB8gfGm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play-editor-DXtSJSBS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
function AlertDialogContent({ className, title, description, confirmLabel = "Delete", onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Portal2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, { className: "fixed inset-0 z-50 bg-bg/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
		className: cn("fixed z-50 left-1/2 top-1/2 w-[min(100%-1.5rem,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
				className: "font-display text-xl text-fg",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
				className: "mt-2 text-sm text-muted",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						children: "Cancel"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: onConfirm,
						children: confirmLabel
					})
				})]
			})
		]
	})] });
}
function Badge({ className, tone = "default", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tone === "default" && "bg-raised text-muted", tone === "accent" && "bg-accent/15 text-accent-2", tone === "warn" && "bg-warn/15 text-warn", tone === "ok" && "bg-ok/15 text-ok", tone === "mute" && "bg-transparent text-faint shadow-[var(--shadow-border)]", className),
		children
	});
}
function keySteps(play, max = 4) {
	const steps = play.steps;
	if (!steps.length) return [];
	if (steps.length <= max) return steps.map((step, index) => ({
		step,
		index
	}));
	const out = [];
	for (let i = 0; i < max; i++) {
		const index = Math.round(i * (steps.length - 1) / (max - 1));
		out.push({
			step: steps[index],
			index
		});
	}
	return out;
}
function courtSnapSize(court, width) {
	return {
		w: width,
		h: Math.round(width / (court === "half" ? 15 / 14 : 28 / 15))
	};
}
function stepDataUrl(play, step, labelFor, width, print = true) {
	const { w, h } = courtSnapSize(play.court, width);
	return snapshotStep({
		court: play.court,
		step,
		w,
		h,
		print,
		labelFor,
		pad: print ? 10 : 12
	}).toDataURL("image/png");
}
function waitImages(doc) {
	const imgs = [...doc.images];
	return Promise.all(imgs.map((img) => new Promise((resolve) => {
		if (img.complete) resolve();
		else {
			img.onload = () => resolve();
			img.onerror = () => resolve();
		}
	}))).then(() => void 0);
}
function printHtml(html) {
	const iframe = document.createElement("iframe");
	iframe.setAttribute("aria-hidden", "true");
	iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
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
	run();
}
function printShell(title, body) {
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
function logoHtml(settings) {
	if (settings.logoDataUrl?.startsWith("data:image/")) return `<img src="${settings.logoDataUrl}" alt=""/>`;
	return defaultMarkSvg("#111111", "#ffffff");
}
function printPlaySheet(play, settings, labelFor) {
	const grid = keySteps(play, 4).map(({ step, index }) => {
		const src = stepDataUrl(play, step, labelFor, 720, true);
		const cap = step.note ? escHtml(step.note) : `Step ${index + 1}`;
		return `<figure class="frame"><img src="${src}" alt="Step ${index + 1}"/><figcaption class="cap">${index + 1}. ${cap}</figcaption></figure>`;
	}).join("");
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
function printPlanSheet(plan, plays, settings) {
	const total = plan.blocks.reduce((s, b) => s + (Number(b.minutes) || 0), 0);
	const rows = plan.blocks.map((b) => {
		const linked = b.playId ? plays.find((p) => p.id === b.playId) : void 0;
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
	}).join("");
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
function benchPlays(plan, plays, max = 6) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
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
function printBenchCard(plan, plays, settings, labelForPlay) {
	const cells = benchPlays(plan, plays, 6).map((play) => {
		const step = play.steps[0];
		if (!step) return "";
		return `<div class="cell"><img src="${stepDataUrl(play, step, labelForPlay(play), 420, true)}" alt=""/><h2>${escHtml(play.name)}</h2></div>`;
	}).join("");
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
async function downloadPlaySheetPng(play, settings, labelFor) {
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
	ctx.font = "600 16px \"DM Sans\", sans-serif";
	ctx.textAlign = "left";
	const club = [settings.teamName, settings.shortClubName].filter(Boolean).join(" · ");
	ctx.fillText(club.toUpperCase(), 118, 62);
	ctx.fillStyle = "#111111";
	ctx.font = "700 48px \"Barlow Condensed\", \"Arial Narrow\", sans-serif";
	ctx.fillText(play.name, 118, 108);
	let tagX = 48;
	ctx.font = "500 14px \"DM Sans\", sans-serif";
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
	const cellW = cols === 1 ? 1179 : 1163 / 2;
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
			pad: 10
		});
		const x = gridX + col * (cellW + gap);
		const y = gridY + row * (h + 36);
		ctx.drawImage(snap, x, y, cellW, cellW / w * h);
		ctx.strokeStyle = "#111111";
		ctx.strokeRect(x, y, cellW, cellW / w * h);
		ctx.fillStyle = "#333333";
		ctx.font = "500 14px \"DM Sans\", sans-serif";
		const cap = step.note || `Step ${index + 1}`;
		ctx.fillText(`${index + 1}. ${cap}`, x, y + cellW / w * h + 18);
	});
	if (play.note) {
		ctx.fillStyle = "#111111";
		ctx.font = "400 18px \"DM Sans\", sans-serif";
		wrapText(ctx, play.note, 48, 1530, 1179, 24);
	}
	ctx.fillStyle = accent;
	ctx.font = "600 12px \"DM Sans\", sans-serif";
	ctx.fillText("HOOPPLAYBOOK", 48, 1614);
	const blob = await new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
	if (blob) downloadBlob(`${slugFile(play.name)}.png`, blob);
}
function wrapText(ctx, text, x, y, maxW, lh) {
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
var TOOLS = [
	{
		id: "select",
		label: "Move"
	},
	{
		id: "pass",
		label: "Pass"
	},
	{
		id: "dribble",
		label: "Dribble"
	},
	{
		id: "cut",
		label: "Cut"
	},
	{
		id: "screen",
		label: "Screen"
	},
	{
		id: "shot",
		label: "Shot"
	}
];
function PlayEditor({ playId }) {
	const navigate = useNavigate();
	const savePlay = useAppStore((s) => s.savePlay);
	const deletePlay = useAppStore((s) => s.deletePlay);
	const duplicatePlay = useAppStore((s) => s.duplicatePlay);
	const settings = useAppStore((s) => s.settings);
	const roster = settings.roster;
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [stepIndex, setStepIndex] = (0, import_react.useState)(0);
	const [tool, setTool] = (0, import_react.useState)("select");
	const [placeSide, setPlaceSide] = (0, import_react.useState)("offense");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [blend, setBlend] = (0, import_react.useState)(1);
	const [prevStep, setPrevStep] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const [shareUrl, setShareUrl] = (0, import_react.useState)("");
	const [shareTooLong, setShareTooLong] = (0, import_react.useState)(false);
	const playRef = (0, import_react.useRef)(false);
	playRef.current = playing;
	(0, import_react.useEffect)(() => {
		const p = useAppStore.getState().plays.find((x) => x.id === playId);
		setDraft(p ? structuredClone(p) : null);
		setStepIndex(0);
		setPlaying(false);
		setBlend(1);
		setPrevStep(null);
	}, [playId]);
	(0, import_react.useEffect)(() => {
		if (!draft) return;
		const t = window.setTimeout(() => savePlay(draft), 280);
		return () => window.clearTimeout(t);
	}, [draft, savePlay]);
	const step = draft?.steps[stepIndex] ?? draft?.steps[0];
	const labelFor = (0, import_react.useMemo)(() => draft ? makeLabeler(draft, roster) : void 0, [draft, roster]);
	const empty = (0, import_react.useMemo)(() => step ? step.players.length === 0 : true, [step]);
	if (!draft || !step) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-16 text-center text-muted",
		children: ["Play not found.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => navigate({ to: "/playbook" }),
				children: "Back to playbook"
			})
		})]
	});
	const patch = (fn) => setDraft((d) => d ? fn(d) : d);
	const updateStep = (next) => {
		patch((p) => ({
			...p,
			steps: p.steps.map((s, i) => i === stepIndex ? next : s)
		}));
	};
	const addStep = () => {
		const copy = {
			id: uid("st"),
			players: step.players.map((pl) => ({ ...pl })),
			drawings: [],
			note: ""
		};
		patch((p) => {
			const steps = [...p.steps];
			steps.splice(stepIndex + 1, 0, copy);
			return {
				...p,
				steps
			};
		});
		setStepIndex((i) => i + 1);
		setPlaying(false);
		setBlend(1);
		setPrevStep(null);
	};
	const duplicateStep = () => {
		const copy = {
			...step,
			id: uid("st"),
			players: step.players.map((pl) => ({ ...pl })),
			drawings: step.drawings.map((d) => ({
				...d,
				id: uid("dr"),
				points: d.points.map((pt) => ({ ...pt }))
			}))
		};
		patch((p) => {
			const steps = [...p.steps];
			steps.splice(stepIndex + 1, 0, copy);
			return {
				...p,
				steps
			};
		});
		setStepIndex((i) => i + 1);
	};
	const deleteStep = () => {
		if (draft.steps.length <= 1) {
			toast("Keep at least one step");
			return;
		}
		patch((p) => ({
			...p,
			steps: p.steps.filter((_, i) => i !== stepIndex)
		}));
		setStepIndex((i) => Math.max(0, i - 1));
		setBlend(1);
		setPrevStep(null);
	};
	const undoStroke = () => {
		if (!step.drawings.length) return;
		updateStep({
			...step,
			drawings: step.drawings.slice(0, -1)
		});
	};
	const removeSelected = () => {
		if (!selectedId) return;
		updateStep({
			...step,
			players: step.players.filter((p) => p.id !== selectedId)
		});
		setSelectedId(null);
	};
	const animateTo = (nextIndex) => {
		const from = draft.steps[stepIndex];
		const toI = nextIndex;
		if (!from || toI < 0 || toI >= draft.steps.length) return;
		if (prefersReducedMotion()) {
			setStepIndex(toI);
			setBlend(1);
			setPrevStep(null);
			return Promise.resolve();
		}
		setPrevStep(from);
		setStepIndex(toI);
		setBlend(0);
		return new Promise((resolve) => {
			const start = performance.now();
			const dur = 600;
			const tick = (now) => {
				const t = Math.min(1, (now - start) / dur);
				setBlend(t);
				if (t < 1) requestAnimationFrame(tick);
				else {
					setPrevStep(null);
					resolve();
				}
			};
			requestAnimationFrame(tick);
		});
	};
	const onPlay = async () => {
		if (playing) {
			setPlaying(false);
			return;
		}
		setPlaying(true);
		playRef.current = true;
		let i = stepIndex;
		if (i >= draft.steps.length - 1) {
			setStepIndex(0);
			setBlend(1);
			setPrevStep(null);
			i = 0;
		}
		while (playRef.current && i < draft.steps.length - 1) {
			await animateTo(i + 1);
			i += 1;
			if (!playRef.current) break;
		}
		setPlaying(false);
	};
	const onNext = () => {
		if (stepIndex >= draft.steps.length - 1) {
			setStepIndex(0);
			setBlend(1);
			setPrevStep(null);
			return;
		}
		animateTo(stepIndex + 1);
	};
	const toggleTag = (tag) => {
		patch((p) => ({
			...p,
			tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag]
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg pb-[env(safe-area-inset-bottom)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-1 px-2 pt-[max(0.5rem,env(safe-area-inset-top))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Back",
						onClick: () => navigate({ to: "/playbook" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.name,
						onChange: (e) => patch((p) => ({
							...p,
							name: e.target.value
						})),
						className: "h-11 border-0 bg-transparent px-1 font-display text-lg tracking-tight",
						"aria-label": "Play name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => {
							savePlay(draft);
							toast("Saved on this device");
						},
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto no-scrollbar px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
					a: "Half",
					b: "Full",
					value: draft.court === "half" ? "a" : "b",
					onChange: (v) => patch((p) => ({
						...p,
						court: v === "a" ? "half" : "full"
					}))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
					a: "Offense",
					b: "Defense",
					value: placeSide === "offense" ? "a" : "b",
					onChange: (v) => setPlaceSide(v === "a" ? "offense" : "defense")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl bg-court shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourtCanvas, {
						court: draft.court,
						step,
						prevStep,
						blend,
						tool,
						placeSide,
						interactive: !playing,
						selectedId,
						onSelect: setSelectedId,
						onChange: updateStep,
						labelFor
					}), empty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pointer-events-none absolute inset-x-4 bottom-3 text-center text-xs text-court-line/80",
						children: "Tap the court to add players. Add a step when someone moves."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-1 overflow-x-auto no-scrollbar px-3",
				children: [
					TOOLS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTool(t.id),
						className: cn("h-11 shrink-0 rounded-md px-3 text-xs font-medium transition-[background-color,color] duration-150", tool === t.id ? "bg-accent text-accent-fg" : "bg-raised text-muted"),
						children: t.label
					}, t.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: undoStroke,
						className: "inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-raised text-muted",
						"aria-label": "Undo last drawing",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo, { className: "size-4 -scale-x-100" })
					}),
					selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: removeSelected,
						className: "inline-flex h-11 shrink-0 items-center gap-1 rounded-md bg-danger/15 px-3 text-xs text-danger",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Player"]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2 px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-lg tabular-nums text-fg",
					children: [
						"Step ",
						stepIndex + 1,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: ["/", draft.steps.length]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Add step",
							onClick: addStep,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Duplicate step",
							onClick: duplicateStep,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Delete step",
							onClick: deleteStep,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": playing ? "Pause" : "Play",
							onClick: () => void onPlay(),
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 ml-0.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Next step",
							onClick: onNext,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-3 px-3 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "job",
						children: "Player job"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "job",
						className: "mt-1 min-h-20",
						placeholder: "What does each player do?",
						value: draft.note,
						onChange: (e) => patch((p) => ({
							...p,
							note: e.target.value
						}))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Step note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						placeholder: "Caption for this step",
						value: step.note,
						onChange: (e) => updateStep({
							...step,
							note: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "size-4 accent-[var(--color-accent)]",
								checked: !!draft.useRosterNames,
								onChange: (e) => {
									const on = e.target.checked;
									patch((p) => ({
										...p,
										useRosterNames: on,
										rosterSlots: on && !Object.keys(p.rosterSlots ?? {}).length ? defaultRosterSlots(roster) : p.rosterSlots
									}));
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-fg",
								children: "Use roster names"
							})]
						}), draft.useRosterNames ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
								a: "#",
								b: "Name",
								value: draft.rosterLabel === "name" ? "b" : "a",
								onChange: (v) => patch((p) => ({
									...p,
									rosterLabel: v === "b" ? "name" : "number"
								}))
							}), roster.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Add players in Settings so dots can show a jersey or short name."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-2",
								children: SLOT_LIST.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[2rem_1fr] items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-center font-display text-lg text-accent",
										children: n
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
										value: draft.rosterSlots?.[n] ?? "",
										onChange: (e) => {
											const value = e.target.value;
											patch((p) => {
												const slots = { ...p.rosterSlots };
												if (value) slots[n] = value;
												else delete slots[n];
												return {
													...p,
													rosterSlots: slots
												};
											});
										},
										"aria-label": `Roster for ${n}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: "",
											children: ["Jersey ", n]
										}), roster.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: r.id,
											children: [
												"#",
												r.number,
												" ",
												r.name
											]
										}, r.id))]
									})]
								}, n))
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: PLAY_TAGS.map((tag) => {
							const on = draft.tags.includes(tag);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleTag(tag),
								className: cn("h-9 rounded-full px-3 text-xs font-medium", on ? "bg-accent text-accent-fg" : "bg-raised text-muted"),
								children: tag
							}, tag);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: async () => {
									try {
										const packed = await packPlay(draft);
										setShareUrl(packed.url);
										setShareTooLong(packed.tooLong);
										setShareOpen(true);
										if (!packed.tooLong) try {
											await navigator.clipboard.writeText(packed.url);
											toast("Share link copied");
										} catch {}
									} catch {
										setShareUrl("");
										setShareTooLong(true);
										setShareOpen(true);
										toast("Could not build a link — download a play file");
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), "Share"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => {
									downloadPlaySheetPng(draft, settings, labelFor);
									toast("Downloading PNG sheet");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "PNG"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => printPlaySheet(draft, settings, labelFor),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => {
									const id = duplicatePlay(draft.id);
									if (id) {
										toast("Play duplicated");
										navigate({
											to: "/playbook/$playId",
											params: { playId: id }
										});
									}
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Duplicate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "danger",
								className: "col-span-2",
								onClick: () => setConfirmDelete(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: shareOpen,
				onOpenChange: setShareOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Share this play",
					children: [
						shareTooLong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "This play is too big for a reliable link. Download a play file instead, then Import it from the Playbook."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Paste this link in the same app to load the play. No account. No server."
						}),
						!shareTooLong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-3",
							readOnly: true,
							value: shareUrl,
							onFocus: (e) => e.currentTarget.select(),
							"aria-label": "Share link"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2",
							children: [!shareTooLong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: async () => {
									try {
										await navigator.clipboard.writeText(shareUrl);
										toast("Copied");
									} catch {
										toast("Copy failed — select the link");
									}
								},
								children: "Copy link"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => {
									downloadText(`${slugFile(draft.name)}.json`, playToJson(draft), "application/json");
									toast("Play file downloaded");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download play file"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent, {
					title: "Delete this play?",
					description: "It will be removed from this device. Linked practice blocks keep their notes.",
					onConfirm: () => {
						deletePlay(draft.id);
						navigate({ to: "/playbook" });
					}
				})
			})
		]
	});
}
function Seg({ a, b, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-11 shrink-0 rounded-lg bg-raised p-1",
		children: ["a", "b"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(k),
			className: cn("h-full rounded-md px-3 text-xs font-medium", value === k ? "bg-surface text-fg" : "text-muted"),
			children: k === "a" ? a : b
		}, k))
	});
}
function PlayThumb({ play, className }) {
	const roster = useAppStore((s) => s.settings.roster);
	const labelFor = (0, import_react.useMemo)(() => makeLabeler(play, roster), [play, roster]);
	const step = play.steps[0];
	if (!step) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden rounded-lg bg-court", play.court === "half" ? "aspect-half" : "aspect-full", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourtCanvas, {
			court: play.court,
			step,
			labelFor
		})
	});
}
function TagRow({ tags }) {
	if (!tags.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1",
		children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			tone: "accent",
			children: t
		}, t))
	});
}
//#endregion
export { PlayThumb as a, printPlanSheet as c, PlayEditor as i, AlertDialogContent as n, TagRow as o, Badge as r, printBenchCard as s, AlertDialog as t };
