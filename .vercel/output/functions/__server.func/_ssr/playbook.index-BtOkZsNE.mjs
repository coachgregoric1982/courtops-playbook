import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useAppStore, g as PLAY_TAGS, t as cn } from "./store-D1YpRH0R.mjs";
import { l as Plus, n as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as parsePlayFile } from "./router-BTQHqHHs.mjs";
import { t as Button } from "./roster-qGFIfom1.mjs";
import { t as Input } from "./label-bLB8gfGm.mjs";
import { a as PlayThumb, o as TagRow } from "./play-editor-DXtSJSBS.mjs";
import { n as PageHeader, t as AppShell } from "./app-shell-XhTz3a25.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playbook.index-BtOkZsNE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Playbook() {
	const navigate = useNavigate();
	const plays = useAppStore((s) => s.plays);
	const createPlay = useAppStore((s) => s.createPlay);
	const importPlay = useAppStore((s) => s.importPlay);
	const [q, setQ] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)("all");
	const fileRef = (0, import_react.useRef)(null);
	const filtered = (0, import_react.useMemo)(() => {
		return plays.filter((p) => {
			const hitQ = !q.trim() || p.name.toLowerCase().includes(q.toLowerCase()) || p.note.toLowerCase().includes(q.toLowerCase());
			const hitT = tag === "all" || p.tags.includes(tag);
			return hitQ && hitT;
		});
	}, [
		plays,
		q,
		tag
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Draw",
			title: "Playbook",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => fileRef.current?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Import"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => {
						const id = createPlay();
						navigate({
							to: "/playbook/$playId",
							params: { playId: id }
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: "application/json,.json",
					className: "sr-only",
					onChange: async (e) => {
						const file = e.target.files?.[0];
						e.target.value = "";
						if (!file) return;
						try {
							const play = parsePlayFile(await file.text());
							const id = importPlay(play);
							toast("Play imported");
							navigate({
								to: "/playbook/$playId",
								params: { playId: id }
							});
						} catch {
							toast("Could not read that play file");
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search plays",
					value: q,
					onChange: (e) => setQ(e.target.value),
					"aria-label": "Search plays"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-1.5 overflow-x-auto no-scrollbar pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: tag === "all",
						onClick: () => setTag("all"),
						children: "All"
					}), PLAY_TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: tag === t,
						onClick: () => setTag(t),
						children: t
					}, t))]
				})
			]
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-4 py-16 text-center text-sm text-muted",
			children: "No plays match. Draw a new one for the next timeout."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 flex flex-col gap-3 px-4 pb-8",
			children: filtered.map((play) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/playbook/$playId",
				params: { playId: play.id },
				className: "block overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayThumb, {
					play,
					className: "rounded-none max-h-48"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl text-fg",
							children: play.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [play.steps.length, " steps"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagRow, { tags: play.tags })]
				})]
			}) }, play.id))
		})
	] });
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium", on ? "bg-accent text-accent-fg" : "bg-raised text-muted"),
		children
	});
}
//#endregion
export { Playbook as component };
