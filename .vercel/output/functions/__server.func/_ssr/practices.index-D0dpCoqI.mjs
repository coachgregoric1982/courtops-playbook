import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatDateLabel, d as useAppStore } from "./store-D1YpRH0R.mjs";
import { l as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./roster-qGFIfom1.mjs";
import { n as PageHeader, t as AppShell } from "./app-shell-XhTz3a25.mjs";
import { n as PlanMeta } from "./plan-editor-Bl5hcn16.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practices.index-D0dpCoqI.js
var import_jsx_runtime = require_jsx_runtime();
function Practices() {
	const navigate = useNavigate();
	const plans = useAppStore((s) => s.plans);
	const createPlan = useAppStore((s) => s.createPlan);
	const buildYouth90 = useAppStore((s) => s.buildYouth90);
	const sorted = [...plans].sort((a, b) => a.date.localeCompare(b.date));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Clock",
			title: "Practice plans",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					const id = createPlan();
					navigate({
						to: "/practices/$planId",
						params: { planId: id }
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: () => {
					const id = buildYouth90();
					navigate({
						to: "/practices/$planId",
						params: { planId: id }
					});
				},
				children: "Build a 90-min youth practice"
			})
		}),
		sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-4 py-16 text-center text-sm text-muted",
			children: "No plans yet. Build a 90-minute youth session to get on the floor."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 flex flex-col gap-3 px-4 pb-8",
			children: sorted.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/practices/$planId",
				params: { planId: plan.id },
				className: "block rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.14em] text-accent",
						children: formatDateLabel(plan.date)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl text-fg",
						children: plan.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanMeta, { plan })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-3 space-y-1",
						children: [plan.blocks.slice(0, 4).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: b.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [b.minutes, "m"]
							})]
						}, b.id)), plan.blocks.length > 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-xs text-faint",
							children: [
								"+",
								plan.blocks.length - 4,
								" more"
							]
						}) : null]
					})
				]
			}) }, plan.id))
		})
	] });
}
//#endregion
export { Practices as component };
