import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatDateLabel, d as useAppStore, s as planMinutes } from "./store-D1YpRH0R.mjs";
import { b as BookOpen, g as Clock, l as Plus, u as Play } from "../_libs/lucide-react.mjs";
import { t as Button } from "./roster-qGFIfom1.mjs";
import { a as PlayThumb, o as TagRow } from "./play-editor-DXtSJSBS.mjs";
import { n as PageHeader, t as AppShell } from "./app-shell-XhTz3a25.mjs";
import { n as TeamMark, t as AppMark } from "./team-mark-DnmV9a0J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DfQP-kj8.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	const settings = useAppStore((s) => s.settings);
	const plays = useAppStore((s) => s.plays);
	const plans = useAppStore((s) => s.plans);
	const createPlay = useAppStore((s) => s.createPlay);
	const createPlan = useAppStore((s) => s.createPlan);
	const featured = plays[0];
	const nextPlan = [...plans].sort((a, b) => a.date.localeCompare(b.date))[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Playbook · FIBA board",
			title: "CourtOps",
			leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { size: 40 }),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg leading-tight text-fg",
					children: settings.teamName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [settings.shortClubName ? `${settings.shortClubName} · ` : "", settings.ageGroup]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					logoUrl: settings.logoDataUrl,
					size: 44
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid grid-cols-2 gap-3 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-24 flex-col items-start justify-between rounded-xl bg-accent p-4 text-left text-accent-fg",
				onClick: () => {
					const id = createPlay();
					navigate({
						to: "/playbook/$playId",
						params: { playId: id }
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl leading-none",
					children: "New play"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-24 flex-col items-start justify-between rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)]",
				onClick: () => {
					const id = createPlan();
					navigate({
						to: "/practices/$planId",
						params: { planId: id }
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl leading-none text-fg",
					children: "New practice"
				})]
			})]
		}),
		nextPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-5 px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: "Next session"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl text-fg",
						children: nextPlan.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							formatDateLabel(nextPlan.date),
							" · ",
							planMinutes(nextPlan),
							" min ·",
							" ",
							nextPlan.blocks.length,
							" blocks"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/practices/$planId/run",
								params: { planId: nextPlan.id },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 ml-0.5" }), "Run"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/practices/$planId",
								params: { planId: nextPlan.id },
								children: "Open plan"
							})
						})]
					})
				]
			})
		}) : null,
		featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-fg",
					children: "Featured look"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/playbook",
					className: "text-xs font-medium text-accent",
					children: "All plays"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/playbook/$playId",
				params: { playId: featured.id },
				className: "block overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayThumb, {
					play: featured,
					className: "rounded-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl text-fg",
							children: featured.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagRow, { tags: featured.tags }),
						featured.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: featured.note
						}) : null
					]
				})]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 px-4 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Playbook"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: plays.slice(0, 5).map((play) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/playbook/$playId",
					params: { playId: play.id },
					className: "flex items-center gap-3 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-24 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayThumb, { play })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium text-fg",
								children: play.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									play.court === "half" ? "Half court" : "Full court",
									" ·",
									" ",
									play.steps.length,
									" steps"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "ml-auto size-4 shrink-0 text-faint" })
					]
				}) }, play.id))
			})]
		})
	] });
}
//#endregion
export { Home as component };
