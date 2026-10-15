import { calc as e } from "@csstools/css-calc";
import { TokenType as t, tokenize as n } from "@csstools/css-tokenizer";
import { LRUCache as r } from "lru-cache";
import { SyntaxFlag as i, color as a } from "@csstools/css-color-parser";
import { parseComponentValue as o } from "@csstools/css-parser-algorithms";
//#region src/js/cache.ts
var s = 4096, c = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	get item() {
		return this.#e;
	}
}, l = new r({ max: s }), u = (e, t) => {
	e && (t instanceof c ? l.set(e, t) : l.set(e, new c(t)));
}, d = (e) => {
	if (!e) return !1;
	let t = l.get(e);
	return t !== void 0 && t;
}, f = (e) => {
	let t = Object.keys(e);
	if (t.length === 0) return "";
	t.sort();
	let n = "";
	for (let r of t) n += `${r}:${JSON.stringify(e[r])};`;
	return n;
}, p = (e, t = {}) => {
	if (!e || t.customProperty && typeof t.customProperty.callback == "function" || t.dimension && typeof t.dimension.callback == "function") return "";
	let n = e.namespace || "", r = e.name || "", i = e.value || "";
	return !n && !r && !i ? "" : `${`${n}:${r}:${i}`}::${`${t.format || ""}|${t.colorSpace || ""}|${t.colorScheme || ""}|${t.currentColor || ""}|${t.d50 ? "1" : "0"}|${t.nullable ? "1" : "0"}|${t.preserveComment ? "1" : "0"}|${t.delimiter || ""}`}::${t.customProperty ? f(t.customProperty) : ""}::${t.dimension ? f(t.dimension) : ""}`;
}, m = (e) => typeof e == "string" || e instanceof String, h = (e) => m(e) || typeof e == "number", { CloseParen: g, Comma: _, Comment: v, Delim: y, EOF: b, Function: x, OpenParen: S, Whitespace: C } = t, w = "util", T = 10, E = 16, D = 360, O = 180, ee = /--[\w-]+/g, te = /^,$/, ne = /^\/$/, re = /^\s+$/, k = (e, t = {}) => {
	if (!m(e)) throw TypeError(`${e} is not a string.`);
	let r = e.trim(), { delimiter: i = " ", preserveComment: a = !1 } = t, o = p({
		namespace: w,
		name: "splitValue",
		value: r
	}, {
		delimiter: i,
		preserveComment: a
	}), s = d(o);
	if (s instanceof c) return s.item;
	let l;
	switch (i) {
		case ",":
			l = te;
			break;
		case "/":
			l = ne;
			break;
		default: l = re;
	}
	let f = n({ css: r }), h = 0, T = "", E = [];
	for (let [e, t] of f) switch (e) {
		case _:
		case y:
			h === 0 && l.test(t) ? (E.push(T.trim()), T = "") : T += t;
			break;
		case v:
			a && (i === "," || i === "/") && (T += t);
			break;
		case x:
		case S:
			T += t, h++;
			break;
		case g:
			T += t, h--;
			break;
		case C:
			l.test(t) ? h === 0 ? T &&= (E.push(T.trim()), "") : T += " " : T.endsWith(" ") || (T += " ");
			break;
		default: e === b ? (E.push(T.trim()), T = "") : T += t;
	}
	return u(o, E), E;
}, A = (e) => {
	if (!m(e)) throw TypeError(`${e} is not a string.`);
	let t = e.trim(), n = p({
		namespace: w,
		name: "extractDashedIdent",
		value: t
	}), r = d(n);
	if (r instanceof c) return r.item;
	let i = t.match(ee), a = i ? [...new Set(i)] : [];
	return u(n, a), a;
}, j = (e, t = 0) => {
	if (!Number.isFinite(e)) throw TypeError(`${e} is not a finite number.`);
	if (!Number.isFinite(t)) throw TypeError(`${t} is not a finite number.`);
	if (t < 0 || t > E) throw RangeError(`${t} is not between 0 and ${E}.`);
	if (t === 0) return Math.round(e);
	let n = t === E ? 6 : t < T ? 4 : 5;
	return parseFloat(e.toPrecision(n));
}, ie = (e, t, n = "shorter") => {
	if (!Number.isFinite(e)) throw TypeError(`${e} is not a finite number.`);
	if (!Number.isFinite(t)) throw TypeError(`${t} is not a finite number.`);
	let r = e, i = t;
	switch (n) {
		case "decreasing":
			i > r && (r += D);
			break;
		case "increasing":
			i < r && (i += D);
			break;
		case "longer":
			i > r && i < r + O ? r += D : i > r - O && i <= r && (i += D);
			break;
		default: i > r + O ? r += D : i < r - O && (i += D);
	}
	return [r, i];
}, M = /* @__PURE__ */ new Map([
	["xx-small", 9 / 16],
	["x-small", 5 / 8],
	["small", 13 / 16],
	["medium", 1],
	["large", 9 / 8],
	["x-large", 3 / 2],
	["xx-large", 2],
	["xxx-large", 3]
]), N = /* @__PURE__ */ new Map([["smaller", 1 / 1.2], ["larger", 1.2]]), P = /* @__PURE__ */ new Map([
	["cm", 96 / 2.54],
	["mm", 96 / 25.4],
	["q", 96 / 101.6],
	["in", 96],
	["pc", 16],
	["pt", 96 / 72],
	["px", 1]
]), F = /* @__PURE__ */ new Map([
	["rcap", 1],
	["rch", .5],
	["rem", 1],
	["rex", .5],
	["ric", 1],
	["rlh", 1.2]
]), I = (e, t, n = {}) => {
	let { dimension: r = {} } = n, { callback: i, em: a, rem: o, vh: s, vw: c } = r;
	if (m(e)) {
		let t = e.toLowerCase().trim(), n = M.get(t);
		if (n !== void 0) return n * o;
		let r = N.get(t);
		return r === void 0 ? NaN : r * a;
	}
	if (Number.isFinite(e) && t) {
		let n = t.toLowerCase();
		if (Object.hasOwn(r, n)) return e * Number(r[n]);
		if (typeof i == "function") return e * (i(n) ?? NaN);
		let l = P.get(n);
		if (l !== void 0) return e * l;
		let u = F.get(n);
		if (u !== void 0) return e * u * o;
		let d = F.get(`r${n}`);
		if (d !== void 0) return e * d * a;
		switch (n) {
			case "vb": return e * s;
			case "vi": return e * c;
			case "vmax": return e * Math.max(s, c);
			case "vmin": return e * Math.min(s, c);
		}
	}
	return NaN;
}, ae = "(?:0|[1-9]\\d*)", oe = "clamp|max|min|exp|hypot|log|pow|sqrt|abs|sign|mod|rem|round|a?(?:cos|sin|tan)|atan2", se = `calc|${oe}`, ce = `var|${se}`, le = "deg|g?rad|turn", ue = "[cm]m|[dls]?v(?:[bhiw]|max|min)|in|p[ctx]|q|r?(?:[cl]h|cap|e[mx]|ic)", L = `[+-]?(?:${ae}(?:\\.\\d*)?|\\.\\d+)(?:e-?${ae})?`, de = `\\+?(?:${ae}(?:\\.\\d*)?|\\.\\d+)(?:e-?${ae})?`, R = "none", z = `${L}%`, fe = `^(?:${se})\\(|(?<=[*\\/\\s\\(])(?:${se})\\(`, pe = `^(?:${oe})\\($`, me = "^var\\(|(?<=[*\\/\\s\\(])var\\(", he = `^(?:${ce})\\(`, ge = `(?:\\s*\\/\\s*(?:${L}|${z}|${R}))?`, _e = `(?:\\s*,\\s*(?:${L}|${z}))?`, ve = "(?:ok)?l(?:ab|ch)|color|hsla?|hwb|rgba?", ye = "[a-z]+|#[\\da-f]{3}|#[\\da-f]{4}|#[\\da-f]{6}|#[\\da-f]{8}", be = "(?:ok)?lch|hsl|hwb", xe = "(?:de|in)creasing|longer|shorter", Se = `${L}(?:${le})?`, Ce = `(?:${L}(?:${le})?|${R})`, we = `(?:${L}|${z}|${R})`, Te = `(?:${be})(?:\\s(?:${xe})\\shue)?`, Ee = `(${be})(?:\\s(${xe})\\shue)?`, De = "(?:ok)?lab", Oe = "(?:ok)?lch", ke = "(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?", Ae = "xyz(?:-d(?:50|65))?", je = `${De}|${ke}|${Ae}`, Me = `${Te}|${je}`, Ne = "color-mix(", Pe = `(?:${ve})\\(\\s*from\\s+`, Fe = `(${ve})\\(\\s*from\\s+`, Ie = "var(", Le = `(?:${ke}|${Ae})(?:\\s+${we}){3}${ge}`, Re = "^light-dark\\(", ze = `^${Pe}|(?<=[\\s])${Pe}`, Be = `${Ce}(?:\\s+${we}){2}${ge}`, Ve = `${Se}(?:\\s*,\\s*${z}){2}${_e}`, He = `(?:${we}\\s+){2}${Ce}${ge}`, Ue = `${we}(?:\\s+${we}){2}${ge}`, We = `(?:${L}(?:\\s*,\\s*${L}){2}|${z}(?:\\s*,\\s*${z}){2})${_e}`, Ge = `${ye}|hsla?\\(\\s*${Ve}\\s*\\)|rgba?\\(\\s*${We}\\s*\\)|(?:hsla?|hwb)\\(\\s*${Be}\\s*\\)|(?:(?:ok)?lab|rgba?)\\(\\s*${Ue}\\s*\\)|(?:ok)?lch\\(\\s*${He}\\s*\\)|color\\(\\s*${Le}\\s*\\)`, Ke = `(?:${Ge})(?:\\s+${z})?`, qe = `color-mix\\(\\s*in\\s+(?:${Me})\\s*,\\s*${Ke}\\s*,\\s*${Ke}\\s*\\)`, Je = `color-mix\\(\\s*in\\s+(${Me})\\s*,\\s*(${Ke})\\s*,\\s*(${Ke})\\s*\\)`, B = "computedValue", V = "mixValue", Ye = "specifiedValue", Xe = "color", Ze = .001, Qe = .5, $e = 2, H = 3, et = 4, tt = 8, nt = 10, rt = 12, U = 16, it = 60, at = 180, ot = 360, W = 100, G = 255, st = 2, ct = 3, lt = 2.4, ut = 12.92, dt = .055, ft = 116, pt = 500, mt = 200, ht = 216 / 24389, gt = 24389 / 27, _t = [
	.3457 / .3585,
	1,
	.2958 / .3585
], vt = [
	[
		.955473421488075,
		-.02309845494876471,
		.06325924320057072
	],
	[
		-.0283697093338637,
		1.0099953980813041,
		.021041441191917323
	],
	[
		.012314014864481998,
		-.020507649298898964,
		1.330365926242124
	]
], yt = [
	[
		1.0479297925449969,
		.022946870601609652,
		-.05019226628920524
	],
	[
		.02962780877005599,
		.9904344267538799,
		-.017073799063418826
	],
	[
		-.009243040646204504,
		.015055191490298152,
		.7518742814281371
	]
], bt = [
	[
		506752 / 1228815,
		87881 / 245763,
		12673 / 70218
	],
	[
		87098 / 409605,
		175762 / 245763,
		12673 / 175545
	],
	[
		7918 / 409605,
		87881 / 737289,
		1001167 / 1053270
	]
], xt = [
	[
		12831 / 3959,
		-329 / 214,
		-1974 / 3959
	],
	[
		-851781 / 878810,
		1648619 / 878810,
		36519 / 878810
	],
	[
		705 / 12673,
		-2585 / 12673,
		705 / 667
	]
], St = [
	[
		.819022437996703,
		.3619062600528904,
		-.1288737815209879
	],
	[
		.0329836539323885,
		.9292868615863434,
		.0361446663506424
	],
	[
		.0481771893596242,
		.2642395317527308,
		.6335478284694309
	]
], Ct = [
	[
		1.2268798758459243,
		-.5578149944602171,
		.2813910456659647
	],
	[
		-.0405757452148008,
		1.112286803280317,
		-.0717110580655164
	],
	[
		-.0763729366746601,
		-.4214933324022432,
		1.5869240198367816
	]
], wt = [
	[
		1,
		.3963377773761749,
		.2158037573099136
	],
	[
		1,
		-.1055613458156586,
		-.0638541728258133
	],
	[
		1,
		-.0894841775298119,
		-1.2914855480194092
	]
], Tt = [
	[
		.210454268309314,
		.7936177747023054,
		-.0040720430116193
	],
	[
		1.9779985324311684,
		-2.42859224204858,
		.450593709617411
	],
	[
		.0259040424655478,
		.7827717124575296,
		-.8086757549230774
	]
], Et = [
	[
		608311 / 1250200,
		189793 / 714400,
		198249 / 1000160
	],
	[
		35783 / 156275,
		247089 / 357200,
		198249 / 2500400
	],
	[
		0,
		32229 / 714400,
		5220557 / 5000800
	]
], Dt = [
	[
		63426534 / 99577255,
		20160776 / 139408157,
		47086771 / 278816314
	],
	[
		26158966 / 99577255,
		472592308 / 697040785,
		8267143 / 139408157
	],
	[
		0,
		19567812 / 697040785,
		295819943 / 278816314
	]
], Ot = [
	[
		573536 / 994567,
		263643 / 1420810,
		187206 / 994567
	],
	[
		591459 / 1989134,
		6239551 / 9945670,
		374412 / 4972835
	],
	[
		53769 / 1989134,
		351524 / 4972835,
		4929758 / 4972835
	]
], kt = [
	[
		.7977666449006423,
		.13518129740053308,
		.0313477341283922
	],
	[
		.2880748288194013,
		.711835234241873,
		8993693872564e-17
	],
	[
		0,
		0,
		.8251046025104602
	]
], At = RegExp(`^(?:${Ge})$`), jt = RegExp(`^${Ee}$`), Mt = /^xyz(?:-d(?:50|65))?$/, K = /^currentColor$/i, Nt = RegExp(`^color\\(\\s*(${Le})\\s*\\)$`), Pt = RegExp(`^hsla?\\(\\s*(${Be}|${Ve})\\s*\\)$`), Ft = RegExp(`^hwb\\(\\s*(${Be})\\s*\\)$`), It = RegExp(`^lab\\(\\s*(${Ue})\\s*\\)$`), Lt = RegExp(`^lch\\(\\s*(${He})\\s*\\)$`), Rt = RegExp(`^${qe}$`), zt = RegExp(`^${Je}$`), Bt = RegExp(`${qe}`, "g"), Vt = RegExp(`^oklab\\(\\s*(${Ue})\\s*\\)$`), Ht = RegExp(`^oklch\\(\\s*(${He})\\s*\\)$`), q = /^(?:specifi|comput)edValue$/, Ut = RegExp(`^(${L})(${le})?$`), Wt = RegExp(`^rgba?\\(\\s*(${Ue}|${We})\\s*\\)$`), Gt = RegExp(`^(?:${ke}|${Ae})$`), Kt = RegExp(`in\\s+(${Me})`), qt = RegExp(`^color-mix\\(\\s*in\\s+(${Me})\\s*,`), Jt = RegExp(`^(${Ge})(?:\\s+(${z}))?$`), Yt = {
	aliceblue: [
		240,
		248,
		255
	],
	antiquewhite: [
		250,
		235,
		215
	],
	aqua: [
		0,
		255,
		255
	],
	aquamarine: [
		127,
		255,
		212
	],
	azure: [
		240,
		255,
		255
	],
	beige: [
		245,
		245,
		220
	],
	bisque: [
		255,
		228,
		196
	],
	black: [
		0,
		0,
		0
	],
	blanchedalmond: [
		255,
		235,
		205
	],
	blue: [
		0,
		0,
		255
	],
	blueviolet: [
		138,
		43,
		226
	],
	brown: [
		165,
		42,
		42
	],
	burlywood: [
		222,
		184,
		135
	],
	cadetblue: [
		95,
		158,
		160
	],
	chartreuse: [
		127,
		255,
		0
	],
	chocolate: [
		210,
		105,
		30
	],
	coral: [
		255,
		127,
		80
	],
	cornflowerblue: [
		100,
		149,
		237
	],
	cornsilk: [
		255,
		248,
		220
	],
	crimson: [
		220,
		20,
		60
	],
	cyan: [
		0,
		255,
		255
	],
	darkblue: [
		0,
		0,
		139
	],
	darkcyan: [
		0,
		139,
		139
	],
	darkgoldenrod: [
		184,
		134,
		11
	],
	darkgray: [
		169,
		169,
		169
	],
	darkgreen: [
		0,
		100,
		0
	],
	darkgrey: [
		169,
		169,
		169
	],
	darkkhaki: [
		189,
		183,
		107
	],
	darkmagenta: [
		139,
		0,
		139
	],
	darkolivegreen: [
		85,
		107,
		47
	],
	darkorange: [
		255,
		140,
		0
	],
	darkorchid: [
		153,
		50,
		204
	],
	darkred: [
		139,
		0,
		0
	],
	darksalmon: [
		233,
		150,
		122
	],
	darkseagreen: [
		143,
		188,
		143
	],
	darkslateblue: [
		72,
		61,
		139
	],
	darkslategray: [
		47,
		79,
		79
	],
	darkslategrey: [
		47,
		79,
		79
	],
	darkturquoise: [
		0,
		206,
		209
	],
	darkviolet: [
		148,
		0,
		211
	],
	deeppink: [
		255,
		20,
		147
	],
	deepskyblue: [
		0,
		191,
		255
	],
	dimgray: [
		105,
		105,
		105
	],
	dimgrey: [
		105,
		105,
		105
	],
	dodgerblue: [
		30,
		144,
		255
	],
	firebrick: [
		178,
		34,
		34
	],
	floralwhite: [
		255,
		250,
		240
	],
	forestgreen: [
		34,
		139,
		34
	],
	fuchsia: [
		255,
		0,
		255
	],
	gainsboro: [
		220,
		220,
		220
	],
	ghostwhite: [
		248,
		248,
		255
	],
	gold: [
		255,
		215,
		0
	],
	goldenrod: [
		218,
		165,
		32
	],
	gray: [
		128,
		128,
		128
	],
	green: [
		0,
		128,
		0
	],
	greenyellow: [
		173,
		255,
		47
	],
	grey: [
		128,
		128,
		128
	],
	honeydew: [
		240,
		255,
		240
	],
	hotpink: [
		255,
		105,
		180
	],
	indianred: [
		205,
		92,
		92
	],
	indigo: [
		75,
		0,
		130
	],
	ivory: [
		255,
		255,
		240
	],
	khaki: [
		240,
		230,
		140
	],
	lavender: [
		230,
		230,
		250
	],
	lavenderblush: [
		255,
		240,
		245
	],
	lawngreen: [
		124,
		252,
		0
	],
	lemonchiffon: [
		255,
		250,
		205
	],
	lightblue: [
		173,
		216,
		230
	],
	lightcoral: [
		240,
		128,
		128
	],
	lightcyan: [
		224,
		255,
		255
	],
	lightgoldenrodyellow: [
		250,
		250,
		210
	],
	lightgray: [
		211,
		211,
		211
	],
	lightgreen: [
		144,
		238,
		144
	],
	lightgrey: [
		211,
		211,
		211
	],
	lightpink: [
		255,
		182,
		193
	],
	lightsalmon: [
		255,
		160,
		122
	],
	lightseagreen: [
		32,
		178,
		170
	],
	lightskyblue: [
		135,
		206,
		250
	],
	lightslategray: [
		119,
		136,
		153
	],
	lightslategrey: [
		119,
		136,
		153
	],
	lightsteelblue: [
		176,
		196,
		222
	],
	lightyellow: [
		255,
		255,
		224
	],
	lime: [
		0,
		255,
		0
	],
	limegreen: [
		50,
		205,
		50
	],
	linen: [
		250,
		240,
		230
	],
	magenta: [
		255,
		0,
		255
	],
	maroon: [
		128,
		0,
		0
	],
	mediumaquamarine: [
		102,
		205,
		170
	],
	mediumblue: [
		0,
		0,
		205
	],
	mediumorchid: [
		186,
		85,
		211
	],
	mediumpurple: [
		147,
		112,
		219
	],
	mediumseagreen: [
		60,
		179,
		113
	],
	mediumslateblue: [
		123,
		104,
		238
	],
	mediumspringgreen: [
		0,
		250,
		154
	],
	mediumturquoise: [
		72,
		209,
		204
	],
	mediumvioletred: [
		199,
		21,
		133
	],
	midnightblue: [
		25,
		25,
		112
	],
	mintcream: [
		245,
		255,
		250
	],
	mistyrose: [
		255,
		228,
		225
	],
	moccasin: [
		255,
		228,
		181
	],
	navajowhite: [
		255,
		222,
		173
	],
	navy: [
		0,
		0,
		128
	],
	oldlace: [
		253,
		245,
		230
	],
	olive: [
		128,
		128,
		0
	],
	olivedrab: [
		107,
		142,
		35
	],
	orange: [
		255,
		165,
		0
	],
	orangered: [
		255,
		69,
		0
	],
	orchid: [
		218,
		112,
		214
	],
	palegoldenrod: [
		238,
		232,
		170
	],
	palegreen: [
		152,
		251,
		152
	],
	paleturquoise: [
		175,
		238,
		238
	],
	palevioletred: [
		219,
		112,
		147
	],
	papayawhip: [
		255,
		239,
		213
	],
	peachpuff: [
		255,
		218,
		185
	],
	peru: [
		205,
		133,
		63
	],
	pink: [
		255,
		192,
		203
	],
	plum: [
		221,
		160,
		221
	],
	powderblue: [
		176,
		224,
		230
	],
	purple: [
		128,
		0,
		128
	],
	rebeccapurple: [
		102,
		51,
		153
	],
	red: [
		255,
		0,
		0
	],
	rosybrown: [
		188,
		143,
		143
	],
	royalblue: [
		65,
		105,
		225
	],
	saddlebrown: [
		139,
		69,
		19
	],
	salmon: [
		250,
		128,
		114
	],
	sandybrown: [
		244,
		164,
		96
	],
	seagreen: [
		46,
		139,
		87
	],
	seashell: [
		255,
		245,
		238
	],
	sienna: [
		160,
		82,
		45
	],
	silver: [
		192,
		192,
		192
	],
	skyblue: [
		135,
		206,
		235
	],
	slateblue: [
		106,
		90,
		205
	],
	slategray: [
		112,
		128,
		144
	],
	slategrey: [
		112,
		128,
		144
	],
	snow: [
		255,
		250,
		250
	],
	springgreen: [
		0,
		255,
		127
	],
	steelblue: [
		70,
		130,
		180
	],
	tan: [
		210,
		180,
		140
	],
	teal: [
		0,
		128,
		128
	],
	thistle: [
		216,
		191,
		216
	],
	tomato: [
		255,
		99,
		71
	],
	turquoise: [
		64,
		224,
		208
	],
	violet: [
		238,
		130,
		238
	],
	wheat: [
		245,
		222,
		179
	],
	white: [
		255,
		255,
		255
	],
	whitesmoke: [
		245,
		245,
		245
	],
	yellow: [
		255,
		255,
		0
	],
	yellowgreen: [
		154,
		205,
		50
	]
}, Xt = (e, t, n = !1) => {
	if (t === "specifiedValue") return u(e, ""), "";
	if (n) return u(e, null), null;
	let r = [
		"rgb",
		0,
		0,
		0,
		0
	];
	return u(e, r), r;
}, Zt = (e, t = !1) => {
	switch (e) {
		case "hsl":
		case "hwb":
		case V: return null;
		case Ye: return "";
		default: return t ? null : [
			"rgb",
			0,
			0,
			0,
			0
		];
	}
}, Qt = (e, t = {}) => {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	let { alpha: n = !1, minLength: r = H, maxLength: i = et, minRange: a = 0, maxRange: o = 1, validateRange: s = !0 } = t;
	if (!Number.isFinite(r)) throw TypeError(`${r} is not a number.`);
	if (!Number.isFinite(i)) throw TypeError(`${i} is not a number.`);
	if (!Number.isFinite(a)) throw TypeError(`${a} is not a number.`);
	if (!Number.isFinite(o)) throw TypeError(`${o} is not a number.`);
	let c = e.length;
	if (c < r || c > i) throw Error(`Unexpected array length ${c}.`);
	let l = 0;
	for (; l < c;) {
		let t = e[l];
		if (!Number.isFinite(t)) throw TypeError(`${t} is not a number.`);
		if (l < H && s && (t < a || t > o)) throw RangeError(`${t} is not between ${a} and ${o}.`);
		if (l === H && (t < 0 || t > 1)) throw RangeError(`${t} is not between 0 and 1.`);
		l++;
	}
	return n && c === H && e.push(1), e;
}, J = (e, t, n = !1) => {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	if (e.length !== H) throw Error(`Unexpected array length ${e.length}.`);
	if (!n) for (let t of e) t = Qt(t, {
		maxLength: H,
		validateRange: !1
	});
	let [[r, i, a], [o, s, c], [l, u, d]] = e, f, p, m;
	return n ? [f, p, m] = t : [f, p, m] = Qt(t, {
		maxLength: H,
		validateRange: !1
	}), [
		r * f + i * p + a * m,
		o * f + s * p + c * m,
		l * f + u * p + d * m
	];
}, $t = (e, t, n = !1) => {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	if (e.length !== et) throw Error(`Unexpected array length ${e.length}.`);
	if (!Array.isArray(t)) throw TypeError(`${t} is not an array.`);
	if (t.length !== et) throw Error(`Unexpected array length ${t.length}.`);
	let r = 0;
	for (; r < et;) e[r] === "none" && t[r] === "none" ? (e[r] = 0, t[r] = 0) : e[r] === "none" ? e[r] = t[r] : t[r] === "none" && (t[r] = e[r]), r++;
	return n ? [e, t] : [Qt(e, {
		minLength: et,
		validateRange: !1
	}), Qt(t, {
		minLength: et,
		validateRange: !1
	})];
}, en = (e) => {
	if (!Number.isFinite(e)) throw TypeError(`${e} is not a number.`);
	if (e = Math.round(e), e < 0 || e > G) throw RangeError(`${e} is not between 0 and ${G}.`);
	let t = e.toString(U);
	return t.length === 1 && (t = `0${t}`), t;
}, tn = (e) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let t = ot / 400, n = ot / (Math.PI * $e);
	if (!Ut.test(e)) throw SyntaxError(`Invalid property value: ${e}`);
	let [, r, i] = e.match(Ut), a;
	switch (i) {
		case "grad":
			a = parseFloat(r) * t;
			break;
		case "rad":
			a = parseFloat(r) * n;
			break;
		case "turn":
			a = parseFloat(r) * ot;
			break;
		default: a = parseFloat(r);
	}
	return a %= ot, a < 0 ? a += ot : Object.is(a, -0) && (a = 0), a;
}, nn = (e = "") => {
	if (m(e)) {
		if (e = e.trim(), !e) e = "1";
		else if (e === "none") e = "0";
		else {
			let t;
			if (t = e.endsWith("%") ? parseFloat(e) / W : parseFloat(e), !Number.isFinite(t)) throw TypeError(`${t} is not a finite number.`);
			e = t < Ze ? "0" : t > 1 ? "1" : t.toFixed(H);
		}
	} else e = "1";
	return parseFloat(e);
}, rn = (e) => {
	if (m(e)) {
		if (e === "") throw SyntaxError("Invalid property value: (empty string)");
		e = e.trim();
	} else throw TypeError(`${e} is not a string.`);
	let t = parseInt(e, U);
	if (t <= 0) return 0;
	if (t >= G) return 1;
	let n = /* @__PURE__ */ new Map();
	for (let e = 1; e < W; e++) n.set(Math.round(e * G / W), e);
	return t = n.has(t) ? n.get(t) / W : Math.round(t / G / Ze) * Ze, parseFloat(t.toFixed(H));
}, an = (e, t = !1) => {
	let n, r, i;
	t ? [n, r, i] = e : [n, r, i] = Qt(e, {
		maxLength: H,
		maxRange: G
	});
	let a = n / G, o = r / G, s = i / G, c = .04045;
	return a > c ? a = ((a + dt) / 1.055) ** lt : a /= ut, o > c ? o = ((o + dt) / 1.055) ** lt : o /= ut, s > c ? s = ((s + dt) / 1.055) ** lt : s /= ut, [
		a,
		o,
		s
	];
}, on = (e, t = !1) => (t || (e = Qt(e, {
	maxLength: H,
	maxRange: G
})), e = an(e, !0), J(bt, e, !0)), sn = (e, t = !1) => {
	let [n, r, i] = Qt(e, { maxLength: H }), a = 809 / 258400;
	return n > a ? n = n ** (1 / lt) * 1.055 - dt : n *= ut, n *= G, r > a ? r = r ** (1 / lt) * 1.055 - dt : r *= ut, r *= G, i > a ? i = i ** (1 / lt) * 1.055 - dt : i *= ut, i *= G, [
		t ? Math.round(n) : n,
		t ? Math.round(r) : r,
		t ? Math.round(i) : i
	];
}, cn = (e, t = !1) => {
	t || (e = Qt(e, {
		maxLength: H,
		validateRange: !1
	}));
	let [n, r, i] = J(xt, e, !0);
	return [n, r, i] = sn([
		Math.min(Math.max(n, 0), 1),
		Math.min(Math.max(r, 0), 1),
		Math.min(Math.max(i, 0), 1)
	], !0), [
		n,
		r,
		i
	];
}, ln = (e, t = !1) => {
	let [n, r, i] = cn(e, t), a = n / G, o = r / G, s = i / G, c = Math.max(a, o, s), l = Math.min(a, o, s), u = c - l, d = (c + l) * Qe * W, f, p;
	if (Math.round(d) === 0 || Math.round(d) === W) f = 0, p = 0;
	else if (p = u / (1 - Math.abs(c + l - 1)) * W, p === 0) f = 0;
	else {
		switch (c) {
			case a:
				f = (o - s) / u;
				break;
			case o:
				f = (s - a) / u + $e;
				break;
			case s:
			default: f = (a - o) / u + et;
		}
		f = f * it % ot, f < 0 && (f += ot);
	}
	return [
		f,
		p,
		d
	];
}, un = (e, t = !1) => {
	let [n, r, i] = cn(e, t), a = Math.min(n, r, i) / G, o = 1 - Math.max(n, r, i) / G, s;
	return a + o === 1 ? s = 0 : [s] = ln(e), [
		s,
		a * W,
		o * W
	];
}, dn = (e, t = !1) => {
	t || (e = Qt(e, {
		maxLength: H,
		validateRange: !1
	}));
	let [n, r, i] = J(Tt, J(St, e, !0).map((e) => Math.cbrt(e)), !0);
	n = Math.min(Math.max(n, 0), 1);
	let a = Math.round(parseFloat(n.toFixed(et)) * W);
	return (a === 0 || a === W) && (r = 0, i = 0), [
		n,
		r,
		i
	];
}, fn = (e, t = !1) => {
	let [n, r, i] = dn(e, t), a, o, s = Math.round(parseFloat(n.toFixed(et)) * W);
	return s === 0 || s === W ? (a = 0, o = 0) : (a = Math.max(Math.sqrt(r ** +st + i ** +st), 0), parseFloat(a.toFixed(et)) === 0 ? o = 0 : (o = Math.atan2(i, r) * at / Math.PI, o < 0 && (o += ot))), [
		n,
		a,
		o
	];
}, pn = (e, t = !1) => (t || (e = Qt(e, {
	maxLength: H,
	validateRange: !1
})), cn(J(vt, e, !0), !0)), mn = (e, t = !1) => {
	t || (e = Qt(e, {
		maxLength: H,
		validateRange: !1
	}));
	let [n, r, i] = e.map((e, t) => e / _t[t]).map((e) => e > ht ? Math.cbrt(e) : (e * gt + U) / ft), a = Math.min(Math.max(ft * r - U, 0), W), o, s;
	return a === 0 || a === W ? (o = 0, s = 0) : (o = (n - r) * pt, s = (r - i) * mt), [
		a,
		o,
		s
	];
}, hn = (e, t = !1) => {
	let [n, r, i] = mn(e, t), a, o;
	return n === 0 || n === W ? (a = 0, o = 0) : (a = Math.max(Math.sqrt(r ** +st + i ** +st), 0), o = Math.atan2(i, r) * at / Math.PI, o < 0 && (o += ot)), [
		n,
		a,
		o
	];
}, gn = (e) => {
	let [t, n, r, i] = Qt(e, {
		alpha: !0,
		maxRange: G
	}), a = en(t), o = en(n), s = en(r), c = en(i * G), l;
	return l = c === "ff" ? `#${a}${o}${s}` : `#${a}${o}${s}${c}`, l;
}, _n = (e) => {
	if (m(e)) e = e.toLowerCase().trim();
	else throw TypeError(`${e} is not a string.`);
	if (!(/^#[\da-f]{6}$/.test(e) || /^#[\da-f]{3}$/.test(e) || /^#[\da-f]{8}$/.test(e) || /^#[\da-f]{4}$/.test(e))) throw SyntaxError(`Invalid property value: ${e}`);
	let t = [];
	if (/^#[\da-f]{3}$/.test(e)) {
		let [, n, r, i] = e.match(/^#([\da-f])([\da-f])([\da-f])$/);
		t.push(parseInt(`${n}${n}`, U), parseInt(`${r}${r}`, U), parseInt(`${i}${i}`, U), 1);
	} else if (/^#[\da-f]{4}$/.test(e)) {
		let [, n, r, i, a] = e.match(/^#([\da-f])([\da-f])([\da-f])([\da-f])$/);
		t.push(parseInt(`${n}${n}`, U), parseInt(`${r}${r}`, U), parseInt(`${i}${i}`, U), rn(`${a}${a}`));
	} else if (/^#[\da-f]{8}$/.test(e)) {
		let [, n, r, i, a] = e.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})$/);
		t.push(parseInt(n, U), parseInt(r, U), parseInt(i, U), rn(a));
	} else {
		let [, n, r, i] = e.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/);
		t.push(parseInt(n, U), parseInt(r, U), parseInt(i, U), 1);
	}
	return t;
}, vn = (e) => {
	let [t, n, r, i] = _n(e), [a, o, s] = an([
		t,
		n,
		r
	], !0);
	return [
		a,
		o,
		s,
		i
	];
}, yn = (e) => {
	let [t, n, r, i] = vn(e), [a, o, s] = J(bt, [
		t,
		n,
		r
	], !0);
	return [
		a,
		o,
		s,
		i
	];
}, bn = (e, t = {}) => {
	if (m(e)) e = e.toLowerCase().trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!Wt.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let [, i] = e.match(Wt), [a, o, s, c = ""] = i.match(/[^\s,/]+/g), l, u, d;
	a === "none" ? l = 0 : (l = a.endsWith("%") ? parseFloat(a) * G / W : parseFloat(a), l = Math.min(Math.max(j(l, tt), 0), G)), o === "none" ? u = 0 : (u = o.endsWith("%") ? parseFloat(o) * G / W : parseFloat(o), u = Math.min(Math.max(j(u, tt), 0), G)), s === "none" ? d = 0 : (d = s.endsWith("%") ? parseFloat(s) * G / W : parseFloat(s), d = Math.min(Math.max(j(d, tt), 0), G));
	let f = nn(c);
	return [
		"rgb",
		l,
		u,
		d,
		n === "mixValue" && c === "none" ? R : f
	];
}, xn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!Pt.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let [, i] = e.match(Pt), [a, o, s, c = ""] = i.match(/[^\s,/]+/g), l, u, d;
	l = a === "none" ? 0 : tn(a), u = o === "none" ? 0 : Math.min(Math.max(parseFloat(o), 0), W), d = s === "none" ? 0 : Math.min(Math.max(parseFloat(s), 0), W);
	let f = nn(c);
	if (n === "hsl") return [
		n,
		a === "none" ? a : l,
		o === "none" ? o : u,
		s === "none" ? s : d,
		c === "none" ? c : f
	];
	l = l / ot * rt, d /= W;
	let p = u / W * Math.min(d, 1 - d), h = l % rt, g = (8 + l) % rt, _ = (4 + l) % rt, v = d - p * Math.max(-1, Math.min(h - H, H ** st - h, 1)), y = d - p * Math.max(-1, Math.min(g - H, H ** st - g, 1)), b = d - p * Math.max(-1, Math.min(_ - H, H ** st - _, 1));
	return [
		"rgb",
		Math.min(Math.max(j(v * G, tt), 0), G),
		Math.min(Math.max(j(y * G, tt), 0), G),
		Math.min(Math.max(j(b * G, tt), 0), G),
		f
	];
}, Sn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!Ft.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let [, i] = e.match(Ft), [a, o, s, c = ""] = i.match(/[^\s,/]+/g), l, u, d;
	l = a === "none" ? 0 : tn(a), u = o === "none" ? 0 : Math.min(Math.max(parseFloat(o), 0), W) / W, d = s === "none" ? 0 : Math.min(Math.max(parseFloat(s), 0), W) / W;
	let f = nn(c);
	if (n === "hwb") return [
		n,
		a === "none" ? a : l,
		o === "none" ? o : u * W,
		s === "none" ? s : d * W,
		c === "none" ? c : f
	];
	if (u + d >= 1) {
		let e = j(u / (u + d) * G, tt);
		return [
			"rgb",
			e,
			e,
			e,
			f
		];
	}
	let p = (1 - u - d) / G, [, h, g, _] = xn(`hsl(${l} 100 50)`);
	return h = j((h * p + u) * G, tt), g = j((g * p + u) * G, tt), _ = j((_ * p + u) * G, tt), [
		"rgb",
		Math.min(Math.max(h, 0), G),
		Math.min(Math.max(g, 0), G),
		Math.min(Math.max(_, 0), G),
		f
	];
}, Cn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!It.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let i = 1.25, [, a] = e.match(It), [o, s, c, l = ""] = a.match(/[^\s,/]+/g), u, d, f;
	o === "none" ? u = 0 : (o.endsWith("%") ? (u = parseFloat(o), u > W && (u = W)) : u = parseFloat(o), u < 0 && (u = 0)), d = s === "none" ? 0 : s.endsWith("%") ? parseFloat(s) * i : parseFloat(s), f = c === "none" ? 0 : c.endsWith("%") ? parseFloat(c) * i : parseFloat(c);
	let p = nn(l);
	if (q.test(n)) return [
		"lab",
		o === "none" ? o : j(u, U),
		s === "none" ? s : j(d, U),
		c === "none" ? c : j(f, U),
		l === "none" ? l : p
	];
	let h = (u + U) / ft, g = d / pt + h, _ = h - f / mt, v = h ** +ct, y = g ** +ct, b = _ ** +ct, [x, S, C] = [
		y > ht ? y : (g * ft - U) / gt,
		u > 8 ? v : u / gt,
		b > ht ? b : (_ * ft - U) / gt
	].map((e, t) => e * _t[t]);
	return [
		"xyz-d50",
		j(x, U),
		j(S, U),
		j(C, U),
		p
	];
}, wn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!Lt.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let [, i] = e.match(Lt), [a, o, s, c = ""] = i.match(/[^\s,/]+/g), l, u, d;
	a === "none" ? l = 0 : (l = parseFloat(a), l < 0 && (l = 0)), u = o === "none" ? 0 : o.endsWith("%") ? parseFloat(o) * 1.5 : parseFloat(o), d = s === "none" ? 0 : tn(s);
	let f = nn(c);
	if (q.test(n)) return [
		"lch",
		a === "none" ? a : j(l, U),
		o === "none" ? o : j(u, U),
		s === "none" ? s : j(d, U),
		c === "none" ? c : f
	];
	let p = u * Math.cos(d * Math.PI / at), h = u * Math.sin(d * Math.PI / at), [, g, _, v] = Cn(`lab(${l} ${p} ${h})`);
	return [
		"xyz-d50",
		j(g, U),
		j(_, U),
		j(v, U),
		f
	];
}, Tn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!Vt.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let i = .4, [, a] = e.match(Vt), [o, s, c, l = ""] = a.match(/[^\s,/]+/g), u, d, f;
	o === "none" ? u = 0 : (u = o.endsWith("%") ? parseFloat(o) / W : parseFloat(o), u < 0 && (u = 0)), d = s === "none" ? 0 : s.endsWith("%") ? parseFloat(s) * i / W : parseFloat(s), f = c === "none" ? 0 : c.endsWith("%") ? parseFloat(c) * i / W : parseFloat(c);
	let p = nn(l);
	if (q.test(n)) return [
		"oklab",
		o === "none" ? o : j(u, U),
		s === "none" ? s : j(d, U),
		c === "none" ? c : j(f, U),
		l === "none" ? l : p
	];
	let [h, g, _] = J(Ct, J(wt, [
		u,
		d,
		f
	]).map((e) => e ** +ct), !0);
	return [
		"xyz-d65",
		j(h, U),
		j(g, U),
		j(_, U),
		p
	];
}, En = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "", nullable: r = !1 } = t;
	if (!Ht.test(e)) {
		let e = Zt(n, r);
		return e === null ? null : (m(e), e);
	}
	let [, i] = e.match(Ht), [a, o, s, c = ""] = i.match(/[^\s,/]+/g), l, u, d;
	a === "none" ? l = 0 : (l = a.endsWith("%") ? parseFloat(a) / W : parseFloat(a), l < 0 && (l = 0)), o === "none" ? u = 0 : (u = o.endsWith("%") ? parseFloat(o) * .4 / W : parseFloat(o), u < 0 && (u = 0)), d = s === "none" ? 0 : tn(s);
	let f = nn(c);
	if (q.test(n)) return [
		"oklch",
		a === "none" ? a : j(l, U),
		o === "none" ? o : j(u, U),
		s === "none" ? s : j(d, U),
		c === "none" ? c : f
	];
	let p = u * Math.cos(d * Math.PI / at), h = u * Math.sin(d * Math.PI / at), [g, _, v] = J(Ct, J(wt, [
		l,
		p,
		h
	]).map((e) => e ** +ct), !0);
	return [
		"xyz-d65",
		j(g, U),
		j(_, U),
		j(v, U),
		f
	];
}, Y = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { colorSpace: n = "", d50: r = !1, format: i = "", nullable: a = !1 } = t;
	if (!Nt.test(e)) {
		let e = Zt(i, a);
		return e === null ? null : (m(e), e);
	}
	let [, o] = e.match(Nt), [s, c, l, u, d = ""] = o.match(/[^\s,/]+/g), f, p, h;
	s === "xyz" && (s = "xyz-d65"), f = c === "none" ? 0 : c.endsWith("%") ? parseFloat(c) / W : parseFloat(c), p = l === "none" ? 0 : l.endsWith("%") ? parseFloat(l) / W : parseFloat(l), h = u === "none" ? 0 : u.endsWith("%") ? parseFloat(u) / W : parseFloat(u);
	let g = nn(d);
	if (q.test(i) || i === "mixValue" && s === n) return [
		s,
		c === "none" ? c : j(f, nt),
		l === "none" ? l : j(p, nt),
		u === "none" ? u : j(h, nt),
		d === "none" ? d : g
	];
	let _ = 0, v = 0, y = 0;
	if (s === "srgb-linear") [_, v, y] = J(bt, [
		f,
		p,
		h
	]), r && ([_, v, y] = J(yt, [
		_,
		v,
		y
	], !0));
	else if (s === "display-p3") {
		let e = an([
			f * G,
			p * G,
			h * G
		]);
		[_, v, y] = J(Et, e), r && ([_, v, y] = J(yt, [
			_,
			v,
			y
		], !0));
	} else if (s === "rec2020") {
		let e = 1.09929682680944, t = .45, n = [
			f,
			p,
			h
		].map((n) => {
			let r;
			return r = n < .018053968510807 * t * nt ? n / (t * nt) : ((n + e - 1) / e) ** (1 / t), r;
		});
		[_, v, y] = J(Dt, n), r && ([_, v, y] = J(yt, [
			_,
			v,
			y
		], !0));
	} else if (s === "a98-rgb") {
		let e = [
			f,
			p,
			h
		].map((e) => e ** 2.19921875);
		[_, v, y] = J(Ot, e), r && ([_, v, y] = J(yt, [
			_,
			v,
			y
		], !0));
	} else if (s === "prophoto-rgb") {
		let e = [
			f,
			p,
			h
		].map((e) => {
			let t;
			return t = e > 1 / 32 ? e ** 1.8 : e / U, t;
		});
		[_, v, y] = J(kt, e), r || ([_, v, y] = J(vt, [
			_,
			v,
			y
		], !0));
	} else /^xyz(?:-d(?:50|65))?$/.test(s) ? ([_, v, y] = [
		f,
		p,
		h
	], s === "xyz-d50" ? r || ([_, v, y] = J(vt, [
		_,
		v,
		y
	])) : r && ([_, v, y] = J(yt, [
		_,
		v,
		y
	], !0))) : ([_, v, y] = on([
		f * G,
		p * G,
		h * G
	]), r && ([_, v, y] = J(yt, [
		_,
		v,
		y
	], !0)));
	return [
		r ? "xyz-d50" : "xyz-d65",
		j(_, U),
		j(v, U),
		j(y, U),
		i === "mixValue" && d === "none" ? d : g
	];
}, X = (e, t = {}) => {
	if (m(e)) e = e.toLowerCase().trim();
	else throw TypeError(`${e} is not a string.`);
	let { d50: n = !1, format: r = "", nullable: i = !1 } = t;
	if (!At.test(e)) {
		let e = Zt(r, i);
		return e === null ? null : (m(e), e);
	}
	let a = 0, o = 0, s = 0, c = 0;
	if (K.test(e)) {
		if (r === "computedValue") return [
			"rgb",
			0,
			0,
			0,
			0
		];
		if (r === "specifiedValue") return e;
	} else if (/^[a-z]+$/.test(e)) {
		if (Object.hasOwn(Yt, e)) {
			if (r === "specifiedValue") return e;
			let [t, i, l] = Yt[e];
			if (c = 1, r === "computedValue") return [
				"rgb",
				t,
				i,
				l,
				c
			];
			[a, o, s] = on([
				t,
				i,
				l
			], !0), n && ([a, o, s] = J(yt, [
				a,
				o,
				s
			], !0));
		} else switch (r) {
			case B: return i && e !== "transparent" ? null : [
				"rgb",
				0,
				0,
				0,
				0
			];
			case Ye: return e === "transparent" ? e : "";
			case V: return e === "transparent" ? [
				"rgb",
				0,
				0,
				0,
				0
			] : null;
		}
	} else if (e[0] === "#") {
		if (q.test(r)) return ["rgb", ..._n(e)];
		[a, o, s, c] = yn(e), n && ([a, o, s] = J(yt, [
			a,
			o,
			s
		], !0));
	} else if (e.startsWith("lab")) {
		if (q.test(r)) return Cn(e, t);
		[, a, o, s, c] = Cn(e), n || ([a, o, s] = J(vt, [
			a,
			o,
			s
		], !0));
	} else if (e.startsWith("lch")) {
		if (q.test(r)) return wn(e, t);
		[, a, o, s, c] = wn(e), n || ([a, o, s] = J(vt, [
			a,
			o,
			s
		], !0));
	} else if (e.startsWith("oklab")) {
		if (q.test(r)) return Tn(e, t);
		[, a, o, s, c] = Tn(e), n && ([a, o, s] = J(yt, [
			a,
			o,
			s
		], !0));
	} else if (e.startsWith("oklch")) {
		if (q.test(r)) return En(e, t);
		[, a, o, s, c] = En(e), n && ([a, o, s] = J(yt, [
			a,
			o,
			s
		], !0));
	} else {
		let i, l, u;
		if (e.startsWith("hsl") ? [, i, l, u, c] = xn(e) : e.startsWith("hwb") ? [, i, l, u, c] = Sn(e) : [, i, l, u, c] = bn(e, t), q.test(r)) return [
			"rgb",
			Math.round(i),
			Math.round(l),
			Math.round(u),
			c
		];
		[a, o, s] = on([
			i,
			l,
			u
		]), n && ([a, o, s] = J(yt, [
			a,
			o,
			s
		], !0));
	}
	return [
		n ? "xyz-d50" : "xyz-d65",
		j(a, U),
		j(o, U),
		j(s, U),
		c
	];
}, Dn = (e, t = {}) => {
	if (m(e)) e = e.toLowerCase().trim();
	else throw TypeError(`${e} is not a string.`);
	let { colorSpace: n = "", format: r = "", nullable: i = !1 } = t, a = p({
		namespace: Xe,
		name: "resolveColorValue",
		value: e
	}, t), o = d(a);
	if (o !== !1) return o.item;
	if (!At.test(e)) {
		let e = Zt(r, i);
		return e === null ? (u(a, null), null) : (u(a, e), m(e), e);
	}
	let s = "", c = 0, l = 0, f = 0, h = 0;
	if (K.test(e)) {
		if (r === "specifiedValue") return u(a, e), e;
	} else if (/^[a-z]+$/.test(e)) {
		if (Object.hasOwn(Yt, e)) {
			if (r === "specifiedValue") return u(a, e), e;
			[c, l, f] = Yt[e], h = 1;
		} else switch (r) {
			case Ye: return e === "transparent" ? (u(a, e), e) : (u(a, ""), "");
			case V:
				if (e === "transparent") {
					let e = [
						"rgb",
						0,
						0,
						0,
						0
					];
					return u(a, e), e;
				}
				return u(a, null), null;
			case B:
			default: {
				if (i && e !== "transparent") return u(a, null), null;
				let t = [
					"rgb",
					0,
					0,
					0,
					0
				];
				return u(a, t), t;
			}
		}
	} else if (e[0] === "#") [c, l, f, h] = _n(e);
	else if (e.startsWith("hsl")) [, c, l, f, h] = xn(e, t);
	else if (e.startsWith("hwb")) [, c, l, f, h] = Sn(e, t);
	else if (/^l(?:ab|ch)/.test(e)) {
		let n, i, o;
		if (e.startsWith("lab") ? [s, n, i, o, h] = Cn(e, t) : [s, n, i, o, h] = wn(e, t), q.test(r)) {
			let e = [
				s,
				n,
				i,
				o,
				h
			];
			return u(a, e), e;
		}
		[c, l, f] = pn([
			n,
			i,
			o
		]);
	} else if (/^okl(?:ab|ch)/.test(e)) {
		let n, i, o;
		if (e.startsWith("oklab") ? [s, n, i, o, h] = Tn(e, t) : [s, n, i, o, h] = En(e, t), q.test(r)) {
			let e = [
				s,
				n,
				i,
				o,
				h
			];
			return u(a, e), e;
		}
		[c, l, f] = cn([
			n,
			i,
			o
		]);
	} else [, c, l, f, h] = bn(e, t);
	if (r === "mixValue" && n === "srgb") {
		let e = [
			"srgb",
			c / G,
			l / G,
			f / G,
			h
		];
		return u(a, e), e;
	}
	let g = [
		"rgb",
		Math.round(c),
		Math.round(l),
		Math.round(f),
		h
	];
	return u(a, g), g;
}, On = (e, t = {}) => {
	if (m(e)) e = e.toLowerCase().trim();
	else throw TypeError(`${e} is not a string.`);
	let { colorSpace: n = "", format: r = "", nullable: i = !1 } = t, a = p({
		namespace: Xe,
		name: "resolveColorFunc",
		value: e
	}, t), o = d(a);
	if (o !== !1) return o.item;
	if (!Nt.test(e)) {
		let e = Zt(r, i);
		return e === null ? (u(a, null), null) : (u(a, e), m(e), e);
	}
	let [s, c, l, f, h] = Y(e, t);
	if (q.test(r) || r === "mixValue" && s === n) {
		let e = [
			s,
			c,
			l,
			f,
			h
		];
		return u(a, e), e;
	}
	let g = parseFloat(`${c}`), _ = parseFloat(`${l}`), v = parseFloat(`${f}`), y = nn(`${h}`), [b, x, S] = cn([
		g,
		_,
		v
	], !0), C = [
		"rgb",
		b,
		x,
		S,
		y
	];
	return u(a, C), C;
}, kn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { colorSpace: n = "", format: r = "" } = t, i = "", a, o, s, c, l, u, d;
	if (r === "mixValue") {
		let r;
		if (r = e.startsWith("color(") ? Y(e, t) : X(e, t), r === null) return null;
		if ([i, l, u, d, c] = r, i === n) return [
			l,
			u,
			d,
			c
		];
		[a, o, s] = J(xt, [
			l,
			u,
			d
		], !0);
	} else if (e.startsWith("color(")) {
		let [, t] = e.match(Nt), [n] = t.match(/[^\s,/]+/g);
		n === "srgb-linear" ? [, a, o, s, c] = On(e, { format: B }) : ([, l, u, d, c] = Y(e), [a, o, s] = J(xt, [
			l,
			u,
			d
		], !0));
	} else [, l, u, d, c] = X(e), [a, o, s] = J(xt, [
		l,
		u,
		d
	], !0);
	return [
		Math.min(Math.max(a, 0), 1),
		Math.min(Math.max(o, 0), 1),
		Math.min(Math.max(s, 0), 1),
		c
	];
}, An = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (n === "mixValue") {
		let n;
		if (n = e.startsWith("color(") ? On(e, t) : Dn(e, t), n === null) return null;
		[, r, i, a, o] = n;
	} else if (e.startsWith("color(")) {
		let [, t] = e.match(Nt), [n] = t.match(/[^\s,/]+/g);
		n === "srgb" ? ([, r, i, a, o] = On(e, { format: B }), r *= G, i *= G, a *= G) : [, r, i, a, o] = On(e);
	} else /^(?:ok)?l(?:ab|ch)/.test(e) ? ([r, i, a, o] = kn(e), [r, i, a] = sn([
		r,
		i,
		a
	])) : [, r, i, a, o] = Dn(e, { format: B });
	return [
		r,
		i,
		a,
		o
	];
}, jn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { d50: n = !1, format: r = "" } = t, i, a, o, s;
	if (r === "mixValue") {
		let n;
		if (n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, i, a, o, s] = n;
	} else if (e.startsWith("color(")) {
		let [, r] = e.match(Nt), [c] = r.match(/[^\s,/]+/g);
		n ? c === "xyz-d50" ? [, i, a, o, s] = On(e, { format: B }) : [, i, a, o, s] = Y(e, t) : /^xyz(?:-d65)?$/.test(c) ? [, i, a, o, s] = On(e, { format: B }) : [, i, a, o, s] = Y(e);
	} else [, i, a, o, s] = X(e, t);
	return [
		i,
		a,
		o,
		s
	];
}, Mn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (Pt.test(e)) return [, r, i, a, o] = xn(e, { format: "hsl" }), n === "hsl" ? [
		Math.round(r),
		Math.round(i),
		Math.round(a),
		o
	] : [
		r,
		i,
		a,
		o
	];
	let s, c, l;
	if (n === "mixValue") {
		let n;
		if (n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, s, c, l, o] = n;
	} else e.startsWith("color(") ? [, s, c, l, o] = Y(e) : [, s, c, l, o] = X(e);
	return [r, i, a] = ln([
		s,
		c,
		l
	], !0), n === "hsl" ? [
		Math.round(r),
		Math.round(i),
		Math.round(a),
		o
	] : [
		n === "mixValue" && i === 0 ? R : r,
		i,
		a,
		o
	];
}, Nn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (Ft.test(e)) return [, r, i, a, o] = Sn(e, { format: "hwb" }), n === "hwb" ? [
		Math.round(r),
		Math.round(i),
		Math.round(a),
		o
	] : [
		r,
		i,
		a,
		o
	];
	let s, c, l;
	if (n === "mixValue") {
		let n;
		if (n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, s, c, l, o] = n;
	} else e.startsWith("color(") ? [, s, c, l, o] = Y(e) : [, s, c, l, o] = X(e);
	return [r, i, a] = un([
		s,
		c,
		l
	], !0), n === "hwb" ? [
		Math.round(r),
		Math.round(i),
		Math.round(a),
		o
	] : [
		n === "mixValue" && i + a >= 100 ? R : r,
		i,
		a,
		o
	];
}, Pn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (It.test(e)) return [, r, i, a, o] = Cn(e, { format: B }), [
		r,
		i,
		a,
		o
	];
	let s, c, l;
	if (n === "mixValue") {
		let n;
		if (t.d50 = !0, n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, s, c, l, o] = n;
	} else e.startsWith("color(") ? [, s, c, l, o] = Y(e, { d50: !0 }) : [, s, c, l, o] = X(e, { d50: !0 });
	return [r, i, a] = mn([
		s,
		c,
		l
	], !0), [
		r,
		i,
		a,
		o
	];
}, Fn = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (Lt.test(e)) return [, r, i, a, o] = wn(e, { format: B }), [
		r,
		i,
		a,
		o
	];
	let s, c, l;
	if (n === "mixValue") {
		let n;
		if (t.d50 = !0, n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, s, c, l, o] = n;
	} else e.startsWith("color(") ? [, s, c, l, o] = Y(e, { d50: !0 }) : [, s, c, l, o] = X(e, { d50: !0 });
	return [r, i, a] = hn([
		s,
		c,
		l
	], !0), [
		r,
		i,
		n === "mixValue" && i === 0 ? R : a,
		o
	];
}, In = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (Vt.test(e)) return [, r, i, a, o] = Tn(e, { format: B }), [
		r,
		i,
		a,
		o
	];
	let s, c, l;
	if (n === "mixValue") {
		let n;
		if (n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, s, c, l, o] = n;
	} else e.startsWith("color(") ? [, s, c, l, o] = Y(e) : [, s, c, l, o] = X(e);
	return [r, i, a] = dn([
		s,
		c,
		l
	], !0), [
		r,
		i,
		a,
		o
	];
}, Ln = (e, t = {}) => {
	if (m(e)) e = e.trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: n = "" } = t, r, i, a, o;
	if (Ht.test(e)) return [, r, i, a, o] = En(e, { format: B }), [
		r,
		i,
		a,
		o
	];
	let s, c, l;
	if (n === "mixValue") {
		let n;
		if (n = e.startsWith("color(") ? Y(e, t) : X(e, t), n === null) return null;
		[, s, c, l, o] = n;
	} else e.startsWith("color(") ? [, s, c, l, o] = Y(e) : [, s, c, l, o] = X(e);
	return [r, i, a] = fn([
		s,
		c,
		l
	], !0), [
		r,
		i,
		n === "mixValue" && i === 0 ? R : a,
		o
	];
}, Rn = (e, t = {}, n = () => null) => {
	if (m(e)) e = e.toLowerCase().trim();
	else throw TypeError(`${e} is not a string.`);
	let { format: r = "", nullable: i = !1 } = t, a = p({
		namespace: Xe,
		name: "resolveColorMix",
		value: e
	}, t), o = d(a);
	if (o !== !1) return o.item;
	let s = [], c = "", l = "", f = "", h = "", g = "", _ = "", v = !1;
	if (!Rt.test(e)) {
		if (e.startsWith("color-mix(") && Bt.test(e)) {
			let t = e.match(Bt);
			for (let i of t) if (i) {
				let t = Rn(i, { format: r === "specifiedValue" ? r : B }, n);
				if (Array.isArray(t)) {
					let [n, r, i, a, o] = t;
					if (r === 0 && i === 0 && a === 0 && o === 0) {
						e = "";
						break;
					}
					t = Gt.test(n) ? o === 1 ? `color(${n} ${r} ${i} ${a})` : `color(${n} ${r} ${i} ${a} / ${o})` : o === 1 ? `${n}(${r} ${i} ${a})` : `${n}(${r} ${i} ${a} / ${o})`;
				} else if (!Rt.test(t)) {
					e = "";
					break;
				}
				s.push(t), e = e.replace(i, t);
			}
			if (!e) return Xt(a, r, i);
		} else if (e.startsWith("color-mix(") && e.endsWith(")") && e.includes("light-dark(")) {
			let [o = "", s = "", u = ""] = k(e.replace(Ne, "").replace(/\)$/, ""), { delimiter: "," }), [d = "", p = ""] = k(s), [y = "", b = ""] = k(u), x = n(d, { format: Ye }), S = n(y, { format: Ye });
			if (Kt.test(o) && x && S) {
				if (r === "specifiedValue") {
					let [, t] = o.match(Kt);
					jt.test(t) ? [, c, l] = t.match(jt) : c = t, f = x, p && (h = p), g = S, b && (_ = b), e = e.replace(d, x).replace(y, S), v = !0;
				} else {
					let r = n(d, t), i = n(y, t);
					m(r) && m(i) && (e = e.replace(d, r).replace(y, i));
				}
			} else return Xt(a, r, i);
		} else return Xt(a, r, i);
	}
	if (s.length && r === "specifiedValue") {
		let [, t] = e.match(qt);
		if (jt.test(t) ? [, c, l] = t.match(jt) : c = t, s.length === 2) {
			let [t, n] = s;
			t = t.replace(/(?=[()])/g, "\\"), n = n.replace(/(?=[()])/g, "\\");
			let r = RegExp(`(${t})(?:\\s+(${z}))?`), i = RegExp(`(${n})(?:\\s+(${z}))?`);
			[, f, h] = e.match(r), [, g, _] = e.match(i);
		} else {
			let [t] = s;
			t = t.replace(/(?=[()])/g, "\\");
			let n = `${t}(?:\\s+${z})?`, r = `(${t})(?:\\s+(${z}))?`, i = RegExp(`^${r}$`);
			if (RegExp(`${r}\\s*\\)$`).test(e)) {
				let t = RegExp(`(${Ke})\\s*,\\s*(${n})\\s*\\)$`), [, r, a] = e.match(t);
				[, f, h] = r.match(Jt), [, g, _] = a.match(i);
			} else {
				let t = RegExp(`(${n})\\s*,\\s*(${Ke})\\s*\\)$`), [, r, a] = e.match(t);
				[, f, h] = r.match(i), [, g, _] = a.match(Jt);
			}
		}
	} else if (!v) {
		let [, t, n, r] = e.match(zt);
		[, f, h] = n.match(Jt), [, g, _] = r.match(Jt), jt.test(t) ? [, c, l] = t.match(jt) : c = t;
	}
	let y, b, x;
	if (h && _) {
		let e = parseFloat(h) / W, t = parseFloat(_) / W;
		if (e < 0 || e > 1 || t < 0 || t > 1 || e === 0 && t === 0) return Xt(a, r, i);
		let n = e + t;
		y = e / n, b = t / n, x = n < 1 ? n : 1;
	} else {
		if (h) {
			if (y = parseFloat(h) / W, y < 0 || y > 1) return Xt(a, r, i);
			b = 1 - y;
		} else if (_) {
			if (b = parseFloat(_) / W, b < 0 || b > 1) return Xt(a, r, i);
			y = 1 - b;
		} else y = Qe, b = Qe;
		x = 1;
	}
	if (c === "xyz" && (c = "xyz-d65"), r === "specifiedValue") {
		let e = "", n = "";
		if (f.startsWith("color-mix(") || f.startsWith("light-dark(")) e = f;
		else if (f.startsWith("color(")) {
			let [n, r, i, a, o] = Y(f, t);
			e = o === 1 ? `color(${n} ${r} ${i} ${a})` : `color(${n} ${r} ${i} ${a} / ${o})`;
		} else {
			let n = X(f, t);
			if (Array.isArray(n)) {
				let [t, r, i, a, o] = n;
				e = o === 1 ? t === "rgb" ? `${t}(${r}, ${i}, ${a})` : `${t}(${r} ${i} ${a})` : t === "rgb" ? `${t}a(${r}, ${i}, ${a}, ${o})` : `${t}(${r} ${i} ${a} / ${o})`;
			} else {
				if (!m(n) || !n) return u(a, ""), "";
				e = n;
			}
		}
		if (g.startsWith("color-mix(") || g.startsWith("light-dark(")) n = g;
		else if (g.startsWith("color(")) {
			let [e, r, i, a, o] = Y(g, t);
			n = o === 1 ? `color(${e} ${r} ${i} ${a})` : `color(${e} ${r} ${i} ${a} / ${o})`;
		} else {
			let e = X(g, t);
			if (Array.isArray(e)) {
				let [t, r, i, a, o] = e;
				n = o === 1 ? t === "rgb" ? `${t}(${r}, ${i}, ${a})` : `${t}(${r} ${i} ${a})` : t === "rgb" ? `${t}a(${r}, ${i}, ${a}, ${o})` : `${t}(${r} ${i} ${a} / ${o})`;
			} else {
				if (!m(e) || !e) return u(a, ""), "";
				n = e;
			}
		}
		if (h && _) e += ` ${parseFloat(h)}%`, n += ` ${parseFloat(_)}%`;
		else if (h) {
			let t = parseFloat(h);
			t !== W * Qe && (e += ` ${t}%`);
		} else if (_) {
			let t = W - parseFloat(_);
			t !== W * Qe && (e += ` ${t}%`);
		}
		if (l) {
			let t = `color-mix(in ${c} ${l} hue, ${e}, ${n})`;
			return u(a, t), t;
		}
		{
			let t = `color-mix(in ${c}, ${e}, ${n})`;
			return u(a, t), t;
		}
	}
	let S = 0, C = 0, w = 0, T = 0;
	if (/^srgb(?:-linear)?$/.test(c)) {
		let e, t;
		if (c === "srgb" ? (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : An(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : An(g, {
			colorSpace: c,
			format: V
		})) : (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : kn(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : kn(g, {
			colorSpace: c,
			format: V
		})), e === null || t === null) return Xt(a, r, i);
		let [n, o, s, l] = e, [d, p, m, h] = t, _ = n === "none" && d === "none", v = o === "none" && p === "none", E = s === "none" && m === "none", D = l === "none" && h === "none", [[O, ee, te, ne], [re, k, A, ie]] = $t([
			n,
			o,
			s,
			l
		], [
			d,
			p,
			m,
			h
		], !0), M = ne * y, N = ie * b;
		if (T = M + N, T === 0 ? (S = O * y + re * b, C = ee * y + k * b, w = te * y + A * b) : (S = (O * M + re * N) / T, C = (ee * M + k * N) / T, w = (te * M + A * N) / T, T = parseFloat(T.toFixed(3))), r === "computedValue") {
			let e = [
				c,
				_ ? R : j(S, U),
				v ? R : j(C, U),
				E ? R : j(w, U),
				D ? R : T * x
			];
			return u(a, e), e;
		}
		S *= G, C *= G, w *= G;
	} else if (Mt.test(c)) {
		let e, t;
		if (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : jn(f, {
			colorSpace: c,
			d50: c === "xyz-d50",
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : jn(g, {
			colorSpace: c,
			d50: c === "xyz-d50",
			format: V
		}), e === null || t === null) return Xt(a, r, i);
		let [n, o, s, l] = e, [d, p, m, h] = t, _ = n === "none" && d === "none", v = o === "none" && p === "none", E = s === "none" && m === "none", D = l === "none" && h === "none", [[O, ee, te, ne], [re, k, A, ie]] = $t([
			n,
			o,
			s,
			l
		], [
			d,
			p,
			m,
			h
		], !0), M = ne * y, N = ie * b;
		T = M + N;
		let P, F, I;
		if (T === 0 ? (P = O * y + re * b, F = ee * y + k * b, I = te * y + A * b) : (P = (O * M + re * N) / T, F = (ee * M + k * N) / T, I = (te * M + A * N) / T, T = parseFloat(T.toFixed(3))), r === "computedValue") {
			let e = [
				c,
				_ ? R : j(P, U),
				v ? R : j(F, U),
				E ? R : j(I, U),
				D ? R : T * x
			];
			return u(a, e), e;
		}
		c === "xyz-d50" ? [S, C, w] = pn([
			P,
			F,
			I
		], !0) : [S, C, w] = cn([
			P,
			F,
			I
		], !0);
	} else if (/^h(?:sl|wb)$/.test(c)) {
		let e, t;
		if (c === "hsl" ? (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : Mn(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : Mn(g, {
			colorSpace: c,
			format: V
		})) : (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : Nn(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : Nn(g, {
			colorSpace: c,
			format: V
		})), e === null || t === null) return Xt(a, r, i);
		let [n, o, s, d] = e, [p, m, h, _] = t, v = d === "none" && _ === "none", [[E, D, O, ee], [te, ne, re, k]] = $t([
			n,
			o,
			s,
			d
		], [
			p,
			m,
			h,
			_
		], !0);
		l && ([E, te] = ie(E, te, l));
		let A = ee * y, M = k * b;
		T = A + M;
		let N = (E * y + te * b) % ot, P, F;
		if (T === 0 ? (P = D * y + ne * b, F = O * y + re * b) : (P = (D * A + ne * M) / T, F = (O * A + re * M) / T, T = parseFloat(T.toFixed(3))), [S, C, w] = An(`${c}(${N} ${P} ${F})`), r === "computedValue") {
			let e = [
				"srgb",
				j(S / G, U),
				j(C / G, U),
				j(w / G, U),
				v ? R : T * x
			];
			return u(a, e), e;
		}
	} else if (/^(?:ok)?lch$/.test(c)) {
		let e, t;
		if (c === "lch" ? (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : Fn(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : Fn(g, {
			colorSpace: c,
			format: V
		})) : (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : Ln(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : Ln(g, {
			colorSpace: c,
			format: V
		})), e === null || t === null) return Xt(a, r, i);
		let [n, o, s, d] = e, [p, m, h, _] = t, v = n === "none" && p === "none", E = o === "none" && m === "none", D = s === "none" && h === "none", O = d === "none" && _ === "none", [[ee, te, ne, re], [k, A, M, N]] = $t([
			n,
			o,
			s,
			d
		], [
			p,
			m,
			h,
			_
		], !0);
		l && ([ne, M] = ie(ne, M, l));
		let P = re * y, F = N * b;
		T = P + F;
		let I = (ne * y + M * b) % ot, ae, oe;
		if (T === 0 ? (ae = ee * y + k * b, oe = te * y + A * b) : (ae = (ee * P + k * F) / T, oe = (te * P + A * F) / T, T = parseFloat(T.toFixed(3))), r === "computedValue") {
			let e = [
				c,
				v ? R : j(ae, U),
				E ? R : j(oe, U),
				D ? R : j(I, U),
				O ? R : T * x
			];
			return u(a, e), e;
		}
		[, S, C, w] = Dn(`${c}(${ae} ${oe} ${I})`);
	} else {
		let e, t;
		if (c === "lab" ? (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : Pn(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : Pn(g, {
			colorSpace: c,
			format: V
		})) : (e = K.test(f) ? [
			R,
			R,
			R,
			R
		] : In(f, {
			colorSpace: c,
			format: V
		}), t = K.test(g) ? [
			R,
			R,
			R,
			R
		] : In(g, {
			colorSpace: c,
			format: V
		})), e === null || t === null) return Xt(a, r, i);
		let [n, o, s, l] = e, [d, p, m, h] = t, _ = n === "none" && d === "none", v = o === "none" && p === "none", E = s === "none" && m === "none", D = l === "none" && h === "none", [[O, ee, te, ne], [re, k, A, ie]] = $t([
			n,
			o,
			s,
			l
		], [
			d,
			p,
			m,
			h
		], !0), M = ne * y, N = ie * b;
		T = M + N;
		let P, F, I;
		if (T === 0 ? (P = O * y + re * b, F = ee * y + k * b, I = te * y + A * b) : (P = (O * M + re * N) / T, F = (ee * M + k * N) / T, I = (te * M + A * N) / T, T = parseFloat(T.toFixed(3))), r === "computedValue") {
			let e = [
				c,
				_ ? R : j(P, U),
				v ? R : j(F, U),
				E ? R : j(I, U),
				D ? R : T * x
			];
			return u(a, e), e;
		}
		[, S, C, w] = Dn(`${c}(${P} ${F} ${I})`);
	}
	let E = [
		"rgb",
		Math.round(S),
		Math.round(C),
		Math.round(w),
		parseFloat((T * x).toFixed(3))
	];
	return u(a, E), E;
}, { CloseParen: zn, Comment: Bn, Delim: Vn, Dimension: Hn, EOF: Un, Function: Wn, Ident: Gn, Number: Kn, OpenParen: qn, Percentage: Jn, Whitespace: Yn } = t, { HasNoneKeywords: Xn } = i, Zn = "relative-color", Qn = 8, $n = 10, er = 16, tr = 100, nr = 255, rr = /* @__PURE__ */ new Map([
	["color", [
		"r",
		"g",
		"b",
		"alpha"
	]],
	["hsl", [
		"h",
		"s",
		"l",
		"alpha"
	]],
	["hsla", [
		"h",
		"s",
		"l",
		"alpha"
	]],
	["hwb", [
		"h",
		"w",
		"b",
		"alpha"
	]],
	["lab", [
		"l",
		"a",
		"b",
		"alpha"
	]],
	["lch", [
		"l",
		"c",
		"h",
		"alpha"
	]],
	["oklab", [
		"l",
		"a",
		"b",
		"alpha"
	]],
	["oklch", [
		"l",
		"c",
		"h",
		"alpha"
	]],
	["rgb", [
		"r",
		"g",
		"b",
		"alpha"
	]],
	["rgba", [
		"r",
		"g",
		"b",
		"alpha"
	]]
]), ir = RegExp(`^${Pe}(${Ge}|${qe})\\s+`), ar = /(?:hsla?|hwb)$/, or = RegExp(`^(?:${De}|${Oe})$`), sr = /^(?:abs|sig?n|cos|tan)\(/, cr = new RegExp(pe), lr = new RegExp(Pe), ur = RegExp(`^${Fe}`), dr = RegExp(`^${Pe}`), fr = new RegExp(me);
function pr(e, t = {}) {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	let { colorSpace: n = "", format: r = "" } = t, i = rr.get(n);
	if (!i) return null;
	let a = /* @__PURE__ */ new Set(), o = [
		[],
		[],
		[],
		[]
	], s = 0, c = 0, l = "", u = !1;
	for (let n of e) {
		if (!Array.isArray(n)) throw TypeError(`${n} is not an array.`);
		let [e, r, , , d] = n, f = o[s];
		if (Array.isArray(f)) switch (e) {
			case Vn:
				if (l) {
					if ((r === "+" || r === "-") && u && !sr.test(l)) return null;
					u = !1, f.push(r);
				}
				break;
			case Hn: {
				if (!l || !sr.test(l)) return null;
				let e = ei(n, t);
				m(e) ? f.push(e) : f.push(r);
				break;
			}
			case Wn:
				f.push(r), l = r, c++, cr.test(r) && a.add(c);
				break;
			case Gn:
				if (!i.includes(r)) return null;
				f.push(r), l || s++;
				break;
			case Kn:
				f.push(Number(d?.value)), l || s++;
				break;
			case qn:
				f.push(r), c++;
				break;
			case zn:
				l && (f.at(-1) === " " ? f[f.length - 1] = r : f.push(r), a.has(c) && a.delete(c), c--, c === 0 && (l = "", s++));
				break;
			case Jn:
				if (!l) return null;
				if (!sr.test(l)) {
					let e;
					for (let t = f.length - 1; t >= 0; t--) if (f[t] !== " ") {
						e = f[t];
						break;
					}
					if (e === "+" || e === "-") return null;
					u = e !== "*" && e !== "/";
				}
				f.push(Number(d?.value) / tr);
				break;
			case Yn:
				if (f.length && l) {
					let e = f.at(-1);
					(typeof e == "number" || m(e) && !e.endsWith("(") && e !== " ") && f.push(r);
				}
				break;
			default: e !== Bn && e !== Un && l && f.push(r);
		}
	}
	let d = [];
	for (let e of o) if (e.length === 1) {
		let [t] = e;
		h(t) && d.push(t);
	} else if (e.length) {
		let t = $r(e.join(""), { format: r });
		d.push(t);
	}
	return d;
}
function mr(e, t = {}, r = () => null) {
	let { colorScheme: i = "normal", currentColor: a = "", format: o = "" } = t;
	if (m(e)) {
		if (e = e.toLowerCase().trim(), !e) return null;
		if (!dr.test(e)) return e;
	} else return null;
	let s = p({
		namespace: Zn,
		name: "extractOriginColor",
		value: e
	}, t), c = d(s);
	if (c !== !1) return c.item;
	if (/currentcolor/.test(e)) {
		if (a) e = e.replace(/currentcolor/g, a);
		else return u(s, null), null;
	}
	let l = "";
	if (ur.test(e) && ([, l] = e.match(ur)), t.colorSpace = l, e.includes("light-dark(")) {
		let [, n = ""] = k(e.replace(RegExp(`^${l}\\(`), "").replace(/\)$/, "")), a = r(n, {
			colorScheme: i,
			format: Ye
		});
		if (!a) return u(s, null), null;
		if (o === "specifiedValue") e = e.replace(n, a);
		else {
			let i = r(a, t);
			if (m(i)) e = e.replace(n, i);
			else return u(s, null), null;
		}
	}
	if (ir.test(e)) {
		let [, i] = e.match(ir), [, a] = e.split(i);
		if (/^[a-z]+$/.test(i)) {
			if (!/^transparent$/.test(i) && !Object.hasOwn(Yt, i)) return u(s, null), null;
		} else if (o === "specifiedValue") {
			let n = r(i, t);
			n && m(n) && (e = e.replace(i, n));
		}
		if (o === "specifiedValue") {
			let r = pr(n({ css: a }), t);
			if (r === null) return u(s, null), null;
			let [i, o, c, l] = r, d = "";
			d = h(l) ? ` ${i} ${o} ${c} / ${l})` : ` ${r.join(" ")})`, a !== d && (e = e.replace(a, d));
		}
	} else {
		let [, i] = e.split(dr), a = n({ css: i }), o = [], c = 0, l = 0;
		for (let [e, t] of a) {
			switch (l++, e) {
				case Wn:
				case qn:
					o.push(t), c++;
					break;
				case zn:
					o.at(-1) === " " ? o[o.length - 1] = t : o.push(t), c--;
					break;
				case Yn: {
					let e = o.at(-1);
					m(e) && !e.endsWith("(") && e !== " " && o.push(t);
					break;
				}
				default: e !== Bn && e !== Un && o.push(t);
			}
			if (c === 0) break;
		}
		let d = hr(o.join("").trim(), t, r);
		if (d === null) return u(s, null), null;
		let f = pr(a.slice(l), t);
		if (f === null) return u(s, null), null;
		let [p, g, _, v] = f, y = "";
		y = h(v) ? ` ${p} ${g} ${_} / ${v})` : ` ${f.join(" ")})`, e = e.replace(i, `${d}${y}`);
	}
	return u(s, e), e;
}
function hr(e, t = {}, r = () => null) {
	let { format: i = "" } = t;
	if (m(e)) {
		if (fr.test(e)) {
			if (i !== "specifiedValue") throw SyntaxError(`Unexpected token ${Ie} found.`);
			return e;
		}
		if (!lr.test(e)) return e;
		e = e.toLowerCase().trim();
	} else throw TypeError(`${e} is not a string.`);
	let s = p({
		namespace: Zn,
		name: "resolveRelativeColor",
		value: e
	}, t), c = d(s);
	if (c !== !1) return c.item;
	let l = mr(e, t, r);
	if (l === null) return u(s, null), null;
	if (e = l, i === "specifiedValue") return e.startsWith("rgba(") ? e = e.replace("rgba(", "rgb(") : e.startsWith("hsla(") && (e = e.replace("hsla(", "hsl(")), e;
	let f = n({ css: e }), h = o(f), g = a(h);
	if (!g) return u(s, null), null;
	let { alpha: _, channels: v, colorNotation: y, syntaxFlags: b } = g, x;
	x = Number.isNaN(Number(_)) ? b instanceof Set && b.has(Xn) ? R : 0 : j(Number(_), Qn);
	let S, C, w;
	[S, C, w] = v;
	let T;
	if (or.test(y)) {
		let e = b instanceof Set && b.has(Xn);
		S = Number.isNaN(S) ? e ? R : 0 : j(S, er), C = Number.isNaN(C) ? e ? R : 0 : j(C, er), w = Number.isNaN(w) ? e ? R : 0 : j(w, er), T = x === 1 ? `${y}(${S} ${C} ${w})` : `${y}(${S} ${C} ${w} / ${x})`;
	} else if (ar.test(y)) {
		Number.isNaN(S) && (S = 0), Number.isNaN(C) && (C = 0), Number.isNaN(w) && (w = 0);
		let [e, t, n] = An(`${y}(${S} ${C} ${w} / ${x})`);
		e = j(e / nr, $n), t = j(t / nr, $n), n = j(n / nr, $n), T = x === 1 ? `color(srgb ${e} ${t} ${n})` : `color(srgb ${e} ${t} ${n} / ${x})`;
	} else {
		let e = y === "rgb" ? "srgb" : y, t = b instanceof Set && b.has(Xn);
		S = Number.isNaN(S) ? t ? R : 0 : j(S, $n), C = Number.isNaN(C) ? t ? R : 0 : j(C, $n), w = Number.isNaN(w) ? t ? R : 0 : j(w, $n), T = x === 1 ? `color(${e} ${S} ${C} ${w})` : `color(${e} ${S} ${C} ${w} / ${x})`;
	}
	return u(s, T), T;
}
//#endregion
//#region src/js/resolve.ts
var gr = "resolve", _r = "rgba(0, 0, 0, 0)", vr = RegExp(`^(?:${Ge})$`), yr = new RegExp(fe), br = /^(?:(?:ok)?l(?:ab|ch)|color(?:-mix)?|hsla?|hwb|rgba?|var)\(/, xr = new RegExp(Re), Sr = new RegExp(ze), Cr = new RegExp(me), wr = new RegExp(qe), Z = (e, t = {}) => {
	if (!m(e)) throw TypeError(`${e} is not a string.`);
	e = e.trim();
	let { colorScheme: n = "normal", currentColor: r = "", format: i = B, nullable: a = !1 } = t, o = p({
		namespace: gr,
		name: "resolve",
		value: e
	}, t), s = d(o);
	if (s !== !1) return s.item;
	if (Cr.test(e)) {
		if (i === "specifiedValue") return u(o, e), e;
		let n = ai(e, t);
		if (n === null) {
			let e = i === "hex" || i === "hexAlpha" || a ? null : _r;
			return u(o, e), e;
		}
		e = n;
	}
	if (t.format !== i && (t.format = i), e = e.toLowerCase(), xr.test(e) && e.endsWith(")")) {
		let [r = "", s = ""] = k(e.replace(xr, "").replace(/\)$/, ""), { delimiter: "," });
		if (r && s) {
			if (i === "specifiedValue") {
				let e = Z(r, t), n = Z(s, t), i = e && n ? `light-dark(${e}, ${n})` : "";
				return u(o, i), i;
			}
			let e = Z(n === "dark" ? s : r, t), c = e === null && !a ? _r : e;
			return u(o, c), c;
		}
		let c;
		return c = i === "specifiedValue" ? "" : i === "hex" || i === "hexAlpha" ? null : _r, u(o, c), c;
	}
	if (Sr.test(e)) {
		let n = hr(e, t, Z);
		if (i === "computedValue") {
			let e = n === null && !a ? _r : n;
			return u(o, e), e;
		}
		if (i === "specifiedValue") {
			let e = n === null ? "" : n;
			return u(o, e), e;
		}
		e = n === null ? "" : n;
	}
	yr.test(e) && (e = ni(e, t));
	let c = "", l = NaN, f = NaN, h = NaN, g = NaN;
	if (e === "transparent") {
		let t;
		switch (i) {
			case Ye:
				t = e;
				break;
			case "hex":
				t = null;
				break;
			case "hexAlpha":
				t = "#00000000";
				break;
			default: t = _r;
		}
		return u(o, t), t;
	}
	if (e === "currentcolor") {
		if (i === "specifiedValue") return u(o, e), e;
		if (r) {
			let e;
			if (e = r.startsWith("color-mix(") ? Rn(r, t, Z) : r.startsWith("color(") ? On(r, t) : Dn(r, t), e === null) return u(o, null), null;
			[c, l, f, h, g] = e;
		} else {
			let t = i === "computedValue" ? _r : e;
			if (i === "computedValue") return u(o, t), t;
		}
	} else if (i === "specifiedValue") {
		let n = "";
		if (e.startsWith("color-mix(")) {
			let r = Rn(e, t, Z);
			r && m(r) && (n = r);
		} else if (e.startsWith("color(")) {
			let r = On(e, t);
			if (Array.isArray(r)) {
				let [e, t, i, a, o] = r;
				n = o === 1 ? `color(${e} ${t} ${i} ${a})` : `color(${e} ${t} ${i} ${a} / ${o})`;
			}
		} else {
			let r = Dn(e, t);
			if (Array.isArray(r)) {
				let [e, t, i, a, o] = r;
				n = e === "rgb" ? o === 1 ? `${e}(${t}, ${i}, ${a})` : `${e}a(${t}, ${i}, ${a}, ${o})` : o === 1 ? `${e}(${t} ${i} ${a})` : `${e}(${t} ${i} ${a} / ${o})`;
			} else r && (n = r);
		}
		return u(o, n), n;
	} else if (e.startsWith("color-mix(")) {
		r && (e = e.replace(/currentcolor/g, r)), e = e.replace(/transparent/g, _r);
		let n = Rn(e, t, Z);
		if (n === null) return u(o, null), null;
		[c, l, f, h, g] = n;
	} else if (e.startsWith("color(")) {
		let n = On(e, t);
		if (n === null) return u(o, null), null;
		[c, l, f, h, g] = n;
	} else if (e) {
		let n = Dn(e, t);
		if (n === null) return u(o, null), null;
		[c, l, f, h, g] = n;
	}
	let _ = "";
	switch (i) {
		case "hex":
		case "hexAlpha":
			_ = Number.isNaN(l) || Number.isNaN(f) || Number.isNaN(h) || Number.isNaN(g) || i === "hex" && g === 0 ? null : gn([
				l,
				f,
				h,
				i === "hex" ? 1 : g
			]);
			break;
		default: _ = c === "rgb" ? g === 1 ? `${c}(${l}, ${f}, ${h})` : `${c}a(${l}, ${f}, ${h}, ${g})` : [
			"lab",
			"lch",
			"oklab",
			"oklch"
		].includes(c) ? g === 1 ? `${c}(${l} ${f} ${h})` : `${c}(${l} ${f} ${h} / ${g})` : g === 1 ? `color(${c} ${l} ${f} ${h})` : `color(${c} ${l} ${f} ${h} / ${g})`;
	}
	return u(o, _), _;
}, Tr = (e, t = {}) => (t.nullable = !1, Z(e, t)), Er = (e, t = {}) => {
	if (!m(e)) return !1;
	let n = e.toLowerCase().trim();
	if (!n) return !1;
	if (/^[a-z]+$/.test(n)) return n === "currentcolor" || n === "transparent" || Object.hasOwn(Yt, n);
	if (vr.test(n) || wr.test(n)) return !0;
	if (br.test(n)) {
		let e = {
			...t,
			nullable: !0
		};
		return e.format ||= Ye, !!Z(n, e);
	}
	return !1;
}, { CloseParen: Dr, Comment: Or, Dimension: kr, EOF: Ar, Function: jr, Ident: Mr, OpenParen: Nr, Whitespace: Pr } = t, Fr = "css-calc-var", Ir = 3, Lr = 16, Rr = new RegExp(fe), zr = RegExp(`^calc\\((${L})\\)$`), Br = new RegExp(pe), Vr = new RegExp(me), Hr = new RegExp(he), Ur = /\s[*+/-]\s/, Wr = /\($/, Gr = RegExp(`^(${L})(${le}|${ue})$`), Kr = RegExp(`^(${L})(${le}|${ue}|%)$`), qr = RegExp(`^(${L})%$`), Jr = /^(?:inherit|initial|revert(?:-layer)?|unset)$/, Yr = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p;
	#m;
	#h;
	#g;
	constructor() {
		this.#e = !1, this.#t = [], this.#n = [], this.#r = !1, this.#i = [], this.#a = [], this.#o = !1, this.#s = [], this.#c = [], this.#l = [], this.#u = [], this.#d = !1, this.#f = [], this.#p = [], this.#m = [], this.#h = [], this.#g = { toCanonicalUnits: !0 };
	}
	get hasNum() {
		return this.#e;
	}
	set hasNum(e) {
		this.#e = !!e;
	}
	get numSum() {
		return this.#t;
	}
	get numMul() {
		return this.#n;
	}
	get hasPct() {
		return this.#r;
	}
	set hasPct(e) {
		this.#r = !!e;
	}
	get pctSum() {
		return this.#i;
	}
	get pctMul() {
		return this.#a;
	}
	get hasDim() {
		return this.#o;
	}
	set hasDim(e) {
		this.#o = !!e;
	}
	get dimSum() {
		return this.#s;
	}
	get dimSub() {
		return this.#c;
	}
	get dimMul() {
		return this.#l;
	}
	get dimDiv() {
		return this.#u;
	}
	get hasEtc() {
		return this.#d;
	}
	set hasEtc(e) {
		this.#d = !!e;
	}
	get etcSum() {
		return this.#f;
	}
	get etcSub() {
		return this.#p;
	}
	get etcMul() {
		return this.#m;
	}
	get etcDiv() {
		return this.#h;
	}
	clear() {
		this.#e = !1, this.#t.length = 0, this.#n.length = 0, this.#r = !1, this.#i.length = 0, this.#a.length = 0, this.#o = !1, this.#s.length = 0, this.#c.length = 0, this.#l.length = 0, this.#u.length = 0, this.#d = !1, this.#f.length = 0, this.#p.length = 0, this.#m.length = 0, this.#h.length = 0;
	}
	sort(e = []) {
		let t = [...e];
		return t.length > 1 && t.sort((e, t) => {
			let n;
			if (Kr.test(e) && Kr.test(t)) {
				let [, r, i] = e.match(Kr), [, a, o] = t.match(Kr);
				n = i === o ? Number(r) === Number(a) ? 0 : Number(r) > Number(a) ? 1 : -1 : i > o ? 1 : -1;
			} else n = e === t ? 0 : e > t ? 1 : -1;
			return n;
		}), t;
	}
	multiply() {
		let t = [], n;
		if (this.#e) {
			n = 1;
			for (let e of this.#n) if (n *= e, n === 0 || !Number.isFinite(n) || Number.isNaN(n)) break;
			!this.#r && !this.#o && !this.hasEtc && (Number.isFinite(n) && (n = j(n, Lr)), t.push(n));
		}
		if (this.#r) {
			typeof n != "number" && (n = 1);
			for (let e of this.#a) if (n *= e, n === 0 || !Number.isFinite(n) || Number.isNaN(n)) break;
			Number.isFinite(n) && (n = `${j(n, Lr)}%`), !this.#o && !this.hasEtc && t.push(n);
		}
		if (this.#o) {
			let r = "", i = "", a = "";
			this.#l.length && (this.#l.length === 1 ? [i] = this.#l : i = `${this.sort(this.#l).join(" * ")}`), this.#u.length && (this.#u.length === 1 ? [a] = this.#u : a = `${this.sort(this.#u).join(" * ")}`), Number.isFinite(n) ? (r = i ? a ? a.includes("*") ? e(`calc(${n} * ${i} / (${a}))`, this.#g) : e(`calc(${n} * ${i} / ${a})`, this.#g) : e(`calc(${n} * ${i})`, this.#g) : a.includes("*") ? e(`calc(${n} / (${a}))`, this.#g) : e(`calc(${n} / ${a})`, this.#g), t.push(r.replace(/^calc/, ""))) : (!t.length && n !== void 0 && t.push(n), i ? (r = a ? a.includes("*") ? e(`calc(${i} / (${a}))`, this.#g) : e(`calc(${i} / ${a})`, this.#g) : e(`calc(${i})`, this.#g), t.length ? t.push("*", r.replace(/^calc/, "")) : t.push(r.replace(/^calc/, ""))) : (r = e(`calc(${a})`, this.#g), t.length ? t.push("/", r.replace(/^calc/, "")) : t.push("1", "/", r.replace(/^calc/, ""))));
		}
		if (this.#d) {
			if (this.#m.length) {
				!t.length && n !== void 0 && t.push(n);
				let e = this.sort(this.#m).join(" * ");
				t.length ? t.push(`* ${e}`) : t.push(`${e}`);
			}
			if (this.#h.length) {
				let e = this.sort(this.#h).join(" * ");
				e.includes("*") ? t.length ? t.push(`/ (${e})`) : t.push(`1 / (${e})`) : t.length ? t.push(`/ ${e}`) : t.push(`1 / ${e}`);
			}
		}
		return t.length ? t.join(" ") : "";
	}
	sum() {
		let t = [];
		if (this.#e) {
			let e = 0;
			for (let t of this.#t) if (e += t, !Number.isFinite(e) || Number.isNaN(e)) break;
			t.push(e);
		}
		if (this.#r) {
			let e = 0;
			for (let t of this.#i) if (e += t, !Number.isFinite(e)) break;
			Number.isFinite(e) && (e = `${e}%`), t.length ? t.push(`+ ${e}`) : t.push(e);
		}
		if (this.#o) {
			let n, r, i;
			this.#s.length && (r = this.sort(this.#s).join(" + ")), this.#c.length && (i = this.sort(this.#c).join(" + ")), n = r ? i ? i.includes("-") ? e(`calc(${r} - (${i}))`, this.#g) : e(`calc(${r} - ${i})`, this.#g) : e(`calc(${r})`, this.#g) : e(`calc(-1 * (${i}))`, this.#g), t.length ? t.push("+", n.replace(/^calc/, "")) : t.push(n.replace(/^calc/, ""));
		}
		if (this.#d) {
			if (this.#f.length) {
				let e = this.sort(this.#f).map((e) => {
					let t;
					return t = Ur.test(e) && !e.startsWith("(") && !e.endsWith(")") ? `(${e})` : e, t;
				}).join(" + ");
				t.length ? this.#f.length > 1 ? t.push(`+ (${e})`) : t.push(`+ ${e}`) : t.push(`${e}`);
			}
			if (this.#p.length) {
				let e = this.sort(this.#p).map((e) => {
					let t;
					return t = Ur.test(e) && !e.startsWith("(") && !e.endsWith(")") ? `(${e})` : e, t;
				}).join(" + ");
				t.length ? this.#p.length > 1 ? t.push(`- (${e})`) : t.push(`- ${e}`) : this.#p.length > 1 ? t.push(`-1 * (${e})`) : t.push(`-1 * ${e}`);
			}
		}
		return t.length ? t.join(" ") : "";
	}
}, Xr = (e = [], t = !1) => {
	if (e.length < Ir) throw Error(`Unexpected array length ${e.length}.`);
	let n = e.shift();
	if (!m(n) || !n.endsWith("(")) throw Error(`Unexpected token ${n}.`);
	let r = e.pop();
	if (r !== ")") throw Error(`Unexpected token ${r}.`);
	if (e.length === 1) {
		let [t] = e;
		if (!h(t)) throw Error(`Unexpected token ${t}.`);
		return `${n}${t}${r}`;
	}
	let i = [], a = new Yr(), o = "", s = e.length, c = !1;
	for (let t = 0; t < s; t++) {
		let n = e[t];
		if (!h(n)) throw Error(`Unexpected token ${n}.`);
		if (n === "*" || n === "/") o = n;
		else if (n === "+" || n === "-") {
			let e = a.multiply();
			e && i.push(e, n), c = !0, a.clear(), o = "";
		} else {
			let e = Number(n), t = `${n}`;
			switch (o) {
				case "/":
					if (Number.isFinite(e)) a.hasNum = !0, a.numMul.push(1 / e);
					else if (qr.test(t)) {
						let [, e] = t.match(qr);
						a.hasPct = !0, a.pctMul.push(1e4 / Number(e));
					} else Gr.test(t) ? (a.hasDim = !0, a.dimDiv.push(t)) : (a.hasEtc = !0, a.etcDiv.push(t));
					break;
				default: if (Number.isFinite(e)) a.hasNum = !0, a.numMul.push(e);
				else if (qr.test(t)) {
					let [, e] = t.match(qr);
					a.hasPct = !0, a.pctMul.push(Number(e));
				} else Gr.test(t) ? (a.hasDim = !0, a.dimMul.push(t)) : (a.hasEtc = !0, a.etcMul.push(t));
			}
		}
		if (t === s - 1) {
			let e = a.multiply();
			e && i.push(e), a.clear(), o = "";
		}
	}
	let l = "";
	if (t && c) {
		let e = [];
		a.clear(), o = "";
		let t = i.length;
		for (let n = 0; n < t; n++) {
			let r = i[n];
			if (h(r)) {
				if (r === "+" || r === "-") o = r;
				else {
					let e = Number(r), t = `${r}`;
					switch (o) {
						case "-":
							if (Number.isFinite(e)) a.hasNum = !0, a.numSum.push(-1 * e);
							else if (qr.test(t)) {
								let [, e] = t.match(qr);
								a.hasPct = !0, a.pctSum.push(-1 * Number(e));
							} else Gr.test(t) ? (a.hasDim = !0, a.dimSub.push(t)) : (a.hasEtc = !0, a.etcSub.push(t));
							break;
						default: if (Number.isFinite(e)) a.hasNum = !0, a.numSum.push(e);
						else if (qr.test(t)) {
							let [, e] = t.match(qr);
							a.hasPct = !0, a.pctSum.push(Number(e));
						} else Gr.test(t) ? (a.hasDim = !0, a.dimSum.push(t)) : (a.hasEtc = !0, a.etcSum.push(t));
					}
				}
			}
			if (n === t - 1) {
				let t = a.sum();
				t && e.push(t), a.clear(), o = "";
			}
		}
		l = e.join(" ").replace(/\+\s-/g, "- ");
	} else l = i.join(" ").replace(/\+\s-/g, "- ");
	return l.startsWith("(") && l.endsWith(")") && l.lastIndexOf("(") === 0 && l.indexOf(")") === l.length - 1 && (l = l.substring(1, l.length - 1)), `${n}${l}${r}`;
}, Zr = (e) => {
	let t = n({ css: e }), r = [], i = "", a = "", o = 0;
	for (let e of t) {
		let [t, n] = e;
		if (t === Nr || t === jr ? o++ : t === Dr && o--, o === 0 && (n === "+" || n === "-")) {
			i.trim() && r.push((a === "-" ? "-" : "") + i.trim()), i = "", a = n;
			continue;
		}
		i += n;
	}
	i.trim() && r.push((a === "-" ? "-" : "") + i.trim()), r.sort((e, t) => {
		let n = /^(-?(?:\d+(?:\.\d+)?|\.\d+))([a-z%]*)$/i, r = e.match(n), i = t.match(n);
		if (r && i) {
			let e = Number(r[1] ?? "0"), t = Number(i[1] ?? "0"), n = r[2] ?? "", a = i[2] ?? "";
			return n === a ? e - t : n > a ? 1 : -1;
		}
		return e === t ? 0 : e > t ? 1 : -1;
	});
	let s = r[0];
	if (s === void 0) return e;
	let c = s;
	for (let e = 1; e < r.length; e++) {
		let t = r[e] ?? "";
		t.startsWith("-") ? c += " - " + t.substring(1) : t && (c += " + " + t);
	}
	return c;
}, Qr = (t, n) => {
	let r = t[0], i = m(r) && Br.test(r), a = [];
	for (let e of t) Array.isArray(e) ? a.push(Qr(e, i)) : a.push(e);
	let o = a.includes(","), s = a[0] ?? "", c = m(s) && Br.test(s);
	if (o && c && a.at(-1) === ")") {
		let e = a.shift(), t = a.pop(), n = [], r = [];
		for (let e of a) e === "," ? (n.push(r), r = []) : r.push(e);
		return r.length && n.push(r), `${e}${n.map((e) => {
			if (e.length >= Ir) {
				let t = Xr([
					"calc(",
					...e,
					")"
				], !0);
				return Zr(t.substring(5, t.length - 1));
			}
			if (e.length === 1) {
				let t = e[0];
				if (m(t) && t.startsWith("calc(") && t.endsWith(")")) return Zr(t.substring(5, t.length - 1));
			}
			return e.join("");
		}).join(", ")}${t}`;
	}
	if (n) {
		if (!o) {
			if (a.length >= Ir) return Xr(a, !0);
			let e = a[0] ?? "";
			return e.endsWith("(") ? a.join("") : e.startsWith("calc(") || /^[a-z-]+\(/.test(e) ? e : `calc(${e})`;
		}
		return a.join("").replace(/,\s*/g, ", ");
	}
	if (a.length >= Ir && !o) {
		let t = Xr(a, !1);
		return Hr.test(t) && (t = e(t, { toCanonicalUnits: !0 })), t;
	}
	return a.join("").replace(/,\s*/g, ", ");
}, $r = (e, t = {}) => {
	let { format: r = "" } = t;
	if (m(e)) {
		if (!Hr.test(e) || r !== "specifiedValue") return e;
		e = e.toLowerCase().trim();
	} else throw TypeError(`${e} is not a string.`);
	let i = p({
		namespace: Fr,
		name: "serializeCalc",
		value: e
	}, t), a = d(i);
	if (a !== !1) return a.item;
	let o = n({ css: e }).map((e) => {
		let [t, n] = e, r = "";
		return t !== Pr && t !== Or && (r = n), r;
	}).filter((e) => e), s = [[]];
	for (let e of o) if (Wr.test(e)) {
		let t = [e], n = s.at(-1);
		n && n.push(t), s.push(t);
	} else if (e === ")") {
		if (s.length > 1) {
			let t = s.pop();
			t && t.push(e);
		} else {
			let t = s[0];
			t && t.push(e);
		}
	} else {
		let t = s.at(-1);
		t && t.push(e);
	}
	let c = "", l = s[0];
	return l && (c = l.length === 1 && Array.isArray(l[0]) ? Qr(l[0], !0) : Qr(l, !0)), u(i, c), c;
}, ei = (e, t = {}) => {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	let [, , , , n = {}] = e, { unit: r, value: i } = n;
	if (r === "px") return `${i}${r}`;
	let a = I(Number(i), r, t);
	return Number.isFinite(a) ? `${j(a, Lr)}px` : null;
}, ti = (e, t = {}) => {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	let { format: n = "" } = t, r = /* @__PURE__ */ new Set(), i = 0, a = [];
	for (let o of e) {
		if (!Array.isArray(o)) throw TypeError(`${o} is not an array.`);
		let [e = "", s = ""] = o;
		switch (e) {
			case kr:
				if (n === "specifiedValue" && !r.has(i)) a.push(s);
				else {
					let e = ei(o, t);
					m(e) ? a.push(e) : a.push(s);
				}
				break;
			case jr:
			case Nr:
				a.push(s), i++, Br.test(s) && r.add(i);
				break;
			case Dr:
				a.length && a.at(-1) === " " ? a.splice(-1, 1, s) : a.push(s), r.has(i) && r.delete(i), i--;
				break;
			case Pr:
				if (a.length) {
					let e = a.at(-1);
					m(e) && !e.endsWith("(") && e !== " " && a.push(s);
				}
				break;
			default: e !== Or && e !== Ar && a.push(s);
		}
	}
	return a;
}, ni = (t, r = {}) => {
	let { format: i = "" } = r;
	if (m(t)) {
		if (Vr.test(t)) {
			if (i === "specifiedValue") return t;
			{
				let e = ai(t, r);
				return m(e) ? e : "";
			}
		}
		if (!Rr.test(t)) return t;
		t = t.toLowerCase().trim();
	} else throw TypeError(`${t} is not a string.`);
	let a = p({
		namespace: Fr,
		name: "cssCalc",
		value: t
	}, r), o = d(a);
	if (o !== !1) return o.item;
	let s = ti(n({ css: t }), r), c = e(s.join(""), { toCanonicalUnits: !0 });
	if (Hr.test(t)) {
		if (Kr.test(c)) {
			let [, e, t] = c.match(Kr);
			c = `${j(Number(e), Lr)}${t}`;
		}
		c && !Hr.test(c) && i === "specifiedValue" && (c = `calc(${c})`);
	}
	if (i === "specifiedValue") {
		if (/\s[-+*/]\s/.test(c) && !c.includes("NaN")) c = $r(c, r);
		else if (zr.test(c)) {
			let [, e] = c.match(zr);
			c = `calc(${j(Number(e), Lr)})`;
		}
	}
	return u(a, c), c;
};
function ri(e, t = {}) {
	if (!Array.isArray(e)) throw TypeError(`${e} is not an array.`);
	let { customProperty: n = {} } = t, r = [];
	for (; e.length;) {
		let i = e.shift();
		if (!i) break;
		if (!Array.isArray(i)) throw TypeError(`${i} is not an array.`);
		let [a, o] = i;
		if (a === Dr) break;
		if (o === "var(") {
			let [, n] = ri(e, t);
			n && r.push(n);
		} else if (o && a === Mr) {
			if (o.startsWith("--")) {
				let e;
				Object.hasOwn(n, o) ? e = n[o] : typeof n.callback == "function" && (e = n.callback(o)), e && r.push(e);
			} else r.push(o);
		}
	}
	let i = !1;
	r.length > 1 && (i = Er(r.at(-1)));
	let a = "";
	for (let e of r) {
		if (e = e.trim(), Vr.test(e)) {
			let n = ai(e, t);
			m(n) && (!i || Er(n)) && (a = n);
		} else Rr.test(e) ? (e = ni(e, t), (!i || Er(e)) && (a = e)) : e && !Jr.test(e) && (!i || Er(e)) && (a = e);
		if (a) break;
	}
	return [e, a];
}
function ii(e, t = {}) {
	let n = [];
	for (; e.length;) {
		let r = e.shift();
		if (!r) break;
		let [i = "", a = ""] = r;
		if (a === "var(") {
			let [, r] = ri(e, t);
			if (!r) return null;
			n.push(r);
		} else switch (i) {
			case Dr:
				n.length && n.at(-1) === " " ? n[n.length - 1] = a : n.push(a);
				break;
			case Pr:
				if (n.length) {
					let e = n.at(-1);
					m(e) && !e.endsWith("(") && e !== " " && n.push(a);
				}
				break;
			default: i !== Or && i !== Ar && n.push(a);
		}
	}
	return n;
}
function ai(e, t = {}) {
	let { format: r = "" } = t;
	if (m(e)) {
		if (!Vr.test(e) || r === "specifiedValue") return e;
		e = e.trim();
	} else throw TypeError(`${e} is not a string.`);
	let i = p({
		namespace: Fr,
		name: "resolveVar",
		value: e
	}, t), a = d(i);
	if (a !== !1) return a.item;
	let o = ii(n({ css: e }), t);
	if (Array.isArray(o)) {
		let e = o.join("");
		return Rr.test(e) && (e = ni(e, t)), u(i, e), e;
	}
	return u(i, null), null;
}
var oi = (e, t = {}) => {
	let n = ai(e, t);
	return m(n) ? n : "";
}, si = "css-gradient", ci = `${L}(?:${le})`, li = `${ci}|${z}`, Q = `${`${L}(?:${ue})|0`}|${z}`, ui = `${de}(?:${ue}|%)|0`, di = `${de}(?:${ue})|0`, $ = "center", fi = "left|right", pi = "top|bottom", mi = "start|end", hi = `${fi}|x-(?:${mi})`, gi = `${pi}|y-(?:${mi})`, _i = `block-(?:${mi})`, vi = `inline-(?:${mi})`, yi = `${$}|${hi}|${gi}|${_i}|${vi}|${Q}`, bi = [
	`(?:${$}|${hi})\\s+(?:${$}|${gi})`,
	`(?:${$}|${gi})\\s+(?:${$}|${hi})`,
	`(?:${$}|${hi}|${Q})\\s+(?:${$}|${gi}|${Q})`,
	`(?:${$}|${_i})\\s+(?:${$}|${vi})`,
	`(?:${$}|${vi})\\s+(?:${$}|${_i})`,
	`(?:${$}|${mi})\\s+(?:${$}|${mi})`
].join("|"), xi = [
	`(?:${hi})\\s+(?:${Q})\\s+(?:${gi})\\s+(?:${Q})`,
	`(?:${gi})\\s+(?:${Q})\\s+(?:${hi})\\s+(?:${Q})`,
	`(?:${_i})\\s+(?:${Q})\\s+(?:${vi})\\s+(?:${Q})`,
	`(?:${vi})\\s+(?:${Q})\\s+(?:${_i})\\s+(?:${Q})`,
	`(?:${mi})\\s+(?:${Q})\\s+(?:${mi})\\s+(?:${Q})`
].join("|"), Si = "(?:clos|farth)est-(?:corner|side)", Ci = [
	`${Si}(?:\\s+${Si})?`,
	`${di}`,
	`(?:${ui})\\s+(?:${ui})`
].join("|"), wi = "circle|ellipse", Ti = `from\\s+${ci}`, Ei = `at\\s+(?:${yi}|${bi}|${xi})`, Di = `to\\s+(?:(?:${fi})(?:\\s(?:${pi}))?|(?:${pi})(?:\\s(?:${fi}))?)`, Oi = `in\\s+(?:${je}|${Te})`, ki = [`(?:${ci}|${Di})(?:\\s+${Oi})?`, `${Oi}(?:\\s+(?:${ci}|${Di}))?`].join("|"), Ai = [
	`(?:${wi})(?:\\s+(?:${Ci}))?(?:\\s+${Ei})?(?:\\s+${Oi})?`,
	`(?:${Ci})(?:\\s+(?:${wi}))?(?:\\s+${Ei})?(?:\\s+${Oi})?`,
	`${Ei}(?:\\s+${Oi})?`,
	`${Oi}(?:\\s+${wi})(?:\\s+(?:${Ci}))?(?:\\s+${Ei})?`,
	`${Oi}(?:\\s+${Ci})(?:\\s+(?:${wi}))?(?:\\s+${Ei})?`,
	`${Oi}(?:\\s+${Ei})?`
].join("|"), ji = [
	`${Ti}(?:\\s+${Ei})?(?:\\s+${Oi})?`,
	`${Ei}(?:\\s+${Oi})?`,
	`${Oi}(?:\\s+${Ti})?(?:\\s+${Ei})?`
].join("|"), Mi = [/to\s+bottom/], Ni = [
	/ellipse/,
	/farthest-corner/,
	/at\s+center/
], Pi = [/at\s+center/], Fi = /^(?:repeating-)?conic-gradient$/, Ii = /^(?:repeating-)?linear-gradient$/, Li = /^(?:repeating-)?radial-gradient$/, Ri = RegExp(`^(?:${li})$`), zi = RegExp(`^(?:${Q})$`), Bi = RegExp(`(?:\\s+(?:${li})){1,2}$`), Vi = RegExp(`(?:\\s+(?:${Q})){1,2}$`), Hi = /^(?:repeating-)?(?:conic|linear|radial)-gradient\(/, Ui = /^((?:repeating-)?(?:conic|linear|radial)-gradient)\(/, Wi = RegExp(`^(?:${ji})$`), Gi = RegExp(`^(?:${ki})$`), Ki = RegExp(`^(?:${Ai})$`), qi = (e) => {
	if (m(e) && (e = e.trim(), Hi.test(e))) {
		let [, t] = e.match(Ui);
		return t;
	}
	return "";
}, Ji = (e, t) => {
	if (m(e) && m(t)) {
		e = e.trim(), t = t.trim();
		let n = null, r = [];
		if (Ii.test(t) ? (n = Gi, r = Mi) : Li.test(t) ? (n = Ki, r = Ni) : Fi.test(t) && (n = Wi, r = Pi), n) {
			let t = n.test(e);
			if (t) {
				let n = e;
				for (let e of r) n = n.replace(e, "");
				return n = n.replace(/\s{2,}/g, " ").trim(), {
					line: n,
					valid: t
				};
			}
			return {
				valid: t,
				line: e
			};
		}
	}
	return {
		line: e,
		valid: !1
	};
}, Yi = (e, t, n = {}) => {
	if (Array.isArray(e) && e.length > 1) {
		let r = Fi.test(t), i = r ? Ri : zi, a = r ? Bi : Vi, o = [], s = "";
		for (let t = 0; t < e.length; t++) {
			let r = e[t];
			if (m(r)) {
				if (i.test(r)) {
					if (t === 0 || s === "hint") return {
						colorStops: e,
						valid: !1
					};
					s = "hint", o.push(r);
				} else {
					let t = r.replace(a, "");
					if (Er(t, { format: "specifiedValue" })) {
						let e = Z(t, n);
						s = "color", o.push(r.replace(t, e));
					} else return {
						colorStops: e,
						valid: !1
					};
				}
			} else return {
				colorStops: e,
				valid: !1
			};
		}
		return s === "color" ? {
			valid: !0,
			colorStops: o
		} : {
			colorStops: e,
			valid: !1
		};
	}
	return {
		colorStops: e,
		valid: !1
	};
}, Xi = (e, t = {}) => {
	if (m(e)) {
		e = e.trim();
		let n = p({
			namespace: si,
			name: "parseGradient",
			value: e
		}, t), r = d(n);
		if (r !== !1) return r.item;
		let i = qi(e), a = e.replace(Hi, "").replace(/\)$/, "");
		if (i && a) {
			let [r = "", ...o] = k(a, { delimiter: "," }), s = Fi.test(i) ? Bi : Vi, c = "";
			if (s.test(r)) {
				let e = r.replace(s, "");
				if (Er(e, { format: "specifiedValue" })) {
					let n = Z(e, t);
					c = r.replace(e, n);
				}
			} else Er(r, { format: "specifiedValue" }) && (c = Z(r, t));
			if (c) {
				o.unshift(c);
				let { colorStops: r, valid: a } = Yi(o, i, t);
				if (a) {
					let t = {
						value: e,
						type: i,
						colorStopList: r
					};
					return u(n, t), t;
				}
			} else if (o.length > 1) {
				let { line: a, valid: s } = Ji(r, i), { colorStops: c, valid: l } = Yi(o, i, t);
				if (s && l) {
					let t = {
						value: e,
						type: i,
						gradientLine: a,
						colorStopList: c
					};
					return u(n, t), t;
				}
			}
		}
		return u(n, null), null;
	}
	return null;
}, Zi = (e, t = {}) => {
	let { format: n = B } = t, r = Xi(e, t);
	if (r) {
		let { type: e = "", gradientLine: t = "", colorStopList: n = [] } = r;
		if (e && Array.isArray(n) && n.length > 1) return t ? `${e}(${t}, ${n.join(", ")})` : `${e}(${n.join(", ")})`;
	}
	return n === "specifiedValue" ? "" : "none";
}, Qi = (e, t = {}) => Xi(e, t) !== null, $i = "convert", ea = new RegExp(fe), ta = new RegExp(ze), na = new RegExp(me), ra = (e, t = {}) => {
	if (!m(e) || (e = e.trim(), !e)) return null;
	let n = p({
		namespace: $i,
		name: "preProcess",
		value: e
	}, t), r = d(n);
	if (r !== !1) return r.item;
	let i = e;
	if (na.test(e)) {
		let r = ai(e, t);
		if (m(r)) i = r;
		else return u(n, null), null;
	}
	if (ta.test(i)) {
		let e = hr(i, t);
		if (m(e)) i = e;
		else return u(n, null), null;
	} else ea.test(i) && (i = ni(i, t));
	if (i.startsWith("color-mix")) {
		let e = Z(i, {
			...t,
			format: B,
			nullable: !0
		});
		i = typeof e == "string" ? e : null;
	}
	return u(n, i), i;
}, ia = (e, t, n) => (r, i = {}) => {
	if (!m(r)) throw TypeError(`${r} is not a string.`);
	let a = ra(r, i);
	if (a === null) return [
		0,
		0,
		0,
		0
	];
	let o = a.toLowerCase(), s = p({
		namespace: $i,
		name: e,
		value: o
	}, i), c = d(s);
	if (c !== !1) return c.item;
	let l = n(o, {
		...i,
		format: t
	});
	return u(s, l), l;
}, aa = (e) => en(e), oa = (e, t = {}) => {
	if (!m(e)) throw TypeError(`${e} is not a string.`);
	let n = ra(e, t);
	if (n === null) return null;
	let r = n.toLowerCase(), i = p({
		namespace: $i,
		name: "colorToHex",
		value: r
	}, t), a = d(i);
	if (a !== !1) return a.item;
	let o = Z(r, {
		...t,
		nullable: !0,
		format: t.alpha ? "hexAlpha" : "hex"
	});
	return m(o) ? (u(i, o), o) : (u(i, null), null);
}, sa = ia("colorToHsl", "hsl", Mn), ca = ia("colorToHwb", "hwb", Nn), la = ia("colorToLab", "lab", Pn), ua = ia("colorToLch", "lch", Fn), da = ia("colorToOklab", "oklab", In), fa = ia("colorToOklch", "oklch", Ln), pa = ia("colorToRgb", "rgb", An), ma = (e, t = {}) => {
	if (!m(e)) throw TypeError(`${e} is not a string.`);
	let n = ra(e, t);
	if (n === null) return [
		0,
		0,
		0,
		0
	];
	let r = n.toLowerCase(), i = p({
		namespace: $i,
		name: "colorToXyz",
		value: r
	}, t), a = d(i);
	if (a !== !1) return a.item;
	let o;
	o = r.startsWith("color(") ? Y(r, t) : X(r, t);
	let [, ...s] = o;
	return u(i, s), s;
}, ha = {
	colorToHex: oa,
	colorToHsl: sa,
	colorToHwb: ca,
	colorToLab: la,
	colorToLch: ua,
	colorToOklab: da,
	colorToOklch: fa,
	colorToRgb: pa,
	colorToXyz: ma,
	colorToXyzD50: (e, t = {}) => (t.d50 = !0, ma(e, t)),
	numberToHex: aa
}, ga = {
	cssCalc: ni,
	cssVar: oi,
	extractDashedIdent: A,
	isColor: Er,
	isGradient: Qi,
	resolveGradient: Zi,
	resolveLengthInPixels: I,
	splitValue: k
};
//#endregion
export { ha as convert, Tr as resolve, ga as utils };
