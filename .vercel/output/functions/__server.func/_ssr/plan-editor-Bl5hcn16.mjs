import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useAppStore, f as youth90Template, m as BLOCK_TYPES, s as planMinutes, t as cn, u as uid } from "./store-D1YpRH0R.mjs";
import { _ as ChevronUp, c as Printer, h as Copy, i as Trash2, l as Plus, v as ChevronLeft, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as makeLabeler, t as Button } from "./roster-qGFIfom1.mjs";
import { i as SheetContent, n as Dialog } from "./court-canvas-VaLaLgUs.mjs";
import { i as Textarea, n as Label, r as NativeSelect, t as Input } from "./label-bLB8gfGm.mjs";
import { a as PlayThumb, c as printPlanSheet, n as AlertDialogContent, r as Badge, s as printBenchCard, t as AlertDialog } from "./play-editor-DXtSJSBS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plan-editor-Bl5hcn16.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlanEditor({ planId }) {
	const navigate = useNavigate();
	const savePlan = useAppStore((s) => s.savePlan);
	const deletePlan = useAppStore((s) => s.deletePlan);
	const duplicatePlan = useAppStore((s) => s.duplicatePlan);
	const plays = useAppStore((s) => s.plays);
	const settings = useAppStore((s) => s.settings);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [pickPlay, setPickPlay] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const p = useAppStore.getState().plans.find((x) => x.id === planId);
		setDraft(p ? structuredClone(p) : null);
	}, [planId]);
	(0, import_react.useEffect)(() => {
		if (!draft) return;
		const t = window.setTimeout(() => savePlan(draft), 280);
		return () => window.clearTimeout(t);
	}, [draft, savePlan]);
	const total = draft ? planMinutes(draft) : 0;
	const mismatch = draft ? total !== draft.targetMinutes : false;
	if (!draft) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-16 text-center text-muted",
		children: ["Plan not found.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => navigate({ to: "/practices" }),
				children: "Back to practices"
			})
		})]
	});
	const patch = (fn) => setDraft((d) => d ? fn(d) : d);
	const addBlock = (block) => {
		const next = {
			id: uid("bk"),
			title: block?.title ?? "New block",
			minutes: block?.minutes ?? 8,
			type: block?.type ?? "drill",
			notes: block?.notes ?? "",
			playId: block?.playId,
			equipment: block?.equipment ?? "",
			cue: block?.cue ?? ""
		};
		patch((p) => ({
			...p,
			blocks: [...p.blocks, next]
		}));
	};
	const updateBlock = (id, next) => {
		patch((p) => ({
			...p,
			blocks: p.blocks.map((b) => b.id === id ? {
				...b,
				...next
			} : b)
		}));
	};
	const move = (index, dir) => {
		patch((p) => {
			const blocks = [...p.blocks];
			const j = index + dir;
			if (j < 0 || j >= blocks.length) return p;
			const tmp = blocks[index];
			blocks[index] = blocks[j];
			blocks[j] = tmp;
			return {
				...p,
				blocks
			};
		});
	};
	const fillYouth = () => {
		const first = plays[0]?.id;
		patch((p) => ({
			...p,
			name: p.name === "New practice" ? "90-min youth practice" : p.name,
			targetMinutes: 90,
			blocks: youth90Template(first).map((b) => ({
				...b,
				id: uid("bk")
			}))
		}));
		toast("90-minute youth template loaded");
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
						onClick: () => navigate({ to: "/practices" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.name,
						onChange: (e) => patch((p) => ({
							...p,
							name: e.target.value
						})),
						className: "h-11 border-0 bg-transparent px-1 font-display text-lg tracking-tight",
						"aria-label": "Plan name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => {
							savePlan(draft);
							toast("Saved on this device");
						},
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "date",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "date",
					type: "date",
					className: "mt-1",
					value: draft.date,
					onChange: (e) => patch((p) => ({
						...p,
						date: e.target.value
					}))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "target",
					children: "Planned minutes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "target",
					type: "number",
					min: 15,
					max: 180,
					className: "mt-1",
					value: draft.targetMinutes,
					onChange: (e) => patch((p) => ({
						...p,
						targetMinutes: Number(e.target.value) || 0
					}))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl text-fg",
						children: "Timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("text-sm tabular-nums", mismatch ? "text-warn" : "text-muted"),
						children: [
							total,
							" / ",
							draft.targetMinutes,
							" min",
							mismatch ? " — does not match" : ""
						]
					})]
				}), mismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-warn",
					children: "Running total does not match the planned length."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 flex flex-col gap-3 px-4",
				children: draft.blocks.map((block, i) => {
					const linked = plays.find((p) => p.id === block.playId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-raised",
										"aria-label": "Move up",
										onClick: () => move(i, -1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-raised",
										"aria-label": "Move down",
										onClick: () => move(i, 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: block.title,
											onChange: (e) => updateBlock(block.id, { title: e.target.value }),
											"aria-label": "Block title"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
												value: block.type,
												onChange: (e) => updateBlock(block.id, { type: e.target.value }),
												children: BLOCK_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												max: 90,
												value: block.minutes,
												onChange: (e) => updateBlock(block.id, { minutes: Number(e.target.value) || 0 }),
												"aria-label": "Minutes"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											className: "min-h-16",
											placeholder: "Coach notes",
											value: block.notes,
											onChange: (e) => updateBlock(block.id, { notes: e.target.value })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Equipment (optional)",
											value: block.equipment ?? "",
											onChange: (e) => updateBlock(block.id, { equipment: e.target.value }),
											"aria-label": "Equipment"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Coaching cue (optional)",
											value: block.cue ?? "",
											onChange: (e) => updateBlock(block.id, { cue: e.target.value }),
											"aria-label": "Coaching cue"
										}),
										linked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 rounded-md bg-raised p-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-20 shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayThumb, { play: linked })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate text-sm text-fg",
														children: linked.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted",
														children: "Linked play"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => updateBlock(block.id, { playId: void 0 }),
													children: "Unlink"
												})
											]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-10 items-center justify-center rounded-md text-danger hover:bg-raised",
									"aria-label": "Remove block",
									onClick: () => patch((p) => ({
										...p,
										blocks: p.blocks.filter((b) => b.id !== block.id)
									})),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						})
					}, block.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2 px-4 pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => addBlock(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add block"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setPickPlay(true),
						children: "Add from playbook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: fillYouth,
						children: "Build a 90-min youth practice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => {
							const id = duplicatePlan(draft.id);
							if (id) {
								toast("Plan duplicated");
								navigate({
									to: "/practices/$planId",
									params: { planId: id }
								});
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Duplicate plan"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => printPlanSheet(draft, plays, settings),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Gym sheet"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => printBenchCard(draft, plays, settings, (play) => makeLabeler(play, settings.roster)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Bench card"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({
							to: "/practices/$planId/run",
							params: { planId: draft.id }
						}),
						disabled: !draft.blocks.length,
						children: "Run practice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => setConfirmDelete(true),
						children: "Delete plan"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: pickPlay,
				onOpenChange: setPickPlay,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					title: "Add from playbook",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Inserts an 8-minute teach-this-play block."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 flex flex-col gap-2",
						children: plays.map((play) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-center gap-3 rounded-lg bg-raised p-2 text-left",
							onClick: () => {
								addBlock({
									title: `Teach ${play.name}`,
									minutes: 8,
									type: "play review",
									notes: "Walk-through, then 5-on-0.",
									playId: play.id
								});
								setPickPlay(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-20 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayThumb, { play })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm text-fg",
									children: play.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: play.tags.join(" · ") || "Untagged"
								})]
							})]
						}) }, play.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent, {
					title: "Delete this plan?",
					description: "The practice plan will be removed from this device.",
					onConfirm: () => {
						deletePlan(draft.id);
						navigate({ to: "/practices" });
					}
				})
			})
		]
	});
}
function PlanMeta({ plan }) {
	const total = planMinutes(plan);
	const mismatch = total !== plan.targetMinutes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			tone: mismatch ? "warn" : "mute",
			children: [
				total,
				"/",
				plan.targetMinutes,
				" min"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-faint",
			children: [plan.blocks.length, " blocks"]
		})]
	});
}
//#endregion
export { PlanMeta as n, PlanEditor as t };
