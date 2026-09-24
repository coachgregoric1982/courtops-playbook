import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./store-D1YpRH0R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-mark-DnmV9a0J.js
var import_jsx_runtime = require_jsx_runtime();
function TeamMark({ logoUrl, size = 40, className, alt = "Team logo" }) {
	if (logoUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: logoUrl,
		alt,
		width: size,
		height: size,
		className: cn("shrink-0 rounded-sm object-contain", className),
		style: {
			width: size,
			height: size
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultMark, {
		size,
		className
	});
}
function AppMark({ size = 36, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 100",
		width: size,
		height: size,
		className: cn("shrink-0", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "100",
				height: "100",
				rx: "22",
				fill: "#070b12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12",
				y: "12",
				width: "76",
				height: "76",
				rx: "10",
				fill: "#121a26"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M22 20h56",
				fill: "none",
				stroke: "#d4a017",
				strokeWidth: "5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "20",
				width: "28",
				height: "26",
				fill: "none",
				stroke: "#d4a017",
				strokeWidth: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M22 20c0 34 56 34 56 0",
				fill: "none",
				stroke: "#d4a017",
				strokeWidth: "5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "26",
				r: "5",
				fill: "none",
				stroke: "#f4f1ea",
				strokeWidth: "3.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "74",
				r: "6",
				fill: "#d4a017"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M38 70l18-22",
				fill: "none",
				stroke: "#f4f1ea",
				strokeWidth: "4.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M48 52l8-4-2 9",
				fill: "none",
				stroke: "#f4f1ea",
				strokeWidth: "4.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		]
	});
}
function DefaultMark({ size = 40, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		width: size,
		height: size,
		className: cn("shrink-0 text-accent", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "64",
				height: "64",
				rx: "14",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "none",
				stroke: "var(--color-accent-fg)",
				strokeWidth: "3.4",
				strokeLinecap: "round",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 14h40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "22",
						y: "14",
						width: "20",
						height: "18"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 14c0 24 40 24 40 0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "32",
						cy: "18.5",
						r: "3.4"
					})
				]
			}),
			size >= 28 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "32",
				y: "50",
				textAnchor: "middle",
				fontSize: "13",
				fontFamily: "Barlow Condensed, Arial Narrow, sans-serif",
				fontWeight: "700",
				fill: "var(--color-accent-fg)",
				children: "CO"
			}) : null
		]
	});
}
//#endregion
export { TeamMark as n, AppMark as t };
