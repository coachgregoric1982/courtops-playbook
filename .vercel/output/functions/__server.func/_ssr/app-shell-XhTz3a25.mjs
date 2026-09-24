import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./store-D1YpRH0R.mjs";
import { b as BookOpen, g as Clock, o as Settings, p as House } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-XhTz3a25.js
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/",
		label: "Home",
		icon: House,
		match: (p) => p === "/"
	},
	{
		to: "/playbook",
		label: "Playbook",
		icon: BookOpen,
		match: (p) => p.startsWith("/playbook")
	},
	{
		to: "/practices",
		label: "Practice",
		icon: Clock,
		match: (p) => p.startsWith("/practices")
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
		match: (p) => p.startsWith("/settings")
	}
];
function AppShell({ children, hideNav = false }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex-1", hideNav ? "pb-0" : "pb-20"),
			children
		}), !hideNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border bg-surface/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm no-print",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-4",
				children: TABS.map((tab) => {
					const active = tab.match(pathname);
					const Icon = tab.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-[color] duration-150", active ? "text-accent" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: active ? 2.2 : 1.8
						}), tab.label]
					}) }, tab.to);
				})
			})
		})]
	});
}
function PageHeader({ kicker, title, action, leading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-end justify-between gap-3 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-end gap-3",
			children: [leading, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
					children: kicker
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight text-fg",
					children: title
				})]
			})]
		}), action]
	});
}
//#endregion
export { PageHeader as n, AppShell as t };
