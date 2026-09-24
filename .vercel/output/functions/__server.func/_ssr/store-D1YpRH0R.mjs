import { t as create } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/types-CWw7dNn4.js
var DEFAULT = "#d4a017";
function parseHex(hex) {
	const raw = hex.trim().replace("#", "");
	const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
	if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
	return {
		r: parseInt(full.slice(0, 2), 16),
		g: parseInt(full.slice(2, 4), 16),
		b: parseInt(full.slice(4, 6), 16)
	};
}
function lum(r, g, b) {
	const a = [
		r,
		g,
		b
	].map((v) => {
		const x = v / 255;
		return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4);
	});
	return .2126 * a[0] + .7152 * a[1] + .0722 * a[2];
}
function toHex(r, g, b) {
	const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`;
}
function mix(a, b, t) {
	return {
		r: a.r + (b.r - a.r) * t,
		g: a.g + (b.g - a.g) * t,
		b: a.b + (b.b - a.b) * t
	};
}
function normalizeAccent(hex) {
	const rgb = parseHex(hex) ?? parseHex(DEFAULT);
	if (lum(rgb.r, rgb.g, rgb.b) < .14) {
		const lifted = mix(rgb, {
			r: 255,
			g: 255,
			b: 255
		}, .42);
		return toHex(lifted.r, lifted.g, lifted.b);
	}
	return toHex(rgb.r, rgb.g, rgb.b);
}
function paletteFrom(hex) {
	const accent = normalizeAccent(hex);
	const rgb = parseHex(accent);
	const accentFg = lum(rgb.r, rgb.g, rgb.b) > .42 ? "#140e04" : "#f4f1ea";
	const lifted = mix(rgb, {
		r: 255,
		g: 245,
		b: 220
	}, .32);
	return {
		accent,
		accentFg,
		accent2: toHex(lifted.r, lifted.g, lifted.b)
	};
}
function applyBrandColor(hex) {
	if (typeof document === "undefined") return;
	const p = paletteFrom(hex);
	const root = document.documentElement;
	root.style.setProperty("--color-accent", p.accent);
	root.style.setProperty("--color-accent-fg", p.accentFg);
	root.style.setProperty("--color-accent-2", p.accent2);
}
function resizeLogoFile(file, max = 256) {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith("image/")) {
			reject(/* @__PURE__ */ new Error("Not an image"));
			return;
		}
		if (file.size > 4e6) {
			reject(/* @__PURE__ */ new Error("Image is too large"));
			return;
		}
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, max / Math.max(img.width, img.height));
			const w = Math.max(1, Math.round(img.width * scale));
			const h = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("No canvas"));
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/png"));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Could not read image"));
		};
		img.src = url;
	});
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("image"));
		img.src = src;
	});
}
function drawDefaultMark(ctx, x, y, size, fill, ink = "#140e04") {
	const cx = x + size / 2;
	ctx.save();
	roundClip(ctx, x, y, size, size, size * .22);
	ctx.fillStyle = fill;
	ctx.fillRect(x, y, size, size);
	ctx.strokeStyle = ink;
	ctx.lineWidth = Math.max(1.4, size / 16);
	ctx.lineCap = "round";
	const top = y + size * .22;
	const left = x + size * .18;
	const right = x + size * .82;
	ctx.beginPath();
	ctx.moveTo(left, top);
	ctx.lineTo(right, top);
	ctx.stroke();
	const keyW = size * .3;
	const keyH = size * .28;
	ctx.strokeRect(cx - keyW / 2, top, keyW, keyH);
	ctx.beginPath();
	ctx.moveTo(left, top);
	ctx.quadraticCurveTo(cx, y + size * .72, right, top);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, top + size * .07, size * .07, 0, Math.PI * 2);
	ctx.stroke();
	if (size >= 22) {
		ctx.fillStyle = ink;
		ctx.font = `700 ${Math.round(size * .22)}px "Barlow Condensed", "Arial Narrow", sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("CO", cx, y + size * .78);
	}
	ctx.restore();
}
async function drawBrandMark(ctx, x, y, size, logoDataUrl, fill, ink = "#140e04") {
	if (logoDataUrl) try {
		const img = await loadImage(logoDataUrl);
		ctx.save();
		roundClip(ctx, x, y, size, size, size * .12);
		ctx.drawImage(img, x, y, size, size);
		ctx.restore();
		return;
	} catch {}
	drawDefaultMark(ctx, x, y, size, fill, ink);
}
function roundClip(ctx, x, y, w, h, r) {
	const rr = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
	ctx.clip();
}
function defaultMarkSvg(fill, ink = "#140e04") {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="${fill}"/><g fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"><path d="M12 14h40"/><rect x="22" y="14" width="20" height="18"/><path d="M12 14c0 24 40 24 40 0"/><circle cx="32" cy="18.5" r="3.4"/></g><text x="32" y="52" text-anchor="middle" font-size="13" font-family="Arial Narrow, sans-serif" font-weight="700" fill="${ink}">CO</text></svg>`;
}
var PLAY_TAGS = [
	"BOB",
	"SLOB",
	"ATO",
	"vs man",
	"vs zone",
	"press break",
	"motion",
	"delay"
];
var BLOCK_TYPES = [
	"warmup",
	"teaching",
	"drill",
	"play review",
	"scrimmage",
	"cooldown"
];
var POSITIONS = [
	"PG",
	"SG",
	"SF",
	"PF",
	"C",
	"G",
	"F",
	"W"
];
var AGE_GROUPS = [
	"U10",
	"U12",
	"U14",
	"U16",
	"U18",
	"Open"
];
var COLOR_PRESETS = [
	"#d4a017",
	"#c45c4a",
	"#3d9a6a",
	"#4a8fb8",
	"#e07040"
];
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/store-D1YpRH0R.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`).slice(0, 8)}`;
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatMmss(totalSeconds) {
	const s = Math.max(0, Math.floor(totalSeconds));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function formatDateLabel(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	return new Date(y, m - 1, d).toLocaleDateString(void 0, {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
function prefersReducedMotion() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function slugFile(name) {
	return name.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "file";
}
function downloadBlob(filename, blob) {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	a.click();
	URL.revokeObjectURL(a.href);
}
function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
	downloadBlob(filename, new Blob([text], { type: mime }));
}
function escHtml(s) {
	const a = String.fromCharCode(38);
	return s.replaceAll(a, `${a}amp;`).replaceAll("<", `${a}lt;`).replaceAll(">", `${a}gt;`).replaceAll("\"", `${a}quot;`).replaceAll("'", `${a}#39;`);
}
var T0 = Date.parse("2026-09-18T12:00:00+08:00");
function off(spots) {
	return spots.map((p, i) => ({
		id: `o${i + 1}`,
		n: i + 1,
		side: "offense",
		x: p[0],
		y: p[1]
	}));
}
function withDefense(offense, hoop = {
	x: .5,
	y: .112
}, t = .22) {
	const def = offense.map((p) => ({
		id: `d${p.n}`,
		n: p.n,
		side: "defense",
		x: p.x + (hoop.x - p.x) * t,
		y: p.y + (hoop.y - p.y) * t
	}));
	return [...offense, ...def];
}
function D(id, type, x1, y1, x2, y2) {
	return {
		id,
		type,
		points: [{
			x: x1,
			y: y1
		}, {
			x: x2,
			y: y2
		}]
	};
}
function st(id, players, drawings = [], note = "") {
	return {
		id,
		players,
		drawings,
		note
	};
}
function play(partial) {
	return {
		updatedAt: T0,
		...partial
	};
}
var HORNS_1 = off([
	[.5, .7],
	[.88, .2],
	[.12, .2],
	[.64, .4],
	[.36, .4]
]);
var HORNS_2 = off([
	[.58, .5],
	[.78, .36],
	[.14, .22],
	[.64, .4],
	[.7, .28]
]);
var HORNS_3 = off([
	[.46, .22],
	[.8, .42],
	[.18, .24],
	[.6, .42],
	[.68, .2]
]);
var HORNS_4 = off([
	[.42, .16],
	[.78, .4],
	[.22, .28],
	[.56, .38],
	[.62, .16]
]);
var BOB_1 = off([
	[.5, .04],
	[.5, .28],
	[.5, .4],
	[.5, .52],
	[.5, .64]
]);
var BOB_2 = off([
	[.5, .04],
	[.88, .2],
	[.78, .42],
	[.22, .38],
	[.5, .22]
]);
var BOB_3 = off([
	[.62, .18],
	[.9, .18],
	[.8, .44],
	[.2, .36],
	[.42, .16]
]);
var SLOB_1 = off([
	[.02, .42],
	[.38, .22],
	[.62, .22],
	[.38, .48],
	[.62, .48]
]);
var SLOB_2 = off([
	[.02, .42],
	[.22, .2],
	[.78, .38],
	[.42, .36],
	[.58, .28]
]);
var SLOB_3 = off([
	[.18, .4],
	[.14, .18],
	[.82, .4],
	[.4, .34],
	[.52, .2]
]);
var ATO_1 = off([
	[.5, .66],
	[.18, .42],
	[.82, .42],
	[.38, .4],
	[.62, .4]
]);
var ATO_2 = off([
	[.42, .58],
	[.5, .52],
	[.84, .4],
	[.42, .4],
	[.58, .4]
]);
var ATO_3 = off([
	[.36, .56],
	[.5, .62],
	[.86, .38],
	[.4, .4],
	[.6, .4]
]);
var ZONE_1 = off([
	[.5, .72],
	[.18, .38],
	[.82, .38],
	[.38, .42],
	[.62, .42]
]);
var ZONE_2 = off([
	[.28, .62],
	[.12, .22],
	[.88, .36],
	[.42, .28],
	[.62, .42]
]);
var ZONE_3 = off([
	[.22, .58],
	[.12, .2],
	[.88, .34],
	[.48, .18],
	[.66, .4]
]);
var PRESS_HOOP = {
	x: .056,
	y: .5
};
var PRESS_1 = off([
	[.04, .5],
	[.22, .28],
	[.22, .72],
	[.48, .5],
	[.78, .5]
]);
var PRESS_2 = off([
	[.06, .5],
	[.28, .38],
	[.22, .72],
	[.55, .42],
	[.82, .5]
]);
var PRESS_3 = off([
	[.12, .5],
	[.4, .42],
	[.28, .7],
	[.68, .48],
	[.9, .5]
]);
function pressPlayers(spots) {
	return withDefense(spots, PRESS_HOOP, .18);
}
var DELAY_1 = off([
	[.5, .68],
	[.88, .38],
	[.12, .38],
	[.78, .18],
	[.5, .4]
]);
var DELAY_2 = off([
	[.28, .6],
	[.88, .36],
	[.18, .42],
	[.78, .18],
	[.5, .38]
]);
var DELAY_3 = off([
	[.22, .52],
	[.86, .34],
	[.22, .38],
	[.8, .2],
	[.48, .36]
]);
var SPAIN_1 = off([
	[.5, .68],
	[.86, .36],
	[.14, .36],
	[.38, .4],
	[.58, .48]
]);
var SPAIN_2 = off([
	[.64, .5],
	[.86, .34],
	[.14, .34],
	[.52, .32],
	[.6, .42]
]);
var SPAIN_3 = off([
	[.7, .38],
	[.88, .32],
	[.16, .32],
	[.58, .62],
	[.52, .22]
]);
var SAMPLE_ROSTER = [
	{
		id: "rp1",
		number: "4",
		name: "Maya Chen",
		position: "PG"
	},
	{
		id: "rp2",
		number: "12",
		name: "Jordan Lee",
		position: "SG"
	},
	{
		id: "rp3",
		number: "21",
		name: "Sam Rivera",
		position: "SF"
	},
	{
		id: "rp4",
		number: "33",
		name: "Alex Kim",
		position: "PF"
	},
	{
		id: "rp5",
		number: "15",
		name: "Riley Park",
		position: "C"
	},
	{
		id: "rp6",
		number: "7",
		name: "Casey Nguyen",
		position: "G"
	},
	{
		id: "rp7",
		number: "23",
		name: "Quinn Brooks",
		position: "F"
	}
];
var SAMPLE_PLAYS = [
	play({
		id: "play-horns",
		name: "Horns Floppy",
		court: "half",
		tags: ["motion", "vs man"],
		note: "4 receives and holds. 5 screens down for 2. 1 cuts to the rim after the pass.",
		useRosterNames: true,
		rosterLabel: "number",
		rosterSlots: {
			1: "rp1",
			2: "rp2",
			3: "rp3",
			4: "rp4",
			5: "rp5"
		},
		steps: [
			st("h1", withDefense(HORNS_1), [], "Horns: 4 and 5 at the elbows."),
			st("h2", withDefense(HORNS_2), [
				D("h2p", "pass", .5, .7, .64, .4),
				D("h2s", "screen", .36, .4, .7, .28),
				D("h2c", "cut", .88, .2, .78, .36)
			], "1 to 4. 5 down-screens for 2."),
			st("h3", withDefense(HORNS_3), [D("h3p", "pass", .64, .4, .8, .42), D("h3c", "cut", .58, .5, .46, .22)], "Extra to 2. 1 cuts. 5 pops."),
			st("h4", withDefense(HORNS_4), [D("h4s", "shot", .78, .4, .55, .16), D("h4c", "cut", .46, .22, .42, .16)], "2 hunts the three. 1 rebounds weak side.")
		]
	}),
	play({
		id: "play-bob",
		name: "BOB Stack",
		court: "half",
		tags: ["BOB", "vs man"],
		note: "4 inbounds. Stack breaks on the slap: 2 corner, 3 wing, 5 to ball, 1 rim.",
		steps: [
			st("b1", withDefense(BOB_1), [], "Stack on the nail. 4 ready to inbound."),
			st("b2", withDefense(BOB_2), [
				D("b2c1", "cut", .5, .28, .88, .2),
				D("b2c2", "cut", .5, .4, .78, .42),
				D("b2c3", "cut", .5, .52, .22, .38),
				D("b2c4", "cut", .5, .64, .5, .22)
			], "Break the stack on the slap."),
			st("b3", withDefense(BOB_3), [D("b3p", "pass", .5, .04, .42, .16), D("b3s", "shot", .42, .16, .5, .12)], "Hit 5 on the short roll. 4 steps in.")
		],
		updatedAt: T0 + 36e5
	}),
	play({
		id: "play-slob",
		name: "SLOB Box Stagger",
		court: "half",
		tags: ["SLOB", "vs man"],
		note: "4 inbounds from the side. Stagger away for 3. 2 clears the corner.",
		steps: [
			st("s1", withDefense(SLOB_1), [], "Box in the key. 4 on the sideline."),
			st("s2", withDefense(SLOB_2), [
				D("s2c", "cut", .62, .22, .78, .38),
				D("s2s", "screen", .62, .48, .58, .28),
				D("s2c2", "cut", .38, .22, .22, .2)
			], "Stagger for 3. 2 clears corner."),
			st("s3", withDefense(SLOB_3), [D("s3p", "pass", .02, .42, .82, .4), D("s3s", "shot", .82, .4, .55, .16)], "Skip to 3. Shot or drive closeout.")
		],
		updatedAt: T0 + 72e5
	}),
	play({
		id: "play-ato",
		name: "ATO Elevator",
		court: "half",
		tags: ["ATO", "vs man"],
		note: "2 sprints through the 4–5 elevator. 1 must wait for the doors to close.",
		steps: [
			st("a1", withDefense(ATO_1), [], "2 on the weak wing. 4 and 5 are the doors."),
			st("a2", withDefense(ATO_2), [
				D("a2c", "cut", .18, .42, .5, .52),
				D("a2s1", "screen", .38, .4, .42, .4),
				D("a2s2", "screen", .62, .4, .58, .4)
			], "2 through the elevator."),
			st("a3", withDefense(ATO_3), [D("a3p", "pass", .42, .58, .5, .62), D("a3s", "shot", .5, .62, .5, .18)], "1 hits 2 at the nail for three.")
		],
		updatedAt: T0 + 108e5
	}),
	play({
		id: "play-zone",
		name: "1-4 High vs Zone",
		court: "half",
		tags: ["vs zone", "motion"],
		note: "High-low with 4 and 5. Skip opposite before the zone recovers.",
		steps: [
			st("z1", withDefense(ZONE_1), [], "1-4 high. Punish the top of the 2-3."),
			st("z2", withDefense(ZONE_2), [
				D("z2p", "pass", .5, .72, .28, .62),
				D("z2c", "cut", .38, .42, .42, .28),
				D("z2d", "dribble", .5, .72, .28, .62)
			], "Shift left. 4 dives the short middle."),
			st("z3", withDefense(ZONE_3), [
				D("z3p", "pass", .28, .62, .42, .28),
				D("z3p2", "pass", .42, .28, .12, .2),
				D("z3s", "shot", .12, .2, .5, .12)
			], "High-low, then kick the corner.")
		],
		updatedAt: T0 + 144e5
	}),
	play({
		id: "play-press",
		name: "Press Break 1-4",
		court: "full",
		tags: ["press break"],
		note: "4 inbounds. 1 is the outlet. 3 is the safety. Do not hold the ball.",
		steps: [
			st("p1", pressPlayers(PRESS_1), [], "1-4 spread. 4 takes the ball out."),
			st("p2", pressPlayers(PRESS_2), [D("p2p", "pass", .04, .5, .28, .38), D("p2c", "cut", .48, .5, .55, .42)], "Hit 1. 4 steps in. 3 presents middle."),
			st("p3", pressPlayers(PRESS_3), [
				D("p3p", "pass", .28, .38, .4, .42),
				D("p3d", "dribble", .4, .42, .68, .48),
				D("p3p2", "pass", .68, .48, .9, .5)
			], "Advance middle, finish to 5.")
		],
		updatedAt: T0 + 18e6
	}),
	play({
		id: "play-delay",
		name: "Delay 4-Out",
		court: "half",
		tags: ["delay", "vs man"],
		note: "Eat clock. 5 is the only post. Reverse twice before a hunt.",
		steps: [
			st("d1", withDefense(DELAY_1), [], "4-out, 5 at the high post."),
			st("d2", withDefense(DELAY_2), [D("d2d", "dribble", .5, .68, .28, .6), D("d2p", "pass", .28, .6, .18, .42)], "Slow dribble entry. Reverse to 3."),
			st("d3", withDefense(DELAY_3), [D("d3p", "pass", .18, .42, .22, .38), D("d3c", "cut", .5, .4, .48, .36)], "Hold. 5 shows as the relief.")
		],
		updatedAt: T0 + 216e5
	}),
	play({
		id: "play-spain",
		name: "Spain Pick and Roll",
		court: "half",
		tags: ["vs man", "ATO"],
		note: "5 ballscreens. 4 backscreens the 5-man. 1 turns the corner.",
		steps: [
			st("sp1", withDefense(SPAIN_1), [], "5 at the right slot. 4 is the Spain screener."),
			st("sp2", withDefense(SPAIN_2), [
				D("sp2d", "dribble", .5, .68, .64, .5),
				D("sp2s", "screen", .58, .48, .6, .42),
				D("sp2s2", "screen", .38, .4, .52, .32)
			], "Ballscreen + backscreen (Spain)."),
			st("sp3", withDefense(SPAIN_3), [
				D("sp3c", "cut", .6, .42, .52, .22),
				D("sp3c2", "cut", .52, .32, .58, .62),
				D("sp3s", "shot", .7, .38, .52, .16)
			], "5 dives. 4 pops. 1 scores or kicks.")
		],
		updatedAt: T0 + 252e5
	})
];
var SAMPLE_PLANS = [{
	id: "plan-tue",
	name: "Tue Install — U14",
	date: "2026-09-22",
	targetMinutes: 90,
	updatedAt: T0 + 4e6,
	blocks: [
		{
			id: "tb1",
			title: "Dynamic warmup",
			minutes: 10,
			type: "warmup",
			notes: "Jog, skips, closeouts, two-line layups.",
			equipment: "Cones",
			cue: "Talk on every closeout."
		},
		{
			id: "tb2",
			title: "Ball-handling series",
			minutes: 12,
			type: "drill",
			notes: "Stationary pound, on-move change of direction, 1-on-1 hold.",
			equipment: "1 ball each",
			cue: "Eyes up."
		},
		{
			id: "tb3",
			title: "Form shooting",
			minutes: 15,
			type: "drill",
			notes: "Partner form, 5 spots, make-it-take-it closeouts.",
			equipment: "2 balls per pair",
			cue: "Hold the follow-through."
		},
		{
			id: "tb4",
			title: "Teach Horns Floppy",
			minutes: 20,
			type: "play review",
			notes: "Walk-through, then 5-on-0, then 5-on-5 live.",
			playId: "play-horns",
			cue: "4 holds. 5 down-screens."
		},
		{
			id: "tb5",
			title: "4-on-4 breakdown",
			minutes: 15,
			type: "teaching",
			notes: "Help, recover, and the extra pass. No dribble live if they rush.",
			cue: "See both — man and ball."
		},
		{
			id: "tb6",
			title: "Controlled scrimmage",
			minutes: 12,
			type: "scrimmage",
			notes: "Stop for the Horns cue. First to 8.",
			cue: "Call Horns live."
		},
		{
			id: "tb7",
			title: "Shoot-off + stretch",
			minutes: 6,
			type: "cooldown",
			notes: "Free throws in pairs. Then hip / calf stretch.",
			equipment: "1 ball per pair"
		}
	]
}, {
	id: "plan-sat",
	name: "Saturday Tune-up",
	date: "2026-09-26",
	targetMinutes: 75,
	updatedAt: T0 + 8e6,
	blocks: [
		{
			id: "sb1",
			title: "Warmup games",
			minutes: 8,
			type: "warmup",
			notes: "3-line layups and a short 3-on-2 / 2-on-1.",
			cue: "Sprint the floor."
		},
		{
			id: "sb2",
			title: "Shooting circuit",
			minutes: 15,
			type: "drill",
			notes: "Corner-wing-top. Track makes. No standing.",
			equipment: "3 balls, 6 cones",
			cue: "Catch ready."
		},
		{
			id: "sb3",
			title: "Teach BOB Stack",
			minutes: 8,
			type: "play review",
			notes: "Baseline inbound vs man. Live after two makes.",
			playId: "play-bob",
			cue: "Slap. Break. Do not stand."
		},
		{
			id: "sb4",
			title: "Teach SLOB Box",
			minutes: 8,
			type: "play review",
			notes: "Sideline inbound. Skip vs overplay.",
			playId: "play-slob",
			cue: "Stagger away. Skip if denied."
		},
		{
			id: "sb5",
			title: "Press break 1-4",
			minutes: 12,
			type: "play review",
			notes: "Full court vs 1-2-1-1. 4-second inbounds.",
			playId: "play-press",
			equipment: "Full court",
			cue: "Do not hold the ball."
		},
		{
			id: "sb6",
			title: "Scrimmage",
			minutes: 18,
			type: "scrimmage",
			notes: "Special-situation stops: BOB, SLOB, ATO.",
			cue: "Dead ball = set play."
		},
		{
			id: "sb7",
			title: "Cooldown FT",
			minutes: 6,
			type: "cooldown",
			notes: "Make 2 in a row to leave. Quiet stretch."
		}
	]
}];
var INITIAL_SETTINGS = {
	teamName: "U14 Phoenix",
	shortClubName: "PHX",
	ageGroup: "U14",
	defaultPracticeMinutes: 90,
	primaryColor: "#d4a017",
	logoDataUrl: "",
	roster: SAMPLE_ROSTER.map((r) => ({ ...r }))
};
function getInitialData() {
	return {
		settings: {
			...INITIAL_SETTINGS,
			roster: SAMPLE_ROSTER.map((r) => ({ ...r }))
		},
		plays: SAMPLE_PLAYS.map((p) => ({
			...p,
			tags: [...p.tags],
			rosterSlots: p.rosterSlots ? { ...p.rosterSlots } : void 0,
			steps: p.steps.map((s) => ({
				...s,
				players: s.players.map((pl) => ({ ...pl })),
				drawings: s.drawings.map((d) => ({
					...d,
					points: d.points.map((pt) => ({ ...pt }))
				}))
			}))
		})),
		plans: SAMPLE_PLANS.map((plan) => ({
			...plan,
			blocks: plan.blocks.map((b) => ({ ...b }))
		}))
	};
}
function emptyPlay(id) {
	return {
		id,
		name: "New play",
		court: "half",
		tags: [],
		note: "",
		updatedAt: Date.now(),
		useRosterNames: false,
		rosterLabel: "number",
		rosterSlots: {},
		steps: [{
			id: uid("st"),
			players: [],
			drawings: [],
			note: ""
		}]
	};
}
function emptyPlan(id, targetMinutes, date) {
	return {
		id,
		name: "New practice",
		date,
		targetMinutes,
		blocks: [],
		updatedAt: Date.now()
	};
}
function youth90Template(playId) {
	return [
		{
			title: "Dynamic warmup",
			minutes: 10,
			type: "warmup",
			notes: "Jog, skips, closeouts, two-line layups.",
			equipment: "Cones",
			cue: "Talk on every closeout."
		},
		{
			title: "Ball-handling series",
			minutes: 12,
			type: "drill",
			notes: "Pound series, on-move Crossover / between, weak-hand finish.",
			equipment: "1 ball each",
			cue: "Eyes up."
		},
		{
			title: "Shooting",
			minutes: 15,
			type: "drill",
			notes: "Form, then 5-spot. Track makes.",
			equipment: "2 balls per pair",
			cue: "Hold the follow-through."
		},
		{
			title: playId ? "Play install" : "Play install",
			minutes: 20,
			type: "play review",
			notes: "Walk-through, 5-on-0, then live.",
			playId,
			cue: "Walk it. Then live."
		},
		{
			title: "Breakdown",
			minutes: 15,
			type: "teaching",
			notes: "4-on-4 help and recover. Teach the extra pass.",
			cue: "See both — man and ball."
		},
		{
			title: "Scrimmage",
			minutes: 12,
			type: "scrimmage",
			notes: "Stop for the cue. Keep score.",
			cue: "Call the set live."
		},
		{
			title: "Cooldown",
			minutes: 6,
			type: "cooldown",
			notes: "Free throws, then stretch.",
			equipment: "1 ball per pair"
		}
	];
}
var KEY = "hoopplaybook.v1";
function persist(data) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {}
}
function normalizeSettings(raw) {
	const roster = Array.isArray(raw?.roster) ? raw.roster.filter((r) => r && typeof r.name === "string").map((r) => ({
		id: r.id || uid("rp"),
		number: String(r.number ?? ""),
		name: r.name,
		position: String(r.position ?? "")
	})) : SAMPLE_ROSTER.map((r) => ({ ...r }));
	return {
		teamName: raw?.teamName ?? INITIAL_SETTINGS.teamName,
		shortClubName: raw?.shortClubName ?? INITIAL_SETTINGS.shortClubName,
		ageGroup: raw?.ageGroup ?? INITIAL_SETTINGS.ageGroup,
		defaultPracticeMinutes: raw?.defaultPracticeMinutes ?? INITIAL_SETTINGS.defaultPracticeMinutes,
		primaryColor: raw?.primaryColor ?? INITIAL_SETTINGS.primaryColor,
		logoDataUrl: raw?.logoDataUrl ?? "",
		roster
	};
}
function normalizePlay(play) {
	return {
		...play,
		useRosterNames: !!play.useRosterNames,
		rosterLabel: play.rosterLabel === "name" ? "name" : "number",
		rosterSlots: play.rosterSlots ?? {},
		steps: Array.isArray(play.steps) ? play.steps : []
	};
}
function normalizePlan(plan) {
	return {
		...plan,
		blocks: (plan.blocks ?? []).map((b) => ({
			...b,
			equipment: b.equipment ?? "",
			cue: b.cue ?? ""
		}))
	};
}
function readStorage() {
	const fallback = getInitialData();
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			persist(fallback);
			return fallback;
		}
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed.plays) || !Array.isArray(parsed.plans) || !parsed.settings) {
			persist(fallback);
			return fallback;
		}
		return {
			settings: normalizeSettings(parsed.settings),
			plays: parsed.plays.map((p) => normalizePlay(p)),
			plans: parsed.plans.map((p) => normalizePlan(p))
		};
	} catch {
		persist(fallback);
		return fallback;
	}
}
var initial = getInitialData();
var useAppStore = create((set, get) => ({
	...initial,
	ready: false,
	hydrate: () => {
		const data = readStorage();
		persist(data);
		set({
			...data,
			ready: true
		});
	},
	updateSettings: (patch) => {
		const settings = {
			...get().settings,
			...patch
		};
		persist({
			settings,
			plays: get().plays,
			plans: get().plans
		});
		set({ settings });
	},
	setRoster: (roster) => {
		const settings = {
			...get().settings,
			roster
		};
		persist({
			settings,
			plays: get().plays,
			plans: get().plans
		});
		set({ settings });
	},
	createPlay: () => {
		const play = emptyPlay(uid("play"));
		const plays = [play, ...get().plays];
		persist({
			settings: get().settings,
			plays,
			plans: get().plans
		});
		set({ plays });
		return play.id;
	},
	savePlay: (play) => {
		const stamped = {
			...play,
			updatedAt: Date.now()
		};
		const plays = get().plays.map((p) => p.id === play.id ? stamped : p);
		if (!plays.some((p) => p.id === play.id)) plays.unshift(stamped);
		persist({
			settings: get().settings,
			plays,
			plans: get().plans
		});
		set({ plays });
	},
	deletePlay: (id) => {
		const plays = get().plays.filter((p) => p.id !== id);
		const plans = get().plans.map((plan) => ({
			...plan,
			blocks: plan.blocks.map((b) => b.playId === id ? {
				...b,
				playId: void 0
			} : b)
		}));
		persist({
			settings: get().settings,
			plays,
			plans
		});
		set({
			plays,
			plans
		});
	},
	duplicatePlay: (id) => {
		const src = get().plays.find((p) => p.id === id);
		if (!src) return null;
		const copy = {
			...src,
			id: uid("play"),
			name: `${src.name} (copy)`,
			updatedAt: Date.now(),
			tags: [...src.tags],
			rosterSlots: { ...src.rosterSlots },
			steps: src.steps.map((s) => ({
				...s,
				id: uid("st"),
				players: s.players.map((pl) => ({ ...pl })),
				drawings: s.drawings.map((d) => ({
					...d,
					id: uid("dr"),
					points: d.points.map((pt) => ({ ...pt }))
				}))
			}))
		};
		const plays = [copy, ...get().plays];
		persist({
			settings: get().settings,
			plays,
			plans: get().plans
		});
		set({ plays });
		return copy.id;
	},
	importPlay: (play) => {
		const copy = {
			...normalizePlay(play),
			id: uid("play"),
			updatedAt: Date.now()
		};
		const plays = [copy, ...get().plays];
		persist({
			settings: get().settings,
			plays,
			plans: get().plans
		});
		set({ plays });
		return copy.id;
	},
	createPlan: () => {
		const plan = emptyPlan(uid("plan"), get().settings.defaultPracticeMinutes, todayISO());
		const plans = [plan, ...get().plans];
		persist({
			settings: get().settings,
			plays: get().plays,
			plans
		});
		set({ plans });
		return plan.id;
	},
	savePlan: (plan) => {
		const stamped = {
			...plan,
			updatedAt: Date.now()
		};
		const plans = get().plans.map((p) => p.id === plan.id ? stamped : p);
		if (!plans.some((p) => p.id === plan.id)) plans.unshift(stamped);
		persist({
			settings: get().settings,
			plays: get().plays,
			plans
		});
		set({ plans });
	},
	deletePlan: (id) => {
		const plans = get().plans.filter((p) => p.id !== id);
		persist({
			settings: get().settings,
			plays: get().plays,
			plans
		});
		set({ plans });
	},
	duplicatePlan: (id) => {
		const src = get().plans.find((p) => p.id === id);
		if (!src) return null;
		const copy = {
			...src,
			id: uid("plan"),
			name: `${src.name} (copy)`,
			date: todayISO(),
			updatedAt: Date.now(),
			blocks: src.blocks.map((b) => ({
				...b,
				id: uid("bk")
			}))
		};
		const plans = [copy, ...get().plans];
		persist({
			settings: get().settings,
			plays: get().plays,
			plans
		});
		set({ plans });
		return copy.id;
	},
	buildYouth90: () => {
		const firstPlay = get().plays[0]?.id;
		const blocks = youth90Template(firstPlay).map((b) => ({
			...b,
			id: uid("bk")
		}));
		const plan = {
			id: uid("plan"),
			name: "90-min youth practice",
			date: todayISO(),
			targetMinutes: 90,
			blocks,
			updatedAt: Date.now()
		};
		const plans = [plan, ...get().plans];
		persist({
			settings: get().settings,
			plays: get().plays,
			plans
		});
		set({ plans });
		return plan.id;
	}
}));
function planMinutes(plan) {
	return plan.blocks.reduce((sum, b) => sum + (Number(b.minutes) || 0), 0);
}
//#endregion
export { resizeLogoFile as S, POSITIONS as _, formatDateLabel as a, drawBrandMark as b, prefersReducedMotion as c, useAppStore as d, youth90Template as f, PLAY_TAGS as g, COLOR_PRESETS as h, escHtml as i, slugFile as l, BLOCK_TYPES as m, downloadBlob as n, formatMmss as o, AGE_GROUPS as p, downloadText as r, planMinutes as s, cn as t, uid as u, applyBrandColor as v, normalizeAccent as x, defaultMarkSvg as y };
