/* Draws the share card into public/og.png.
 *
 * A portfolio's whole job is to be pasted somewhere, and a link with no
 * `og:image` renders on LinkedIn and Slack as a grey box with a domain under
 * it. The obvious source for the picture is a screenshot of the game, and it
 * was rejected: a screenshot goes stale the first time the island changes and
 * nothing in CI would ever notice. This is drawn from the same palette as
 * `app/game.css`, so it stays true to the thing it advertises for.
 *
 * Next ships `next/og`, which does exactly this and is one file shorter. It
 * is not used, because on Windows it does not run at all: the bundled
 * @vercel/og resolves its own font and wasm with `path.join(import.meta.url,
 * "../…")`, and `path.win32.join` turns `file:///C:/…` into `file:\C:\…`,
 * which is not a URL. The build dies at `Error occurred prerendering page
 * "/opengraph-image"` with `TypeError: Invalid URL`, on the machine this
 * project is actually developed on. Satori and resvg are what `next/og` is
 * made of; called directly, the paths are ours and the build runs everywhere.
 *
 * Written to public/ rather than emitted by a route because `output:
 * "export"` has no server to render one, and because a file in public/ is
 * served by `next dev` too — so the card can be looked at without a build.
 *
 *   node scripts/og.mjs        (runs on prebuild)
 */
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "og.png");

const W = 1200, H = 630;

/* app/game.css :root. Copied and not imported: satori never sees the
   stylesheet, and a var() resolves to nothing at all. */
const BG = "#0a0a0c", INK = "#ecebe8", DIM = "#b6b3ac", MUT = "#8f8d87";
const LINE = "#2c2c32", GREEN = "#7fdca8", GOLD = "#ffd76a";

/* ---- the font ----
 * Read out of node_modules rather than committed, the same trade
 * scripts/gen-manifest.mjs makes for the Draco decoder: a binary in version
 * control goes stale against whatever it was taken from. Noto Sans latin
 * covers every accent in the card — Raúl, Jiménez, físicas. */
const fontPath = join(here, "..", "node_modules", "next", "dist", "compiled",
  "@vercel", "og", "noto-sans-v27-latin-regular.ttf");
if (!existsSync(fontPath)) {
  console.error(`og: no font at ${fontPath} — cannot draw the share card`);
  process.exit(1);
}
const font = readFileSync(fontPath);

/* ---- the island ----
 * Drawn as one SVG and handed to satori as an <img> holding a data URI:
 * satori's own SVG element support is partial, and an image is the path it
 * handles completely. It is a static drawing either way.
 *
 * The skyline is points rather than a `d` string, because the temple markers
 * have to stand *on* it. Steles floating a few pixels above the ridge is
 * exactly the mistake the world itself keeps making with props, and the fix
 * is the same one — ask the surface for its height instead of guessing. */
const RIDGE = [
  [0, 500], [120, 470], [250, 430], [360, 452], [470, 386], [560, 344],
  [660, 382], [760, 430], [880, 462], [1010, 446], [1120, 472], [1200, 494]
];
const ridgeY = x => {
  for (let i = 1; i < RIDGE.length; i++) {
    const [x0, y0] = RIDGE[i - 1], [x1, y1] = RIDGE[i];
    if (x <= x1) return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
  }
  return RIDGE[RIDGE.length - 1][1];
};
const ridgePath = `M${RIDGE.map(([x, y]) => `${x} ${y}`).join(" L")} L${W} ${H} L0 ${H} Z`;

/* One marker per zone, counted out of the world rather than typed here. The
   README said eight for months after there were seven; a picture that says a
   number should get the number from whatever decides it. */
const world = readFileSync(join(here, "..", "src", "game", "world.js"), "utf8");
const zones = (world
  .slice(world.indexOf("const ZONES_META = ["))
  .split("\n];")[0]
  .match(/^ {2}\{ key: /gm) ?? []).length;
if (zones < 3 || zones > 20) {
  console.error(`og: read ${zones} zones out of world.js — the parse is wrong, not the world`);
  process.exit(1);
}

const temples = Array.from({ length: zones }, (_, i) => {
  const x = 300 + i * (570 / Math.max(1, zones - 1));
  const tall = 26 + (i % 3) * 9;
  /* a pixel into the hill, so the base never shows daylight under it */
  return `<rect x="${x.toFixed(1)}" y="${(ridgeY(x) - tall + 1).toFixed(1)}" width="4" height="${tall}" fill="${GREEN}" opacity=".55"/>`;
}).join("");

const scene = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0a0c"/><stop offset="70%" stop-color="#101820"/><stop offset="100%" stop-color="#12233a"/>
    </linearGradient>
    <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1d3b31"/><stop offset="100%" stop-color="#0d1a17"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- the low sun the island is lit by -->
  <circle cx="965" cy="300" r="58" fill="${GOLD}" opacity=".14"/>
  <circle cx="965" cy="300" r="30" fill="${GOLD}" opacity=".32"/>
  <!-- sea: a band, not a disc, for the same reason as in the world -->
  <rect x="0" y="470" width="${W}" height="160" fill="#0c1a26"/>
  <rect x="0" y="470" width="${W}" height="2" fill="#16304a"/>
  <!-- the ridge, a shoulder either side of it, and the islet offshore -->
  <path d="${ridgePath}" fill="url(#hill)"/>
  <path d="M1046 470 L1082 440 L1120 470 Z" fill="#16241f"/>
  <!-- one marker per zone, counted out of the world itself -->
  ${temples}
</svg>`;

/* satori takes React elements; this is a .mjs with no JSX step, and an
   element is a plain object, so here is the plain object. */
const h = (type, style, children) => ({ type, props: { style, children } });
const row = children => ({ type: "div", props: { style: { display: "flex", gap: 14 }, children } });

const tag = text => h("div", {
  display: "flex", fontSize: 20, color: DIM,
  border: `1px solid ${LINE}`, borderRadius: 4, padding: "8px 14px"
}, text);

const card = {
  type: "div",
  props: {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column",
      justifyContent: "space-between", background: BG, padding: 64,
      position: "relative", fontFamily: "Noto Sans", color: INK
    },
    children: [
      h("img", { position: "absolute", top: 0, left: 0, width: W, height: H }, null),
      {
        type: "div",
        props: {
          style: { display: "flex", flexDirection: "column", position: "relative" },
          children: [
            h("div", { display: "flex", fontSize: 22, letterSpacing: 6, color: GREEN, textTransform: "uppercase" },
              "RJA · Gameplay + Fullstack"),
            h("div", { display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 14, lineHeight: 1 },
              "La Isla del Gato"),
            h("div", { display: "flex", fontSize: 30, color: DIM, marginTop: 20, maxWidth: 760, lineHeight: 1.35 },
              "El portfolio de Raúl Jiménez Ayza, jugable: una isla con relieve, siete templos que cuentan su CV y un gato con físicas de verdad.")
          ]
        }
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "relative", borderTop: `1px solid ${LINE}`, paddingTop: 24
          },
          children: [
            h("div", { display: "flex", fontSize: 24, color: MUT, letterSpacing: 1 },
              "rauljimenezayza.github.io/portfolio-interactivo"),
            row(["three.js", "cannon-es", "Next.js"].map(tag))
          ]
        }
      }
    ]
  }
};

/* the background <img> wants its src on props, not on style */
card.props.children[0].props.src =
  `data:image/svg+xml;base64,${Buffer.from(scene, "utf8").toString("base64")}`;

const svg = await satori(card, {
  width: W, height: H,
  fonts: [{ name: "Noto Sans", data: font, weight: 400, style: "normal" }]
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`og:     public/og.png — ${W}x${H}, ${Math.round(png.length / 1024)} KB`);
