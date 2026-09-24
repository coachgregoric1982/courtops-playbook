import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, d as DialogContent$1, f as DialogOverlay, l as Dialog$1, m as DialogTitle, p as DialogPortal, u as DialogClose, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn, u as uid } from "./store-D1YpRH0R.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/court-canvas-VaLaLgUs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed z-50 left-1/2 top-1/2 w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)] focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-xl tracking-tight text-fg",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "inline-flex size-11 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		}), children]
	})] });
}
function SheetContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-2xl border border-border bg-surface px-5 pt-5 pb-5 shadow-[var(--shadow-border)] focus:outline-none", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-xl tracking-tight text-fg",
				children: title
			}),
			children
		]
	})] });
}
var THEME = {
	woodA: "#2a1c12",
	woodB: "#23180f",
	woodC: "#331f14",
	paint: "rgba(92, 48, 28, 0.45)",
	line: "#e6d7b8",
	lineDim: "rgba(230, 215, 184, 0.4)",
	hoop: "#d4a017",
	net: "rgba(244, 241, 234, 0.75)",
	rim: "#c45c4a",
	offense: "#e8b84a",
	offenseInk: "#140e04",
	defense: "#4a8fb8",
	defenseInk: "#071018",
	pass: "#f4f1ea",
	dribble: "#e8c56b",
	cut: "#c8d0d8",
	screen: "#d4a017",
	shot: "#e07060",
	select: "#f4f1ea"
};
var PRINT_THEME = {
	woodA: "#ffffff",
	woodB: "#f4f4f4",
	woodC: "#ffffff",
	paint: "rgba(0, 0, 0, 0.06)",
	line: "#111111",
	lineDim: "rgba(17, 17, 17, 0.35)",
	hoop: "#111111",
	net: "rgba(17, 17, 17, 0.55)",
	rim: "#111111",
	offense: "#111111",
	offenseInk: "#ffffff",
	defense: "#ffffff",
	defenseInk: "#111111",
	pass: "#111111",
	dribble: "#333333",
	cut: "#444444",
	screen: "#111111",
	shot: "#111111",
	select: "#111111"
};
var currentTheme = THEME;
function withTheme(print, fn) {
	const prev = currentTheme;
	currentTheme = print ? PRINT_THEME : THEME;
	try {
		return fn();
	} finally {
		currentTheme = prev;
	}
}
/** FIBA meters */
var F = {
	length: 28,
	width: 15,
	half: 14,
	basket: 1.575,
	threeR: 6.75,
	corner: .9,
	keyW: 4.9,
	keyL: 5.8,
	ftR: 1.8,
	noCharge: 1.25,
	ccR: 1.8,
	bbW: 1.8,
	bbFromBase: 1.2,
	rimR: .225
};
function layoutFor(type, w, h, pad = 10) {
	const innerW = Math.max(1, w - pad * 2);
	const innerH = Math.max(1, h - pad * 2);
	const aspect = type === "half" ? 15 / 14 : 28 / 15;
	let cw;
	let ch;
	if (innerW / innerH > aspect) {
		ch = innerH;
		cw = ch * aspect;
	} else {
		cw = innerW;
		ch = cw / aspect;
	}
	const ox = (w - cw) / 2;
	const oy = (h - ch) / 2;
	return {
		type,
		ox,
		oy,
		cw,
		ch,
		toX: (nx) => ox + nx * cw,
		toY: (ny) => oy + ny * ch,
		fromX: (px) => (px - ox) / cw,
		fromY: (py) => (py - oy) / ch,
		mX: (m) => type === "half" ? ox + m / 15 * cw : ox + m / 28 * cw,
		mY: (m) => type === "half" ? oy + m / 14 * ch : oy + m / 15 * ch
	};
}
function playerRadius(L) {
	return Math.max(13, Math.min(22, Math.min(L.cw, L.ch) * .048));
}
function hoopNorm(type, nx = .5, ny = .5) {
	if (type === "half") return {
		x: .5,
		y: F.basket / 14
	};
	if (nx < .5) return {
		x: F.basket / 28,
		y: .5
	};
	return {
		x: 1 - F.basket / 28,
		y: .5
	};
}
function drawCourt(ctx, L, print = false) {
	withTheme(print, () => {
		ctx.save();
		roundRect(ctx, L.ox, L.oy, L.cw, L.ch, 6);
		ctx.clip();
		drawWood(ctx, L, print);
		if (L.type === "half") drawHalf(ctx, L);
		else drawFull(ctx, L);
		ctx.restore();
		ctx.save();
		ctx.strokeStyle = currentTheme.line;
		ctx.lineWidth = Math.max(2, L.cw / 220);
		roundRect(ctx, L.ox, L.oy, L.cw, L.ch, 6);
		ctx.stroke();
		ctx.restore();
	});
}
function drawWood(ctx, L, print) {
	const boards = L.type === "half" ? 15 : 28;
	const along = L.cw;
	const across = L.ch;
	const bw = along / boards;
	for (let i = 0; i < boards; i++) {
		ctx.fillStyle = i % 2 === 0 ? currentTheme.woodA : currentTheme.woodB;
		ctx.fillRect(L.ox + i * bw, L.oy, bw + .5, across);
	}
	if (print) return;
	const g = ctx.createRadialGradient(L.ox + L.cw / 2, L.oy + L.ch / 2, Math.min(L.cw, L.ch) * .2, L.ox + L.cw / 2, L.oy + L.ch / 2, Math.max(L.cw, L.ch) * .72);
	g.addColorStop(0, "rgba(0,0,0,0)");
	g.addColorStop(1, "rgba(0,0,0,0.28)");
	ctx.fillStyle = g;
	ctx.fillRect(L.ox, L.oy, L.cw, L.ch);
}
function lineW(L) {
	return Math.max(1.4, L.cw / 260);
}
function drawHalf(ctx, L) {
	const X = (m) => L.mX(m);
	const Y = (m) => L.mY(m);
	const lw = lineW(L);
	ctx.strokeStyle = currentTheme.line;
	ctx.fillStyle = currentTheme.paint;
	ctx.lineWidth = lw;
	const keyLeft = 7.5 - F.keyW / 2;
	ctx.fillRect(X(keyLeft), Y(0), X(keyLeft + F.keyW) - X(keyLeft), Y(F.keyL) - Y(0));
	ctx.strokeRect(X(keyLeft), Y(0), X(keyLeft + F.keyW) - X(keyLeft), Y(F.keyL) - Y(0));
	const ftcx = X(7.5);
	const ftcy = Y(F.keyL);
	const ftr = X(7.5 + F.ftR) - X(7.5);
	ctx.beginPath();
	ctx.arc(ftcx, ftcy, ftr, 0, Math.PI);
	ctx.stroke();
	ctx.save();
	ctx.setLineDash([6, 5]);
	ctx.beginPath();
	ctx.arc(ftcx, ftcy, ftr, Math.PI, Math.PI * 2);
	ctx.stroke();
	ctx.restore();
	ctx.beginPath();
	ctx.moveTo(X(0), Y(14));
	ctx.lineTo(X(15), Y(14));
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(X(7.5), Y(14), X(7.5 + F.ccR) - X(7.5), Math.PI, 0, true);
	ctx.stroke();
	drawThreeHalf(ctx, L, X, Y);
	drawHoopHalf(ctx, L, X, Y);
}
function drawThreeHalf(ctx, L, X, Y) {
	const bx = 7.5;
	const by = F.basket;
	const dx = F.width / 2 - F.corner;
	const meetY = by + Math.sqrt(F.threeR * F.threeR - dx * dx);
	ctx.strokeStyle = currentTheme.line;
	ctx.lineWidth = lineW(L);
	ctx.beginPath();
	ctx.moveTo(X(F.corner), Y(0));
	ctx.lineTo(X(F.corner), Y(meetY));
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(X(15 - F.corner), Y(0));
	ctx.lineTo(X(15 - F.corner), Y(meetY));
	ctx.stroke();
	const cx = X(bx);
	const cy = Y(by);
	const r = X(bx + F.threeR) - X(bx);
	const aL = Math.atan2(Y(meetY) - cy, X(F.corner) - cx);
	const aR = Math.atan2(Y(meetY) - cy, X(15 - F.corner) - cx);
	ctx.beginPath();
	ctx.arc(cx, cy, r, aR, aL);
	ctx.stroke();
}
function drawHoopHalf(ctx, L, X, Y) {
	const lw = lineW(L);
	ctx.strokeStyle = currentTheme.line;
	ctx.lineWidth = lw + 1;
	ctx.beginPath();
	ctx.moveTo(X(7.5 - F.bbW / 2), Y(F.bbFromBase));
	ctx.lineTo(X(7.5 + F.bbW / 2), Y(F.bbFromBase));
	ctx.stroke();
	const cx = X(7.5);
	const cy = Y(F.basket);
	const ncr = X(7.5 + F.noCharge) - X(7.5);
	ctx.lineWidth = lw;
	ctx.beginPath();
	ctx.arc(cx, cy, ncr, 0, Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(cx - ncr, cy);
	ctx.lineTo(cx - ncr, Y(F.bbFromBase));
	ctx.moveTo(cx + ncr, cy);
	ctx.lineTo(cx + ncr, Y(F.bbFromBase));
	ctx.stroke();
	const rr = X(7.5 + F.rimR) - X(7.5);
	ctx.strokeStyle = currentTheme.rim;
	ctx.lineWidth = lw + .6;
	ctx.beginPath();
	ctx.arc(cx, cy, rr, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = currentTheme.net;
	ctx.lineWidth = 1;
	for (let i = 0; i < 6; i++) {
		const a = Math.PI * (i + .5) / 6 + Math.PI * .15;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
		ctx.lineTo(cx + Math.cos(a) * rr * .3, cy + rr * 1.7);
		ctx.stroke();
	}
}
function drawFull(ctx, L) {
	const X = (m) => L.mX(m);
	const Y = (m) => L.mY(m);
	const lw = lineW(L);
	ctx.strokeStyle = currentTheme.line;
	ctx.lineWidth = lw;
	ctx.beginPath();
	ctx.moveTo(X(14), Y(0));
	ctx.lineTo(X(14), Y(15));
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(X(14), Y(7.5), X(14 + F.ccR) - X(14), 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(X(14), Y(7.5), Math.max(3, lw * 1.4), 0, Math.PI * 2);
	ctx.fillStyle = currentTheme.line;
	ctx.fill();
	drawEndFull(ctx, L, "left");
	drawEndFull(ctx, L, "right");
}
function drawEndFull(ctx, L, end) {
	const X = (m) => L.mX(end === "left" ? m : 28 - m);
	const Y = (m) => L.mY(m);
	const lw = lineW(L);
	const keyTop = 7.5 - F.keyW / 2;
	ctx.fillStyle = currentTheme.paint;
	ctx.strokeStyle = currentTheme.line;
	ctx.lineWidth = lw;
	const x0 = X(0);
	const x1 = X(F.keyL);
	ctx.fillRect(Math.min(x0, x1), Y(keyTop), Math.abs(x1 - x0), Y(keyTop + F.keyW) - Y(keyTop));
	ctx.strokeRect(Math.min(x0, x1), Y(keyTop), Math.abs(x1 - x0), Y(keyTop + F.keyW) - Y(keyTop));
	const ftcx = X(F.keyL);
	const ftcy = Y(7.5);
	const ftr = Math.abs(X(F.keyL + F.ftR) - X(F.keyL));
	const facing = end === "left" ? 0 : Math.PI;
	ctx.beginPath();
	ctx.arc(ftcx, ftcy, ftr, facing - Math.PI / 2, facing + Math.PI / 2);
	ctx.stroke();
	ctx.save();
	ctx.setLineDash([6, 5]);
	ctx.beginPath();
	ctx.arc(ftcx, ftcy, ftr, facing + Math.PI / 2, facing - Math.PI / 2);
	ctx.stroke();
	ctx.restore();
	const bx = F.basket;
	const by = 7.5;
	const dx = F.width / 2 - F.corner;
	const meet = bx + Math.sqrt(F.threeR * F.threeR - dx * dx);
	ctx.beginPath();
	ctx.moveTo(X(0), Y(F.corner));
	ctx.lineTo(X(meet), Y(F.corner));
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(X(0), Y(15 - F.corner));
	ctx.lineTo(X(meet), Y(15 - F.corner));
	ctx.stroke();
	const cx = X(bx);
	const cy = Y(by);
	const r = Math.abs(X(bx + F.threeR) - X(bx));
	const a1 = Math.atan2(Y(F.corner) - cy, X(meet) - cx);
	const a2 = Math.atan2(Y(15 - F.corner) - cy, X(meet) - cx);
	ctx.beginPath();
	if (end === "left") ctx.arc(cx, cy, r, a1, a2);
	else ctx.arc(cx, cy, r, a2, a1);
	ctx.stroke();
	ctx.lineWidth = lw + 1;
	ctx.beginPath();
	ctx.moveTo(X(F.bbFromBase), Y(7.5 - F.bbW / 2));
	ctx.lineTo(X(F.bbFromBase), Y(7.5 + F.bbW / 2));
	ctx.stroke();
	const ncr = Math.abs(X(bx + F.noCharge) - X(bx));
	ctx.lineWidth = lw;
	ctx.beginPath();
	if (end === "left") ctx.arc(cx, cy, ncr, -Math.PI / 2, Math.PI / 2);
	else ctx.arc(cx, cy, ncr, Math.PI / 2, -Math.PI / 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(cx, cy - ncr);
	ctx.lineTo(X(F.bbFromBase), cy - ncr);
	ctx.moveTo(cx, cy + ncr);
	ctx.lineTo(X(F.bbFromBase), cy + ncr);
	ctx.stroke();
	const rr = Math.abs(X(bx + F.rimR) - X(bx));
	ctx.strokeStyle = currentTheme.rim;
	ctx.lineWidth = lw + .6;
	ctx.beginPath();
	ctx.arc(cx, cy, rr, 0, Math.PI * 2);
	ctx.stroke();
}
function roundRect(ctx, x, y, w, h, r) {
	const rr = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
}
function lerpPlayers(from, to, t) {
	const e = easeInOut(t);
	return to.map((p) => {
		const src = from.find((q) => q.side === p.side && q.n === p.n);
		if (!src) return p;
		return {
			...p,
			x: src.x + (p.x - src.x) * e,
			y: src.y + (p.y - src.y) * e
		};
	});
}
function easeInOut(t) {
	return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function drawDrawings(ctx, L, drawings, alpha = 1, print = false) {
	withTheme(print, () => {
		ctx.save();
		ctx.globalAlpha = alpha;
		for (const d of drawings) {
			if (d.points.length < 1) continue;
			if (d.type === "screen") drawScreen(ctx, L, d.points);
			else if (d.type === "shot") drawShot(ctx, L, d.points);
			else drawPath(ctx, L, d);
		}
		ctx.restore();
	});
}
function pts(L, points) {
	return points.map((p) => ({
		x: L.toX(p.x),
		y: L.toY(p.y)
	}));
}
function drawPath(ctx, L, d) {
	const p = pts(L, d.points);
	if (p.length < 2) return;
	const w = Math.max(2, L.cw / 180);
	ctx.lineWidth = w;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	if (d.type === "pass") {
		ctx.strokeStyle = currentTheme.pass;
		ctx.setLineDash([]);
		strokePoly(ctx, p);
		arrowHead(ctx, p, currentTheme.pass, w * 3.2);
	} else if (d.type === "cut") {
		ctx.strokeStyle = currentTheme.cut;
		ctx.setLineDash([8, 6]);
		strokePoly(ctx, p);
		ctx.setLineDash([]);
		arrowHead(ctx, p, currentTheme.cut, w * 3.2);
	} else {
		ctx.strokeStyle = currentTheme.dribble;
		ctx.setLineDash([]);
		strokeWavy(ctx, p, Math.max(5, L.cw / 70));
		arrowHead(ctx, p, currentTheme.dribble, w * 2.6);
	}
}
function strokePoly(ctx, p) {
	ctx.beginPath();
	ctx.moveTo(p[0].x, p[0].y);
	for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
	ctx.stroke();
}
function strokeWavy(ctx, p, amp) {
	const samples = [];
	for (let i = 1; i < p.length; i++) {
		const a = p[i - 1];
		const b = p[i];
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const n = Math.max(8, Math.floor((Math.hypot(dx, dy) || 1) / 6));
		for (let k = 0; k < n; k++) {
			const t = k / n;
			samples.push({
				x: a.x + dx * t,
				y: a.y + dy * t
			});
		}
	}
	samples.push(p[p.length - 1]);
	ctx.beginPath();
	let dist = 0;
	for (let i = 0; i < samples.length; i++) {
		if (i > 0) dist += Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y);
		const prev = samples[Math.max(0, i - 1)];
		const dx = samples[i].x - prev.x;
		const dy = samples[i].y - prev.y;
		const len = Math.hypot(dx, dy) || 1;
		const px = -dy / len;
		const py = dx / len;
		const off = Math.sin(dist / 11) * amp;
		const x = samples[i].x + px * off;
		const y = samples[i].y + py * off;
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	}
	ctx.stroke();
}
function arrowHead(ctx, p, color, size) {
	const a = p[p.length - 2];
	const b = p[p.length - 1];
	const ang = Math.atan2(b.y - a.y, b.x - a.x);
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(b.x, b.y);
	ctx.lineTo(b.x - size * Math.cos(ang - .4), b.y - size * Math.sin(ang - .4));
	ctx.lineTo(b.x - size * Math.cos(ang + .4), b.y - size * Math.sin(ang + .4));
	ctx.closePath();
	ctx.fill();
}
function drawScreen(ctx, L, points) {
	const p = pts(L, points);
	const a = p[0];
	const b = p[p.length - 1] ?? a;
	const ang = Math.atan2(b.y - a.y, b.x - a.x);
	const stem = Math.max(10, L.cw / 28);
	const bar = Math.max(16, L.cw / 16);
	const w = Math.max(3, L.cw / 140);
	ctx.strokeStyle = currentTheme.screen;
	ctx.lineCap = "round";
	ctx.lineWidth = w;
	ctx.beginPath();
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.stroke();
	const tx = b.x + Math.cos(ang) * (stem * .05);
	const ty = b.y + Math.sin(ang) * (stem * .05);
	const px = Math.cos(ang + Math.PI / 2);
	const py = Math.sin(ang + Math.PI / 2);
	ctx.lineWidth = w + 1.4;
	ctx.beginPath();
	ctx.moveTo(tx - px * bar * .5, ty - py * bar * .5);
	ctx.lineTo(tx + px * bar * .5, ty + py * bar * .5);
	ctx.stroke();
}
function drawShot(ctx, L, points) {
	const p = pts(L, points);
	const a = p[0];
	const hoop = hoopNorm(L.type, points[0].x, points[0].y);
	const hx = L.toX(hoop.x);
	const hy = L.toY(hoop.y);
	const b = p.length > 1 ? p[p.length - 1] : {
		x: hx,
		y: hy
	};
	ctx.strokeStyle = currentTheme.shot;
	ctx.fillStyle = currentTheme.shot;
	ctx.lineWidth = Math.max(2, L.cw / 180);
	ctx.beginPath();
	const mx = (a.x + b.x) / 2;
	const my = (a.y + b.y) / 2 - Math.max(18, L.ch / 14);
	ctx.moveTo(a.x, a.y);
	ctx.quadraticCurveTo(mx, my, b.x, b.y);
	ctx.stroke();
	const r = Math.max(6, L.cw / 70);
	ctx.beginPath();
	ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
	ctx.fillStyle = currentTheme.offense;
	ctx.fill();
	ctx.strokeStyle = currentTheme.offenseInk;
	ctx.lineWidth = 1.2;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(a.x, a.y, r * .55, -.6, 2.2);
	ctx.stroke();
}
function drawPlayers(ctx, L, players, opts) {
	const resolved = opts && typeof opts === "object" ? opts : { selectedId: opts };
	withTheme(resolved.print, () => {
		const r = playerRadius(L);
		const ordered = [...players.filter((p) => p.side === "defense"), ...players.filter((p) => p.side === "offense")];
		for (const p of ordered) {
			const x = L.toX(p.x);
			const y = L.toY(p.y);
			const fill = p.side === "offense" ? currentTheme.offense : currentTheme.defense;
			const ink = p.side === "offense" ? currentTheme.offenseInk : currentTheme.defenseInk;
			const label = resolved.labelFor?.(p) ?? String(p.n);
			ctx.save();
			ctx.beginPath();
			ctx.arc(x, y, r + 1.5, 0, Math.PI * 2);
			ctx.fillStyle = resolved.print ? "transparent" : "rgba(0,0,0,0.35)";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.fillStyle = fill;
			ctx.fill();
			if (p.side === "defense" || resolved.print) {
				ctx.lineWidth = resolved.print ? 2 : 2;
				ctx.strokeStyle = resolved.print ? "#111111" : "rgba(7,16,24,0.45)";
				ctx.stroke();
			}
			if (resolved.selectedId === p.id) {
				ctx.lineWidth = 2.4;
				ctx.strokeStyle = currentTheme.select;
				ctx.stroke();
			}
			ctx.fillStyle = ink;
			const size = label.length > 2 ? r * .72 : r * 1.05;
			ctx.font = `600 ${Math.round(size)}px "Barlow Condensed", "Arial Narrow", sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(label, x, y + .5);
			ctx.restore();
		}
	});
}
function hitPlayer(players, L, px, py) {
	const r = playerRadius(L) + 10;
	const ordered = [...players.filter((p) => p.side === "defense"), ...players.filter((p) => p.side === "offense")];
	for (let i = ordered.length - 1; i >= 0; i--) {
		const p = ordered[i];
		const dx = L.toX(p.x) - px;
		const dy = L.toY(p.y) - py;
		if (dx * dx + dy * dy <= r * r) return p;
	}
}
function drawStep(ctx, L, step, opts) {
	withTheme(opts?.print, () => {
		drawCourt(ctx, L, opts?.print);
		drawDrawings(ctx, L, step.drawings, 1, opts?.print);
		drawPlayers(ctx, L, opts?.playerOverride ?? step.players, {
			selectedId: opts?.selectedId,
			labelFor: opts?.labelFor,
			print: opts?.print
		});
	});
}
function snapshotStep(opts) {
	const canvas = document.createElement("canvas");
	canvas.width = opts.w;
	canvas.height = opts.h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return canvas;
	ctx.fillStyle = opts.print ? "#ffffff" : "#070b12";
	ctx.fillRect(0, 0, opts.w, opts.h);
	drawStep(ctx, layoutFor(opts.court, opts.w, opts.h, opts.pad ?? 12), opts.step, {
		print: opts.print,
		labelFor: opts.labelFor
	});
	return canvas;
}
function clamp01(n) {
	return Math.max(.02, Math.min(.98, n));
}
function CourtCanvas({ court, step, prevStep, blend = 1, tool = "select", placeSide = "offense", interactive = false, selectedId, onSelect, onChange, className, labelFor }) {
	const wrapRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const layoutRef = (0, import_react.useRef)(null);
	const floorRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(null);
	const stepRef = (0, import_react.useRef)(step);
	stepRef.current = step;
	const toolRef = (0, import_react.useRef)(tool);
	toolRef.current = tool;
	const sideRef = (0, import_react.useRef)(placeSide);
	sideRef.current = placeSide;
	const paint = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const w = wrap.clientWidth;
		const h = wrap.clientHeight;
		if (w < 2 || h < 2) return;
		if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			floorRef.current = null;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		const L = layoutFor(court, w, h, 8);
		layoutRef.current = L;
		if (!floorRef.current || floorRef.current.width !== canvas.width || floorRef.current.height !== canvas.height) {
			const off = document.createElement("canvas");
			off.width = canvas.width;
			off.height = canvas.height;
			const octx = off.getContext("2d");
			if (octx) {
				octx.setTransform(dpr, 0, 0, dpr, 0, 0);
				drawCourt(octx, L);
				floorRef.current = off;
			}
		}
		if (floorRef.current) ctx.drawImage(floorRef.current, 0, 0, w, h);
		const t = blend;
		drawDrawings(ctx, L, prevStep && t < .55 ? prevStep.drawings : step.drawings, prevStep && t < .55 ? 1 - t * .4 : t < 1 ? .55 + t * .45 : 1);
		drawPlayers(ctx, L, prevStep && t < 1 ? lerpPlayers(prevStep.players, step.players, t) : step.players, {
			selectedId,
			labelFor
		});
	}, [
		blend,
		court,
		labelFor,
		prevStep,
		selectedId,
		step
	]);
	(0, import_react.useEffect)(() => {
		floorRef.current = null;
		paint();
	}, [court, paint]);
	(0, import_react.useEffect)(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		const ro = new ResizeObserver(() => paint());
		ro.observe(wrap);
		paint();
		return () => ro.disconnect();
	}, [paint]);
	const eventPoint = (e) => {
		const canvas = canvasRef.current;
		const L = layoutRef.current;
		if (!canvas || !L) return null;
		const r = canvas.getBoundingClientRect();
		const x = e.clientX - r.left;
		const y = e.clientY - r.top;
		return {
			x,
			y,
			nx: clamp01(L.fromX(x)),
			ny: clamp01(L.fromY(y)),
			L
		};
	};
	const onPointerDown = (e) => {
		if (!interactive) return;
		const hit = eventPoint(e);
		if (!hit) return;
		e.target.setPointerCapture(e.pointerId);
		const cur = stepRef.current;
		const player = hitPlayer(cur.players, hit.L, hit.x, hit.y);
		if (toolRef.current === "select") {
			if (player) {
				dragRef.current = {
					kind: "player",
					playerId: player.id,
					points: []
				};
				onSelect?.(player.id);
			} else {
				onSelect?.(null);
				const side = sideRef.current;
				if (cur.players.filter((p) => p.side === side).length < 5) {
					const used = new Set(cur.players.filter((p) => p.side === side).map((p) => p.n));
					const n = [
						1,
						2,
						3,
						4,
						5
					].find((k) => !used.has(k)) ?? 1;
					const next = {
						id: uid(side === "offense" ? "o" : "d"),
						n,
						side,
						x: hit.nx,
						y: hit.ny
					};
					onChange?.({
						...cur,
						players: [...cur.players, next]
					});
					onSelect?.(next.id);
				}
			}
			return;
		}
		dragRef.current = {
			kind: "draw",
			points: [{
				x: hit.nx,
				y: hit.ny
			}]
		};
	};
	const onPointerMove = (e) => {
		if (!interactive || !dragRef.current) return;
		const hit = eventPoint(e);
		if (!hit) return;
		const cur = stepRef.current;
		if (dragRef.current.kind === "player" && dragRef.current.playerId) {
			const id = dragRef.current.playerId;
			onChange?.({
				...cur,
				players: cur.players.map((p) => p.id === id ? {
					...p,
					x: hit.nx,
					y: hit.ny
				} : p)
			});
			return;
		}
		const pts = dragRef.current.points;
		const last = pts[pts.length - 1];
		if (last && Math.hypot(hit.nx - last.x, hit.ny - last.y) > .012 && pts.length < 64) pts.push({
			x: hit.nx,
			y: hit.ny
		});
	};
	const onPointerUp = () => {
		if (!interactive || !dragRef.current) return;
		const drag = dragRef.current;
		dragRef.current = null;
		if (drag.kind !== "draw") return;
		const cur = stepRef.current;
		const t = toolRef.current;
		if (t === "select") return;
		const points = drag.points;
		if (points.length === 0) return;
		if ((t === "pass" || t === "cut" || t === "dribble") && points.length < 2) return;
		const drawing = {
			id: uid("dr"),
			type: t,
			points: points.length === 1 ? [points[0], points[0]] : points
		};
		onChange?.({
			...cur,
			drawings: [...cur.drawings, drawing]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: className ?? (court === "half" ? "relative aspect-half w-full" : "relative aspect-full w-full"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute inset-0 size-full touch-none rounded-lg",
			onPointerDown,
			onPointerMove,
			onPointerUp,
			onPointerCancel: onPointerUp
		})
	});
}
//#endregion
export { snapshotStep as a, SheetContent as i, Dialog as n, DialogContent as r, CourtCanvas as t };
