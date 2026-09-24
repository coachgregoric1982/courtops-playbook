import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as resizeLogoFile, _ as POSITIONS, d as useAppStore, h as COLOR_PRESETS, p as AGE_GROUPS, r as downloadText, t as cn, u as uid } from "./store-D1YpRH0R.mjs";
import { i as Trash2, l as Plus, n as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as parseRosterCsv, o as rosterToCsv, t as Button } from "./roster-qGFIfom1.mjs";
import { n as Label, r as NativeSelect, t as Input } from "./label-bLB8gfGm.mjs";
import { n as PageHeader, t as AppShell } from "./app-shell-XhTz3a25.mjs";
import { n as TeamMark } from "./team-mark-DnmV9a0J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DyTQm_V4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useAppStore((s) => s.settings);
	const updateSettings = useAppStore((s) => s.updateSettings);
	const setRoster = useAppStore((s) => s.setRoster);
	const plays = useAppStore((s) => s.plays);
	const plans = useAppStore((s) => s.plans);
	const logoRef = (0, import_react.useRef)(null);
	const csvRef = (0, import_react.useRef)(null);
	const [csvErrors, setCsvErrors] = (0, import_react.useState)([]);
	const roster = settings.roster;
	const patchPlayer = (id, next) => {
		setRoster(roster.map((p) => p.id === id ? {
			...p,
			...next
		} : p));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Sideline",
		title: "Settings"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 px-4 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "team",
				children: "Team name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "team",
				className: "mt-1",
				value: settings.teamName,
				onChange: (e) => updateSettings({ teamName: e.target.value })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "club",
				children: "Short club name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "club",
				className: "mt-1",
				maxLength: 8,
				placeholder: "PHX",
				value: settings.shortClubName,
				onChange: (e) => updateSettings({ shortClubName: e.target.value })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "age",
				children: "Age group"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
				id: "age",
				className: "mt-1",
				value: settings.ageGroup,
				onChange: (e) => updateSettings({ ageGroup: e.target.value }),
				children: AGE_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: g,
					children: g
				}, g))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "len",
				children: "Default practice length (minutes)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "len",
				className: "mt-1",
				type: "number",
				min: 30,
				max: 180,
				value: settings.defaultPracticeMinutes,
				onChange: (e) => updateSettings({ defaultPracticeMinutes: Number(e.target.value) || 90 })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "color",
				children: "Primary color"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-center gap-2",
				children: [COLOR_PRESETS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Color ${c}`,
					onClick: () => updateSettings({ primaryColor: c }),
					className: cn("size-11 rounded-full border border-border", settings.primaryColor === c && "ring-2 ring-fg ring-offset-2 ring-offset-bg"),
					style: { background: c }
				}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "color",
					type: "color",
					value: settings.primaryColor,
					"aria-label": "Custom primary color",
					className: "size-11 cursor-pointer rounded-full border border-border bg-raised p-1",
					onChange: (e) => updateSettings({ primaryColor: e.target.value })
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Team logo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					logoUrl: settings.logoDataUrl,
					size: 56
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: logoRef,
							type: "file",
							accept: "image/*",
							className: "sr-only",
							onChange: async (e) => {
								const file = e.target.files?.[0];
								e.target.value = "";
								if (!file) return;
								try {
									const data = await resizeLogoFile(file);
									updateSettings({ logoDataUrl: data });
									toast("Logo saved on this device");
								} catch (err) {
									toast(err instanceof Error ? err.message : "Could not read that image");
								}
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => logoRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Upload logo"]
						}),
						settings.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => updateSettings({ logoDataUrl: "" }),
							children: "Use CO mark"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "No logo — CourtOps CO mark."
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-fg",
						children: "Roster"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Stored on this device. Import a CSV with columns number, name, position."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-2",
						children: roster.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-surface p-2 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "w-16 shrink-0",
										value: p.number,
										onChange: (e) => patchPlayer(p.id, { number: e.target.value }),
										"aria-label": "Number",
										inputMode: "numeric"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "min-w-0 flex-1",
										value: p.name,
										onChange: (e) => patchPlayer(p.id, { name: e.target.value }),
										"aria-label": "Name",
										placeholder: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-danger",
										"aria-label": `Remove ${p.name || "player"}`,
										onClick: () => setRoster(roster.filter((x) => x.id !== p.id)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								className: "mt-1.5",
								value: POSITIONS.includes(p.position) ? p.position : p.position ? "__custom" : "",
								onChange: (e) => {
									const v = e.target.value;
									if (v === "__custom") return;
									patchPlayer(p.id, { position: v });
								},
								"aria-label": "Position",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Position"
									}),
									POSITIONS.map((pos) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: pos,
										children: pos
									}, pos)),
									p.position && !POSITIONS.includes(p.position) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "__custom",
										children: p.position
									}) : null
								]
							})]
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => setRoster([...roster, {
									id: uid("rp"),
									number: "",
									name: "",
									position: ""
								}]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add player"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => csvRef.current?.click(),
									children: "Import CSV"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => {
										downloadText("roster.csv", rosterToCsv(roster), "text/csv;charset=utf-8");
										toast("Roster CSV downloaded");
									},
									children: "Export CSV"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: csvRef,
								type: "file",
								accept: ".csv,text/csv,text/plain",
								className: "sr-only",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (!file) return;
									const text = await file.text();
									const { players, errors } = parseRosterCsv(text);
									setCsvErrors(errors.map((er) => `Row ${er.row}: ${er.message}`));
									if (players.length) {
										setRoster([...roster, ...players]);
										toast(`Imported ${players.length} player${players.length === 1 ? "" : "s"}`);
									} else if (!errors.length) toast("No players in that file");
								}
							}),
							csvErrors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "rounded-lg bg-danger/10 p-3 text-xs text-danger",
								children: csvErrors.map((err) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: err }, err))
							}) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 text-sm text-muted shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-fg",
						children: "This device"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1",
						children: [
							plays.length,
							" plays · ",
							plans.length,
							" practice plans · ",
							roster.length,
							" ",
							"players stored in the browser. Refresh keeps the board. No account, no cloud."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-faint",
						children: "FIBA markings · youth & club"
					})
				]
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
