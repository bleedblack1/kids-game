import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as Camera, C as Eye, D as ChevronLeft, E as ChevronRight, M as ArrowLeft, N as Activity, O as ChevronDown, S as Flame, T as ChevronUp, _ as LayoutDashboard, a as Users, b as Gem, c as Sticker, d as ShieldAlert, f as Settings, g as LoaderCircle, h as Play, i as Volume2, j as CameraOff, k as Check, l as Star, m as RotateCcw, n as X, o as UserRound, p as RotateCw, r as VolumeX, s as Trophy, t as Zap, u as Sparkles, v as Heart, w as Coins, x as Gamepad2, y as GraduationCap } from "../_libs/lucide-react.mjs";
import { C as Vector3, S as TorusGeometry, _ as PlaneGeometry, a as Clock, b as SphereGeometry, c as CylinderGeometry, d as Group, f as HemisphereLight, g as PerspectiveCamera, h as MeshStandardMaterial, i as CircleGeometry, l as DirectionalLight, m as MeshBasicMaterial, n as BoxGeometry, o as Color, p as Mesh, r as CapsuleGeometry, s as ConeGeometry, t as WebGLRenderer, u as Fog, v as SRGBColorSpace, x as TetrahedronGeometry, y as Scene } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CsYqKzmU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OPTS = [
	{
		id: "kid",
		label: "Kid",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-3.5 w-3.5" })
	},
	{
		id: "parent",
		label: "Parent",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" })
	},
	{
		id: "teacher",
		label: "Teacher",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-3.5 w-3.5" })
	}
];
function RoleSwitcher({ role, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border-2 border-sidebar-border bg-card/60 p-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 px-1 text-[9px] font-black uppercase tracking-wider text-muted-foreground",
			children: "View as"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: OPTS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onChange(o.id),
				className: `flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-black transition-all ${role === o.id ? "bg-primary text-primary-foreground shadow" : "text-foreground hover:bg-sidebar-accent"}`,
				children: [o.icon, o.label]
			}, o.id))
		})]
	});
}
var ageGroups = [
	{
		label: "Preschool 3–4",
		games: [
			{
				name: "Animal Walk Adventure",
				active: true,
				view: "game"
			},
			{
				name: "Finger Gesture Quiz",
				active: true,
				view: "finger-quiz"
			},
			{
				name: "Endless Runner",
				active: true,
				view: "endless-runner"
			},
			{
				name: "Math Adventure",
				active: true,
				view: "math-adventure"
			},
			{
				name: "Colour Hunt",
				active: false
			},
			{
				name: "Shape Catcher",
				active: false
			}
		]
	},
	{
		label: "LKG 4–5",
		games: [{
			name: "Vocab Face Quiz 📖",
			active: true,
			view: "vocab-face"
		}]
	},
	{
		label: "UKG 5–6",
		games: [{
			name: "Point & Spell 🪄",
			active: true,
			view: "point-spell"
		}]
	}
];
function Sidebar({ view, onNavigate, role, onRoleChange }) {
	const [gamesOpen, setGamesOpen] = (0, import_react.useState)(true);
	const [openAge, setOpenAge] = (0, import_react.useState)("Preschool 3–4");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex w-[260px] shrink-0 flex-col gap-2 border-r border-border bg-sidebar p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-2 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xl font-black tracking-tight text-foreground",
					children: "KALQY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Move · Play · Learn"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-1 mb-2 rounded-3xl bg-gradient-to-br from-sunshine to-coral p-3 text-foreground shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-background/70 text-2xl animate-bounce-soft",
						children: "🦊"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-extrabold",
							children: "Hi, I'm Kalqy!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs opacity-80",
							children: "Ready to play?"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }),
						label: "Dashboard",
						active: view === "dashboard",
						onClick: () => onNavigate("dashboard")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sticker, { className: "h-4 w-4" }),
						label: "Sticker Book",
						active: view === "sticker-book",
						onClick: () => onNavigate("sticker-book")
					}),
					role === "teacher" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }),
						label: "Leaderboard",
						active: view === "leaderboard",
						onClick: () => onNavigate("leaderboard")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setGamesOpen((v) => !v),
						className: "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, { className: "h-4 w-4" }), "Games"]
						}), gamesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					}),
					gamesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-2 flex flex-col gap-1 border-l-2 border-sidebar-border pl-2",
						children: ageGroups.map((age) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpenAge(openAge === age.label ? null : age.label),
							className: "flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-sidebar-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: age.label }), openAge === age.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
						}), openAge === age.label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-col gap-0.5",
							children: [age.games.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-1 text-[11px] italic text-muted-foreground",
								children: "Coming soon"
							}), age.games.map((g) => {
								const target = g.view ?? "game";
								const isActive = g.active && view === target;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: !g.active,
									onClick: () => g.active && onNavigate(target),
									className: `flex items-center justify-between rounded-xl px-2 py-1.5 text-left text-xs font-semibold transition-all ${isActive ? "bg-primary text-primary-foreground shadow" : g.active ? "text-foreground hover:bg-sidebar-accent" : "cursor-not-allowed text-muted-foreground/60"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: g.name
									}), !g.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase",
										children: "Soon"
									})]
								}, g.name);
							})]
						})] }, age.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" }),
						label: "Settings",
						disabled: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSwitcher, {
					role,
					onChange: onRoleChange
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-extrabold",
						children: "NEP 2020"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "opacity-75",
						children: "Foundational Stage aligned"
					})]
				})]
			})
		]
	});
}
function NavItem({ icon, label, active, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled,
		className: `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all ${active ? "bg-primary text-primary-foreground shadow-md" : disabled ? "cursor-not-allowed text-muted-foreground/60" : "text-sidebar-foreground hover:bg-sidebar-accent"}`,
		children: [
			icon,
			label,
			disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted-foreground",
				children: "Soon"
			})
		]
	});
}
var KEY$2 = "kalqy.role.v1";
function getRole() {
	if (typeof window === "undefined") return "kid";
	return window.localStorage.getItem(KEY$2) || "kid";
}
function setRole(r) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY$2, r);
}
var CLASS_ROSTER = [
	{
		id: "k1",
		name: "Aarav",
		avatar: "🦁",
		coins: 82,
		stickers: 6,
		streak: 4,
		topSkill: "Coordination"
	},
	{
		id: "k2",
		name: "Diya",
		avatar: "🦋",
		coins: 71,
		stickers: 5,
		streak: 3,
		topSkill: "Vocabulary"
	},
	{
		id: "k3",
		name: "Kabir",
		avatar: "🐯",
		coins: 65,
		stickers: 4,
		streak: 2,
		topSkill: "Balance"
	},
	{
		id: "k4",
		name: "Meera",
		avatar: "🐰",
		coins: 60,
		stickers: 4,
		streak: 5,
		topSkill: "Vocabulary"
	},
	{
		id: "k5",
		name: "Rohan",
		avatar: "🐼",
		coins: 54,
		stickers: 3,
		streak: 1,
		topSkill: "Numeracy"
	},
	{
		id: "k6",
		name: "Sara",
		avatar: "🦄",
		coins: 48,
		stickers: 3,
		streak: 2,
		topSkill: "Body Awareness"
	},
	{
		id: "k7",
		name: "Vihaan",
		avatar: "🐵",
		coins: 41,
		stickers: 2,
		streak: 1,
		topSkill: "Coordination"
	},
	{
		id: "k8",
		name: "Zara",
		avatar: "🐨",
		coins: 35,
		stickers: 2,
		streak: 1,
		topSkill: "Balance"
	}
];
var KEY$1 = "kalqy.events.v1";
var listeners$1 = /* @__PURE__ */ new Set();
function load$1() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(window.localStorage.getItem(KEY$1) || "[]");
	} catch {
		return [];
	}
}
function save$1(events) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY$1, JSON.stringify(events.slice(-2e3)));
	} catch {}
}
var cache$1 = null;
function all() {
	if (cache$1 === null) cache$1 = load$1();
	return cache$1;
}
function logEvent(e) {
	const evt = {
		id: Math.random().toString(36).slice(2),
		ts: e.ts ?? Date.now(),
		...e
	};
	const list = [...all(), evt];
	cache$1 = list;
	save$1(list);
	listeners$1.forEach((l) => l());
	return evt;
}
function getSkillTrend() {
	const base = {
		balance: 35,
		coordination: 40,
		bodyAwareness: 30,
		vocabulary: 25,
		numeracy: 25
	};
	for (const e of all()) {
		if (!e.skill || !(e.skill in base)) continue;
		if (e.type === "correct") base[e.skill] = Math.min(100, base[e.skill] + 3);
		if (e.type === "movement" && e.value) base[e.skill] = Math.min(100, base[e.skill] + e.value * 2);
	}
	return base;
}
function getUsage() {
	const map = /* @__PURE__ */ new Map();
	const starts = /* @__PURE__ */ new Map();
	for (const e of all()) {
		if (e.type === "session-start") starts.set(e.game, e.ts);
		if (e.type === "session-end") {
			const s = starts.get(e.game);
			const prev = map.get(e.game) || {
				sessions: 0,
				ms: 0
			};
			map.set(e.game, {
				sessions: prev.sessions + 1,
				ms: prev.ms + (s ? e.ts - s : 0)
			});
			starts.delete(e.game);
		}
	}
	return Array.from(map.entries()).map(([game, v]) => ({
		game,
		sessions: v.sessions,
		minutes: Math.max(1, Math.round(v.ms / 6e4))
	}));
}
function getInferences() {
	const trend = getSkillTrend();
	const usage = getUsage();
	const out = [];
	const best = Object.entries(trend).sort((a, b) => b[1] - a[1])[0];
	const worst = Object.entries(trend).sort((a, b) => a[1] - b[1])[0];
	if (best) out.push(`Strongest skill: ${labelSkill(best[0])} (${best[1]}%)`);
	if (worst && worst[1] < 45) out.push(`Needs practice: ${labelSkill(worst[0])} — try a related game`);
	const played = new Set(usage.map((u) => u.game));
	const unplayed = [
		"animal-walk",
		"finger-quiz",
		"endless-runner",
		"math-adventure",
		"vocab-face",
		"point-spell"
	].filter((g) => !played.has(g));
	if (unplayed.length) out.push(`Not tried yet: ${unplayed.map(labelGame).slice(0, 2).join(", ")}`);
	return out;
}
function labelSkill(s) {
	return {
		balance: "Balance",
		coordination: "Coordination",
		bodyAwareness: "Body Awareness",
		vocabulary: "Vocabulary",
		numeracy: "Numeracy"
	}[s];
}
function labelGame(g) {
	return {
		"animal-walk": "Animal Walk",
		"finger-quiz": "Finger Quiz",
		"endless-runner": "Endless Runner",
		"math-adventure": "Math Adventure",
		"vocab-face": "Vocab Face Quiz",
		"point-spell": "Point & Spell"
	}[g] ?? g;
}
var STICKERS = [
	{
		id: "first-hop",
		name: "First Hop",
		emoji: "🐸",
		description: "You did your first frog jump!",
		color: "leaf"
	},
	{
		id: "bouncy-bunny",
		name: "Bouncy Bunny",
		emoji: "🐰",
		description: "3 hops in a row!",
		color: "coral"
	},
	{
		id: "power-jumper",
		name: "Power Jumper",
		emoji: "💥",
		description: "A super-high jump!",
		color: "sunshine"
	},
	{
		id: "jungle-master",
		name: "Jungle Master",
		emoji: "🌴",
		description: "Finished all 5 rounds!",
		color: "jungle"
	},
	{
		id: "word-wizard",
		name: "Word Wizard",
		emoji: "🪄",
		description: "Said 3 words right!",
		color: "sky"
	},
	{
		id: "number-ninja",
		name: "Number Ninja",
		emoji: "🔢",
		description: "Solved a math puzzle!",
		color: "sunshine"
	},
	{
		id: "streak-star",
		name: "Streak Star",
		emoji: "⭐",
		description: "Played 3 days in a row!",
		color: "sunshine"
	},
	{
		id: "spelling-champ",
		name: "Spelling Champ",
		emoji: "🏅",
		description: "Spelled 3 words with your finger!",
		color: "grape"
	}
];
var KEY = "kalqy.rewards.v1";
function load() {
	if (typeof window === "undefined") return {
		coins: 0,
		stickers: [],
		streakDays: 0,
		lastPlayed: null
	};
	try {
		return JSON.parse(window.localStorage.getItem(KEY) || "null") || {
			coins: 0,
			stickers: [],
			streakDays: 0,
			lastPlayed: null
		};
	} catch {
		return {
			coins: 0,
			stickers: [],
			streakDays: 0,
			lastPlayed: null
		};
	}
}
function save(s) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(s));
	listeners.forEach((l) => l());
}
var cache = null;
var listeners = /* @__PURE__ */ new Set();
function getRewards() {
	if (!cache) cache = load();
	return cache;
}
function subscribeRewards(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function addCoins(n, opts) {
	const s = { ...getRewards() };
	s.coins += n;
	cache = s;
	save(s);
	if (opts?.game) logEvent({
		game: opts.game,
		type: "milestone",
		value: n,
		label: opts.label || "coins"
	});
}
function unlockSticker(id, game) {
	const s = {
		...getRewards(),
		stickers: [...getRewards().stickers]
	};
	if (s.stickers.includes(id)) return null;
	const sticker = STICKERS.find((x) => x.id === id);
	if (!sticker) return null;
	s.stickers.push(id);
	s.coins += 5;
	cache = s;
	save(s);
	if (game) logEvent({
		game,
		type: "milestone",
		label: `sticker:${id}`
	});
	return sticker;
}
function tickStreak() {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const s = { ...getRewards() };
	if (s.lastPlayed === today) return;
	const yesterday = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10);
	s.streakDays = s.lastPlayed === yesterday ? s.streakDays + 1 : 1;
	s.lastPlayed = today;
	cache = s;
	save(s);
	if (s.streakDays >= 3) unlockSticker("streak-star");
}
function scoreJumpHeight(h) {
	if (h >= .6) return {
		coins: 3,
		sticker: "power-jumper",
		label: "High jump! +3 coins"
	};
	if (h >= .3) return {
		coins: 2,
		label: "Nice hop! +2 coins"
	};
	return {
		coins: 1,
		label: "Little hop +1 coin"
	};
}
function Dashboard({ role, stats, onPlay, onOpenStickers, onOpenLeaderboard }) {
	const [, force] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const unsub = subscribeRewards(() => force((n) => n + 1));
		return () => {
			unsub();
		};
	}, []);
	const rewards = getRewards();
	const trend = getSkillTrend();
	const usage = getUsage();
	const inferences = getInferences();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-black uppercase tracking-wider text-muted-foreground",
						children: role === "kid" ? "Kid View" : role === "parent" ? "Parent View" : "Teacher View"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl font-black tracking-tight md:text-4xl",
						children: [
							role === "kid" && "Welcome back, little explorer! 🐾",
							role === "parent" && "Your child's learning journey",
							role === "teacher" && "Classroom overview"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm font-semibold text-muted-foreground md:text-base",
						children: [
							role === "kid" && "Let's move, play, and learn together with Kalqy.",
							role === "parent" && "Skills, milestones, and time spent this week.",
							role === "teacher" && "Class of Miss Priya · 8 explorers · NEP Foundational Stage."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard$1, {
						label: "Kalqy Coins",
						value: rewards.coins,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {}),
						color: "sunshine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard$1, {
						label: "Stickers",
						value: `${rewards.stickers.length}/${STICKERS.length}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {}),
						color: "coral",
						onClick: onOpenStickers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard$1, {
						label: "Day Streak",
						value: `${rewards.streakDays}🔥`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {}),
						color: "coral"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard$1, {
						label: "Games Played",
						value: stats.gamesPlayed,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {}),
						color: "leaf"
					})
				]
			}),
			role === "kid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KidView, {
				stats,
				onPlay,
				rewards
			}),
			role === "parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentView, {
				trend,
				usage,
				inferences
			}),
			role === "teacher" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherView, {
				trend,
				inferences,
				onOpenLeaderboard
			})
		]
	});
}
function KidView({ stats, onPlay, rewards }) {
	const nextSticker = STICKERS.find((s) => !rewards.stickers.includes(s.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground",
				children: "Featured Game"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl border-2 border-border bg-card shadow-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-0 md:grid-cols-[1fr_1.2fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex min-h-[220px] items-center justify-center overflow-hidden bg-gradient-to-br from-leaf via-jungle to-sky p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 opacity-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-4 top-6 text-5xl",
									children: "🌴"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-6 top-10 text-4xl",
									children: "🌿"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-4 left-10 text-4xl",
									children: "🍃"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-8 right-4 text-5xl",
									children: "🌳"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center gap-2 text-7xl md:text-8xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-bounce-soft",
									children: "🐸"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-bounce-soft",
									style: { animationDelay: "0.2s" },
									children: "🐰"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-bounce-soft",
									style: { animationDelay: "0.4s" },
									children: "🐘"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 p-6 md:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										color: "leaf",
										children: "Gross Motor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										color: "sunshine",
										children: "Age 3–4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										color: "sky",
										children: "NEP 2020"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-black md:text-3xl",
								children: "Animal Walk Adventure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-muted-foreground md:text-base",
								children: "Hop, crawl, squat and waddle with Kalqy — earn coins for high-power moves!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onPlay,
								className: "group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-black text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 md:w-auto md:self-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5 fill-current" }), " Play Now"]
							})
						]
					})]
				})
			})]
		}),
		nextSticker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-3xl border-2 border-dashed border-primary/50 bg-card p-5 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-black uppercase tracking-wider text-muted-foreground",
				children: "Next Milestone"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-5xl grayscale",
					children: nextSticker.emoji
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-black",
					children: nextSticker.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold text-muted-foreground",
					children: nextSticker.description
				})] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xs font-black uppercase tracking-wider text-muted-foreground",
				children: "My Skills"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBar, {
						label: "Balance",
						value: stats.balance,
						color: "leaf",
						emoji: "⚖️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBar, {
						label: "Coordination",
						value: stats.coordination,
						color: "sky",
						emoji: "🤸"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBar, {
						label: "Body Awareness",
						value: stats.bodyAwareness,
						color: "grape",
						emoji: "🧘"
					})
				]
			})]
		})
	] });
}
function ParentView({ trend, usage, inferences }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-2 grid gap-4 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-4 text-sm font-black uppercase tracking-wider text-muted-foreground",
				children: "NEP Competency Skills"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: Object.entries(trend).map(([s, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBar, {
					label: labelSkill(s),
					value: v,
					color: skillColor(s),
					emoji: skillEmoji(s)
				}, s))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-black uppercase tracking-wider text-muted-foreground",
					children: "Time by Game (this week)"
				}),
				usage.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm italic text-muted-foreground",
					children: "No sessions logged yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: usage.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-32 truncate text-sm font-bold",
								children: labelGame(u.game)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-3 flex-1 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary",
									style: { width: `${Math.min(100, u.minutes * 8)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-16 text-right text-xs font-semibold text-muted-foreground",
								children: [
									u.minutes,
									"m · ",
									u.sessions,
									"×"
								]
							})
						]
					}, u.game))
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-sm font-black uppercase tracking-wider text-muted-foreground",
			children: "Insights"
		}), inferences.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm italic text-muted-foreground",
			children: "Play a few games to unlock insights."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2",
			children: inferences.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-2xl bg-secondary/40 px-4 py-2.5 text-sm font-semibold",
				children: ["💡 ", i]
			}, idx))
		})]
	})] });
}
function TeacherView({ trend, inferences, onOpenLeaderboard }) {
	const top3 = [...CLASS_ROSTER].sort((a, b) => b.coins - a.coins).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-2 grid gap-4 md:grid-cols-[1.4fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-black uppercase tracking-wider text-muted-foreground",
					children: "🏆 Top Explorers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onOpenLeaderboard,
					className: "rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground shadow",
					children: "Full Leaderboard →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: top3.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl bg-secondary/30 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl",
							children: k.avatar
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-black",
								children: k.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: k.topSkill
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-black text-foreground",
							children: [k.coins, " 🪙"]
						})
					]
				}, k.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-4 text-sm font-black uppercase tracking-wider text-muted-foreground",
				children: "Class NEP Coverage"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: Object.entries(trend).map(([s, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBar, {
					label: labelSkill(s),
					value: v,
					color: skillColor(s),
					emoji: skillEmoji(s)
				}, s))
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-3xl border-2 border-border bg-card p-6 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-sm font-black uppercase tracking-wider text-muted-foreground",
			children: "Auto-Inferences"
		}), inferences.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm italic text-muted-foreground",
			children: "Play games to generate insights."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2 md:grid-cols-2",
			children: inferences.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-2xl bg-secondary/40 px-4 py-2.5 text-sm font-semibold",
				children: ["💡 ", i]
			}, idx))
		})]
	})] });
}
var colorMap$1 = {
	sunshine: "bg-sunshine",
	coral: "bg-coral",
	leaf: "bg-leaf",
	sky: "bg-sky",
	grape: "bg-grape"
};
function skillColor(s) {
	return {
		balance: "leaf",
		coordination: "sky",
		bodyAwareness: "grape",
		vocabulary: "sunshine",
		numeracy: "sunshine"
	}[s];
}
function skillEmoji(s) {
	return {
		balance: "⚖️",
		coordination: "🤸",
		bodyAwareness: "🧘",
		vocabulary: "🔤",
		numeracy: "🔢"
	}[s];
}
function StatCard$1({ label, value, icon, color, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(onClick ? "button" : "div", {
		onClick,
		className: `rounded-3xl border-2 border-border bg-card p-4 text-left shadow-sm transition-all ${onClick ? "hover:-translate-y-0.5 hover:shadow-md cursor-pointer" : ""}`,
		children: [
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mb-2 grid h-9 w-9 place-items-center rounded-2xl ${colorMap$1[color]}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "[&>svg]:h-4 [&>svg]:w-4",
					children: icon
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-2xl font-black",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
				children: label
			})
		]
	});
}
function Badge({ children, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide text-foreground ${colorMap$1[color]}`,
		children
	});
}
function SkillBar({ label, value, color, emoji }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1.5 flex items-center justify-between text-sm font-bold",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg",
				children: emoji
			}), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-muted-foreground",
			children: [value, "%"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-3 w-full overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full rounded-full transition-all duration-700 ${colorMap$1[color]}`,
			style: { width: `${value}%` }
		})
	})] });
}
function CameraPanel({ mode, onModeChange, onMovementDetected, active }) {
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const lastFireRef = (0, import_react.useRef)(0);
	const detectorRef = (0, import_react.useRef)(null);
	const prevFrameRef = (0, import_react.useRef)(null);
	const prevKpRef = (0, import_react.useRef)(null);
	const [status, setStatus] = (0, import_react.useState)("");
	const [activity, setActivity] = (0, import_react.useState)(0);
	const [loadingModel, setLoadingModel] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [permission, setPermission] = (0, import_react.useState)("idle");
	const [retryNonce, setRetryNonce] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (mode === "off") return;
		const anyNav = navigator;
		if (anyNav?.permissions?.query) anyNav.permissions.query({ name: "camera" }).then((res) => {
			if (res.state === "granted") setPermission("granted");
			else if (res.state === "denied") setPermission("denied");
			else setPermission("idle");
		}).catch(() => {});
	}, [mode]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function startCam() {
			if (mode === "off") return;
			if (permission !== "granted") return;
			try {
				setError(null);
				setStatus("Starting camera…");
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						width: 480,
						height: 360,
						facingMode: "user"
					},
					audio: false
				});
				if (cancelled) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play().catch(() => {});
				}
				setStatus(mode === "preview" ? "Camera on" : "Watching for movement…");
			} catch (e) {
				const msg = e?.name === "NotAllowedError" ? "Camera access blocked" : e?.message || "Could not start camera";
				setError(msg);
				setPermission("denied");
			}
		}
		startCam();
		return () => {
			cancelled = true;
		};
	}, [
		mode,
		permission,
		retryNonce
	]);
	const requestPermission = (0, import_react.useCallback)(async () => {
		setError(null);
		setPermission("prompting");
		setStatus("Asking for camera permission…");
		try {
			(await navigator.mediaDevices.getUserMedia({
				video: {
					width: 480,
					height: 360,
					facingMode: "user"
				},
				audio: false
			})).getTracks().forEach((t) => t.stop());
			setPermission("granted");
		} catch (e) {
			const msg = e?.name === "NotAllowedError" ? "Camera access blocked" : e?.message || "Could not start camera";
			setError(msg);
			setPermission("denied");
		}
	}, []);
	const retry = (0, import_react.useCallback)(() => {
		setError(null);
		setRetryNonce((n) => n + 1);
		requestPermission();
	}, [requestPermission]);
	(0, import_react.useEffect)(() => {
		if (mode === "off") {
			streamRef.current?.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
			if (videoRef.current) videoRef.current.srcObject = null;
			prevFrameRef.current = null;
			prevKpRef.current = null;
			setActivity(0);
			setStatus("");
		}
	}, [mode]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadPose() {
			if (mode !== "pose" || detectorRef.current) return;
			setLoadingModel(true);
			setStatus("Loading AI model…");
			try {
				const tf = await import("../_libs/@tensorflow-models/pose-detection.mjs").then((n) => n.r);
				await import("../_libs/@tensorflow/tfjs-backend-webgl+[...].mjs").then((n) => n.t);
				const pd = await import("../_libs/@tensorflow-models/pose-detection.mjs").then((n) => n.t);
				await tf.ready();
				const det = await pd.createDetector(pd.SupportedModels.MoveNet, { modelType: pd.movenet.modelType.SINGLEPOSE_LIGHTNING });
				if (cancelled) return;
				detectorRef.current = det;
				setStatus("Watching your moves…");
			} catch (e) {
				setError("Could not load pose model");
				onModeChange("motion");
			} finally {
				setLoadingModel(false);
			}
		}
		loadPose();
		return () => {
			cancelled = true;
		};
	}, [mode]);
	(0, import_react.useEffect)(() => {
		if (mode === "off" || mode === "preview") return;
		let running = true;
		const tick = async () => {
			if (!running) return;
			const video = videoRef.current;
			const canvas = canvasRef.current;
			if (video && canvas && video.readyState >= 2) {
				if (mode === "motion") runMotion(video, canvas);
				else if (mode === "pose" && detectorRef.current) await runPose(video);
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => {
			running = false;
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [mode, active]);
	const fireMovement = () => {
		const now = Date.now();
		if (now - lastFireRef.current < 1500) return;
		if (!active) return;
		lastFireRef.current = now;
		onMovementDetected?.();
	};
	const runMotion = (video, canvas) => {
		const w = 64;
		const h = 48;
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		ctx.drawImage(video, 0, 0, w, h);
		const frame = ctx.getImageData(0, 0, w, h).data;
		const prev = prevFrameRef.current;
		if (prev) {
			let diff = 0;
			for (let i = 0; i < frame.length; i += 16) diff += Math.abs(frame[i] - prev[i]);
			const normalized = Math.min(1, diff / 8e3);
			setActivity(normalized);
			if (normalized > .35) fireMovement();
		}
		prevFrameRef.current = new Uint8ClampedArray(frame);
	};
	const runPose = async (video) => {
		try {
			const poses = await detectorRef.current.estimatePoses(video, { flipHorizontal: true });
			if (!poses.length) return;
			const kp = poses[0].keypoints.filter((k) => k.score > .3).map((k) => ({
				x: k.x,
				y: k.y
			}));
			const prev = prevKpRef.current;
			if (prev && prev.length && kp.length) {
				const n = Math.min(prev.length, kp.length);
				let total = 0;
				for (let i = 0; i < n; i++) total += Math.hypot(kp[i].x - prev[i].x, kp[i].y - prev[i].y);
				const avg = total / n;
				const normalized = Math.min(1, avg / 40);
				setActivity(normalized);
				if (normalized > .45) fireMovement();
			}
			prevKpRef.current = kp;
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border-4 border-card bg-card/90 p-3 shadow-lg backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" }), "Camera"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "h-3.5 w-3.5" }),
							label: "Off",
							active: mode === "off",
							onClick: () => onModeChange("off")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }),
							label: "See me",
							active: mode === "preview",
							onClick: () => onModeChange("preview")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5" }),
							label: "Motion",
							active: mode === "motion",
							onClick: () => onModeChange("motion")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
							label: "AI Pose",
							active: mode === "pose",
							onClick: () => onModeChange("pose")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video w-full overflow-hidden rounded-2xl bg-black/80",
				children: [mode === "off" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center text-center text-xs font-bold text-white/70",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "mx-auto mb-1 h-6 w-6" }), "Tap a mode to turn on the camera"] })
				}) : permission !== "granted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center p-4 text-center text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-[220px] space-y-2",
						children: permission === "denied" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mx-auto h-7 w-7 text-coral" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-black",
								children: "Camera access blocked"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold text-white/70",
								children: "Allow camera in your browser's address bar, then tap retry."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: retry,
								className: "mx-auto mt-1 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground shadow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-3 w-3" }), " Retry"]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mx-auto h-7 w-7 text-jungle" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-black",
								children: "Let Kalqy see you move!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold text-white/70",
								children: "We use your camera only on this device — nothing is recorded."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: requestPermission,
								disabled: permission === "prompting",
								className: "mx-auto mt-1 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground shadow disabled:opacity-60",
								children: permission === "prompting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Asking…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3 w-3" }), " Allow camera"] })
							})
						] })
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						playsInline: true,
						muted: true,
						className: "h-full w-full -scale-x-100 object-cover"
					}),
					loadingModel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Loading AI…"]
					}),
					(mode === "motion" || mode === "pose") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-1.5 left-1.5 right-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 w-full overflow-hidden rounded-full bg-white/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-jungle transition-all",
								style: { width: `${Math.round(activity * 100)}%` }
							})
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "hidden"
				})]
			}),
			(status || error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-2 text-center text-[11px] font-bold ${error ? "text-coral" : "text-muted-foreground"}`,
				children: error || status
			})
		]
	});
}
function ModeBtn({ icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`,
		children: [icon, label]
	});
}
function PowerMeter({ value, label = "Power" }) {
	const pct = Math.max(0, Math.min(1, value)) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-1 rounded-2xl bg-card/90 p-2 shadow-sm backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: `h-4 w-4 ${pct > 60 ? "text-jungle" : pct > 30 ? "text-sunshine" : "text-coral"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-24 w-3 overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-t from-coral via-sunshine to-jungle transition-all duration-200",
					style: { height: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[9px] font-black uppercase tracking-wider text-muted-foreground",
				children: label
			})
		]
	});
}
var ANIMALS = [
	{
		name: "Frog",
		emoji: "🐸",
		movement: "Jump",
		verb: "hop",
		sound: "Ribbit! Ribbit!",
		skill: "balance"
	},
	{
		name: "Rabbit",
		emoji: "🐰",
		movement: "Crawl",
		verb: "crawl",
		sound: "Sniff sniff!",
		skill: "coordination"
	},
	{
		name: "Elephant",
		emoji: "🐘",
		movement: "Squat",
		verb: "squat",
		sound: "Trumpet!",
		skill: "bodyAwareness"
	},
	{
		name: "Duck",
		emoji: "🦆",
		movement: "Walk",
		verb: "waddle",
		sound: "Quack quack!",
		skill: "coordination"
	}
];
var LADDER = [
	"a hop",
	"two hops",
	"a hop and a clap",
	"a big high hop",
	"a hop and a spin"
];
var TOTAL_ROUNDS = 5;
function speak$4(text) {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = .95;
		u.pitch = 1.2;
		window.speechSynthesis.speak(u);
	} catch {}
}
function playTone$3(freq, duration = .2, type = "sine") {
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.value = freq;
		osc.connect(gain);
		gain.connect(ctx.destination);
		gain.gain.setValueAtTime(1e-4, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.2, ctx.currentTime + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + duration);
		osc.start();
		osc.stop(ctx.currentTime + duration + .05);
	} catch {}
}
function GameScreen({ onBack, onComplete }) {
	const [phase, setPhase] = (0, import_react.useState)("start");
	const [round, setRound] = (0, import_react.useState)(0);
	const [coins, setCoins] = (0, import_react.useState)(0);
	const [power, setPower] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [confetti, setConfetti] = (0, import_react.useState)(false);
	const [cameraMode, setCameraMode] = (0, import_react.useState)("off");
	const [milestone, setMilestone] = (0, import_react.useState)(null);
	const movementsRef = (0, import_react.useRef)({});
	const streakRef = (0, import_react.useRef)(0);
	const current = (0, import_react.useMemo)(() => {
		const out = [];
		for (let i = 0; i < TOTAL_ROUNDS; i++) out.push(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
		return out;
	}, [phase === "start"])[round];
	(0, import_react.useEffect)(() => {
		if (phase === "playing" && current) {
			const t = setTimeout(() => {
				speak$4(`${current.sound} Can you do ${LADDER[round]} like a ${current.name}?`);
			}, 300);
			return () => clearTimeout(t);
		}
	}, [
		phase,
		round,
		current
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (typeof window !== "undefined") window.speechSynthesis?.cancel();
			logEvent({
				game: "animal-walk",
				type: "session-end"
			});
		};
	}, []);
	const start = () => {
		movementsRef.current = {};
		streakRef.current = 0;
		setCoins(0);
		setRound(0);
		setFeedback(null);
		setPower(0);
		setPhase("playing");
		tickStreak();
		logEvent({
			game: "animal-walk",
			type: "session-start"
		});
	};
	const handlePick = (animal, intensity = .35) => {
		if (feedback) return;
		if (animal.name === current.name) {
			const jump = scoreJumpHeight(intensity);
			streakRef.current += 1;
			setCoins((c) => c + jump.coins);
			setPower(intensity);
			movementsRef.current[current.movement] = (movementsRef.current[current.movement] || 0) + 1;
			logEvent({
				game: "animal-walk",
				type: "correct",
				skill: current.skill,
				value: intensity,
				label: current.movement
			});
			addCoins(jump.coins, {
				game: "animal-walk",
				label: current.movement
			});
			unlockSticker("first-hop", "animal-walk");
			if (streakRef.current >= 3) unlockSticker("bouncy-bunny", "animal-walk");
			if (jump.sticker) unlockSticker(jump.sticker, "animal-walk");
			setFeedback({
				type: "correct",
				label: jump.label
			});
			setMilestone(jump.label);
			setConfetti(true);
			playTone$3(880, .15);
			setTimeout(() => playTone$3(1320, .2), 120);
			speak$4(current.sound + " Great job!");
			setTimeout(() => {
				setFeedback(null);
				setConfetti(false);
				setMilestone(null);
				setPower(0);
				if (round + 1 >= TOTAL_ROUNDS) {
					unlockSticker("jungle-master", "animal-walk");
					setPhase("end");
					onComplete({
						stars: Math.ceil(coins / 3) + 1,
						movements: { ...movementsRef.current }
					});
				} else setRound((r) => r + 1);
			}, 1500);
		} else {
			streakRef.current = 0;
			logEvent({
				game: "animal-walk",
				type: "wrong",
				label: animal.name
			});
			setFeedback({ type: "wrong" });
			playTone$3(220, .25, "triangle");
			speak$4("Try again!");
			setTimeout(() => setFeedback(null), 900);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-full overflow-hidden bg-gradient-to-b from-sky/40 via-leaf/30 to-leaf/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 select-none text-5xl opacity-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-4 top-6",
						children: "🌴"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-8 top-12",
						children: "🌿"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-10 left-12",
						children: "🌳"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-6 right-6",
						children: "🍃"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-1/2 top-4",
						children: "☁️"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 md:px-8 md:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								window.speechSynthesis?.cancel();
								onBack();
							},
							className: "flex items-center gap-2 rounded-2xl bg-card/90 px-4 py-2 text-sm font-bold text-foreground shadow-sm backdrop-blur transition-all hover:scale-105 active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
						}), phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-2xl bg-card/90 px-4 py-2 shadow-sm backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-black",
								children: [
									"Round ",
									round + 1,
									" / ",
									TOTAL_ROUNDS
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-sm font-black text-sunshine",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }),
									" ",
									coins
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center justify-center",
						children: [
							phase === "start" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, { onStart: start }),
							phase === "playing" && current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid w-full gap-5 md:grid-cols-[1fr_320px] md:items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {
										current,
										feedback,
										onPick: (a) => handlePick(a),
										milestone
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerMeter, {
										value: power,
										label: "Jump Power"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraPanel, {
									mode: cameraMode,
									onModeChange: setCameraMode,
									active: !feedback,
									onMovementDetected: (intensity) => handlePick(current, intensity ?? .5)
								})]
							}),
							phase === "end" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndScreen, {
								coins,
								onPlayAgain: start,
								onBack: () => {
									window.speechSynthesis?.cancel();
									onBack();
								}
							})
						]
					}),
					phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-black uppercase tracking-wider text-muted-foreground",
							children: "Round Progress"
						}), Array.from({ length: TOTAL_ROUNDS }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-3 w-6 rounded-full transition-all ${i < round ? "bg-jungle" : i === round ? "bg-sunshine animate-pop" : "bg-muted"}` }, i))]
					})
				]
			}),
			confetti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti$3, {})
		]
	});
}
function StartScreen({ onStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-pop text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 text-8xl md:text-9xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-block animate-bounce-soft",
					children: "🦊"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-2 text-4xl font-black text-foreground drop-shadow-sm md:text-6xl",
				children: "Animal Walk Adventure"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-8 text-lg font-bold text-foreground/80 md:text-xl",
				children: "Move big for more coins! 🪙 High jumps = extra coins."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onStart,
				className: "rounded-3xl bg-primary px-10 py-5 text-2xl font-black text-primary-foreground shadow-xl transition-all hover:scale-110 hover:rotate-1 active:scale-95 md:text-3xl",
				children: "▶ Start"
			})
		]
	});
}
function PlayScreen({ current, feedback, onPick, milestone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 inline-flex items-center gap-2 rounded-full bg-card/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3 w-3" }), "Listen & Move"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-8xl md:text-9xl animate-bounce-soft",
					children: current.emoji
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-black text-jungle mt-1",
					children: current.sound
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-2 text-2xl font-black md:text-4xl",
					children: [
						current.verb.charAt(0).toUpperCase() + current.verb.slice(1),
						" like a ",
						current.name,
						"!"
					]
				}),
				feedback?.type === "correct" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 animate-pop text-2xl font-black text-jungle",
					children: [
						"🌟 ",
						milestone || "Great job!",
						" 🌟"
					]
				}),
				feedback?.type === "wrong" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 animate-pop text-2xl font-black text-coral",
					children: "🐾 Try again!"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5",
			children: ANIMALS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimalCard, {
				animal: a,
				onClick: () => onPick(a),
				disabled: !!feedback
			}, a.name))
		})]
	});
}
function AnimalCard({ animal, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled,
		className: "group flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border-4 border-card bg-card p-4 shadow-lg transition-all hover:-translate-y-1 hover:rotate-1 hover:border-primary hover:shadow-xl active:scale-95 disabled:opacity-60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-6xl transition-transform group-hover:scale-110 md:text-7xl",
				children: animal.emoji
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-base font-black md:text-lg",
				children: animal.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-full bg-secondary px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-secondary-foreground md:text-xs",
				children: animal.movement
			})
		]
	});
}
function EndScreen({ coins, onPlayAgain, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-pop text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-7xl",
				children: "🎉"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-2 text-4xl font-black md:text-6xl",
				children: "You did it!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-lg font-bold text-foreground/80",
				children: "Jungle superstar unlocked! 🌴"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 flex items-center justify-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-sunshine px-6 py-4 shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-3xl font-black",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-8 w-8" }),
							" +",
							coins
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-black uppercase tracking-wider",
						children: "Coins earned"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onPlayAgain,
					className: "flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Play Again"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onBack,
					className: "rounded-2xl bg-card px-6 py-3 text-lg font-black shadow-lg transition-all hover:scale-105 active:scale-95",
					children: "Back to Dashboard"
				})]
			})
		]
	});
}
function Confetti$3() {
	const pieces = Array.from({ length: 40 });
	const colors = [
		"#f97316",
		"#facc15",
		"#22c55e",
		"#38bdf8",
		"#a855f7",
		"#ef4444"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-50 overflow-hidden",
		children: pieces.map((_, i) => {
			const left = Math.random() * 100;
			const delay = Math.random() * .3;
			const duration = 1.2 + Math.random() * .8;
			const color = colors[i % colors.length];
			const size = 6 + Math.random() * 8;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					left: `${left}%`,
					top: "-10vh",
					width: size,
					height: size,
					background: color,
					animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
					borderRadius: i % 3 === 0 ? "50%" : "2px"
				},
				className: "absolute"
			}, i);
		})
	});
}
var QUESTIONS = [
	{
		prompt: "Which number is 7?",
		options: [
			"5",
			"7",
			"3",
			"9"
		],
		correctIndex: 1,
		emoji: "🔢"
	},
	{
		prompt: "How many apples? 🍎🍎🍎",
		options: [
			"2",
			"4",
			"3",
			"1"
		],
		correctIndex: 2,
		emoji: "🍎"
	},
	{
		prompt: "Which shape has 3 sides?",
		options: [
			"⬛ Square",
			"🔺 Triangle",
			"⚪ Circle",
			"⬟ Pentagon"
		],
		correctIndex: 1,
		emoji: "🔺"
	},
	{
		prompt: "Which number comes after 4?",
		options: [
			"3",
			"6",
			"5",
			"2"
		],
		correctIndex: 2,
		emoji: "➡️"
	},
	{
		prompt: "How many stars? ⭐⭐⭐⭐",
		options: [
			"3",
			"2",
			"5",
			"4"
		],
		correctIndex: 3,
		emoji: "⭐"
	}
];
var PRAISE$2 = [
	"🎉 Kudos!",
	"🌟 Great Job!",
	"✨ Awesome!"
];
var ENCOURAGE$1 = [
	"😊 Nice Try!",
	"💪 Try Again!",
	"🌈 Almost!"
];
function speak$3(text) {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = .95;
		u.pitch = 1.15;
		window.speechSynthesis.speak(u);
	} catch {}
}
function playTone$2(freq, duration = .2, type = "sine") {
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.value = freq;
		osc.connect(gain);
		gain.connect(ctx.destination);
		gain.gain.setValueAtTime(1e-4, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.25, ctx.currentTime + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + duration);
		osc.start();
		osc.stop(ctx.currentTime + duration + .05);
	} catch {}
}
function countFingers$1(landmarks) {
	if (!landmarks || landmarks.length < 21) return 0;
	const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
	const wrist = landmarks[0];
	const tips = [
		8,
		12,
		16,
		20
	];
	const pips = [
		6,
		10,
		14,
		18
	];
	const mcps = [
		5,
		9,
		13,
		17
	];
	let count = 0;
	for (let i = 0; i < 4; i++) {
		const tip = landmarks[tips[i]];
		const pip = landmarks[pips[i]];
		const mcp = landmarks[mcps[i]];
		if (dist(tip, wrist) > dist(pip, wrist) * 1.1 && dist(tip, mcp) > dist(pip, mcp)) count++;
	}
	return count;
}
function FingerGestureQuiz({ onBack, onComplete }) {
	const [qIndex, setQIndex] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("playing");
	const [confetti, setConfetti] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const landmarkerRef = (0, import_react.useRef)(null);
	const lastVideoTimeRef = (0, import_react.useRef)(-1);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [fingerCount, setFingerCount] = (0, import_react.useState)(null);
	const [hint, setHint] = (0, import_react.useState)("Show your hand to the camera.");
	const [holdProgress, setHoldProgress] = (0, import_react.useState)(0);
	const holdStartRef = (0, import_react.useRef)(null);
	const holdCountRef = (0, import_react.useRef)(null);
	const lockedRef = (0, import_react.useRef)(false);
	const question = QUESTIONS[qIndex];
	const totalQuestions = QUESTIONS.length;
	(0, import_react.useEffect)(() => {
		if (phase === "playing") {
			const t = setTimeout(() => speak$3(question.prompt), 300);
			return () => clearTimeout(t);
		}
	}, [
		qIndex,
		phase,
		question.prompt
	]);
	(0, import_react.useEffect)(() => {
		if (feedback?.type === "correct") lockedRef.current = true;
	}, [feedback]);
	const submitAnswerRef = (0, import_react.useRef)(() => {});
	const submitAnswer = (0, import_react.useCallback)((choice) => {
		if (lockedRef.current || phase !== "playing") return;
		if (choice === question.correctIndex) {
			lockedRef.current = true;
			const msg = PRAISE$2[Math.floor(Math.random() * PRAISE$2.length)];
			setFeedback({
				type: "correct",
				msg,
				choice
			});
			setConfetti(true);
			setScore((s) => s + 1);
			playTone$2(880, .15);
			setTimeout(() => playTone$2(1320, .2), 120);
			speak$3(msg.replace(/[^\w\s]/g, ""));
			setTimeout(() => {
				setConfetti(false);
				setFeedback(null);
				holdStartRef.current = null;
				holdCountRef.current = null;
				setHoldProgress(0);
				if (qIndex + 1 >= totalQuestions) {
					setPhase("end");
					onComplete?.(score + 1);
				} else setQIndex((i) => i + 1);
				lockedRef.current = false;
			}, 2e3);
		} else {
			const msg = ENCOURAGE$1[Math.floor(Math.random() * ENCOURAGE$1.length)];
			setFeedback({
				type: "wrong",
				msg,
				choice
			});
			playTone$2(330, .2, "triangle");
			speak$3(msg.replace(/[^\w\s]/g, ""));
			setTimeout(() => {
				setFeedback(null);
				holdStartRef.current = null;
				holdCountRef.current = null;
				setHoldProgress(0);
			}, 1100);
		}
	}, [
		phase,
		qIndex,
		question.correctIndex,
		score,
		totalQuestions,
		onComplete
	]);
	(0, import_react.useEffect)(() => {
		submitAnswerRef.current = submitAnswer;
	}, [submitAnswer]);
	const initLandmarker = (0, import_react.useCallback)(async () => {
		if (landmarkerRef.current) return landmarkerRef.current;
		const { FilesetResolver, HandLandmarker } = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
		const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
		const landmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
				delegate: "GPU"
			},
			runningMode: "VIDEO",
			numHands: 2
		});
		landmarkerRef.current = landmarker;
		return landmarker;
	}, []);
	const startCamera = (0, import_react.useCallback)(async () => {
		setStatus("loading");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 640 },
					height: { ideal: 480 }
				},
				audio: false
			});
			streamRef.current = stream;
			const video = videoRef.current;
			if (!video) return;
			video.srcObject = stream;
			await video.play();
			await initLandmarker();
			setStatus("ready");
			loop();
		} catch (err) {
			console.error("Camera error", err);
			if (err?.name === "NotAllowedError" || err?.name === "SecurityError") setStatus("denied");
			else setStatus("error");
		}
	}, [initLandmarker]);
	const stopCamera = (0, import_react.useCallback)(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		try {
			landmarkerRef.current?.close?.();
		} catch {}
		landmarkerRef.current = null;
	}, []);
	const loop = (0, import_react.useCallback)(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		const landmarker = landmarkerRef.current;
		if (!video || !canvas || !landmarker) return;
		const tick = () => {
			if (document.hidden) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
				lastVideoTimeRef.current = video.currentTime;
				try {
					const result = landmarker.detectForVideo(video, performance.now());
					drawAndCount(result);
				} catch (e) {}
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
	}, []);
	const drawAndCount = (result) => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (!canvas || !video) return;
		const w = video.videoWidth || 640;
		const h = video.videoHeight || 480;
		if (canvas.width !== w) canvas.width = w;
		if (canvas.height !== h) canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const hands = result?.landmarks ?? [];
		if (hands.length === 0) {
			setFingerCount(null);
			setHint("Show your hand to the camera.");
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			return;
		}
		if (hands.length > 1) {
			setFingerCount(null);
			setHint("Please use only one hand.");
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			hands.forEach((lm) => drawHand$2(ctx, lm, w, h, "#f59e0b"));
			return;
		}
		const lm = hands[0];
		drawHand$2(ctx, lm, w, h, "#22c55e");
		const count = countFingers$1(lm);
		setFingerCount(count);
		if (count < 1 || count > 4) {
			setHint(count === 0 ? "Hold up 1–4 fingers." : "Use 1, 2, 3, or 4 fingers.");
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			return;
		}
		setHint(`Detected ${count} finger${count > 1 ? "s" : ""} — hold steady…`);
		if (lockedRef.current) {
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			return;
		}
		const now = performance.now();
		if (holdCountRef.current !== count) {
			holdCountRef.current = count;
			holdStartRef.current = now;
			setHoldProgress(0);
			return;
		}
		const elapsed = now - (holdStartRef.current ?? now);
		const HOLD_MS = 1e3;
		setHoldProgress(Math.min(1, elapsed / HOLD_MS));
		if (elapsed >= HOLD_MS) {
			const choice = count - 1;
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			submitAnswerRef.current(choice);
		}
	};
	(0, import_react.useEffect)(() => {
		startCamera();
		return () => {
			stopCamera();
			window.speechSynthesis?.cancel();
		};
	}, []);
	const restart = () => {
		setQIndex(0);
		setScore(0);
		setFeedback(null);
		setPhase("playing");
		lockedRef.current = false;
	};
	const progressPct = (0, import_react.useMemo)(() => Math.round((qIndex + (phase === "end" ? 1 : 0)) / totalQuestions * 100), [
		qIndex,
		phase,
		totalQuestions
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-full overflow-hidden bg-gradient-to-b from-sky/30 via-background to-leaf/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							window.speechSynthesis?.cancel();
							onBack();
						},
						className: "flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105 active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl bg-card px-4 py-2 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-black text-foreground",
							children: [
								"Q ",
								Math.min(qIndex + 1, totalQuestions),
								" / ",
								totalQuestions
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-sm font-black text-coral",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" }), score]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 h-2 w-full overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all",
						style: { width: `${progressPct}%` }
					})
				}),
				phase === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid flex-1 gap-5 md:grid-cols-[1fr_360px] md:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3 w-3" }), " Finger Gesture Quiz"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-3xl font-black text-foreground drop-shadow-sm md:text-5xl",
									children: [
										question.emoji,
										" ",
										question.prompt
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm font-bold text-muted-foreground",
									children: [
										"Show ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "1, 2, 3 or 4"
										}),
										" fingers to pick an answer."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 md:gap-5",
							children: question.options.map((opt, i) => {
								const isCorrect = feedback?.type === "correct" && feedback.choice === i;
								const isWrong = feedback?.type === "wrong" && feedback.choice === i;
								const isPending = fingerCount === i + 1 && !feedback;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => submitAnswer(i),
									disabled: !!feedback && feedback.type === "correct",
									className: `relative flex aspect-[5/3] flex-col items-center justify-center gap-2 rounded-3xl border-4 bg-card p-4 text-center shadow-lg transition-all hover:-translate-y-1 active:scale-95 ${isCorrect ? "border-jungle ring-4 ring-jungle/40" : isWrong ? "border-coral ring-4 ring-coral/40" : isPending ? "border-primary ring-2 ring-primary/30" : "border-card hover:border-primary"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-black shadow",
											children: i + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-3xl font-black text-foreground md:text-5xl",
											children: opt
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] font-black uppercase tracking-wider text-muted-foreground",
											children: [
												"Show ",
												i + 1,
												" finger",
												i > 0 ? "s" : ""
											]
										}),
										isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute bottom-2 left-3 right-3 h-1.5 overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-primary transition-all",
												style: { width: `${holdProgress * 100}%` }
											})
										})
									]
								}, i);
							})
						}),
						feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `animate-pop mt-5 rounded-3xl px-6 py-4 text-center text-2xl font-black shadow-md ${feedback.type === "correct" ? "bg-jungle/15 text-jungle" : "bg-coral/15 text-coral"}`,
							children: feedback.msg
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border-4 border-card bg-card p-3 shadow-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2 text-sm font-black text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 text-primary" }), " Hand Camera"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										ref: videoRef,
										className: "absolute inset-0 h-full w-full -scale-x-100 object-cover",
										playsInline: true,
										muted: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
										ref: canvasRef,
										className: "pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
									}),
									status !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center text-white",
										children: [
											status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-bold",
												children: "Loading hand detector…"
											})] }),
											status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: startCamera,
												className: "rounded-2xl bg-primary px-4 py-2 font-black text-primary-foreground",
												children: "Allow camera"
											}),
											status === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-bold",
												children: "Camera access is needed for the Finger Gesture Quiz."
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: startCamera,
												className: "rounded-2xl bg-primary px-4 py-2 font-black text-primary-foreground",
												children: "Retry"
											})] }),
											status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-bold",
												children: "Could not start the camera."
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: startCamera,
												className: "rounded-2xl bg-primary px-4 py-2 font-black text-primary-foreground",
												children: "Retry"
											})] })
										]
									}),
									status === "ready" && fingerCount !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-2 top-2 rounded-2xl bg-black/60 px-3 py-1.5 text-2xl font-black text-white",
										children: ["☝️ ", fingerCount]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 min-h-[2.5rem] text-center text-sm font-bold text-foreground",
								children: hint
							}),
							holdProgress > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-2 mb-1 h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary transition-all",
									style: { width: `${holdProgress * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-1 text-[11px] leading-snug text-muted-foreground",
								children: "Tip: hold up 1, 2, 3 or 4 fingers in front of the camera for 1 second. You can also tap an answer."
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-pop text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 text-7xl",
								children: "🏆"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mb-2 text-4xl font-black text-foreground md:text-6xl",
								children: "All done!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-6 text-lg font-bold text-foreground/80",
								children: [
									"You scored ",
									score,
									" out of ",
									totalQuestions,
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: restart,
									className: "flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Play Again"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										stopCamera();
										onBack();
									},
									className: "rounded-2xl bg-card px-6 py-3 text-lg font-black text-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
									children: "Back to Dashboard"
								})]
							})
						]
					})
				})
			]
		}), confetti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti$2, {})]
	});
}
function drawHand$2(ctx, lm, w, h, color) {
	const CONNECTIONS = [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
		[0, 5],
		[5, 6],
		[6, 7],
		[7, 8],
		[5, 9],
		[9, 10],
		[10, 11],
		[11, 12],
		[9, 13],
		[13, 14],
		[14, 15],
		[15, 16],
		[13, 17],
		[17, 18],
		[18, 19],
		[19, 20],
		[0, 17]
	];
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.beginPath();
	for (const [a, b] of CONNECTIONS) {
		ctx.moveTo(lm[a].x * w, lm[a].y * h);
		ctx.lineTo(lm[b].x * w, lm[b].y * h);
	}
	ctx.stroke();
	ctx.fillStyle = "#fff";
	for (const p of lm) {
		ctx.beginPath();
		ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
		ctx.fill();
	}
}
function Confetti$2() {
	const pieces = Array.from({ length: 40 });
	const colors = [
		"#f97316",
		"#facc15",
		"#22c55e",
		"#38bdf8",
		"#a855f7",
		"#ef4444"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-50 overflow-hidden",
		children: pieces.map((_, i) => {
			const left = Math.random() * 100;
			const delay = Math.random() * .3;
			const duration = 1.2 + Math.random() * .8;
			const color = colors[i % colors.length];
			const size = 6 + Math.random() * 8;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					left: `${left}%`,
					top: "-10vh",
					width: size,
					height: size,
					background: color,
					animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
					borderRadius: i % 3 === 0 ? "50%" : "2px"
				},
				className: "absolute"
			}, i);
		})
	});
}
var COOLDOWN_MS = 320;
function classify(lm) {
	if (!lm || lm.length < 21) return "none";
	const xs = [
		0,
		5,
		9,
		13,
		17
	].map((i) => lm[i].x);
	const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
	if (avgX > .6) return "right";
	if (avgX < .4) return "left";
	return "none";
}
var HAND_CONNECTIONS = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[0, 5],
	[5, 6],
	[6, 7],
	[7, 8],
	[5, 9],
	[9, 10],
	[10, 11],
	[11, 12],
	[9, 13],
	[13, 14],
	[14, 15],
	[15, 16],
	[13, 17],
	[17, 18],
	[18, 19],
	[19, 20],
	[0, 17]
];
function drawHand$1(ctx, lm, w, h, color) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	for (const [a, b] of HAND_CONNECTIONS) {
		ctx.beginPath();
		ctx.moveTo(lm[a].x * w, lm[a].y * h);
		ctx.lineTo(lm[b].x * w, lm[b].y * h);
		ctx.stroke();
	}
	for (const p of lm) {
		ctx.beginPath();
		ctx.arc(p.x * w, p.y * h, 3.5, 0, Math.PI * 2);
		ctx.fill();
	}
}
function RunnerGestureControl({ active, controls }) {
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const landmarkerRef = (0, import_react.useRef)(null);
	const lastVideoTimeRef = (0, import_react.useRef)(-1);
	const activeRef = (0, import_react.useRef)(active);
	(0, import_react.useEffect)(() => {
		activeRef.current = active;
	}, [active]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [hint, setHint] = (0, import_react.useState)("Show your hand to control the game.");
	const [current, setCurrent] = (0, import_react.useState)("none");
	const holdStartRef = (0, import_react.useRef)(null);
	const holdGestureRef = (0, import_react.useRef)("none");
	const lastFiredRef = (0, import_react.useRef)({
		g: "none",
		t: 0
	});
	const controlsRef = (0, import_react.useRef)(controls);
	(0, import_react.useEffect)(() => {
		controlsRef.current = controls;
	}, [controls]);
	const initLandmarker = (0, import_react.useCallback)(async () => {
		if (landmarkerRef.current) return landmarkerRef.current;
		const { FilesetResolver, HandLandmarker } = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
		const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
		const lm = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
				delegate: "GPU"
			},
			runningMode: "VIDEO",
			numHands: 2
		});
		landmarkerRef.current = lm;
		return lm;
	}, []);
	const fire = (0, import_react.useCallback)((g) => {
		const c = controlsRef.current;
		if (g === "left") c.moveLeft();
		else if (g === "right") c.moveRight();
		else if (g === "jump") c.jump();
		else if (g === "slide") c.slide();
	}, []);
	const loop = (0, import_react.useCallback)(() => {
		const tick = () => {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			const landmarker = landmarkerRef.current;
			if (!video || !canvas || !landmarker) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (document.hidden || !activeRef.current) {
				holdStartRef.current = null;
				holdGestureRef.current = "none";
				canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
				lastVideoTimeRef.current = video.currentTime;
				try {
					const result = landmarker.detectForVideo(video, performance.now());
					process(result);
				} catch {}
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
	}, []);
	const process = (result) => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (!canvas || !video) return;
		const w = video.videoWidth || 640;
		const h = video.videoHeight || 480;
		if (canvas.width !== w) canvas.width = w;
		if (canvas.height !== h) canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const hands = result?.landmarks ?? [];
		if (hands.length === 0) {
			setHint("Show your hand to control the game.");
			setCurrent("none");
			holdStartRef.current = null;
			holdGestureRef.current = "none";
			return;
		}
		if (hands.length > 1) {
			setHint("Please use only one hand.");
			setCurrent("none");
			holdStartRef.current = null;
			holdGestureRef.current = "none";
			hands.forEach((lm) => drawHand$1(ctx, lm, w, h, "#f59e0b"));
			return;
		}
		const lm = hands[0];
		const g = classify(lm);
		drawHand$1(ctx, lm, w, h, g === "none" ? "#94a3b8" : "#22c55e");
		setCurrent(g);
		if (g === "none") {
			setHint("Left hand ← · Right hand →");
			holdStartRef.current = null;
			holdGestureRef.current = "none";
			return;
		}
		const now = performance.now();
		if (holdGestureRef.current !== g) {
			holdGestureRef.current = g;
			holdStartRef.current = now;
			if (now - lastFiredRef.current.t >= COOLDOWN_MS) {
				lastFiredRef.current = {
					g,
					t: now
				};
				fire(g);
			}
			setHint(labelOf(g));
			return;
		}
		const sinceLast = now - lastFiredRef.current.t;
		setHint(labelOf(g));
		if (sinceLast >= 1100) {
			lastFiredRef.current = {
				g,
				t: now
			};
			fire(g);
		}
	};
	const startCamera = (0, import_react.useCallback)(async () => {
		setStatus("loading");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 480 },
					height: { ideal: 360 }
				},
				audio: false
			});
			streamRef.current = stream;
			const video = videoRef.current;
			if (!video) return;
			video.srcObject = stream;
			try {
				await video.play();
			} catch (e) {
				if (e?.name === "AbortError") return;
				throw e;
			}
			await initLandmarker();
			setStatus("ready");
			loop();
		} catch (err) {
			console.error("Gesture camera error", err);
			if (err?.name === "NotAllowedError" || err?.name === "SecurityError") setStatus("denied");
			else setStatus("error");
		}
	}, [initLandmarker, loop]);
	const stopCamera = (0, import_react.useCallback)(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		try {
			landmarkerRef.current?.close?.();
		} catch {}
		landmarkerRef.current = null;
	}, []);
	(0, import_react.useEffect)(() => {
		startCamera();
		return () => stopCamera();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto w-[200px] overflow-hidden rounded-2xl border-2 border-card bg-card/95 shadow-xl backdrop-blur md:w-[240px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-black text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5 text-primary" }), " Gesture"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded-full px-2 py-0.5 text-[10px] ${status === "ready" ? "bg-jungle/20 text-jungle" : status === "denied" || status === "error" ? "bg-coral/20 text-coral" : "bg-muted text-muted-foreground"}`,
					children: status === "ready" ? "LIVE" : status.toUpperCase()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[4/3] w-full bg-black",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "absolute inset-0 h-full w-full -scale-x-100 object-cover",
						playsInline: true,
						muted: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
					}),
					status === "ready" && current !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-1.5 top-1.5 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-black text-primary-foreground",
						children: labelOf(current)
					}),
					status !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/75 p-2 text-center text-white",
						children: [
							status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold",
								children: "Loading detector…"
							})] }),
							status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: startCamera,
								className: "rounded-full bg-primary px-3 py-1.5 text-[11px] font-black text-primary-foreground",
								children: "Enable Camera"
							}),
							status === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "h-5 w-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-bold",
									children: "Camera blocked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: startCamera,
									className: "flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-black text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Retry Camera Access"]
								})
							] }),
							status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold",
								children: "Camera unavailable"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: startCamera,
								className: "flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-black text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Try Again"]
							})] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-1.5 text-[10px] font-bold leading-tight text-muted-foreground",
				children: hint
			})
		]
	});
}
function labelOf(g) {
	switch (g) {
		case "left": return "← Left";
		case "right": return "Right →";
		case "jump": return "↑ Jump";
		case "slide": return "↓ Slide";
		default: return "";
	}
}
var LANES = [
	-2,
	0,
	2
];
var GRAVITY = -55;
var JUMP_V = 15;
var SLIDE_TIME = .7;
var BASE_SPEED = 12;
var SPEED_GROWTH = .2;
var SPAWN_GAP = 12;
function EndlessRunner({ onBack, onComplete }) {
	const mountRef = (0, import_react.useRef)(null);
	const [phase, setPhase] = (0, import_react.useState)("start");
	const [score, setScore] = (0, import_react.useState)(0);
	const [coins, setCoins] = (0, import_react.useState)(0);
	const [best, setBest] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return 0;
		return Number(localStorage.getItem("kalqy-runner-best") || 0);
	});
	const stateRef = (0, import_react.useRef)({
		phase: "start",
		lane: 1,
		targetX: 0,
		y: 0,
		vy: 0,
		sliding: false,
		slideT: 0,
		speed: BASE_SPEED,
		elapsed: 0,
		distance: 0,
		coins: 0,
		spawnT: 0,
		coinSpawnT: 0
	});
	const ctrlRef = (0, import_react.useRef)(null);
	const start = (0, import_react.useCallback)(() => {
		stateRef.current = {
			phase: "playing",
			lane: 1,
			targetX: 0,
			y: 0,
			vy: 0,
			sliding: false,
			slideT: 0,
			speed: BASE_SPEED,
			elapsed: 0,
			distance: 0,
			coins: 0,
			spawnT: 0,
			coinSpawnT: 0
		};
		ctrlRef.current?.resetWorld();
		setScore(0);
		setCoins(0);
		setPhase("playing");
	}, []);
	(0, import_react.useEffect)(() => {
		stateRef.current.phase = phase;
	}, [phase]);
	(0, import_react.useEffect)(() => {
		const mount = mountRef.current;
		if (!mount) return;
		const scene = new Scene();
		scene.background = new Color(8900331);
		scene.fog = new Fog(8900331, 30, 90);
		const camera = new PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, .1, 200);
		camera.position.set(0, 5, -8);
		camera.lookAt(0, 1.5, 10);
		const renderer = new WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(mount.clientWidth, mount.clientHeight);
		renderer.shadowMap.enabled = true;
		mount.appendChild(renderer.domElement);
		const hemi = new HemisphereLight(16777215, 8956501, .9);
		scene.add(hemi);
		const sun = new DirectionalLight(16777215, 1.1);
		sun.position.set(8, 20, 5);
		sun.castShadow = true;
		sun.shadow.mapSize.set(1024, 1024);
		sun.shadow.camera.left = -15;
		sun.shadow.camera.right = 15;
		sun.shadow.camera.top = 20;
		sun.shadow.camera.bottom = -20;
		scene.add(sun);
		const groundGeo = new PlaneGeometry(8, 20);
		const groundMatA = new MeshStandardMaterial({ color: 16032353 });
		const groundMatB = new MeshStandardMaterial({ color: 15320170 });
		const grounds = [];
		for (let i = 0; i < 8; i++) {
			const g = new Mesh(groundGeo, i % 2 ? groundMatA : groundMatB);
			g.rotation.x = -Math.PI / 2;
			g.position.z = i * 20;
			g.receiveShadow = true;
			scene.add(g);
			grounds.push(g);
		}
		for (let i = 0; i < 30; i++) {
			const stripe = new Mesh(new PlaneGeometry(.1, 1.2), new MeshBasicMaterial({ color: 16777215 }));
			stripe.rotation.x = -Math.PI / 2;
			stripe.position.set(-1, .01, i * 5);
			stripe.userData.stripe = true;
			scene.add(stripe);
			const s2 = stripe.clone();
			s2.position.x = 1;
			scene.add(s2);
		}
		const trees = [];
		function makeTree() {
			const g = new Group();
			const trunk = new Mesh(new CylinderGeometry(.2, .3, 1.5), new MeshStandardMaterial({ color: 9132587 }));
			trunk.position.y = .75;
			const top = new Mesh(new ConeGeometry(1, 2.5, 8), new MeshStandardMaterial({ color: 2984510 }));
			top.position.y = 2.5;
			top.castShadow = true;
			g.add(trunk, top);
			return g;
		}
		for (let i = 0; i < 20; i++) {
			const t = makeTree();
			t.position.set(i % 2 ? 6 : -6, 0, i * 8);
			scene.add(t);
			trees.push(t);
		}
		const player = new Group();
		const bodyMat = new MeshStandardMaterial({ color: 16747586 });
		const body = new Mesh(new BoxGeometry(.9, 1, .7), bodyMat);
		body.position.y = .6;
		body.castShadow = true;
		const head = new Mesh(new BoxGeometry(.8, .7, .7), bodyMat);
		head.position.set(0, 1.45, .05);
		head.castShadow = true;
		const earL = new Mesh(new ConeGeometry(.18, .4, 4), bodyMat);
		earL.position.set(-.25, 1.95, 0);
		const earR = earL.clone();
		earR.position.x = .25;
		const muzzle = new Mesh(new BoxGeometry(.4, .3, .3), new MeshStandardMaterial({ color: 16777215 }));
		muzzle.position.set(0, 1.35, .45);
		const eyeMat = new MeshStandardMaterial({ color: 1710618 });
		const eyeL = new Mesh(new SphereGeometry(.06, 8, 8), eyeMat);
		eyeL.position.set(-.18, 1.55, .4);
		const eyeR = eyeL.clone();
		eyeR.position.x = .18;
		const legMat = new MeshStandardMaterial({ color: 14248490 });
		const legFL = new Mesh(new BoxGeometry(.22, .5, .22), legMat);
		legFL.position.set(-.25, .15, .2);
		const legFR = legFL.clone();
		legFR.position.x = .25;
		const legBL = legFL.clone();
		legBL.position.z = -.2;
		const legBR = legFR.clone();
		legBR.position.z = -.2;
		player.add(body, head, earL, earR, muzzle, eyeL, eyeR, legFL, legFR, legBL, legBR);
		player.position.set(0, 0, 4);
		scene.add(player);
		const obstacles = [];
		const coinObjs = [];
		const boxGeo = new BoxGeometry(1.2, 1.2, 1.2);
		const lowMat = new MeshStandardMaterial({ color: 14034984 });
		const barGeo = new BoxGeometry(1.8, .3, .4);
		const barMat = new MeshStandardMaterial({ color: 6966419 });
		const coinGeo = new CylinderGeometry(.35, .35, .08, 16);
		const coinMat = new MeshStandardMaterial({
			color: 16766474,
			metalness: .6,
			roughness: .3,
			emissive: 5583616
		});
		function spawnObstacle(z) {
			const kind = Math.random() < .65 ? "low" : "high";
			const lane = Math.floor(Math.random() * 3);
			let mesh;
			if (kind === "low") {
				mesh = new Mesh(boxGeo, lowMat);
				mesh.position.set(LANES[lane], .6, z);
			} else {
				mesh = new Mesh(barGeo, barMat);
				mesh.position.set(LANES[lane], 1.9, z);
			}
			mesh.castShadow = true;
			scene.add(mesh);
			obstacles.push({
				mesh,
				kind,
				lane
			});
		}
		function spawnCoinRow(z) {
			const lane = Math.floor(Math.random() * 3);
			const count = 3 + Math.floor(Math.random() * 3);
			for (let i = 0; i < count; i++) {
				const m = new Mesh(coinGeo, coinMat);
				m.rotation.x = Math.PI / 2;
				m.position.set(LANES[lane], 1, z + i * 1.6);
				scene.add(m);
				coinObjs.push({
					mesh: m,
					lane
				});
			}
		}
		for (let z = 25; z < 120; z += 12) {
			if (Math.random() < .7) spawnObstacle(z);
			if (Math.random() < .5) spawnCoinRow(z + 4);
		}
		const move = (dir) => {
			const st = stateRef.current;
			if (st.phase !== "playing") return;
			st.lane = Math.max(0, Math.min(2, st.lane + dir));
			st.targetX = LANES[st.lane];
		};
		const jump = () => {
			const st = stateRef.current;
			if (st.phase !== "playing") return;
			if (st.y <= .01 && !st.sliding) st.vy = JUMP_V;
		};
		const slide = () => {
			const st = stateRef.current;
			if (st.phase !== "playing") return;
			if (st.y <= .01) {
				st.sliding = true;
				st.slideT = SLIDE_TIME;
			}
		};
		const resetWorld = () => {
			for (const o of obstacles) scene.remove(o.mesh);
			obstacles.length = 0;
			for (const c of coinObjs) scene.remove(c.mesh);
			coinObjs.length = 0;
			player.position.set(0, 0, 4);
			player.rotation.x = 0;
			player.scale.y = 1;
			for (let z = 25; z < 120; z += 12) {
				if (Math.random() < .7) spawnObstacle(z);
				if (Math.random() < .5) spawnCoinRow(z + 4);
			}
		};
		ctrlRef.current = {
			move,
			jump,
			slide,
			start,
			resetWorld
		};
		const onKey = (e) => {
			if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") move(-1);
			else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") move(1);
			else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
				e.preventDefault();
				jump();
			} else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") slide();
		};
		window.addEventListener("keydown", onKey);
		let tx = 0, ty = 0, tracking = false;
		const onTS = (e) => {
			const t = e.touches[0];
			tx = t.clientX;
			ty = t.clientY;
			tracking = true;
		};
		const onTE = (e) => {
			if (!tracking) return;
			tracking = false;
			const t = e.changedTouches[0];
			const dx = t.clientX - tx;
			const dy = t.clientY - ty;
			if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
			if (Math.abs(dx) > Math.abs(dy)) if (dx > 0) move(1);
			else move(-1);
			else if (dy < 0) jump();
			else slide();
		};
		const dom = renderer.domElement;
		dom.addEventListener("touchstart", onTS, { passive: true });
		dom.addEventListener("touchend", onTE, { passive: true });
		const onResize = () => {
			if (!mount) return;
			camera.aspect = mount.clientWidth / mount.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(mount.clientWidth, mount.clientHeight);
		};
		window.addEventListener("resize", onResize);
		const clock = new Clock();
		let raf = 0;
		let animT = 0;
		const animate = () => {
			raf = requestAnimationFrame(animate);
			const dt = Math.min(.05, clock.getDelta());
			const s = stateRef.current;
			if (s.phase === "playing") {
				s.elapsed += dt;
				s.speed = BASE_SPEED + s.elapsed * SPEED_GROWTH;
				const adv = s.speed * dt;
				s.distance += adv;
				player.position.x += (s.targetX - player.position.x) * Math.min(1, dt * 12);
				if (s.y > 0 || s.vy > 0) {
					s.vy += GRAVITY * dt;
					s.y += s.vy * dt;
					if (s.y < 0) {
						s.y = 0;
						s.vy = 0;
					}
				}
				player.position.y = s.y;
				if (s.sliding) {
					s.slideT -= dt;
					if (s.slideT <= 0) s.sliding = false;
				}
				player.scale.y = s.sliding ? .5 : 1;
				player.rotation.x = s.sliding ? -.3 : 0;
				animT += dt * 10;
				const swing = Math.sin(animT) * .5;
				legFL.position.z = .2 + swing * .2;
				legFR.position.z = .2 - swing * .2;
				legBL.position.z = -.2 - swing * .2;
				legBR.position.z = -.2 + swing * .2;
				for (const g of grounds) {
					g.position.z -= adv;
					if (g.position.z < -15) g.position.z += grounds.length * 20;
				}
				scene.children.forEach((c) => {
					if (c.userData?.stripe) {
						c.position.z -= adv;
						if (c.position.z < -10) c.position.z += 150;
					}
				});
				for (const t of trees) {
					t.position.z -= adv;
					if (t.position.z < -10) t.position.z += 160;
				}
				for (let i = obstacles.length - 1; i >= 0; i--) {
					const o = obstacles[i];
					o.mesh.position.z -= adv;
					if (o.mesh.position.z < -5) {
						scene.remove(o.mesh);
						obstacles.splice(i, 1);
						continue;
					}
					if (Math.abs(o.mesh.position.z - player.position.z) < .9 && o.lane === s.lane) {
						if (o.kind === "low" && s.y < 1.2) endGame();
						else if (o.kind === "high" && !s.sliding) endGame();
					}
				}
				for (let i = coinObjs.length - 1; i >= 0; i--) {
					const c = coinObjs[i];
					c.mesh.position.z -= adv;
					c.mesh.rotation.y += dt * 5;
					if (c.mesh.position.z < -5) {
						scene.remove(c.mesh);
						coinObjs.splice(i, 1);
						continue;
					}
					if (c.lane === s.lane && Math.abs(c.mesh.position.z - player.position.z) < .8 && Math.abs(c.mesh.position.y - (player.position.y + .8)) < 1.2) {
						scene.remove(c.mesh);
						coinObjs.splice(i, 1);
						s.coins += 1;
						setCoins(s.coins);
					}
				}
				s.spawnT -= dt;
				if (s.spawnT <= 0) {
					spawnObstacle(110);
					s.spawnT = Math.max(.55, SPAWN_GAP / s.speed);
				}
				s.coinSpawnT -= dt;
				if (s.coinSpawnT <= 0) {
					spawnCoinRow(110);
					s.coinSpawnT = 1.6 + Math.random() * 1.2;
				}
				setScore(Math.floor(s.distance));
			}
			renderer.render(scene, camera);
		};
		function endGame() {
			const s = stateRef.current;
			if (s.phase !== "playing") return;
			s.phase = "over";
			const finalScore = Math.floor(s.distance);
			const finalCoins = s.coins;
			setPhase("over");
			setScore(finalScore);
			setBest((b) => {
				const nb = Math.max(b, finalScore);
				if (typeof window !== "undefined") localStorage.setItem("kalqy-runner-best", String(nb));
				return nb;
			});
			onComplete?.(finalScore, finalCoins);
		}
		animate();
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("resize", onResize);
			dom.removeEventListener("touchstart", onTS);
			dom.removeEventListener("touchend", onTE);
			renderer.dispose();
			if (dom.parentNode) dom.parentNode.removeChild(dom);
			scene.traverse((o) => {
				if (o.geometry) o.geometry.dispose?.();
				if (o.material) if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
				else o.material.dispose?.();
			});
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-2 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onBack,
					className: "flex items-center gap-2 rounded-full bg-card/95 px-4 py-2 text-sm font-black text-foreground shadow-lg backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-sunshine" }),
							" ",
							coins
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-coral" }),
							" ",
							score,
							"m"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: mountRef,
				className: "absolute inset-0"
			}),
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-3 top-16 z-20 md:top-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunnerGestureControl, {
					active: phase === "playing",
					controls: {
						moveLeft: () => ctrlRef.current?.move(-1),
						moveRight: () => ctrlRef.current?.move(1),
						jump: () => ctrlRef.current?.jump(),
						slide: () => ctrlRef.current?.slide()
					}
				})
			}),
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-between p-4 md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto flex flex-col gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => ctrlRef.current?.move(-1),
							className: "grid h-14 w-14 place-items-center rounded-full bg-card/90 text-foreground shadow-lg backdrop-blur",
							"aria-label": "Left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-6 w-6" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => ctrlRef.current?.jump(),
							className: "grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg",
							"aria-label": "Jump",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => ctrlRef.current?.slide(),
							className: "grid h-14 w-14 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-lg",
							"aria-label": "Slide",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-6 w-6" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto flex flex-col gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => ctrlRef.current?.move(1),
							className: "grid h-14 w-14 place-items-center rounded-full bg-card/90 text-foreground shadow-lg backdrop-blur",
							"aria-label": "Right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-6 w-6" })
						})
					})
				]
			}),
			phase === "start" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-center justify-center bg-background/40 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-4 max-w-md rounded-3xl border-4 border-card bg-card p-6 text-center shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-5xl",
							children: "🦊💨"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-3xl font-black text-foreground",
							children: "Endless Runner"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-bold text-muted-foreground",
							children: "Dodge obstacles, grab coins, run as far as you can!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 grid grid-cols-2 gap-2 text-left text-xs font-bold text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-secondary p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: "←→ / A D"
									}), " · Switch lane"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-secondary p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: "↑ / Space"
									}), " · Jump"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-secondary p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: "↓ / S"
									}), " · Slide"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-secondary p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: "Swipe"
									}), " · On mobile"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: start,
							className: "mx-auto flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-black text-primary-foreground shadow-lg transition-transform hover:scale-105",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5" }), " Start Running"]
						}),
						best > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 text-xs font-bold text-muted-foreground",
							children: ["Best: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-foreground",
								children: [best, "m"]
							})]
						})
					]
				})
			}),
			phase === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-center justify-center bg-background/50 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-4 max-w-md rounded-3xl border-4 border-card bg-card p-6 text-center shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-5xl",
							children: "🏁"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-3xl font-black text-foreground",
							children: "Run Complete!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-secondary p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Distance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-2xl font-black text-foreground",
									children: [score, "m"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-secondary p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Coins"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-black text-foreground",
									children: coins
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 text-xs font-bold text-muted-foreground",
							children: ["Best: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-foreground",
								children: [best, "m"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: start,
								className: "flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4" }), " Run Again"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onBack,
								className: "flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-black text-secondary-foreground shadow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Home"]
							})]
						})
					]
				})
			})
		]
	});
}
var PRAISE$1 = [
	"Awesome!",
	"Fantastic!",
	"You're a Math Star!",
	"Kudos!",
	"Great Job!"
];
var ENCOURAGE = [
	"Nice Try!",
	"You Can Do It!",
	"Let's Try Again!"
];
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle$2(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function makeQuestion(diff) {
	let a = 0, b = 0, answer = 0;
	let op = "+";
	if (diff === "beginner") {
		op = Math.random() < .5 ? "+" : "-";
		if (op === "+") {
			a = rand(0, 10);
			b = rand(0, 10 - a);
			answer = a + b;
		} else {
			a = rand(1, 10);
			b = rand(0, a);
			answer = a - b;
		}
	} else if (diff === "intermediate") {
		const r = Math.random();
		if (r < .4) {
			op = "+";
			a = rand(2, 20);
			b = rand(2, 20);
			answer = a + b;
		} else if (r < .7) {
			op = "-";
			a = rand(5, 20);
			b = rand(1, a);
			answer = a - b;
		} else {
			op = "×";
			a = rand(1, 10);
			b = rand(1, 10);
			answer = a * b;
		}
	} else {
		const r = Math.random();
		if (r < .4) {
			op = "×";
			a = rand(2, 12);
			b = rand(2, 12);
			answer = a * b;
		} else if (r < .7) {
			op = "÷";
			b = rand(2, 10);
			answer = rand(2, 10);
			a = b * answer;
		} else {
			op = Math.random() < .5 ? "+" : "-";
			a = rand(10, 50);
			b = rand(5, op === "-" ? a : 50);
			answer = op === "+" ? a + b : a - b;
		}
	}
	const distractors = /* @__PURE__ */ new Set();
	while (distractors.size < 3) {
		const delta = rand(-Math.max(2, Math.floor(answer / 3) + 1), Math.max(3, Math.floor(answer / 3) + 2));
		const cand = answer + delta;
		if (cand !== answer && cand >= 0 && !distractors.has(cand)) distractors.add(cand);
	}
	const opts = shuffle$2([answer, ...distractors]);
	return {
		prompt: `${a} ${op} ${b} = ?`,
		options: opts,
		correctIndex: opts.indexOf(answer),
		op
	};
}
function speak$2(text, muted) {
	if (muted) return;
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = .95;
		u.pitch = 1.25;
		window.speechSynthesis.speak(u);
	} catch {}
}
function playTone$1(freq, duration = .18, type = "sine", muted = false) {
	if (muted) return;
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.value = freq;
		osc.connect(gain);
		gain.connect(ctx.destination);
		gain.gain.setValueAtTime(1e-4, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.22, ctx.currentTime + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + duration);
		osc.start();
		osc.stop(ctx.currentTime + duration + .05);
	} catch {}
}
function successChime(muted) {
	playTone$1(660, .12, "sine", muted);
	setTimeout(() => playTone$1(880, .12, "sine", muted), 100);
	setTimeout(() => playTone$1(1175, .2, "sine", muted), 220);
}
function countFingers(landmarks) {
	if (!landmarks || landmarks.length < 21) return 0;
	const tips = [
		8,
		12,
		16,
		20
	];
	const pips = [
		6,
		10,
		14,
		18
	];
	let count = 0;
	for (let i = 0; i < 4; i++) if (landmarks[tips[i]].y < landmarks[pips[i]].y - .02) count++;
	return count;
}
var HAND_EDGES = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[0, 5],
	[5, 6],
	[6, 7],
	[7, 8],
	[5, 9],
	[9, 10],
	[10, 11],
	[11, 12],
	[9, 13],
	[13, 14],
	[14, 15],
	[15, 16],
	[13, 17],
	[17, 18],
	[18, 19],
	[19, 20],
	[0, 17]
];
function drawHand(ctx, lm, w, h, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.beginPath();
	for (const [a, b] of HAND_EDGES) {
		ctx.moveTo(lm[a].x * w, lm[a].y * h);
		ctx.lineTo(lm[b].x * w, lm[b].y * h);
	}
	ctx.stroke();
	ctx.fillStyle = "#ffffff";
	for (const p of lm) {
		ctx.beginPath();
		ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
		ctx.fill();
	}
}
function useThreeScene(mountRef) {
	const apiRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const mount = mountRef.current;
		if (!mount) return;
		const scene = new Scene();
		scene.background = null;
		const hemi = new HemisphereLight(16766965, 8978383, 1.1);
		scene.add(hemi);
		const sun = new DirectionalLight(16777215, .9);
		sun.position.set(4, 8, 5);
		scene.add(sun);
		const camera = new PerspectiveCamera(45, 1, .1, 100);
		camera.position.set(0, 1.6, 5.2);
		camera.lookAt(0, 1.2, 0);
		const renderer = new WebGLRenderer({
			antialias: true,
			alpha: true
		});
		renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
		renderer.outputColorSpace = SRGBColorSpace;
		mount.appendChild(renderer.domElement);
		const ground = new Mesh(new CircleGeometry(8, 48), new MeshStandardMaterial({ color: 8313175 }));
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = 0;
		scene.add(ground);
		for (let i = 0; i < 40; i++) {
			const r = 2 + Math.random() * 5;
			const a = Math.random() * Math.PI * 2;
			const stem = new Mesh(new CylinderGeometry(.02, .02, .25), new MeshStandardMaterial({ color: 3120708 }));
			stem.position.set(Math.cos(a) * r, .12, Math.sin(a) * r);
			const head = new Mesh(new SphereGeometry(.08, 8, 8), new MeshStandardMaterial({ color: new Color().setHSL(Math.random(), .8, .6) }));
			head.position.copy(stem.position);
			head.position.y += .18;
			scene.add(stem);
			scene.add(head);
		}
		for (let i = 0; i < 6; i++) {
			const a = i / 6 * Math.PI * 2;
			const r = 5.5;
			const trunk = new Mesh(new CylinderGeometry(.18, .22, 1.2), new MeshStandardMaterial({ color: 9132587 }));
			trunk.position.set(Math.cos(a) * r, .6, Math.sin(a) * r);
			const leaves = new Mesh(new SphereGeometry(.9, 16, 16), new MeshStandardMaterial({ color: 3126084 }));
			leaves.position.copy(trunk.position);
			leaves.position.y += 1.1;
			scene.add(trunk);
			scene.add(leaves);
		}
		const clouds = [];
		for (let i = 0; i < 5; i++) {
			const g = new Group();
			const mat = new MeshStandardMaterial({
				color: 16777215,
				roughness: 1
			});
			for (let j = 0; j < 4; j++) {
				const s = new Mesh(new SphereGeometry(.4 + Math.random() * .3, 12, 12), mat);
				s.position.set(j * .5 - .6, Math.random() * .1, 0);
				g.add(s);
			}
			g.position.set(-6 + i * 3, 3.5 + Math.random(), -3 - Math.random() * 2);
			scene.add(g);
			clouds.push(g);
		}
		const blockColors = [
			16739179,
			16765286,
			448160,
			5032432,
			11568383
		];
		for (let i = 0; i < 5; i++) {
			const block = new Mesh(new BoxGeometry(.4, .4, .4), new MeshStandardMaterial({ color: blockColors[i] }));
			block.position.set(-3 + i * 1.4, .2, -2.5);
			scene.add(block);
		}
		const balloons = [];
		const balloonColors = [
			16735631,
			16765286,
			5032432,
			10182117,
			448160
		];
		for (let i = 0; i < 5; i++) {
			const b = new Mesh(new SphereGeometry(.25, 16, 16), new MeshStandardMaterial({
				color: balloonColors[i],
				roughness: .4
			}));
			b.position.set(2.5 + i % 2 * .4, 2 + i * .3, -2 + i * .3);
			scene.add(b);
			balloons.push(b);
		}
		const char = new Group();
		char.position.set(-3, 0, .5);
		const skin = new MeshStandardMaterial({
			color: 16766629,
			roughness: .6
		});
		const shirt = new MeshStandardMaterial({ color: 5032432 });
		const pants = new MeshStandardMaterial({ color: 3835647 });
		const black = new MeshStandardMaterial({ color: 546 });
		const white = new MeshStandardMaterial({ color: 16777215 });
		const mouthMat = new MeshStandardMaterial({ color: 13631568 });
		const body = new Mesh(new CapsuleGeometry(.32, .5, 4, 12), shirt);
		body.position.y = .85;
		char.add(body);
		const legL = new Mesh(new CapsuleGeometry(.13, .4, 4, 8), pants);
		legL.position.set(-.16, .3, 0);
		char.add(legL);
		const legR = legL.clone();
		legR.position.x = .16;
		char.add(legR);
		const armL = new Mesh(new CapsuleGeometry(.1, .45, 4, 8), shirt);
		armL.position.set(-.42, .95, 0);
		char.add(armL);
		const armR = armL.clone();
		armR.position.x = .42;
		char.add(armR);
		const head = new Mesh(new SphereGeometry(.38, 24, 24), skin);
		head.position.y = 1.55;
		char.add(head);
		const hair = new Mesh(new SphereGeometry(.4, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2), new MeshStandardMaterial({ color: 3812906 }));
		hair.position.y = 1.62;
		char.add(hair);
		const eyeWhiteL = new Mesh(new SphereGeometry(.08, 12, 12), white);
		eyeWhiteL.position.set(-.13, 1.6, .32);
		char.add(eyeWhiteL);
		const eyeWhiteR = eyeWhiteL.clone();
		eyeWhiteR.position.x = .13;
		char.add(eyeWhiteR);
		const pupilL = new Mesh(new SphereGeometry(.035, 10, 10), black);
		pupilL.position.set(-.13, 1.6, .39);
		char.add(pupilL);
		const pupilR = pupilL.clone();
		pupilR.position.x = .13;
		char.add(pupilR);
		const cheekMat = new MeshStandardMaterial({ color: 16751266 });
		const cheekL = new Mesh(new SphereGeometry(.06, 10, 10), cheekMat);
		cheekL.position.set(-.22, 1.5, .3);
		char.add(cheekL);
		const cheekR = cheekL.clone();
		cheekR.position.x = .22;
		char.add(cheekR);
		const mouth = new Mesh(new TorusGeometry(.09, .025, 8, 16, Math.PI), mouthMat);
		mouth.position.set(0, 1.46, .34);
		mouth.rotation.z = Math.PI;
		char.add(mouth);
		scene.add(char);
		const particleGroup = new Group();
		scene.add(particleGroup);
		const particles = [];
		const spawnBurst = (origin, color) => {
			const colors = [
				16765286,
				16739179,
				5032432,
				10182117,
				448160
			];
			for (let i = 0; i < 40; i++) {
				const c = color ?? colors[i % colors.length];
				const m = new Mesh(new TetrahedronGeometry(.08), new MeshStandardMaterial({
					color: c,
					emissive: c,
					emissiveIntensity: .3
				}));
				m.position.copy(origin);
				particleGroup.add(m);
				particles.push({
					mesh: m,
					vel: new Vector3((Math.random() - .5) * 3, 2 + Math.random() * 2.5, (Math.random() - .5) * 2),
					life: 1.6,
					spin: (Math.random() - .5) * 8
				});
			}
		};
		const flies = [];
		for (let i = 0; i < 4; i++) {
			const m = new Mesh(new ConeGeometry(.08, .18, 6), new MeshStandardMaterial({ color: 16740518 }));
			scene.add(m);
			flies.push({
				mesh: m,
				t: Math.random() * Math.PI * 2,
				r: 1.5 + Math.random() * 2,
				speed: .6 + Math.random() * .5,
				y: 1.2 + Math.random() * 1.2
			});
		}
		const state = {
			mood: "idle",
			moodT: 0,
			talking: false,
			walkPhase: 0
		};
		state.mood = "walking-in";
		apiRef.current = {
			celebrate: () => {
				state.mood = "celebrate";
				state.moodT = 0;
				spawnBurst(new Vector3(char.position.x, 1.8, char.position.z));
				for (const b of balloons) b.userData.release = true;
			},
			encourage: () => {
				state.mood = "encourage";
				state.moodT = 0;
			},
			setTalking: (b) => {
				state.talking = b;
			}
		};
		const resize = () => {
			if (!mount) return;
			const { clientWidth: w, clientHeight: h } = mount;
			renderer.setSize(w, h, false);
			camera.aspect = w / Math.max(1, h);
			camera.updateProjectionMatrix();
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(mount);
		let rafId = 0;
		let last = performance.now();
		const clock = new Clock();
		let blinkTimer = 0;
		let nextBlink = 2 + Math.random() * 3;
		const tick = () => {
			const now = performance.now();
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const t = clock.getElapsedTime();
			for (const c of clouds) {
				c.position.x += dt * .15;
				if (c.position.x > 7) c.position.x = -7;
			}
			for (const f of flies) {
				f.t += dt * f.speed;
				f.mesh.position.set(Math.cos(f.t) * f.r + 1.5, f.y + Math.sin(f.t * 2) * .2, Math.sin(f.t) * f.r - 1);
				f.mesh.rotation.z = Math.sin(t * 8) * .6;
			}
			for (const b of balloons) if (b.userData.release) {
				b.position.y += dt * 1.5;
				if (b.position.y > 8) {
					b.position.y = 2 + Math.random();
					b.userData.release = false;
				}
			} else b.position.y += Math.sin(t * 1.5 + b.position.x) * dt * .1;
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.life -= dt;
				p.vel.y -= dt * 4;
				p.mesh.position.addScaledVector(p.vel, dt);
				p.mesh.rotation.x += p.spin * dt;
				p.mesh.rotation.y += p.spin * dt;
				if (p.life <= 0) {
					particleGroup.remove(p.mesh);
					p.mesh.geometry.dispose();
					p.mesh.material.dispose();
					particles.splice(i, 1);
				}
			}
			blinkTimer += dt;
			const blinking = blinkTimer > nextBlink && blinkTimer < nextBlink + .12;
			if (blinkTimer > nextBlink + .12) {
				blinkTimer = 0;
				nextBlink = 2 + Math.random() * 3;
			}
			eyeWhiteL.scale.y = eyeWhiteR.scale.y = blinking ? .1 : 1;
			pupilL.scale.y = pupilR.scale.y = blinking ? .1 : 1;
			if (state.talking) {
				const m = 1 + Math.abs(Math.sin(t * 12)) * .6;
				mouth.scale.set(1, m, 1);
			} else mouth.scale.set(1, 1, 1);
			state.moodT += dt;
			char.position.y = Math.sin(t * 2) * .04;
			if (state.mood === "walking-in") {
				const target = 0;
				char.position.x += (target - char.position.x) * Math.min(1, dt * 1.6);
				state.walkPhase += dt * 8;
				legL.rotation.x = Math.sin(state.walkPhase) * .6;
				legR.rotation.x = -Math.sin(state.walkPhase) * .6;
				armL.rotation.x = -Math.sin(state.walkPhase) * .5;
				armR.rotation.x = Math.sin(state.walkPhase) * .5;
				if (Math.abs(char.position.x - target) < .05) {
					state.mood = "wave";
					state.moodT = 0;
					legL.rotation.x = legR.rotation.x = 0;
				}
			} else if (state.mood === "wave") {
				armR.rotation.z = -Math.PI / 1.4;
				armR.rotation.x = Math.sin(state.moodT * 8) * .5;
				if (state.moodT > 1.5) {
					armR.rotation.z = 0;
					armR.rotation.x = 0;
					state.mood = "idle";
				}
			} else if (state.mood === "celebrate") {
				const jump = Math.abs(Math.sin(state.moodT * 6)) * .4;
				char.position.y = jump;
				armL.rotation.z = Math.PI / 2 + Math.sin(state.moodT * 12) * .4;
				armR.rotation.z = -Math.PI / 2 - Math.sin(state.moodT * 12) * .4;
				char.rotation.y = Math.sin(state.moodT * 4) * .3;
				if (state.moodT > 2) {
					armL.rotation.z = 0;
					armR.rotation.z = 0;
					char.rotation.y = 0;
					state.mood = "idle";
				}
			} else if (state.mood === "encourage") {
				armR.rotation.z = -Math.PI / 2.5;
				head.rotation.x = Math.sin(state.moodT * 4) * .2;
				if (state.moodT > 1.5) {
					armR.rotation.z = 0;
					head.rotation.x = 0;
					state.mood = "idle";
				}
			}
			renderer.render(scene, camera);
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(rafId);
			ro.disconnect();
			renderer.dispose();
			if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
			scene.traverse((o) => {
				if (o.geometry) o.geometry.dispose?.();
				if (o.material) if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
				else o.material.dispose?.();
			});
		};
	}, [mountRef]);
	return apiRef;
}
function MathAdventure({ onBack, onComplete }) {
	const [difficulty, setDifficulty] = (0, import_react.useState)(null);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [question, setQuestion] = (0, import_react.useState)(null);
	const [questionNum, setQuestionNum] = (0, import_react.useState)(0);
	const totalQuestions = 10;
	const [correct, setCorrect] = (0, import_react.useState)(0);
	const [coins, setCoins] = (0, import_react.useState)(0);
	const [gems, setGems] = (0, import_react.useState)(0);
	const [xp, setXp] = (0, import_react.useState)(0);
	const [streak, setStreak] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("select");
	const [confetti, setConfetti] = (0, import_react.useState)(false);
	const sceneMountRef = (0, import_react.useRef)(null);
	const sceneApiRef = useThreeScene(sceneMountRef);
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const landmarkerRef = (0, import_react.useRef)(null);
	const lastVideoTimeRef = (0, import_react.useRef)(-1);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [fingerCount, setFingerCount] = (0, import_react.useState)(null);
	const [hint, setHint] = (0, import_react.useState)("Show 1, 2, 3, or 4 fingers.");
	const [holdProgress, setHoldProgress] = (0, import_react.useState)(0);
	const holdStartRef = (0, import_react.useRef)(null);
	const holdCountRef = (0, import_react.useRef)(null);
	const lockedRef = (0, import_react.useRef)(false);
	const questionRef = (0, import_react.useRef)(null);
	questionRef.current = question;
	const submitAnswerRef = (0, import_react.useRef)(() => {});
	const drawAndCountRef = (0, import_react.useRef)(() => {});
	const startGame = (diff) => {
		setDifficulty(diff);
		setCorrect(0);
		setCoins(0);
		setGems(0);
		setXp(0);
		setStreak(0);
		setQuestionNum(0);
		const q = makeQuestion(diff);
		setQuestion(q);
		setPhase("playing");
		setTimeout(() => {
			sceneApiRef.current?.setTalking(true);
			speak$2(`Hi! Let's solve some fun math questions together! ${q.prompt}`, muted);
			setTimeout(() => sceneApiRef.current?.setTalking(false), 3500);
		}, 600);
	};
	(0, import_react.useEffect)(() => {
		if (phase !== "playing" || !question) return;
		if (questionNum === 0) return;
		sceneApiRef.current?.setTalking(true);
		speak$2(question.prompt.replace("×", "times").replace("÷", "divided by"), muted);
		const t = setTimeout(() => sceneApiRef.current?.setTalking(false), 1800);
		return () => clearTimeout(t);
	}, [
		question,
		questionNum,
		phase,
		muted,
		sceneApiRef
	]);
	const submitAnswer = (0, import_react.useCallback)((choice) => {
		const q = questionRef.current;
		if (!q || lockedRef.current || phase !== "playing") return;
		if (choice === q.correctIndex) {
			lockedRef.current = true;
			const msg = PRAISE$1[Math.floor(Math.random() * PRAISE$1.length)];
			setFeedback({
				type: "correct",
				msg,
				choice
			});
			setConfetti(true);
			setCorrect((c) => c + 1);
			setCoins((c) => c + 10);
			setXp((x) => x + 20);
			setStreak((s) => s + 1);
			if ((correct + 1) % 5 === 0) setGems((g) => g + 1);
			successChime(muted);
			sceneApiRef.current?.celebrate();
			speak$2(msg, muted);
			setTimeout(() => {
				setConfetti(false);
				setFeedback(null);
				holdStartRef.current = null;
				holdCountRef.current = null;
				setHoldProgress(0);
				if (questionNum + 1 >= totalQuestions) {
					setPhase("end");
					onComplete?.({
						correct: correct + 1,
						total: totalQuestions,
						coins: coins + 10,
						gems: gems + ((correct + 1) % 5 === 0 ? 1 : 0)
					});
				} else {
					setQuestionNum((n) => n + 1);
					setQuestion(makeQuestion(difficulty));
				}
				lockedRef.current = false;
			}, 2e3);
		} else {
			const msg = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];
			setFeedback({
				type: "wrong",
				msg,
				choice
			});
			setStreak(0);
			playTone$1(330, .2, "triangle", muted);
			sceneApiRef.current?.encourage();
			speak$2(msg, muted);
			setTimeout(() => {
				setFeedback(null);
				holdStartRef.current = null;
				holdCountRef.current = null;
				setHoldProgress(0);
			}, 1300);
		}
	}, [
		phase,
		questionNum,
		correct,
		coins,
		gems,
		muted,
		difficulty,
		onComplete,
		sceneApiRef
	]);
	const initLandmarker = (0, import_react.useCallback)(async () => {
		if (landmarkerRef.current) return landmarkerRef.current;
		const { FilesetResolver, HandLandmarker } = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
		const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
		const landmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
				delegate: "GPU"
			},
			runningMode: "VIDEO",
			numHands: 1
		});
		landmarkerRef.current = landmarker;
		return landmarker;
	}, []);
	const startCamera = (0, import_react.useCallback)(async () => {
		setStatus("loading");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 640 },
					height: { ideal: 480 }
				},
				audio: false
			});
			streamRef.current = stream;
			const video = videoRef.current;
			if (!video) return;
			video.srcObject = stream;
			try {
				await video.play();
			} catch {}
			await initLandmarker();
			setStatus("ready");
			loop();
		} catch (err) {
			if (err?.name === "NotAllowedError" || err?.name === "SecurityError") setStatus("denied");
			else setStatus("error");
		}
	}, [initLandmarker]);
	const stopCamera = (0, import_react.useCallback)(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		try {
			landmarkerRef.current?.close?.();
		} catch {}
		landmarkerRef.current = null;
	}, []);
	const loop = (0, import_react.useCallback)(() => {
		const tick = () => {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			const landmarker = landmarkerRef.current;
			if (!video || !canvas || !landmarker) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (document.hidden) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
				lastVideoTimeRef.current = video.currentTime;
				try {
					const result = landmarker.detectForVideo(video, performance.now());
					drawAndCountRef.current(result);
				} catch {}
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
	}, []);
	const drawAndCount = (result) => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (!canvas || !video) return;
		const w = video.videoWidth || 640;
		const h = video.videoHeight || 480;
		if (canvas.width !== w) canvas.width = w;
		if (canvas.height !== h) canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const hands = result?.landmarks ?? [];
		if (hands.length === 0) {
			setFingerCount(null);
			setHint("Show your hand to the camera.");
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			return;
		}
		const lm = hands[0];
		drawHand(ctx, lm, w, h, "#22c55e");
		const count = countFingers(lm);
		setFingerCount(count);
		if (count < 1 || count > 4) {
			setHint(count === 0 ? "Hold up 1–4 fingers." : "Use 1, 2, 3, or 4 fingers.");
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			return;
		}
		setHint(`Detected ${count} finger${count > 1 ? "s" : ""} — hold steady…`);
		if (lockedRef.current) {
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			return;
		}
		const now = performance.now();
		if (holdCountRef.current !== count) {
			holdCountRef.current = count;
			holdStartRef.current = now;
			setHoldProgress(0);
			return;
		}
		const elapsed = now - (holdStartRef.current ?? now);
		const HOLD_MS = 1e3;
		setHoldProgress(Math.min(1, elapsed / HOLD_MS));
		if (elapsed >= HOLD_MS) {
			const choice = count - 1;
			holdStartRef.current = null;
			holdCountRef.current = null;
			setHoldProgress(0);
			const q = questionRef.current;
			if (q && choice < q.options.length) submitAnswerRef.current(choice);
		}
	};
	submitAnswerRef.current = submitAnswer;
	drawAndCountRef.current = drawAndCount;
	(0, import_react.useEffect)(() => {
		if (phase === "playing") startCamera();
		return () => {
			stopCamera();
		};
	}, [phase]);
	(0, import_react.useEffect)(() => {
		return () => {
			window.speechSynthesis?.cancel();
			stopCamera();
		};
	}, []);
	const accuracy = (0, import_react.useMemo)(() => questionNum === 0 ? 0 : Math.round(correct / Math.max(1, questionNum + (phase === "end" ? 1 : 0)) * 100), [
		correct,
		questionNum,
		phase
	]);
	const restart = () => {
		setPhase("select");
		setDifficulty(null);
		setQuestion(null);
		setFeedback(null);
		lockedRef.current = false;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-full overflow-hidden bg-gradient-to-b from-[#ffd6f0] via-[#cfe9ff] to-[#d6f5d6]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 select-none text-5xl opacity-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-6 top-8 animate-bounce-soft",
						children: "☁️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-12 top-16",
						children: "🌈"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-20 left-12",
						children: "🌸"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-8 right-8 animate-bounce-soft",
						children: "🎈"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								window.speechSynthesis?.cancel();
								onBack();
							},
							className: "flex items-center gap-2 rounded-2xl bg-card/90 px-4 py-2 text-sm font-bold text-foreground shadow-sm backdrop-blur transition-all hover:scale-105 active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" }),
									value: correct,
									color: "text-sunshine"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }),
									value: coins,
									color: "text-amber-500"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "h-4 w-4" }),
									value: gems,
									color: "text-sky-500"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }),
									value: xp + " XP",
									color: "text-violet-500"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMuted((m) => !m),
									className: "flex items-center gap-1 rounded-2xl bg-card/90 px-3 py-2 text-sm font-black shadow-sm backdrop-blur transition-all hover:scale-105 active:scale-95",
									title: muted ? "Unmute" : "Mute",
									children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
								})
							]
						})]
					}),
					phase === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-1 items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-3xl rounded-3xl border-4 border-card bg-card/90 p-6 text-center shadow-xl backdrop-blur md:p-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 text-6xl",
									children: "🧮"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-black text-foreground md:text-5xl",
									children: "Math Adventure"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-base font-bold text-muted-foreground md:text-lg",
									children: "Solve fun math problems with your fingers! ✋"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 grid gap-4 md:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
											emoji: "🌱",
											title: "Beginner",
											desc: "Add & subtract up to 10",
											onClick: () => startGame("beginner"),
											gradient: "from-emerald-300 to-emerald-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
											emoji: "🚀",
											title: "Intermediate",
											desc: "Bigger sums & ×1–10",
											onClick: () => startGame("intermediate"),
											gradient: "from-sky-300 to-sky-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
											emoji: "🧙",
											title: "Advanced",
											desc: "× ÷ and mixed magic",
											onClick: () => startGame("advanced"),
											gradient: "from-fuchsia-300 to-fuchsia-500"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 inline h-3 w-3" }), " Camera + voice powered · Ages 4–10"]
								})
							]
						})
					}),
					phase === "playing" && question && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid flex-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative overflow-hidden rounded-3xl border-4 border-card bg-gradient-to-b from-sky-200 via-pink-100 to-emerald-100 shadow-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											ref: sceneMountRef,
											className: "h-[280px] w-full md:h-[340px]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-foreground shadow",
											children: "🦊 Kalqy the Math Buddy"
										}),
										feedback?.type === "correct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pointer-events-none absolute inset-0 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "animate-pop rounded-3xl bg-white/90 px-6 py-4 text-3xl font-black text-emerald-600 shadow-2xl md:text-4xl",
												children: ["🎉 ", feedback.msg]
											})
										}),
										feedback?.type === "wrong" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pointer-events-none absolute inset-0 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "animate-pop rounded-3xl bg-white/90 px-6 py-4 text-2xl font-black text-pink-500 shadow-2xl md:text-3xl",
												children: ["🤗 ", feedback.msg]
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-3xl border-4 border-card bg-card/95 p-5 text-center shadow-lg backdrop-blur md:p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3 w-3" }),
												" Question ",
												questionNum + 1,
												" of ",
												totalQuestions
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-5xl font-black text-foreground drop-shadow-sm md:text-7xl",
											children: question.prompt
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-sm font-bold text-muted-foreground",
											children: [
												"Show ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary",
													children: "1, 2, 3, or 4"
												}),
												" fingers to pick an answer."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-4 md:gap-5",
									children: question.options.map((opt, i) => {
										const isCorrect = feedback?.type === "correct" && feedback.choice === i;
										const isWrong = feedback?.type === "wrong" && feedback.choice === i;
										const isPending = fingerCount === i + 1 && !feedback;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => submitAnswer(i),
											disabled: !!feedback && feedback.type === "correct",
											className: `relative flex aspect-[5/3] flex-col items-center justify-center gap-2 rounded-3xl border-4 bg-gradient-to-br ${[
												"from-rose-400 to-rose-500",
												"from-amber-400 to-amber-500",
												"from-sky-400 to-sky-500",
												"from-emerald-400 to-emerald-500"
											][i]} p-4 text-center text-white shadow-xl transition-all hover:-translate-y-1 hover:rotate-1 active:scale-95 ${isCorrect ? "border-white ring-4 ring-emerald-300 scale-105" : isWrong ? "border-white ring-4 ring-rose-300 animate-pop" : isPending ? "border-white ring-4 ring-white/70" : "border-white/40"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-base font-black text-foreground shadow-lg",
													children: i + 1
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-5xl font-black drop-shadow-md md:text-6xl",
													children: opt
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] font-black uppercase tracking-wider opacity-90",
													children: [
														"Show ",
														i + 1,
														" finger",
														i > 0 ? "s" : ""
													]
												}),
												isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute bottom-2 left-3 right-3 h-2 overflow-hidden rounded-full bg-white/30",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full rounded-full bg-white transition-all",
														style: { width: `${holdProgress * 100}%` }
													})
												})
											]
										}, i);
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border-4 border-card bg-card/95 p-3 shadow-lg backdrop-blur",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between gap-2 text-sm font-black text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 text-primary" }), " Hand Camera"]
									}), fingerCount !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-primary px-2.5 py-0.5 text-xs text-primary-foreground",
										children: [fingerCount, " ✋"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
											ref: videoRef,
											className: "absolute inset-0 h-full w-full -scale-x-100 object-cover",
											playsInline: true,
											muted: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
											ref: canvasRef,
											className: "pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
										}),
										status !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center text-white",
											children: [
												status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-bold",
													children: "Loading hand detector…"
												})] }),
												status === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-2xl",
														children: "📷"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold",
														children: "Camera blocked."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: startCamera,
														className: "rounded-xl bg-white px-3 py-1.5 text-xs font-black text-black",
														children: "Retry"
													})
												] }),
												status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-bold",
													children: "Camera unavailable."
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: startCamera,
													className: "rounded-xl bg-white px-3 py-1.5 text-xs font-black text-black",
													children: "Try Again"
												})] })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-center text-xs font-bold text-muted-foreground",
									children: hint
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-4 gap-1.5",
									children: [
										1,
										2,
										3,
										4
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `rounded-xl border-2 px-1 py-1 text-center text-xs font-black transition-all ${fingerCount === n ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted/40 text-muted-foreground"}`,
										children: [
											[
												"☝️",
												"✌️",
												"🤟",
												"🖖"
											][n - 1],
											" ",
											n
										]
									}, n))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-2xl bg-muted/40 p-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-1 font-black uppercase tracking-wider text-muted-foreground",
											children: "Live Stats"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: "Answered",
											value: `${questionNum}/${totalQuestions}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: "Accuracy",
											value: `${accuracy}%`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: "Streak",
											value: `${streak} 🔥`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: "Coins",
											value: String(coins)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											label: "Gems",
											value: String(gems)
										})
									]
								})
							]
						})]
					}),
					phase === "end" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-1 items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-pop w-full max-w-xl rounded-3xl border-4 border-card bg-card/95 p-8 text-center shadow-2xl backdrop-blur",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 text-7xl",
									children: "🏆"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-black text-foreground md:text-5xl",
									children: "You Did It!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-base font-bold text-muted-foreground",
									children: "You're a Math Star! ⭐"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "my-6 grid grid-cols-2 gap-3 md:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
											label: "Correct",
											value: `${correct}/${totalQuestions}`,
											icon: "✅"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
											label: "Coins",
											value: String(coins),
											icon: "🪙"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
											label: "Gems",
											value: String(gems),
											icon: "💎"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
											label: "XP",
											value: String(xp),
											icon: "🏆"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => difficulty && startGame(difficulty),
											className: "flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Play Again"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: restart,
											className: "rounded-2xl bg-card px-6 py-3 text-lg font-black text-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
											children: "Change Level"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: onBack,
											className: "rounded-2xl bg-muted px-6 py-3 text-lg font-black text-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
											children: "Dashboard"
										})
									]
								})
							]
						})
					})
				]
			}),
			confetti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti$1, {})
		]
	});
}
function Pill({ icon, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-1.5 rounded-2xl bg-card/90 px-3 py-2 text-sm font-black shadow-sm backdrop-blur ${color}`,
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
function LevelCard({ emoji, title, desc, onClick, gradient }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `group rounded-3xl bg-gradient-to-br ${gradient} p-6 text-left text-white shadow-xl transition-all hover:-translate-y-1 hover:rotate-1 active:scale-95`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-5xl drop-shadow-md",
				children: emoji
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-2xl font-black",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-sm font-bold opacity-90",
				children: desc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-black uppercase tracking-wider",
				children: "Start ▶"
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-bold text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-black text-foreground",
			children: value
		})]
	});
}
function Stat$1({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-muted/50 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-2xl",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xl font-black text-foreground",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-black uppercase tracking-wider text-muted-foreground",
				children: label
			})
		]
	});
}
function Confetti$1() {
	const pieces = Array.from({ length: 60 });
	const colors = [
		"#f97316",
		"#facc15",
		"#22c55e",
		"#38bdf8",
		"#a855f7",
		"#ef4444",
		"#ec4899"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-50 overflow-hidden",
		children: pieces.map((_, i) => {
			const left = Math.random() * 100;
			const delay = Math.random() * .3;
			const duration = 1.4 + Math.random() * 1;
			const color = colors[i % colors.length];
			const size = 6 + Math.random() * 10;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					left: `${left}%`,
					top: "-10vh",
					width: size,
					height: size,
					background: color,
					animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
					borderRadius: i % 3 === 0 ? "50%" : "2px"
				},
				className: "absolute"
			}, i);
		})
	});
}
function StickerBook({ onBack }) {
	const [, force] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const unsub = subscribeRewards(() => force((n) => n + 1));
		return () => {
			unsub();
		};
	}, []);
	const rewards = getRewards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onBack,
				className: "mb-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-2 text-3xl font-black md:text-4xl",
				children: "🎖️ My Sticker Book"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm font-semibold text-muted-foreground",
				children: "Collect stickers by playing, moving, and learning!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }),
						label: "Kalqy Coins",
						value: rewards.coins,
						color: "sunshine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4" }),
						label: "Day Streak",
						value: rewards.streakDays,
						color: "coral"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Stickers",
						value: `${rewards.stickers.length}/${STICKERS.length}`,
						color: "leaf"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
				children: STICKERS.map((s) => {
					const unlocked = rewards.stickers.includes(s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-3xl border-2 p-4 text-center transition-all ${unlocked ? "border-primary bg-card shadow-lg animate-pop" : "border-dashed border-border bg-muted/40 opacity-60 grayscale"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-5xl",
								children: unlocked ? s.emoji : "🔒"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-black text-foreground",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] font-semibold text-muted-foreground",
								children: unlocked ? s.description : "Keep playing to unlock"
							})
						]
					}, s.id);
				})
			})
		]
	});
}
var colorMap = {
	sunshine: "bg-sunshine",
	coral: "bg-coral",
	leaf: "bg-leaf"
};
function StatCard({ icon, label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border-2 border-border bg-card p-4 shadow-sm",
		children: [
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mb-2 grid h-8 w-8 place-items-center rounded-xl ${colorMap[color]}`,
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-2xl font-black",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
				children: label
			})
		]
	});
}
function Leaderboard({ onBack }) {
	const [sort, setSort] = (0, import_react.useState)("coins");
	const rows = [...CLASS_ROSTER].sort((a, b) => b[sort] - a[sort]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onBack,
				className: "mb-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-1 text-3xl font-black md:text-4xl",
				children: "🏆 Top Explorers of the Week"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm font-semibold text-muted-foreground",
				children: "Class of Miss Priya · 8 explorers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortChip, {
						active: sort === "coins",
						onClick: () => setSort("coins"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5" }),
						children: "Coins"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortChip, {
						active: sort === "stickers",
						onClick: () => setSort("stickers"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sticker, { className: "h-3.5 w-3.5" }),
						children: "Stickers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortChip, {
						active: sort === "streak",
						onClick: () => setSort("streak"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5" }),
						children: "Streak"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl border-2 border-border bg-card shadow-lg",
				children: rows.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-4 border-b border-border p-4 last:border-0 ${i === 0 ? "bg-sunshine/20" : i === 1 ? "bg-sky/10" : i === 2 ? "bg-coral/10" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-black",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl",
							children: k.avatar
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-black",
								children: k.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold text-muted-foreground",
								children: ["Top skill: ", k.topSkill]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 text-right text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-black text-foreground",
									children: k.coins
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Coins"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-black text-foreground",
									children: k.stickers
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Stickers"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-black text-foreground",
									children: [k.streak, "🔥"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Streak"
								})] })
							]
						})
					]
				}, k.id))
			})
		]
	});
}
function SortChip({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${active ? "bg-primary text-primary-foreground shadow" : "bg-card text-foreground hover:bg-muted"}`,
		children: [icon, children]
	});
}
var WORDS = [
	{
		emoji: "🍎",
		word: "Apple",
		distractors: [
			"Ball",
			"Banana",
			"Ant"
		]
	},
	{
		emoji: "🐶",
		word: "Dog",
		distractors: [
			"Cat",
			"Cow",
			"Duck"
		]
	},
	{
		emoji: "🐱",
		word: "Cat",
		distractors: [
			"Dog",
			"Rat",
			"Bat"
		]
	},
	{
		emoji: "🚗",
		word: "Car",
		distractors: [
			"Bus",
			"Cup",
			"Bag"
		]
	},
	{
		emoji: "🌞",
		word: "Sun",
		distractors: [
			"Star",
			"Moon",
			"Sky"
		]
	},
	{
		emoji: "🌙",
		word: "Moon",
		distractors: [
			"Sun",
			"Ball",
			"Milk"
		]
	},
	{
		emoji: "🐟",
		word: "Fish",
		distractors: [
			"Frog",
			"Bird",
			"Dish"
		]
	},
	{
		emoji: "🍌",
		word: "Banana",
		distractors: [
			"Apple",
			"Bandana",
			"Onion"
		]
	},
	{
		emoji: "🎈",
		word: "Balloon",
		distractors: [
			"Bell",
			"Bottle",
			"Book"
		]
	},
	{
		emoji: "🏠",
		word: "House",
		distractors: [
			"Horse",
			"Hat",
			"Bus"
		]
	},
	{
		emoji: "🌳",
		word: "Tree",
		distractors: [
			"Three",
			"Green",
			"Leaf"
		]
	},
	{
		emoji: "🐘",
		word: "Elephant",
		distractors: [
			"Egg",
			"Envelope",
			"Eagle"
		]
	},
	{
		emoji: "🥛",
		word: "Milk",
		distractors: [
			"Water",
			"Mango",
			"Silk"
		]
	},
	{
		emoji: "👟",
		word: "Shoe",
		distractors: [
			"Sock",
			"Shirt",
			"Show"
		]
	},
	{
		emoji: "📚",
		word: "Book",
		distractors: [
			"Boot",
			"Box",
			"Cook"
		]
	}
];
var ROUNDS = 6;
var START_LIVES = 5;
var START_TIME = 20;
function speak$1(text) {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = .85;
		u.pitch = 1.15;
		u.volume = 1;
		window.speechSynthesis.speak(u);
	} catch {}
}
function shuffle$1(arr) {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function FaceLaneCam({ active, onSide }) {
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const detectorRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const lastVideoTimeRef = (0, import_react.useRef)(-1);
	const lastSideRef = (0, import_react.useRef)(null);
	const lastFiredRef = (0, import_react.useRef)(0);
	const activeRef = (0, import_react.useRef)(active);
	(0, import_react.useEffect)(() => {
		activeRef.current = active;
	}, [active]);
	const onSideRef = (0, import_react.useRef)(onSide);
	(0, import_react.useEffect)(() => {
		onSideRef.current = onSide;
	}, [onSide]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [side, setSide] = (0, import_react.useState)(null);
	const init = (0, import_react.useCallback)(async () => {
		if (detectorRef.current) return;
		const { FilesetResolver, FaceDetector } = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
		const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
		detectorRef.current = await FaceDetector.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
				delegate: "GPU"
			},
			runningMode: "VIDEO"
		});
	}, []);
	const loop = (0, import_react.useCallback)(() => {
		const tick = () => {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			const det = detectorRef.current;
			if (!video || !canvas || !det) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (document.hidden || !activeRef.current) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}
			if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
				lastVideoTimeRef.current = video.currentTime;
				try {
					const res = det.detectForVideo(video, performance.now());
					process(res);
				} catch {}
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
	}, []);
	const process = (result) => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (!canvas || !video) return;
		const w = video.videoWidth || 640;
		const h = video.videoHeight || 480;
		if (canvas.width !== w) canvas.width = w;
		if (canvas.height !== h) canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const dets = result?.detections ?? [];
		if (!dets.length) {
			setSide(null);
			lastSideRef.current = null;
			return;
		}
		const bb = dets.reduce((a, b) => (a.boundingBox?.width ?? 0) > (b.boundingBox?.width ?? 0) ? a : b).boundingBox;
		if (!bb) return;
		const cx = (bb.originX + bb.width / 2) / w;
		const screenX = 1 - cx;
		let newSide;
		if (screenX < .42) newSide = "left";
		else if (screenX > .58) newSide = "right";
		else {
			setSide(null);
			lastSideRef.current = null;
			ctx.fillStyle = "#fbbf24";
			ctx.beginPath();
			ctx.arc(cx * w, (bb.originY + bb.height / 2) / h * h, 16, 0, Math.PI * 2);
			ctx.fill();
			return;
		}
		ctx.strokeStyle = newSide === "right" ? "#22c55e" : "#ef4444";
		ctx.lineWidth = 4;
		ctx.strokeRect(bb.originX, bb.originY, bb.width, bb.height);
		ctx.fillStyle = ctx.strokeStyle;
		ctx.beginPath();
		ctx.arc(cx * w, bb.originY + bb.height / 2, 10, 0, Math.PI * 2);
		ctx.fill();
		setSide(newSide);
		const now = performance.now();
		if (newSide !== lastSideRef.current && now - lastFiredRef.current > 400) {
			lastSideRef.current = newSide;
			lastFiredRef.current = now;
			onSideRef.current(newSide);
		}
	};
	const start = (0, import_react.useCallback)(async () => {
		setStatus("loading");
		try {
			const s = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 480 },
					height: { ideal: 360 }
				},
				audio: false
			});
			streamRef.current = s;
			const v = videoRef.current;
			if (!v) return;
			v.srcObject = s;
			try {
				await v.play();
			} catch (e) {
				if (e?.name === "AbortError") return;
				throw e;
			}
			await init();
			setStatus("ready");
			loop();
		} catch (err) {
			if (err?.name === "NotAllowedError" || err?.name === "SecurityError") setStatus("denied");
			else setStatus("error");
		}
	}, [init, loop]);
	(0, import_react.useEffect)(() => {
		start();
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			streamRef.current?.getTracks().forEach((t) => t.stop());
			try {
				detectorRef.current?.close?.();
			} catch {}
			detectorRef.current = null;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-md overflow-hidden rounded-3xl border-4 border-card bg-card/95 shadow-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-3 py-2 text-xs font-black",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5 text-primary" }), " Face Aim — move your head!"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded-full px-2 py-0.5 text-[10px] ${status === "ready" ? "bg-jungle/20 text-jungle" : status === "denied" || status === "error" ? "bg-coral/20 text-coral" : "bg-muted text-muted-foreground"}`,
					children: status === "ready" ? "LIVE" : status.toUpperCase()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[4/3] w-full bg-black",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "absolute inset-0 h-full w-full -scale-x-100 object-cover",
						playsInline: true,
						muted: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-0 grid grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex items-center justify-center border-r-2 border-white/40 transition-colors ${side === "left" ? "bg-coral/50" : "bg-coral/10"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-black/50 px-3 py-1.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mx-auto h-6 w-6 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-black text-white",
									children: "WRONG"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex items-center justify-center transition-colors ${side === "right" ? "bg-leaf/50" : "bg-leaf/10"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-black/50 px-3 py-1.5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mx-auto h-6 w-6 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-black text-white",
									children: "RIGHT"
								})]
							})
						})]
					}),
					status !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center text-white",
						children: [
							status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold",
								children: "Loading face camera…"
							})] }),
							status === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "h-6 w-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold",
									children: "Camera blocked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: start,
									className: "flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Retry"]
								})
							] }),
							status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: start,
								className: "rounded-full bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 inline h-3 w-3" }), " Try again"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-1.5 text-[11px] font-bold leading-tight text-muted-foreground",
				children: "Lean your head LEFT for ❌ Wrong · RIGHT for ✅ Right"
			})
		]
	});
}
function buildQuestion(item) {
	const isCorrect = Math.random() < .5;
	return {
		item,
		shown: isCorrect ? item.word : item.distractors[Math.floor(Math.random() * item.distractors.length)],
		isCorrect
	};
}
function VocabFaceQuiz({ onBack, onComplete }) {
	const [phase, setPhase] = (0, import_react.useState)("start");
	const [round, setRound] = (0, import_react.useState)(0);
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [lives, setLives] = (0, import_react.useState)(START_LIVES);
	const [correct, setCorrect] = (0, import_react.useState)(0);
	const [coins, setCoinsUi] = (0, import_react.useState)(0);
	const [streak, setStreak] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(START_TIME);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [answered, setAnswered] = (0, import_react.useState)(false);
	const current = queue[round];
	const start = (0, import_react.useCallback)(() => {
		const qs = shuffle$1(WORDS).slice(0, ROUNDS).map(buildQuestion);
		setQueue(qs);
		setRound(0);
		setLives(START_LIVES);
		setCorrect(0);
		setCoinsUi(0);
		setStreak(0);
		setAnswered(false);
		setFeedback(null);
		setTimeLeft(START_TIME);
		setPhase("playing");
		logEvent({
			game: "vocab-face",
			type: "session-start"
		});
		tickStreak();
		setTimeout(() => speakQuestion(qs[0]), 400);
	}, []);
	const speakQuestion = (q) => {
		speak$1(`Is this a ${q.shown}? Lean right for yes, left for no.`);
	};
	const handleAnswer = (0, import_react.useCallback)((chosen) => {
		if (answered || !current) return;
		setAnswered(true);
		const isRight = chosen === "right" === current.isCorrect;
		if (isRight) {
			const earn = 3 + Math.min(3, streak);
			setCoinsUi((c) => c + earn);
			setCorrect((c) => c + 1);
			setStreak((s) => s + 1);
			setFeedback({
				kind: "ok",
				text: `Great! +${earn} 🪙`,
				key: Date.now()
			});
			addCoins(earn, {
				game: "vocab-face",
				label: "vocab-correct"
			});
			logEvent({
				game: "vocab-face",
				type: "correct",
				skill: "vocabulary",
				value: 1,
				label: current.item.word
			});
			logEvent({
				game: "vocab-face",
				type: "movement",
				skill: "coordination",
				value: .4,
				label: "head-turn"
			});
			speak$1("Yes! Well done.");
		} else {
			setLives((l) => l - 1);
			setStreak(0);
			setFeedback({
				kind: "bad",
				text: `Oops! This is a ${current.item.word}.`,
				key: Date.now()
			});
			logEvent({
				game: "vocab-face",
				type: "wrong",
				skill: "vocabulary",
				label: current.item.word
			});
			speak$1(`This is a ${current.item.word}.`);
		}
		setTimeout(() => {
			setAnswered(false);
			setFeedback(null);
			setTimeLeft(START_TIME);
			if (!isRight && lives - 1 <= 0) {
				endGame();
				return;
			}
			if (round + 1 >= ROUNDS) {
				endGame();
				return;
			}
			setRound((r) => {
				const nr = r + 1;
				setTimeout(() => queue[nr] && speakQuestion(queue[nr]), 300);
				return nr;
			});
		}, isRight ? 1800 : 2600);
	}, [
		answered,
		current,
		streak,
		lives,
		round,
		queue
	]);
	const endGame = (0, import_react.useCallback)(() => {
		setPhase("over");
		logEvent({
			game: "vocab-face",
			type: "session-end"
		});
		if (correct >= 5) unlockSticker("word-wizard", "vocab-face");
		onComplete?.({
			correct,
			total: ROUNDS,
			coins
		});
		if (correct / ROUNDS >= .7) speak$1("Word wizard! Amazing vocabulary.");
		else speak$1("Good try! Let's learn more words.");
	}, [
		correct,
		coins,
		onComplete
	]);
	(0, import_react.useEffect)(() => {
		if (phase !== "playing" || answered) return;
		const id = setInterval(() => {
			setTimeLeft((t) => {
				const nt = t - .1;
				if (nt <= 0) {
					handleAnswer(current?.isCorrect ? "left" : "right");
					return 0;
				}
				return nt;
			});
		}, 100);
		return () => clearInterval(id);
	}, [
		phase,
		answered,
		round
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (phase !== "playing" || answered) return;
			if (e.key === "ArrowLeft") handleAnswer("left");
			else if (e.key === "ArrowRight") handleAnswer("right");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		phase,
		answered,
		handleAnswer
	]);
	if (phase === "start") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-sky/30 via-background to-sunshine/30 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: onBack,
			className: "mb-4 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold shadow hover:shadow-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl rounded-3xl border-4 border-card bg-card p-8 text-center shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-6xl",
					children: "📖✨"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-2 text-3xl font-black",
					children: "Vocab Face Quiz"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-6 text-muted-foreground",
					children: [
						"Look at the picture and the word. Lean your head ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-leaf",
							children: "RIGHT"
						}),
						" if it matches, or ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-coral",
							children: "LEFT"
						}),
						" if it's wrong!"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid grid-cols-2 gap-3 text-left text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-leaf/15 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mb-1 h-5 w-5 text-leaf" }), " Lean RIGHT = Correct"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-coral/15 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mb-1 h-5 w-5 text-coral" }), " Lean LEFT = Wrong"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: start,
					className: "inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-lg font-black text-primary-foreground shadow-lg hover:scale-105 transition-transform",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5" }), " Start"]
				})
			]
		})]
	});
	if (phase === "over") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-sky/30 via-background to-sunshine/30 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: onBack,
			className: "mb-4 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold shadow",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl rounded-3xl border-4 border-card bg-card p-8 text-center shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-6xl",
					children: "🏆"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-1 text-3xl font-black",
					children: "Great job!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-6 text-muted-foreground",
					children: "You finished the Vocab Face Quiz."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid grid-cols-3 gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Correct",
							value: `${correct}/${ROUNDS}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Coins",
							value: `${coins}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lives left",
							value: `${lives}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: start,
						className: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-black text-primary-foreground shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4" }), " Play again"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onBack,
						className: "inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 font-black text-secondary-foreground",
						children: "Home"
					})]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-sky/30 via-background to-sunshine/30 p-4 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onBack,
				className: "flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-bold shadow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-black",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-full bg-card px-3 py-1.5 shadow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-sunshine" }),
							" ",
							coins
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-full bg-card px-3 py-1.5 shadow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 text-coral" }),
							" ",
							lives
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-full bg-card px-3 py-1.5 shadow",
						children: [
							round + 1,
							"/",
							ROUNDS
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-5xl gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border-4 border-card bg-card p-6 text-center shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground",
						children: "Does this word match?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 text-[8rem] leading-none animate-pop",
						children: current?.item.emoji
					}, current?.item.emoji + round),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mx-auto mb-4 inline-block rounded-2xl px-6 py-3 text-4xl font-black shadow-inner ${feedback?.kind === "ok" ? "bg-leaf/25 text-leaf" : feedback?.kind === "bad" ? "bg-coral/25 text-coral" : "bg-secondary"}`,
						children: current?.shown
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => current && speak$1(current.shown),
						className: "mx-auto flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-black text-secondary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" }), " Hear the word"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 h-2 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${timeLeft / START_TIME * 100}%` }
						})
					}),
					feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-4 rounded-2xl px-4 py-2 text-sm font-black animate-pop ${feedback.kind === "ok" ? "bg-leaf/20 text-leaf" : "bg-coral/20 text-coral"}`,
						children: feedback.text
					}, feedback.key),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: answered,
							onClick: () => handleAnswer("left"),
							className: "flex items-center justify-center gap-2 rounded-2xl bg-coral px-4 py-3 text-sm font-black text-white shadow disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Wrong"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: answered,
							onClick: () => handleAnswer("right"),
							className: "flex items-center justify-center gap-2 rounded-2xl bg-leaf px-4 py-3 text-sm font-black text-white shadow disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Right"]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-start justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceLaneCam, {
					active: phase === "playing" && !answered,
					onSide: (s) => handleAnswer(s)
				})
			})]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-secondary p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-bold uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xl font-black",
			children: value
		})]
	});
}
var WORD_BANK = [
	{
		word: "SUN",
		emoji: "☀️"
	},
	{
		word: "CAT",
		emoji: "🐱"
	},
	{
		word: "DOG",
		emoji: "🐶"
	},
	{
		word: "BUS",
		emoji: "🚌"
	},
	{
		word: "BALL",
		emoji: "⚽"
	},
	{
		word: "FISH",
		emoji: "🐟"
	},
	{
		word: "KITE",
		emoji: "🪁"
	},
	{
		word: "STAR",
		emoji: "⭐"
	},
	{
		word: "TREE",
		emoji: "🌳"
	},
	{
		word: "DUCK",
		emoji: "🦆"
	},
	{
		word: "MOON",
		emoji: "🌙"
	},
	{
		word: "LION",
		emoji: "🦁"
	},
	{
		word: "APPLE",
		emoji: "🍎"
	},
	{
		word: "MANGO",
		emoji: "🥭"
	},
	{
		word: "TIGER",
		emoji: "🐯"
	},
	{
		word: "CHAIR",
		emoji: "🪑"
	},
	{
		word: "TABLE",
		emoji: "🪵"
	},
	{
		word: "HOUSE",
		emoji: "🏠"
	},
	{
		word: "RABBIT",
		emoji: "🐰"
	},
	{
		word: "FLOWER",
		emoji: "🌸"
	}
];
var WORDS_PER_SESSION = 5;
var OPTIONS_PER_ROUND = 8;
var HOVER_MS = 1800;
var ACTIVATE_COOLDOWN_MS = 1e3;
var CURSOR_SMOOTHING = .22;
var PRAISE = [
	"🎉 Excellent!",
	"🌟 Great Job!",
	"✨ Awesome!"
];
var SPELL_PRAISE = [
	"Amazing!",
	"Fantastic!",
	"Super speller!"
];
function speak(text) {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	try {
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = .92;
		u.pitch = 1.15;
		window.speechSynthesis.speak(u);
	} catch {}
}
function playTone(freq, duration = .2, type = "sine") {
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.value = freq;
		osc.connect(gain);
		gain.connect(ctx.destination);
		gain.gain.setValueAtTime(1e-4, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.22, ctx.currentTime + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + duration);
		osc.start();
		osc.stop(ctx.currentTime + duration + .05);
	} catch {}
}
function shuffle(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function pickSessionWords() {
	return shuffle(WORD_BANK).slice(0, WORDS_PER_SESSION).sort((a, b) => a.word.length - b.word.length);
}
function pickOptions(target) {
	return shuffle([target, ...shuffle(WORD_BANK.filter((w) => w.word !== target.word)).slice(0, OPTIONS_PER_ROUND - 1)]);
}
function makeTiles(word) {
	const chars = shuffle(word.split(""));
	if (chars.join("") === word && word.length > 1) [chars[0], chars[chars.length - 1]] = [chars[chars.length - 1], chars[0]];
	return chars.map((char, id) => ({
		id,
		char,
		slot: null,
		locked: false,
		wrong: false
	}));
}
function PointAndSpell({ onBack, onComplete }) {
	const [mode, setMode] = (0, import_react.useState)("find");
	const [sessionWords, setSessionWords] = (0, import_react.useState)(() => pickSessionWords());
	const [wordIndex, setWordIndex] = (0, import_react.useState)(0);
	const [options, setOptions] = (0, import_react.useState)([]);
	const [tiles, setTiles] = (0, import_react.useState)([]);
	const [heldTile, setHeldTile] = (0, import_react.useState)(null);
	const [stars, setStars] = (0, import_react.useState)(0);
	const [confetti, setConfetti] = (0, import_react.useState)(false);
	const [mascotMsg, setMascotMsg] = (0, import_react.useState)("Show your hand to the camera!");
	const [wrongPick, setWrongPick] = (0, import_react.useState)(null);
	const [correctPick, setCorrectPick] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [handVisible, setHandVisible] = (0, import_react.useState)(false);
	const [cursor, setCursor] = (0, import_react.useState)(null);
	const [hoverProgress, setHoverProgress] = (0, import_react.useState)(0);
	const [hoverHit, setHoverHit] = (0, import_react.useState)(null);
	const [pinched, setPinched] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const landmarkerRef = (0, import_react.useRef)(null);
	const lastVideoTimeRef = (0, import_react.useRef)(-1);
	const playAreaRef = (0, import_react.useRef)(null);
	const hoverIdRef = (0, import_react.useRef)(null);
	const hoverStartRef = (0, import_react.useRef)(0);
	const smoothCursorRef = (0, import_react.useRef)(null);
	const pinchWasDownRef = (0, import_react.useRef)(false);
	const lastActivateRef = (0, import_react.useRef)(0);
	const lockedRef = (0, import_react.useRef)(false);
	const target = sessionWords[wordIndex];
	const startFindRound = (0, import_react.useCallback)((word) => {
		setMode("find");
		setOptions(pickOptions(word));
		setWrongPick(null);
		setCorrectPick(null);
		setHeldTile(null);
		const line = `Find the ${word.word.toLowerCase()}!`;
		setMascotMsg(line);
		setTimeout(() => speak(line), 400);
	}, []);
	(0, import_react.useEffect)(() => {
		logEvent({
			game: "point-spell",
			type: "session-start"
		});
		tickStreak();
		startFindRound(sessionWords[0]);
	}, []);
	const selectObject = (0, import_react.useCallback)((word) => {
		if (lockedRef.current || mode !== "find" || !target) return;
		if (word === target.word) {
			lockedRef.current = true;
			setCorrectPick(word);
			setConfetti(true);
			const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
			setMascotMsg(`${praise} Let's spell it!`);
			speak(`${praise.replace(/[^\w\s!']/g, "")} Let's spell it!`);
			playTone(880, .15);
			setTimeout(() => playTone(1320, .2), 130);
			logEvent({
				game: "point-spell",
				type: "correct",
				skill: "vocabulary"
			});
			setTimeout(() => {
				setConfetti(false);
				setCorrectPick(null);
				setTiles(makeTiles(target.word));
				setHeldTile(null);
				setMode("spell");
				setMascotMsg(`Drag the letters to spell ${target.word}!`);
				lockedRef.current = false;
			}, 2600);
		} else {
			setWrongPick(word);
			setMascotMsg("Oops! Try again.");
			speak("Oops! Try again.");
			playTone(330, .2, "triangle");
			logEvent({
				game: "point-spell",
				type: "wrong",
				skill: "vocabulary"
			});
			setTimeout(() => setWrongPick(null), 900);
		}
	}, [mode, target]);
	const finishWord = (0, import_react.useCallback)(() => {
		setStars((s) => s + 1);
		setConfetti(true);
		addCoins(2, {
			game: "point-spell",
			label: "word"
		});
		const praise = SPELL_PRAISE[Math.floor(Math.random() * SPELL_PRAISE.length)];
		setMascotMsg(`${praise} You spelled ${target.word} correctly! ⭐`);
		speak(`${praise} You spelled ${target.word.toLowerCase()} correctly!`);
		playTone(880, .12);
		setTimeout(() => playTone(1100, .12), 120);
		setTimeout(() => playTone(1320, .25), 240);
		logEvent({
			game: "point-spell",
			type: "correct",
			skill: "vocabulary",
			label: target.word
		});
		if (wordIndex + 1 >= 3) unlockSticker("spelling-champ", "point-spell");
		const nextIndex = wordIndex + 1;
		setTimeout(() => {
			setConfetti(false);
			if (nextIndex >= sessionWords.length) {
				setMode("end");
				setMascotMsg("You finished all the words! 🏆");
				speak("You finished all the words! Hooray!");
				onComplete?.(stars + 1);
			} else {
				setWordIndex(nextIndex);
				startFindRound(sessionWords[nextIndex]);
			}
			lockedRef.current = false;
		}, 3200);
	}, [
		target,
		wordIndex,
		sessionWords,
		stars,
		onComplete,
		startFindRound
	]);
	const validateSpelling = (0, import_react.useCallback)((placed) => {
		if (!target) return;
		lockedRef.current = true;
		if (placed.every((t) => t.slot === null || t.char === target.word[t.slot])) {
			setTiles((ts) => ts.map((t) => ({
				...t,
				locked: true
			})));
			finishWord();
		} else {
			setMascotMsg("Almost! Try again.");
			speak("Almost! Try again.");
			playTone(330, .2, "triangle");
			logEvent({
				game: "point-spell",
				type: "wrong",
				skill: "vocabulary",
				label: target.word
			});
			setTiles((ts) => ts.map((t) => {
				if (t.slot === null) return t;
				return t.char === target.word[t.slot] ? {
					...t,
					locked: true
				} : {
					...t,
					wrong: true
				};
			}));
			setTimeout(() => {
				setTiles((ts) => ts.map((t) => t.wrong ? {
					...t,
					slot: null,
					wrong: false
				} : t));
				lockedRef.current = false;
			}, 1600);
		}
	}, [target, finishWord]);
	const grabTile = (0, import_react.useCallback)((tileId) => {
		setHeldTile(tileId);
		playTone(660, .08);
	}, []);
	const dropTile = (0, import_react.useCallback)((slotIndex) => {
		if (heldTile === null) return;
		if (tiles.some((t) => t.slot === slotIndex)) return;
		playTone(760, .1);
		setHeldTile(null);
		const next = tiles.map((t) => t.id === heldTile ? {
			...t,
			slot: slotIndex
		} : t);
		setTiles(next);
		if (next.every((t) => t.slot !== null)) {
			lockedRef.current = true;
			setTimeout(() => validateSpelling(next), 350);
		}
	}, [
		heldTile,
		tiles,
		validateSpelling
	]);
	const activate = (0, import_react.useCallback)((hitId) => {
		if (lockedRef.current) return;
		if (mode === "find" && hitId.startsWith("opt:")) selectObject(hitId.slice(4));
		else if (mode === "spell") {
			if (hitId.startsWith("tile:")) {
				const id = Number(hitId.slice(5));
				const tile = tiles.find((t) => t.id === id);
				if (tile && !tile.locked) {
					if (tile.slot !== null) setTiles((ts) => ts.map((t) => t.id === id ? {
						...t,
						slot: null
					} : t));
					grabTile(id);
				}
			} else if (hitId.startsWith("slot:") && heldTile !== null) dropTile(Number(hitId.slice(5)));
		}
	}, [
		mode,
		tiles,
		heldTile,
		selectObject,
		grabTile,
		dropTile
	]);
	const onFrameRef = (0, import_react.useRef)(() => {});
	const handleFrame = (0, import_react.useCallback)((frame) => {
		if (!frame) {
			setHandVisible(false);
			setCursor(null);
			setHoverProgress(0);
			setHoverHit(null);
			setPinched(false);
			hoverIdRef.current = null;
			pinchWasDownRef.current = false;
			return;
		}
		setHandVisible(true);
		setCursor({
			x: frame.x,
			y: frame.y
		});
		setPinched(frame.pinch);
		const area = playAreaRef.current;
		if (!area) return;
		const rect = area.getBoundingClientRect();
		const clientX = rect.left + frame.x * rect.width;
		const clientY = rect.top + frame.y * rect.height;
		const hit = (document.elementFromPoint(clientX, clientY)?.closest("[data-hit]"))?.dataset.hit ?? null;
		setHoverHit(lockedRef.current ? null : hit);
		const now = performance.now();
		if (frame.pinch && !pinchWasDownRef.current) {
			pinchWasDownRef.current = true;
			if (hit && now - lastActivateRef.current > ACTIVATE_COOLDOWN_MS) {
				lastActivateRef.current = now;
				hoverIdRef.current = null;
				setHoverProgress(0);
				activate(hit);
				return;
			}
		}
		if (!frame.pinch) pinchWasDownRef.current = false;
		if (!hit || lockedRef.current) {
			hoverIdRef.current = null;
			setHoverProgress(0);
			return;
		}
		if (hoverIdRef.current !== hit) {
			hoverIdRef.current = hit;
			hoverStartRef.current = now;
			setHoverProgress(0);
			return;
		}
		const elapsed = now - hoverStartRef.current;
		setHoverProgress(Math.min(1, elapsed / HOVER_MS));
		if (elapsed >= HOVER_MS && now - lastActivateRef.current > ACTIVATE_COOLDOWN_MS) {
			lastActivateRef.current = now;
			hoverIdRef.current = null;
			setHoverProgress(0);
			activate(hit);
		}
	}, [activate]);
	(0, import_react.useEffect)(() => {
		onFrameRef.current = handleFrame;
	}, [handleFrame]);
	const initLandmarker = (0, import_react.useCallback)(async () => {
		if (landmarkerRef.current) return landmarkerRef.current;
		const { FilesetResolver, HandLandmarker } = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
		const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
		const landmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
				delegate: "GPU"
			},
			runningMode: "VIDEO",
			numHands: 1
		});
		landmarkerRef.current = landmarker;
		return landmarker;
	}, []);
	const loop = (0, import_react.useCallback)(() => {
		const tick = () => {
			const video = videoRef.current;
			const landmarker = landmarkerRef.current;
			if (!video || !landmarker) return;
			if (!document.hidden && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
				lastVideoTimeRef.current = video.currentTime;
				try {
					const lm = landmarker.detectForVideo(video, performance.now())?.landmarks?.[0];
					if (lm && lm.length >= 21) {
						const tip = lm[8];
						const thumb = lm[4];
						const palm = Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y) || .001;
						const pinch = Math.hypot(tip.x - thumb.x, tip.y - thumb.y) < palm * .4;
						const rawX = Math.min(1, Math.max(0, 1 - tip.x));
						const rawY = Math.min(1, Math.max(0, tip.y));
						const prev = smoothCursorRef.current;
						const x = prev ? prev.x + (rawX - prev.x) * CURSOR_SMOOTHING : rawX;
						const y = prev ? prev.y + (rawY - prev.y) * CURSOR_SMOOTHING : rawY;
						smoothCursorRef.current = {
							x,
							y
						};
						onFrameRef.current({
							x,
							y,
							pinch
						});
					} else {
						smoothCursorRef.current = null;
						onFrameRef.current(null);
					}
				} catch {}
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
	}, []);
	const startCamera = (0, import_react.useCallback)(async () => {
		setStatus("loading");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 640 },
					height: { ideal: 480 }
				},
				audio: false
			});
			streamRef.current = stream;
			const video = videoRef.current;
			if (!video) return;
			video.srcObject = stream;
			await video.play();
			await initLandmarker();
			setStatus("ready");
			loop();
		} catch (err) {
			console.error("Camera error", err);
			const name = err?.name;
			if (name === "NotAllowedError" || name === "SecurityError") setStatus("denied");
			else setStatus("error");
		}
	}, [initLandmarker, loop]);
	const stopCamera = (0, import_react.useCallback)(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		try {
			landmarkerRef.current?.close?.();
		} catch {}
		landmarkerRef.current = null;
	}, []);
	(0, import_react.useEffect)(() => {
		startCamera();
		return () => {
			stopCamera();
			window.speechSynthesis?.cancel();
		};
	}, []);
	const restart = () => {
		const words = pickSessionWords();
		setSessionWords(words);
		setWordIndex(0);
		setStars(0);
		lockedRef.current = false;
		startFindRound(words[0]);
	};
	const progressPct = Math.round((wordIndex + (mode === "end" ? 1 : 0)) / sessionWords.length * 100);
	const heldTileObj = heldTile !== null ? tiles.find((t) => t.id === heldTile) : null;
	const paused = status === "ready" && !handVisible && mode !== "end";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-full overflow-hidden bg-gradient-to-b from-sunshine/25 via-background to-sky/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 select-none overflow-hidden",
				"aria-hidden": true,
				children: [
					{
						emoji: "☁️",
						left: "6%",
						top: "12%",
						size: "text-5xl",
						delay: "0s",
						dur: "5s"
					},
					{
						emoji: "☁️",
						left: "78%",
						top: "8%",
						size: "text-6xl",
						delay: "1.2s",
						dur: "6s"
					},
					{
						emoji: "⭐",
						left: "88%",
						top: "38%",
						size: "text-3xl",
						delay: "0.6s",
						dur: "4s"
					},
					{
						emoji: "🌈",
						left: "3%",
						top: "58%",
						size: "text-4xl",
						delay: "1.8s",
						dur: "5.5s"
					},
					{
						emoji: "🎈",
						left: "92%",
						top: "68%",
						size: "text-4xl",
						delay: "0.3s",
						dur: "4.5s"
					},
					{
						emoji: "🦋",
						left: "12%",
						top: "82%",
						size: "text-3xl",
						delay: "2.2s",
						dur: "5s"
					}
				].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `animate-float absolute opacity-40 ${d.size}`,
					style: {
						left: d.left,
						top: d.top,
						animationDelay: d.delay,
						animationDuration: d.dur
					},
					children: d.emoji
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								window.speechSynthesis?.cancel();
								stopCamera();
								onBack();
							},
							className: "flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105 active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [status === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-black shadow-sm ${handVisible ? "bg-jungle/15 text-jungle" : "bg-card text-muted-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" }), handVisible ? "Camera Connected ✓" : "Show your hand ✋"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-2xl bg-card px-4 py-2 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-black text-foreground",
									children: [
										"Word ",
										Math.min(wordIndex + 1, sessionWords.length),
										" / ",
										sessionWords.length
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-sm font-black text-coral",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "animate-pop inline-block",
										children: stars
									}, stars)]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 h-2 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${progressPct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "animate-bounce-soft grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-sunshine to-coral text-3xl shadow-md",
							children: "🦊"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "animate-pop rounded-3xl rounded-bl-md bg-card px-5 py-3 text-lg font-black text-foreground shadow-sm",
							children: mascotMsg
						}, mascotMsg)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: playAreaRef,
						className: "relative flex-1",
						children: [
							mode === "find" && target && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-5",
								children: options.map((opt, idx) => {
									const isWrong = wrongPick === opt.word;
									const isCorrect = correctPick === opt.word;
									const isHovered = hoverHit === `opt:${opt.word}`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										"data-hit": `opt:${opt.word}`,
										style: {
											animationDelay: `${idx * 70}ms`,
											animationFillMode: "backwards"
										},
										className: `animate-pop flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl border-4 bg-card shadow-lg transition-all duration-200 ${isCorrect ? "scale-110 border-jungle ring-4 ring-jungle/50" : isWrong ? "animate-wiggle border-coral ring-4 ring-coral/40" : isHovered ? "-translate-y-2 scale-105 border-primary ring-4 ring-primary/30" : "border-card"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-5xl transition-transform duration-200 md:text-7xl ${isCorrect ? "animate-bounce-soft" : isHovered ? "scale-125" : "animate-float"}`,
											style: { animationDelay: isCorrect || isHovered ? "0s" : `${idx * 350}ms` },
											children: opt.emoji
										})
									}, opt.word);
								})
							}),
							mode === "spell" && target && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "animate-pop flex flex-col items-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-bounce-soft text-7xl md:text-8xl",
											children: target.emoji
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap justify-center gap-3",
										children: target.word.split("").map((_, i) => {
											const occupant = tiles.find((t) => t.slot === i);
											const slotHovered = !occupant && hoverHit === `slot:${i}`;
											const tileHovered = occupant && hoverHit === `tile:${occupant.id}`;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												"data-hit": occupant ? void 0 : `slot:${i}`,
												style: {
													animationDelay: `${i * 60}ms`,
													animationFillMode: "backwards"
												},
												className: `animate-pop grid h-16 w-16 place-items-center rounded-2xl border-4 text-3xl font-black shadow-inner transition-all duration-200 md:h-20 md:w-20 md:text-4xl ${occupant?.locked ? "border-jungle bg-jungle/15 text-jungle" : occupant?.wrong ? "animate-wiggle border-coral bg-coral/15 text-coral" : occupant ? tileHovered ? "scale-110 border-primary bg-card text-foreground ring-4 ring-primary/30" : "border-primary bg-card text-foreground" : slotHovered && heldTile !== null ? "scale-110 border-dashed border-jungle bg-jungle/15 ring-4 ring-jungle/30" : heldTile !== null ? "animate-bounce-soft border-dashed border-primary bg-primary/10" : "border-dashed border-muted-foreground/40 bg-card/60"}`,
												children: occupant ? occupant.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "animate-pop inline-block",
													children: occupant.char
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													"data-hit": `tile:${occupant.id}`,
													className: "animate-pop grid h-full w-full place-items-center rounded-xl text-inherit",
													children: occupant.char
												}) : null
											}, i);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-h-20 flex-wrap items-center justify-center gap-3 rounded-3xl bg-card/70 px-6 py-4 shadow-inner",
										children: [tiles.filter((t) => t.slot === null && t.id !== heldTile).length === 0 && heldTile === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-pop text-sm font-bold text-muted-foreground",
											children: "All letters placed!"
										}), tiles.filter((t) => t.slot === null && t.id !== heldTile).map((t, idx) => {
											const isHovered = hoverHit === `tile:${t.id}`;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												"data-hit": `tile:${t.id}`,
												style: {
													animationDelay: `${idx * 80}ms`,
													animationFillMode: "backwards"
												},
												className: `animate-pop grid h-16 w-16 place-items-center rounded-2xl border-4 border-sunshine bg-sunshine/20 text-3xl font-black text-foreground shadow-md transition-all duration-200 md:h-20 md:w-20 md:text-4xl ${isHovered ? "-translate-y-2 scale-110 ring-4 ring-sunshine/50" : ""}`,
												children: t.char
											}, t.id);
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-center text-xs font-bold text-muted-foreground",
										children: "Point at a letter to pick it up, then point at a box to drop it. Pinch 🤏 to grab faster!"
									})
								]
							}),
							mode === "end" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full flex-1 items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "animate-pop text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "animate-bounce-soft mb-4 text-7xl",
											children: "🏆"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "mb-2 text-4xl font-black text-foreground md:text-6xl",
											children: "All done!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mb-6 text-lg font-bold text-foreground/80",
											children: [
												"You spelled ",
												stars,
												" word",
												stars === 1 ? "" : "s",
												"! ⭐"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap justify-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: restart,
												className: "flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Play Again"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													stopCamera();
													onBack();
												},
												className: "rounded-2xl bg-card px-6 py-3 text-lg font-black text-foreground shadow-lg transition-all hover:scale-105 active:scale-95",
												children: "Back to Dashboard"
											})]
										})
									]
								})
							}),
							heldTileObj && cursor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "animate-wiggle pointer-events-none absolute z-30 grid h-16 w-16 -translate-x-1/2 -translate-y-[120%] place-items-center rounded-2xl border-4 border-primary bg-card text-3xl font-black text-foreground shadow-xl",
								style: {
									left: `${cursor.x * 100}%`,
									top: `${cursor.y * 100}%`
								},
								children: heldTileObj.char
							}),
							cursor && mode !== "end" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2",
								style: {
									left: `${cursor.x * 100}%`,
									top: `${cursor.y * 100}%`
								},
								children: [hoverHit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-3 animate-ping rounded-full bg-primary/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									width: "56",
									height: "56",
									viewBox: "0 0 56 56",
									className: `transition-transform duration-150 ${pinched ? "scale-75" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "28",
											cy: "28",
											r: "10",
											className: "fill-primary/80"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "28",
											cy: "28",
											r: "14",
											className: "fill-primary/25"
										}),
										hoverProgress > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "28",
											cy: "28",
											r: "20",
											fill: "none",
											strokeWidth: "5",
											strokeLinecap: "round",
											className: "stroke-primary",
											strokeDasharray: 2 * Math.PI * 20,
											strokeDashoffset: 2 * Math.PI * 20 * (1 - hoverProgress),
											transform: "rotate(-90 28 28)"
										})
									]
								})]
							}),
							paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl bg-background/70 backdrop-blur-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "animate-pop rounded-3xl bg-card px-8 py-6 text-center shadow-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 text-5xl",
											children: "✋"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xl font-black text-foreground",
											children: "Game paused"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-bold text-muted-foreground",
											children: "Show your hand to the camera to keep playing."
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none fixed bottom-4 right-4 z-30 w-40 overflow-hidden rounded-2xl border-4 border-card bg-black shadow-xl md:w-52",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							className: "aspect-[4/3] w-full -scale-x-100 object-cover",
							playsInline: true,
							muted: true
						}), status !== "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/75 p-2 text-center text-white",
							children: [status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-4 border-white/30 border-t-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold",
								children: "Loading hand tracking…"
							})] }), (status === "idle" || status === "denied" || status === "error") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-bold",
								children: status === "denied" ? "Camera access is needed to play." : status === "error" ? "Could not start the camera." : "Camera needed to play."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: startCamera,
								className: "rounded-xl bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground",
								children: status === "idle" ? "Allow camera" : "Retry"
							})] })]
						})]
					})
				]
			}),
			confetti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti, {})
		]
	});
}
function Confetti() {
	const pieces = Array.from({ length: 44 });
	const colors = [
		"#f97316",
		"#facc15",
		"#22c55e",
		"#38bdf8",
		"#a855f7",
		"#ef4444"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-50 overflow-hidden",
		children: pieces.map((_, i) => {
			const left = Math.random() * 100;
			const delay = Math.random() * .3;
			const duration = 1.2 + Math.random() * .8;
			const color = colors[i % colors.length];
			const size = 6 + Math.random() * 8;
			return i % 9 === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					left: `${left}%`,
					bottom: "-10vh",
					animation: `balloon-rise ${1.8 + Math.random()}s ${delay}s ease-in forwards`
				},
				className: "absolute text-4xl",
				children: "🎈"
			}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					left: `${left}%`,
					top: "-10vh",
					width: size,
					height: size,
					background: color,
					animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
					borderRadius: i % 3 === 0 ? "50%" : "2px"
				},
				className: "absolute"
			}, i);
		})
	});
}
var SKILL_MAP = {
	Jump: "balance",
	Crawl: "coordination",
	Squat: "bodyAwareness",
	Walk: "coordination"
};
function Index() {
	const [view, setView] = (0, import_react.useState)("dashboard");
	const [role, setRoleState] = (0, import_react.useState)("kid");
	const [stats, setStats] = (0, import_react.useState)({
		gamesPlayed: 0,
		stars: 0,
		balance: 35,
		coordination: 40,
		bodyAwareness: 30
	});
	(0, import_react.useEffect)(() => {
		setRoleState(getRole());
	}, []);
	const changeRole = (r) => {
		setRoleState(r);
		setRole(r);
	};
	const handleComplete = (result) => {
		setStats((prev) => {
			const next = { ...prev };
			next.gamesPlayed += 1;
			next.stars += result.stars;
			for (const [movement, count] of Object.entries(result.movements)) {
				const skill = SKILL_MAP[movement];
				if (skill) next[skill] = Math.min(100, next[skill] + count * 6);
			}
			next.balance = Math.min(100, next.balance + 2);
			next.coordination = Math.min(100, next.coordination + 2);
			next.bodyAwareness = Math.min(100, next.bodyAwareness + 2);
			return next;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
			view,
			onNavigate: setView,
			role,
			onRoleChange: changeRole
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-x-hidden",
			children: [
				view === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
					role,
					stats,
					onPlay: () => setView("game"),
					onOpenStickers: () => setView("sticker-book"),
					onOpenLeaderboard: () => setView("leaderboard")
				}),
				view === "game" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScreen, {
					onBack: () => setView("dashboard"),
					onComplete: handleComplete
				}),
				view === "finger-quiz" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerGestureQuiz, {
					onBack: () => setView("dashboard"),
					onComplete: (s) => setStats((p) => ({
						...p,
						gamesPlayed: p.gamesPlayed + 1,
						stars: p.stars + s
					}))
				}),
				view === "endless-runner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndlessRunner, {
					onBack: () => setView("dashboard"),
					onComplete: (_score, coins) => setStats((p) => ({
						...p,
						gamesPlayed: p.gamesPlayed + 1,
						stars: p.stars + Math.min(5, Math.floor(coins / 5)),
						coordination: Math.min(100, p.coordination + 3)
					}))
				}),
				view === "math-adventure" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MathAdventure, {
					onBack: () => setView("dashboard"),
					onComplete: ({ correct }) => setStats((p) => ({
						...p,
						gamesPlayed: p.gamesPlayed + 1,
						stars: p.stars + Math.min(5, Math.ceil(correct / 2)),
						bodyAwareness: Math.min(100, p.bodyAwareness + 2)
					}))
				}),
				view === "vocab-face" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VocabFaceQuiz, {
					onBack: () => setView("dashboard"),
					onComplete: ({ correct, coins }) => setStats((p) => ({
						...p,
						gamesPlayed: p.gamesPlayed + 1,
						stars: p.stars + Math.min(5, Math.ceil(correct / 2)),
						coordination: Math.min(100, p.coordination + Math.floor(coins / 6))
					}))
				}),
				view === "point-spell" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointAndSpell, {
					onBack: () => setView("dashboard"),
					onComplete: (s) => setStats((p) => ({
						...p,
						gamesPlayed: p.gamesPlayed + 1,
						stars: p.stars + s,
						coordination: Math.min(100, p.coordination + 3)
					}))
				}),
				view === "sticker-book" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickerBook, { onBack: () => setView("dashboard") }),
				view === "leaderboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, { onBack: () => setView("dashboard") })
			]
		})]
	});
}
//#endregion
export { Index as component };
