import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useAppStore, g as PLAY_TAGS, u as uid, v as applyBrandColor } from "./store-D1YpRH0R.mjs";
import { r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BTQHqHHs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function BrandTheme() {
	const color = useAppStore((s) => s.settings.primaryColor);
	(0, import_react.useEffect)(() => {
		applyBrandColor(color || "#d4a017");
	}, [color]);
	return null;
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SHARE_LIMIT = 6e3;
var DRAW_TYPES = [
	"pass",
	"dribble",
	"cut",
	"screen",
	"shot"
];
function q(n) {
	return Math.round(n * 1e3) / 1e3;
}
function packPayload(play) {
	return {
		n: play.name,
		c: play.court === "full" ? "f" : "h",
		t: play.tags,
		o: play.note,
		s: play.steps.map((st) => ({
			n: st.note,
			p: st.players.map((pl) => [
				pl.n,
				pl.side === "defense" ? 1 : 0,
				q(pl.x),
				q(pl.y)
			]),
			d: st.drawings.map((d) => [DRAW_TYPES.indexOf(d.type), d.points.flatMap((pt) => [q(pt.x), q(pt.y)])])
		})),
		r: play.useRosterNames ? 1 : void 0,
		l: play.rosterLabel === "name" ? "a" : play.useRosterNames ? "n" : void 0,
		m: play.rosterSlots && Object.keys(play.rosterSlots).length ? play.rosterSlots : void 0
	};
}
function unpackPayload(raw) {
	const tags = (raw.t ?? []).filter((t) => PLAY_TAGS.includes(t));
	const steps = (raw.s ?? []).map((st) => ({
		id: uid("st"),
		note: st.n ?? "",
		players: (st.p ?? []).map((row) => {
			const n = row[0];
			if (![
				1,
				2,
				3,
				4,
				5
			].includes(n)) return null;
			return {
				id: uid(row[1] ? "d" : "o"),
				n,
				side: row[1] ? "defense" : "offense",
				x: Number(row[2]) || 0,
				y: Number(row[3]) || 0
			};
		}).filter((p) => !!p),
		drawings: (st.d ?? []).map((row) => {
			const type = DRAW_TYPES[row[0]];
			const pts = row[1] ?? [];
			if (!type || pts.length < 2) return null;
			const points = [];
			for (let i = 0; i + 1 < pts.length; i += 2) points.push({
				x: pts[i],
				y: pts[i + 1]
			});
			return {
				id: uid("dr"),
				type,
				points
			};
		}).filter((d) => !!d)
	}));
	const court = raw.c === "f" ? "full" : "half";
	const rosterLabel = raw.l === "a" ? "name" : "number";
	const rosterSlots = {};
	if (raw.m) for (const [k, v] of Object.entries(raw.m)) {
		const n = Number(k);
		if ([
			1,
			2,
			3,
			4,
			5
		].includes(n) && v) rosterSlots[n] = v;
	}
	return {
		id: uid("play"),
		name: raw.n || "Shared play",
		court,
		tags,
		note: raw.o ?? "",
		steps: steps.length ? steps : [{
			id: uid("st"),
			players: [],
			drawings: [],
			note: ""
		}],
		updatedAt: Date.now(),
		useRosterNames: raw.r === 1,
		rosterLabel,
		rosterSlots
	};
}
function bytesToB64url(bytes) {
	let s = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(b64) {
	const pad = "=".repeat((4 - b64.length % 4) % 4);
	const raw = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad);
	const out = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
	return out;
}
async function gzipToB64(text) {
	const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
	const buf = await new Response(stream).arrayBuffer();
	return bytesToB64url(new Uint8Array(buf));
}
async function gunzipFromB64(b64) {
	const bytes = b64urlToBytes(b64);
	const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
	const stream = new Blob([ab]).stream().pipeThrough(new DecompressionStream("gzip"));
	const buf = await new Response(stream).arrayBuffer();
	return new TextDecoder().decode(buf);
}
function rawToB64(text) {
	return bytesToB64url(new TextEncoder().encode(text));
}
function rawFromB64(b64) {
	return new TextDecoder().decode(b64urlToBytes(b64));
}
function shareBase() {
	if (typeof window === "undefined") return "/";
	return `${window.location.origin}${window.location.pathname.replace(/\/(playbook|practices|settings).*$/, "/")}`;
}
async function packPlay(play) {
	const json = JSON.stringify(packPayload(play));
	let payload = `r1.${rawToB64(json)}`;
	try {
		if (typeof CompressionStream !== "undefined") payload = `h1.${await gzipToB64(json)}`;
	} catch {
		payload = `r1.${rawToB64(json)}`;
	}
	const url = `${shareBase()}#hp=${payload}`;
	return {
		url,
		tooLong: url.length > SHARE_LIMIT,
		payload
	};
}
async function unpackPlay(payload) {
	const trimmed = payload.trim();
	let json;
	if (trimmed.startsWith("h1.")) json = await gunzipFromB64(trimmed.slice(3));
	else if (trimmed.startsWith("r1.")) json = rawFromB64(trimmed.slice(3));
	else json = rawFromB64(trimmed);
	const raw = JSON.parse(json);
	if (!raw || typeof raw !== "object" || !Array.isArray(raw.s)) throw new Error("Not a play");
	return unpackPayload(raw);
}
function readShareParam() {
	if (typeof window === "undefined") return null;
	const hash = window.location.hash;
	if (hash.startsWith("#hp=")) return decodeURIComponent(hash.slice(4));
	return new URLSearchParams(window.location.search).get("hp");
}
function clearShareParam() {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);
	url.searchParams.delete("hp");
	url.hash = "";
	window.history.replaceState(null, "", url.pathname + url.search);
}
function playToJson(play) {
	return JSON.stringify(play, null, 2);
}
function parsePlayFile(text) {
	const raw = JSON.parse(text);
	if (!raw || typeof raw !== "object") throw new Error("Not a play file");
	if (!Array.isArray(raw.steps)) throw new Error("Play is missing steps");
	const court = raw.court === "full" ? "full" : "half";
	const tags = Array.isArray(raw.tags) ? raw.tags.filter((t) => PLAY_TAGS.includes(t)) : [];
	const steps = raw.steps.map((st) => ({
		id: uid("st"),
		note: typeof st.note === "string" ? st.note : "",
		players: Array.isArray(st.players) ? st.players.filter((p) => p && [
			1,
			2,
			3,
			4,
			5
		].includes(p.n)).map((p) => ({
			id: uid(p.side === "defense" ? "d" : "o"),
			n: p.n,
			side: p.side === "defense" ? "defense" : "offense",
			x: Number(p.x) || 0,
			y: Number(p.y) || 0
		})) : [],
		drawings: Array.isArray(st.drawings) ? st.drawings.filter((d) => d && DRAW_TYPES.includes(d.type) && Array.isArray(d.points)).map((d) => ({
			id: uid("dr"),
			type: d.type,
			points: d.points.map((pt) => ({
				x: Number(pt.x) || 0,
				y: Number(pt.y) || 0
			}))
		})) : []
	}));
	return {
		id: uid("play"),
		name: typeof raw.name === "string" && raw.name ? raw.name : "Imported play",
		court,
		tags,
		note: typeof raw.note === "string" ? raw.note : "",
		steps: steps.length ? steps : [{
			id: uid("st"),
			players: [],
			drawings: [],
			note: ""
		}],
		updatedAt: Date.now(),
		useRosterNames: !!raw.useRosterNames,
		rosterLabel: raw.rosterLabel === "name" ? "name" : "number",
		rosterSlots: raw.rosterSlots ?? {}
	};
}
var styles_default = "/assets/styles-C2luZbeT.css";
var APP_NAME = "CourtOps Playbook";
function HydrateStore() {
	const hydrate = useAppStore((s) => s.hydrate);
	const importPlay = useAppStore((s) => s.importPlay);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		hydrate();
		const consume = async () => {
			const packed = readShareParam();
			if (!packed) return;
			try {
				const play = await unpackPlay(packed);
				const id = importPlay(play);
				clearShareParam();
				toast("Play loaded from link");
				navigate({
					to: "/playbook/$playId",
					params: { playId: id }
				});
			} catch {
				clearShareParam();
				toast("Could not read that play link");
			}
		};
		consume();
		const onHash = () => void consume();
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, [
		hydrate,
		importPlay,
		navigate
	]);
	return null;
}
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Draw FIBA plays and run timed practice plans. Built for youth and club coaches."
			},
			{
				name: "theme-color",
				content: "#070b12"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg?v=courtops"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandTheme, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateStore, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						theme: "dark",
						position: "top-center",
						toastOptions: { className: "bg-surface text-fg border-border" }
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$9 = () => import("./routes-DfQP-kj8.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./playbook-D0jR-4-X.mjs");
var Route$8 = createFileRoute("/playbook")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./practices-BPXFpvA4.mjs");
var Route$7 = createFileRoute("/practices")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./settings-DyTQm_V4.mjs");
var Route$6 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./playbook.index-BtOkZsNE.mjs");
var Route$5 = createFileRoute("/playbook/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./playbook._playId-DFvl80n8.mjs");
var Route$4 = createFileRoute("/playbook/$playId")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./practices.index-D0dpCoqI.mjs");
var Route$3 = createFileRoute("/practices/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./practices._planId-CMg9BkGj.mjs");
var Route$2 = createFileRoute("/practices/$planId")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./practices._planId.index-RvNFAoo3.mjs");
var Route$1 = createFileRoute("/practices/$planId/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./practices._planId.run-DeNmZjNy.mjs");
var Route = createFileRoute("/practices/$planId/run")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var PlaybookRoute = Route$8.update({
	id: "/playbook",
	path: "/playbook",
	getParentRoute: () => Route$10
});
var PracticesRoute = Route$7.update({
	id: "/practices",
	path: "/practices",
	getParentRoute: () => Route$10
});
var SettingsRoute = Route$6.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$10
});
var PlaybookIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => PlaybookRoute
});
var PlaybookPlayIdRoute = Route$4.update({
	id: "/$playId",
	path: "/$playId",
	getParentRoute: () => PlaybookRoute
});
var PracticesIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => PracticesRoute
});
var PracticesPlanIdRoute = Route$2.update({
	id: "/$planId",
	path: "/$planId",
	getParentRoute: () => PracticesRoute
});
var PracticesPlanIdIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => PracticesPlanIdRoute
});
var PracticesPlanIdRunRoute = Route.update({
	id: "/run",
	path: "/run",
	getParentRoute: () => PracticesPlanIdRoute
});
var PlaybookRouteChildren = {
	PlaybookPlayIdRoute,
	PlaybookIndexRoute
};
var PlaybookRouteWithChildren = PlaybookRoute._addFileChildren(PlaybookRouteChildren);
var PracticesPlanIdRouteChildren = {
	PracticesPlanIdRunRoute,
	PracticesPlanIdIndexRoute
};
var PracticesRouteChildren = {
	PracticesPlanIdRoute: PracticesPlanIdRoute._addFileChildren(PracticesPlanIdRouteChildren),
	PracticesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	PlaybookRoute: PlaybookRouteWithChildren,
	PracticesRoute: PracticesRoute._addFileChildren(PracticesRouteChildren),
	SettingsRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { packPlay as a, Route$4 as i, Route as n, parsePlayFile as o, Route$1 as r, playToJson as s, router_exports as t };
