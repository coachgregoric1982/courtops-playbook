import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, h as Slot, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn, u as uid } from "./store-D1YpRH0R.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roster-qGFIfom1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:pointer-events-none disabled:opacity-40 transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent-2",
			secondary: "bg-raised text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "border border-border bg-transparent text-fg hover:bg-raised",
			ghost: "text-fg hover:bg-raised",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 min-h-11 px-4",
			sm: "h-9 min-h-9 px-3 text-xs",
			lg: "h-12 min-h-12 px-5",
			icon: "size-11 min-h-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var SLOTS = [
	1,
	2,
	3,
	4,
	5
];
function parseCsvLine(line) {
	const out = [];
	let cur = "";
	let q = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (q) {
			if (ch === "\"") {
				if (line[i + 1] === "\"") {
					cur += "\"";
					i += 1;
				} else q = false;
			} else cur += ch;
		} else if (ch === "\"") q = true;
		else if (ch === ",") {
			out.push(cur);
			cur = "";
		} else cur += ch;
	}
	out.push(cur);
	return out.map((s) => s.trim());
}
function headerIndex(cells) {
	const lower = cells.map((c) => c.replace(/^\uFEFF/, "").trim().toLowerCase());
	const number = lower.findIndex((c) => c === "number" || c === "no" || c === "#");
	const name = lower.findIndex((c) => c === "name" || c === "player");
	const position = lower.findIndex((c) => c === "position" || c === "pos" || c === "spot");
	if (number < 0 || name < 0 || position < 0) return null;
	return {
		number,
		name,
		position
	};
}
function validNumber(n) {
	if (!/^\d{1,2}$/.test(n)) return false;
	const v = Number(n);
	return v >= 0 && v <= 99;
}
function parseRosterCsv(text) {
	const errors = [];
	const players = [];
	const lines = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	if (!lines.length || lines.every((l) => !l.trim())) return {
		players,
		errors: [{
			row: 1,
			message: "File is empty"
		}]
	};
	let headerRow = 0;
	while (headerRow < lines.length && !lines[headerRow].trim()) headerRow += 1;
	if (headerRow >= lines.length) return {
		players,
		errors: [{
			row: 1,
			message: "File is empty"
		}]
	};
	const idx = headerIndex(parseCsvLine(lines[headerRow]));
	if (!idx) return {
		players,
		errors: [{
			row: headerRow + 1,
			message: "Need a header row with columns number, name, position"
		}]
	};
	for (let i = headerRow + 1; i < lines.length; i++) {
		const line = lines[i];
		if (!line.trim()) continue;
		const cells = parseCsvLine(line);
		const number = (cells[idx.number] ?? "").trim();
		const name = (cells[idx.name] ?? "").trim();
		const position = (cells[idx.position] ?? "").trim();
		const row = i + 1;
		if (!number && !name && !position) continue;
		const problems = [];
		if (!validNumber(number)) problems.push("number must be 0–99");
		if (!name) problems.push("missing name");
		if (name.length > 40) problems.push("name is too long");
		if (position.length > 12) problems.push("position is too long");
		if (problems.length) {
			errors.push({
				row,
				message: problems.join("; ")
			});
			continue;
		}
		players.push({
			id: uid("rp"),
			number,
			name,
			position
		});
	}
	if (!players.length && !errors.length) errors.push({
		row: headerRow + 1,
		message: "No player rows found"
	});
	return {
		players,
		errors
	};
}
function rosterToCsv(roster) {
	const lines = ["number,name,position"];
	for (const p of roster) {
		const name = /[",\n]/.test(p.name) ? `"${p.name.replace(/"/g, "\"\"")}"` : p.name;
		lines.push(`${p.number},${name},${p.position}`);
	}
	return `${lines.join("\n")}\n`;
}
function shortName(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return "";
	if (parts.length === 1) return parts[0].slice(0, 8);
	return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
function labelForPlayer(player, play, roster) {
	if (player.side !== "offense" || !play.useRosterNames) return String(player.n);
	const id = play.rosterSlots?.[player.n];
	const rp = (id ? roster.find((r) => r.id === id) : void 0) ?? roster.find((r) => r.number === String(player.n));
	if (!rp) return String(player.n);
	if (play.rosterLabel === "name") {
		const s = shortName(rp.name);
		if (s.length <= 5) return s;
		return rp.number || String(player.n);
	}
	return rp.number || String(player.n);
}
function makeLabeler(play, roster) {
	return (p) => labelForPlayer(p, play, roster);
}
function defaultRosterSlots(roster) {
	const slots = {};
	roster.slice(0, 5).forEach((r, i) => {
		slots[SLOTS[i]] = r.id;
	});
	return slots;
}
var SLOT_LIST = SLOTS;
//#endregion
export { parseRosterCsv as a, makeLabeler as i, SLOT_LIST as n, rosterToCsv as o, defaultRosterSlots as r, Button as t };
