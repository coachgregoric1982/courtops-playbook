import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useAppStore, o as formatMmss } from "./store-D1YpRH0R.mjs";
import { a as SkipForward, d as Pause, t as X, u as Play, v as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-BTQHqHHs.mjs";
import { i as makeLabeler, t as Button } from "./roster-qGFIfom1.mjs";
import { n as Dialog, r as DialogContent, t as CourtCanvas } from "./court-canvas-VaLaLgUs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practices._planId.run-DeNmZjNy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Short sideline beep — not a siren. */
function playBeep() {
	if (typeof window === "undefined") return;
	try {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) return;
		const ctx = new AudioCtx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = 784;
		gain.gain.value = .07;
		osc.connect(gain);
		gain.connect(ctx.destination);
		const t = ctx.currentTime;
		osc.start(t);
		gain.gain.setValueAtTime(.07, t);
		gain.gain.exponentialRampToValueAtTime(.001, t + .16);
		osc.stop(t + .18);
		osc.onended = () => {
			ctx.close();
		};
		if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(30);
	} catch {}
}
function RunMode({ planId }) {
	const navigate = useNavigate();
	const plan = useAppStore((s) => s.plans.find((p) => p.id === planId));
	const plays = useAppStore((s) => s.plays);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [remaining, setRemaining] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [diagram, setDiagram] = (0, import_react.useState)(false);
	const [playStep, setPlayStep] = (0, import_react.useState)(0);
	const startedAt = (0, import_react.useRef)(null);
	const startLeft = (0, import_react.useRef)(0);
	const tickRef = (0, import_react.useRef)(null);
	const block = plan?.blocks[index];
	const next = plan?.blocks[index + 1];
	const linked = block?.playId ? plays.find((p) => p.id === block.playId) : void 0;
	const roster = useAppStore((s) => s.settings.roster);
	const labelFor = (0, import_react.useMemo)(() => linked ? makeLabeler(linked, roster) : void 0, [linked, roster]);
	const clearTick = () => {
		if (tickRef.current != null) {
			window.clearInterval(tickRef.current);
			tickRef.current = null;
		}
	};
	(0, import_react.useEffect)(() => {
		if (!block) return;
		clearTick();
		setRemaining(block.minutes * 60);
		setRunning(false);
		startedAt.current = null;
		setDone(false);
	}, [block?.id]);
	(0, import_react.useEffect)(() => () => clearTick(), []);
	const start = () => {
		if (done || remaining <= 0) return;
		startedAt.current = Date.now();
		startLeft.current = remaining;
		clearTick();
		tickRef.current = window.setInterval(() => {
			const origin = startedAt.current;
			if (origin == null) return;
			const elapsed = Math.floor((Date.now() - origin) / 1e3);
			const left = Math.max(0, startLeft.current - elapsed);
			setRemaining(left);
			if (left <= 0) {
				clearTick();
				setRunning(false);
				playBeep();
				const p = useAppStore.getState().plans.find((x) => x.id === planId);
				const i = index;
				if (p && i < p.blocks.length - 1) window.setTimeout(() => setIndex(i + 1), 650);
				else setDone(true);
			}
		}, 250);
		setRunning(true);
	};
	const pause = () => {
		clearTick();
		if (startedAt.current != null) {
			const elapsed = Math.floor((Date.now() - startedAt.current) / 1e3);
			setRemaining(Math.max(0, startLeft.current - elapsed));
		}
		startedAt.current = null;
		setRunning(false);
	};
	const skip = () => {
		clearTick();
		startedAt.current = null;
		setRunning(false);
		if (!plan) return;
		if (index >= plan.blocks.length - 1) {
			setDone(true);
			return;
		}
		setIndex((i) => i + 1);
	};
	const total = block ? block.minutes * 60 : 1;
	const pct = block ? Math.max(0, Math.min(1, 1 - remaining / total)) : 0;
	const linkedStep = linked?.steps[playStep] ?? linked?.steps[0];
	if (!plan || !block) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-16 text-center text-muted",
		children: ["Nothing to run.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => navigate({ to: "/practices" }),
				children: "Back"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg px-4 pb-6 pt-[max(0.5rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Back",
						onClick: () => navigate({
							to: "/practices/$planId",
							params: { planId: plan.id }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: plan.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-1 flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted",
						children: done ? "Complete" : block.type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl leading-tight tracking-tight text-fg",
						children: done ? "Practice complete" : block.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 font-display text-7xl tabular-nums leading-none text-fg",
						"data-remaining": remaining,
						"aria-live": "polite",
						children: done ? "0:00" : formatMmss(remaining)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-raised",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-accent",
							style: { width: `${done ? 100 : pct * 100}%` }
						})
					}),
					block.notes && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-sm text-sm text-muted",
						children: block.notes
					}) : null,
					block.cue && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-sm font-display text-xl text-accent",
						children: block.cue
					}) : null,
					block.equipment && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-faint",
						children: ["Need: ", block.equipment]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex gap-2",
						children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => navigate({
								to: "/practices/$planId",
								params: { planId: plan.id }
							}),
							children: "Back to plan"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: running ? pause : start,
							"aria-label": running ? "Pause" : "Start",
							children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 ml-0.5" }), running ? "Pause" : "Start"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "lg",
							onClick: skip,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5" }), "Skip"]
						})] })
					}),
					linked && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-4",
						onClick: () => {
							setPlayStep(0);
							setDiagram(true);
						},
						children: "Open diagram"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-faint",
					children: "Up next"
				}), next && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-display text-xl text-fg",
					children: [
						next.title,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								"· ",
								next.minutes,
								" min"
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: done ? "Full session in the book." : "Last block."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: diagram,
				onOpenChange: setDiagram,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: linked?.name ?? "Play",
					className: "w-[min(100%-1rem,36rem)] p-4",
					children: linked && linkedStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-lg bg-court",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourtCanvas, {
								court: linked.court,
								step: linkedStep,
								labelFor
							})
						}),
						linked.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: linked.note
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm tabular-nums text-muted",
								children: [
									"Step ",
									playStep + 1,
									"/",
									linked.steps.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => setPlayStep((s) => s >= linked.steps.length - 1 ? 0 : s + 1),
									children: "Next"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setDiagram(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Close"]
								})]
							})]
						})
					] }) : null
				})
			})
		]
	});
}
function RunPage() {
	const { planId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunMode, { planId });
}
//#endregion
export { RunPage as component };
