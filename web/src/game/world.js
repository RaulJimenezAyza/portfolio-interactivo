/* La Isla del Gato — the world.
 *
 * Lifted out of the single-file build with one substitution: the alias block
 * became real imports. That block existed because the inlined three.js was
 * minified and the app needed readable names for `Et`, `ze`, `cs` and the
 * rest. Here the same names come from the package, so everything below is the
 * code that shipped, unchanged.
 *
 * It still expects the markup the single-file build carried in its <head>;
 * shell.ts holds that, and boot() will not find its elements without it.
 */
import {
  Scene as Scene3,
  Fog as Fog3,
  PerspectiveCamera as PerspCam,
  WebGLRenderer as GLRenderer,
  Clock as Clock3,
  Vector2 as V2,
  Vector3 as V3,
  Color as Col,
  Quaternion as Quat3,
  Group as Grp,
  Mesh as Mesh,
  Sprite as Sprite3,
  Points as Points3,
  BufferGeometry as BufGeo,
  Float32BufferAttribute as F32Attr,
  BoxGeometry as BoxGeo,
  CylinderGeometry as CylGeo,
  ConeGeometry as ConeGeo,
  SphereGeometry as SphGeo,
  PlaneGeometry as PlaneGeo,
  RingGeometry as RingGeo,
  TorusGeometry as TorusGeo,
  CircleGeometry as CircleGeo,
  IcosahedronGeometry as IcoGeo,
  OctahedronGeometry as OctGeo,
  TetrahedronGeometry as TetGeo,
  DodecahedronGeometry as DodGeo,
  MeshStandardMaterial as StdMat,
  MeshBasicMaterial as BasicMat,
  SpriteMaterial as SpriteMat,
  PointsMaterial as PointsMat,
  CanvasTexture as CanvasTex,
  PointLight as PtLight,
  DirectionalLight as DirLight,
  HemisphereLight as HemiLight,
  SRGBColorSpace as SRGB,
  AdditiveBlending as BLEND_ADD,
  DoubleSide as SIDE_DOUBLE,
  BackSide as SIDE_BACK,
  EquirectangularReflectionMapping as MAP_EQUIRECT,
  ACESFilmicToneMapping as TONE_ACES,
  PCFSoftShadowMap as SHADOW_SOFT,
  RepeatWrapping as WRAP_REPEAT
} from "three";
import { EffectComposer as Composer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass as BloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass as OutPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  World as CWorld,
  SAPBroadphase as CSAP,
  Material as CMat,
  ContactMaterial as CContact,
  Body as CBody,
  Vec3 as CVec,
  Box as CBox,
  Sphere as CSph,
  Cylinder as CCyl,
  Plane as CPlane
} from "cannon-es";
import { getModel, registerFallback } from "../models/load";


/* ---------- palette ---------- */
const GREEN = "#7fdca8", AMBER = "#e8b06a", BLUE = "#8fb0ff",
      PINK = "#f2a2c4", RED = "#f07a6a", GOLD = "#ffd76a", CYAN = "#7ce8e0";

/* ---------- i18n ---------- */
const I18N = {
  es: {
    role: "full stack & gameplay dev", infoBtn: "CV / Info", kmh: "vel",
    legDrive: "mover", legBoost: "correr", legBrake: "saltar", legOpen: "abrir",
    legHonk: "maullar", legReset: "reset", legPlay: "jugar",
    helpTip: "Ver los controles",
    promptK: "lugar sagrado", promptO: "pulsa E o clic para entrar",
    introKick: "La Isla del Gato · portfolio jugable",
    introTitle: "Hago que las cosas se muevan.",
    introBody: "Una isla, siete templos y un gato con curriculum. Explora, salta, tira cajas, sube a la colina del tiempo, roba los peces dorados, baja a la cueva de cristal a jugar y entra en cada templo para descubrir quién es Raúl.",
    miniDrive: "WASD / flechas para mover al gato",
    miniOpen: "E dentro de un templo", miniFish: "🐟 12 peces escondidos",
    miniHonk: "🕹 4 minijuegos en la cueva",
    startBtn: "▶ Entrar en la isla", loading: "Levantando la isla…",
    toastReset: "Gato de vuelta a la plaza", toastHonk: "¡Miau!",
    close: "Cerrar", viewRepo: "Ver repositorio",
    err: "No se pudo iniciar el 3D. Este archivo lleva el motor dentro, solo necesita un navegador con WebGL. Prueba con Chrome/Edge actualizado.",
    zonesHud: "templos", fishHud: "peces",
    discover: "Templo descubierto:",
    allZones: "🏛 ¡Has descubierto los 7 templos! Ahora ya sabes con quién hablas.",
    allFish: "🐟 ¡12/12! El viejo del muelle enciende el farol: la barca es tuya. Ve a pescar junto al estanque.",
    fishGet: "pez dorado",
    flipBack: "¡Mortal hacia atrás!", flipFront: "¡Mortal hacia delante!",
    aboutTitle: "Sobre mí",
    aboutP1: "Soy Raúl, ingeniero informático por la UAB (2026). Empecé estudiando diseño y desarrollo de videojuegos en la Universitat de Girona, y esa semilla gamedev sigue en todo lo que hago: mi TFG fue un simulador donde poblaciones de agentes evolucionan por su cuenta buscando comida.",
    aboutP2: "Hoy programo full stack en Service Next (Montmeló): web, APIs y producto real. Antes, un año largo de becario de TI en GCO, y por el camino construí TriniGlass, una app de gestión de almacén para una pyme que lo llevaba todo en papel. Unity y Unreal por gusto, TypeScript, Python y Node por oficio.",
    stat1: "motores: Unity, Unreal, Godot, UEFN", stat2: "proyectos de principio a fin", stat3: "prototipos en el cajón",
    workTitle: "Proyectos", skillsTitle: "Skills", pathTitle: "Trayectoria", contactTitle: "Contacto",
    contactBody: "Full stack de día en Service Next, gameplay de noche. Abierto a oportunidades de gameplay, backend o fullstack — y a cualquier proyecto con un problema raro dentro. Respondo rápido."
  },
  en: {
    role: "full stack & gameplay dev", infoBtn: "CV / Info", kmh: "spd",
    legDrive: "move", legBoost: "run", legBrake: "jump", legOpen: "open",
    legHonk: "meow", legReset: "reset", legPlay: "play",
    helpTip: "Show the controls",
    promptK: "sacred place", promptO: "press E or click to enter",
    introKick: "Cat Island · playable portfolio",
    introTitle: "I make things move.",
    introBody: "One island, seven temples and a cat with a résumé. Explore, jump, knock crates over, climb the hill of time, steal the golden fish, drop into the crystal cave for a game and enter each temple to find out who Raúl is.",
    miniDrive: "WASD / arrows to move the cat",
    miniOpen: "E inside a temple", miniFish: "🐟 12 hidden fish",
    miniHonk: "🕹 4 minigames in the cave",
    startBtn: "▶ Enter the island", loading: "Raising the island…",
    toastReset: "Cat back at the plaza", toastHonk: "Meow!",
    close: "Close", viewRepo: "View repository",
    err: "Could not start 3D. The engine is embedded in this file, it only needs a WebGL browser. Try an up-to-date Chrome/Edge.",
    zonesHud: "temples", fishHud: "fish",
    discover: "Temple discovered:",
    allZones: "🏛 You found all 7 temples! Now you know who you're talking to.",
    allFish: "🐟 12/12! The old man lights the pier lantern: the boat is yours. Go fishing by the pond.",
    fishGet: "golden fish",
    flipBack: "Backflip!", flipFront: "Frontflip!",
    aboutTitle: "About",
    aboutP1: "I'm Raúl, Computer Engineering graduate from UAB (2026). I started out studying game design and development at Universitat de Girona, and that gamedev seed is in everything I do: my thesis was a simulator where populations of agents evolve on their own hunting for food.",
    aboutP2: "Today I write full stack code at Service Next (Montmeló): web, APIs and real product. Before that, a year-plus IT internship at GCO, and along the way I built TriniGlass, a warehouse management app for a small business that ran on paper. Unity and Unreal for fun, TypeScript, Python and Node for a living.",
    stat1: "engines: Unity, Unreal, Godot, UEFN", stat2: "projects shipped end to end", stat3: "prototypes in the drawer",
    workTitle: "Work", skillsTitle: "Skills", pathTitle: "Path", contactTitle: "Contact",
    contactBody: "Full stack by day at Service Next, gameplay by night. Open to gameplay, backend or fullstack opportunities — and any project with a weird problem in it. I reply fast."
  }
};

/* ---------- CV data ---------- */
const PROJECTS = [
  { id: "tfg", color: GREEN, link: "https://github.com/RaulJimenezAyza/Evolution-of-intelligent-agents",
    short: "TFG", kind: { es: "TFG · simulación", en: "Thesis · simulation" },
    title: "Evolution of Intelligent Agents",
    blurb: { es: "Agentes que evolucionan buscando comida, con métricas en vivo.", en: "Agents evolving as they hunt for food, with live metrics." },
    body: { es: "Mi Trabajo de Fin de Grado: un simulador donde agentes con parámetros heredables compiten por recursos limitados y la selección hace el resto. El simulador está hecho en C#, y una herramienta aparte en Python (live_graph.py) recibe por UDP el número de agentes y de comida para dibujar en tiempo real la evolución con matplotlib.",
      en: "My final degree thesis: a simulator where agents with heritable parameters compete for limited resources and selection does the rest. Written in C#, with a separate Python tool (live_graph.py) receiving agent and food counts over UDP to plot evolution live with matplotlib." },
    tags: ["C#", "Python", "UDP", "matplotlib", "algoritmos evolutivos"] },
  { id: "triniglass", color: AMBER, link: "https://github.com/RaulJimenezAyza/TriniGlass_Demo",
    short: "TG", kind: { es: "Producto · fullstack", en: "Product · fullstack" },
    title: "TriniGlass",
    blurb: { es: "Gestión de almacén e inventario para una pyme que iba en papel.", en: "Warehouse & inventory management for a paper-run SME." },
    body: { es: "Aplicación de gestión para transformar la operativa logística de una pyme sin herramientas digitales: control de inventario, entradas/salidas de almacén y planificación de producción en un solo sitio. Construida en TypeScript, pensada para que el personal la usara sin manual.",
      en: "A management app to transform the logistics of a small business with no digital tooling: inventory, warehouse in/out movements and production planning in one place. Built in TypeScript, designed so staff could use it without a manual." },
    tags: ["TypeScript", "React", "Node.js", "SQL", "inventario"] },
  { id: "mastermind", color: PINK, link: "https://github.com/RaulJimenezAyza/Mastermind",
    short: "MM", kind: { es: "Juego · web", en: "Game · web" },
    title: "Mastermind",
    blurb: { es: "El clásico juego de deducción, en JavaScript puro.", en: "The classic deduction game, in vanilla JavaScript." },
    body: { es: "Implementación del clásico juego de códigos de colores: lógica de comprobación, feedback de aciertos y estado de partida, todo en JavaScript sin dependencias. Pequeño pero honesto ejercicio de diseño de reglas y bucle de juego.",
      en: "An implementation of the classic colour-code game: check logic, hit/near-hit feedback and game state, all dependency-free. A small but honest exercise in rule design and game loop." },
    tags: ["JavaScript", "game loop", "DOM"] },
  { id: "gamedev", color: CYAN, link: "https://github.com/RaulJimenezAyza",
    short: "GD", kind: { es: "Gameplay · prototipos", en: "Gameplay · prototypes" },
    title: "Prototipos de gameplay",
    blurb: { es: "Unity, Unreal, Godot, UEFN y Roblox — mecánicas y game feel.", en: "Unity, Unreal, Godot, UEFN and Roblox — mechanics & game feel." },
    body: { es: "Lo que más me gusta programar es gameplay: movimiento, cámaras, estados del jugador y esa sensación de que el mando responde. He trabajado con Unity, Unreal y Godot, y publicado experiencias en Fortnite (UEFN) y Roblox — un gran campo de pruebas para diseñar reglas con jugadores reales dentro.",
      en: "What I most enjoy programming is gameplay: movement, cameras, player states and that feeling of the controller responding. I've worked with Unity, Unreal and Godot, and shipped experiences in Fortnite (UEFN) and Roblox — a great testing ground for designing rules with real players inside." },
    tags: ["Unity", "Unreal", "Godot", "UEFN", "Roblox", "C#"] }
];

const SKILLS = [
  { label: { es: "Gamedev", en: "Gamedev" }, color: GREEN,
    items: ["Unity", "Unreal Engine", "Godot", "UEFN / Fortnite", "Roblox", "C#", { es: "IA de agentes", en: "Agent AI" }] },
  { label: { es: "Backend & datos", en: "Backend & data" }, color: AMBER,
    items: ["Python", "Node.js", "SQL", "APIs REST", { es: "Modelado de datos", en: "Data modelling" }, "Git"] },
  { label: { es: "Frontend", en: "Frontend" }, color: BLUE,
    items: ["React", "Vue", "TypeScript", "JavaScript", "HTML / CSS", "Three.js"] }
];

const TIMELINE = [
  { when: { es: "2026 — hoy", en: "2026 — now" }, color: GREEN,
    role: { es: "Programador full stack", en: "Full stack developer" },
    place: "Service Next · Montmeló",
    detail: { es: "Desarrollo full stack de producto real: tecnologías web, APIs y frontend, en jornada completa y presencial.", en: "Full stack development on real product: web technologies, APIs and frontend, full-time on site." } },
  { when: { es: "2025 — 2026", en: "2025 — 2026" }, color: AMBER,
    role: { es: "Becario de TI", en: "IT intern" },
    place: "GCO · Sant Cugat del Vallès",
    detail: { es: "Un año largo de prácticas en infraestructura de TI y CAD: primer contacto serio con sistemas en producción.", en: "A year-plus internship in IT infrastructure and CAD: first serious contact with production systems." } },
  { when: { es: "2023 — 2026", en: "2023 — 2026" }, color: BLUE,
    role: { es: "Ingeniería Informática", en: "BSc Computer Engineering" },
    place: "Universitat Autònoma de Barcelona (UAB)",
    detail: { es: "Algoritmia, sistemas y bases de datos. TFG: Evolution of Intelligent Agents — simulador de evolución en C# con métricas en vivo vía UDP y matplotlib.", en: "Algorithms, systems and databases. Thesis: Evolution of Intelligent Agents — an evolution simulator in C# with live metrics over UDP and matplotlib." } },
  { when: { es: "2020 — 2022", en: "2020 — 2022" }, color: CYAN,
    role: { es: "Diseño y Desarrollo de Videojuegos", en: "Game Design & Development" },
    place: "Universitat de Girona (UdG)",
    detail: { es: "Dos años de motores, mecánicas y game design — la semilla de todo lo demás.", en: "Two years of engines, mechanics and game design — the seed of everything else." } },
  { when: { es: "veranos 2023–24", en: "summers 2023–24" }, color: "#8f8d87",
    role: { es: "Control y aseguramiento de calidad", en: "Quality assurance & control" },
    place: "ALPLA Group · Les Franqueses",
    detail: { es: "Trabajo de verano en planta industrial: procesos, rigor y madrugones.", en: "Summer factory work: processes, rigour and early mornings." } }
];

/* zone metadata: name + lore, one temple each */
const ZONES_META = [
  { key: "about", kind: "section", section: "about", color: AMBER,
    name: { es: "La Casa del Gato", en: "The Cat's House" },
    lore: { es: "Todo héroe sale de una casa. En esta se duerme poco y se programa mucho.", en: "Every hero leaves a house. In this one: little sleep, lots of code." } },
  { key: "tfg", kind: "project", idx: 0, color: GREEN,
    name: { es: "Templo de la Evolución", en: "Temple of Evolution" },
    lore: { es: "10.000 generaciones de bichitos aprendieron a buscar comida aquí. Los supervivientes te observan.", en: "10,000 generations of critters learned to forage here. The survivors are watching you." } },
  { key: "triniglass", kind: "project", idx: 1, color: AMBER,
    name: { es: "El Gran Almacén", en: "The Great Warehouse" },
    lore: { es: "Aquí murió el papel y nació el inventario digital. Las cajas se pueden empujar. Tú puedes.", en: "Paper died here and digital inventory was born. The crates can be pushed. Go on." } },
  /* The Ruins of the Riddle used to stand here, running the same Mastermind
     the Crypt of the Code runs underground. The project itself is still in
     the CV panel; the temple that duplicated a cave hall is gone, and its
     road out of the plaza now leads to the bridge. */
  { key: "gamedev", kind: "project", idx: 3, color: CYAN,
    name: { es: "Santuario Arcade", en: "Arcade Sanctuary" },
    lore: { es: "La máquina lleva décadas jugando sola al pong. Los bumpers son inofensivos. Casi.", en: "The machine has been playing pong against itself for decades. The bumpers are harmless. Mostly." } },
  { key: "skills", kind: "section", section: "skills", color: RED,
    name: { es: "La Forja de Skills", en: "The Skill Forge" },
    lore: { es: "Cada herramienta de este templo se templó en el fuego de un deadline.", en: "Every tool in this temple was tempered in the fire of a deadline." } },
  { key: "path", kind: "section", section: "path", color: BLUE,
    name: { es: "La Colina del Tiempo", en: "The Hill of Time" },
    lore: { es: "Sube las terrazas: de los videojuegos en Girona a la UAB, y de becario a full stack. Desde arriba se ve el futuro.", en: "Climb the terraces: from game dev in Girona to UAB, from intern to full stack. You can see the future from the top." } },
  { key: "contact", kind: "section", section: "contact", color: GOLD,
    name: { es: "El Faro de Señales", en: "The Signal Lighthouse" },
    lore: { es: "Enciende una señal y Raúl responde. El faro nunca se apaga.", en: "Light a signal and Raúl replies. The lighthouse never goes dark." } }
];

/* ---------- state + tiny DOM helpers ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const state = { lang: "es", activeProject: null, near: null, infoSection: null,
                fish: 0, fishTotal: 12, zonesFound: 0,
                minigame: false, mmSolved: false, inCave: false, riding: false };
const L = v => (v && typeof v === "object" && !Array.isArray(v)) ? (v[state.lang] ?? v.es) : v;
const TXT = () => I18N[state.lang];
const IS_TOUCH = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (IS_TOUCH) document.body.classList.add("touch");

/* ---------- i18n render ---------- */
function applyLang() {
  const t = TXT();
  $$("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (t[k] !== undefined) el.textContent = t[k];
  });
  document.documentElement.lang = state.lang;
  document.body.dataset.lang = state.lang;
  $("#langBtn").textContent = state.lang === "es" ? "EN" : "ES";
  $("#infoClose").textContent = t.close;
  $("#mClose").textContent = t.close;
  $("#helpBtn").title = t.helpTip;
  updateHud();
  if (state.minigame) {
    $("#mmKicker").textContent = MT().kicker;
    $("#mmTitle").textContent = MT().title;
    $("#mmHint").innerHTML = MT().hint;
    mmRender();
  }
  if (state.activeProject != null) fillProjectModal(state.activeProject);
  if (state.infoSection === "full") renderInfoFull();
  else if (state.infoSection) renderInfoSection(state.infoSection);
  refreshPrompt();
}
$("#langBtn").addEventListener("click", () => {
  state.lang = state.lang === "es" ? "en" : "es";
  applyLang();
});

/* The control legend is only useful for the first few seconds. It slides away
   on its own and the ? button in the HUD brings it back for good — once the
   player asks for it explicitly, it stays until they dismiss it. */
let legendTimer = null;
function showLegend(v, autoHideMs = 0) {
  $("#legend").classList.toggle("hide", !v);
  $("#helpBtn").classList.toggle("on", v);
  clearTimeout(legendTimer);
  if (v && autoHideMs) legendTimer = setTimeout(() => showLegend(false), autoHideMs);
}
$("#helpBtn").addEventListener("click", () => {
  showLegend($("#legend").classList.contains("hide"));
  Snd.ui(true);
});

function updateHud() {
  const t = TXT();
  $("#fishHud").innerHTML = `🐟 <b>${state.fish}</b>/${state.fishTotal} <span>${t.fishHud}</span>`;
  $("#zoneHud").innerHTML = `🏛 <b>${state.zonesFound}</b>/${ZONES_META.length} <span>${t.zonesHud}</span>`;
}

/* ---------- project modal ---------- */
function fillProjectModal(i) {
  const p = PROJECTS[i], t = TXT();
  $("#mShot").style.background = p.color;
  $("#mShot span").textContent = p.short;
  $("#mKind").textContent = L(p.kind);
  $("#mKind").style.color = p.color;
  $("#mTitle").textContent = p.title;
  $("#mBody").textContent = L(p.body);
  $("#mTags").innerHTML = p.tags.map(x => `<span class="tag">${x}</span>`).join("");
  $("#mLink").href = p.link;
  $("#mLink").textContent = t.viewRepo;
  $("#mClose").textContent = t.close;
  $("#mShot").style.setProperty("--accent", p.color);
  const play = $("#mPlay");
  play.style.display = p.id === "mastermind" ? "" : "none";
  play.textContent = state.lang === "es" ? "▶ Jugar" : "▶ Play";
}
function openProject(i) {
  state.activeProject = i; fillProjectModal(i);
  $("#modal").classList.add("show");
  Snd.duck(true); Snd.ui(true);
}
function closeProject() {
  state.activeProject = null; $("#modal").classList.remove("show");
  Snd.duck(!!state.infoSection); Snd.ui(false);
}
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeProject(); });
$("#mClose").addEventListener("click", closeProject);

/* ---------- info / CV overlay ---------- */
function sectionHTML(sec) {
  const t = TXT();
  const num = { about: "01", work: "02", skills: "03", path: "04", contact: "05" }[sec];
  if (sec === "about") return `<section><div class="num">${num} / ${t.aboutTitle}</div><h2>${t.aboutTitle}</h2>
    <p>${t.aboutP1}</p><p style="margin-top:14px">${t.aboutP2}</p>
    <div class="stats">
      <div class="stat"><div class="v" style="color:${GREEN}">4</div><div class="c">${t.stat1}</div></div>
      <div class="stat"><div class="v" style="color:${AMBER}">3</div><div class="c">${t.stat2}</div></div>
      <div class="stat"><div class="v">∞</div><div class="c">${t.stat3}</div></div>
    </div></section>`;
  if (sec === "work") return `<section><div class="num">${num} / ${t.workTitle}</div><h2>${t.workTitle}</h2>
    <div class="cards">${PROJECTS.map((p, i) => `<div class="card" data-idx="${i}">
      <div class="meta"><span class="sw" style="background:${p.color}"></span><span class="kd">${L(p.kind)}</span></div>
      <div class="t">${p.title}</div><div class="bl">${L(p.blurb)}</div></div>`).join("")}</div></section>`;
  if (sec === "skills") return `<section><div class="num">${num} / ${t.skillsTitle}</div><h2>${t.skillsTitle}</h2>
    <div class="skills">${SKILLS.map(s => `<div class="skillcol"><div class="lbl" style="color:${s.color}">${L(s.label)}</div>
      <div class="chips">${s.items.map(i => `<span class="chip">${L(i)}</span>`).join("")}</div></div>`).join("")}</div></section>`;
  if (sec === "path") return `<section><div class="num">${num} / ${t.pathTitle}</div><h2>${t.pathTitle}</h2>
    ${TIMELINE.map(n => `<div class="tl"><div class="when" style="color:${n.color}">${L(n.when)}</div>
      <div><div class="role">${L(n.role)}</div><div class="place">${L(n.place)}</div><div class="det">${L(n.detail)}</div></div></div>`).join("")}</section>`;
  return `<section><div class="num">${num} / ${t.contactTitle}</div><h2>${t.contactTitle}</h2>
    <p>${t.contactBody}</p>
    <div class="links">
      <a href="mailto:rauljayza@gmail.com"><span class="lab">email</span><span>rauljayza@gmail.com</span></a>
      <a href="https://github.com/RaulJimenezAyza" target="_blank" rel="noopener"><span class="lab">github</span><span>RaulJimenezAyza</span></a>
      <a href="https://www.linkedin.com/in/raul-jimenez-ayza/" target="_blank" rel="noopener"><span class="lab">linkedin</span><span>raul-jimenez-ayza</span></a>
      <div><span class="lab">base</span><span>Lliçà d'Amunt, Barcelona</span></div>
    </div></section>`;
}
function bindInfoCards() {
  $$("#infoInner .card").forEach(c => c.addEventListener("click", () => {
    closeInfo(); openProject(+c.dataset.idx);
  }));
}
function renderInfoFull() {
  state.infoSection = "full";
  $("#infoInner").innerHTML = ["about", "work", "skills", "path", "contact"].map(sectionHTML).join("");
  bindInfoCards();
  $("#info").classList.add("show");
  $("#info .box").scrollTop = 0;
  Snd.duck(true); Snd.ui(true);
}
function renderInfoSection(sec) {
  state.infoSection = sec;
  $("#infoInner").innerHTML = sectionHTML(sec);
  bindInfoCards();
  $("#info").classList.add("show");
  $("#info .box").scrollTop = 0;
  Snd.duck(true); Snd.ui(true);
}
function closeInfo() {
  state.infoSection = null; $("#info").classList.remove("show");
  Snd.duck(state.activeProject != null); Snd.ui(false);
}
$("#infoBtn").addEventListener("click", renderInfoFull);
$("#infoClose").addEventListener("click", closeInfo);
$("#info").addEventListener("click", e => { if (e.target.id === "info") closeInfo(); });

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg, ms = 1600) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), ms);
}

/* ---------- proximity prompt ---------- */
function refreshPrompt() {
  const el = $("#prompt");
  if (state.near && state.activeProject == null && !state.infoSection) {
    $("#promptT").textContent = L(state.near.meta.name);
    const m = state.near.meta;
    $("#promptL").textContent = L(m.loreDone && state.mmSolved ? m.loreDone : m.lore);
    /* The pier stays visible from the start but does not open until the last
       golden fish is in: a locked door you can see is a reason to keep
       looking, and a counter on it says exactly how much looking is left. */
    if (m.kind === "fishing" && state.fish < state.fishTotal) {
      $("#promptL").textContent = state.lang === "es"
        ? `Cerrado. El viejo del muelle solo presta la barca a quien haya encontrado los doce peces dorados. Llevas ${state.fish} de ${state.fishTotal}.`
        : `Closed. The old man at the pier only lends the boat to whoever has found all twelve golden fish. You have ${state.fish} of ${state.fishTotal}.`;
    }
    $("#promptO").textContent = state.near.meta.key === "mastermind"
      ? TXT().promptO + (state.lang === "es" ? "  ·  G para jugar" : "  ·  G to play")
      : m.kind === "fishing" && state.fish < state.fishTotal
        ? (state.lang === "es" ? `faltan ${state.fishTotal - state.fish} peces` : `${state.fishTotal - state.fish} fish to go`)
        : m.kind === "ride"
          ? (state.lang === "es" ? "pulsa E para subir" : "press E to ride")
          : TXT().promptO;
    el.querySelector(".k").textContent = TXT().promptK;
    el.style.borderColor = state.near.meta.color;
    el.classList.add("show");
  } else el.classList.remove("show");
}
function setNear(z) { if (z !== state.near) { state.near = z; refreshPrompt(); } }
function interact() {
  if (!state.near || state.activeProject != null) return;
  const m = state.near.meta;
  if (m.kind === "project") openProject(m.idx);
  else if (m.kind === "section") renderInfoSection(m.section);
  else if (m.kind === "arcade") Arc.open(m.game);
  else if (m.kind === "mm") mmOpen();
  else if (m.kind === "fishing") {
    if (state.fish < state.fishTotal)
      toast(state.lang === "es"
        ? `El muelle está cerrado — ${state.fishTotal - state.fish} peces dorados por encontrar`
        : `The pier is closed — ${state.fishTotal - state.fish} golden fish still out there`, 2400);
    else Arc.open("fishing");
  }
  else if (m.kind === "ride" && game) game.boardCoaster();
}

/* ---------- input ---------- */
const KEYS = {};
addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  /* the minigame owns the keyboard while it is up, so the cat does not
     wander off behind the overlay */
  if (state.minigame) { KEYS[k] = false; return; }
  KEYS[k] = true;
  if (k === "escape") { if (state.activeProject != null) closeProject(); else closeInfo(); }
  if (k === "e") interact();
  if (k === "g") tryOpenMinigame();
  if (k === "h") Snd.meow();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
});
addEventListener("keyup", e => { KEYS[e.key.toLowerCase()] = false; });
$$("#touch .tbtn").forEach(btn => {
  const k = btn.dataset.k;
  const down = e => {
    e.preventDefault();
    if (k === "e") interact();
    else if (k === "h") Snd.meow();
    else if (k === "g") tryOpenMinigame();
    else if (k === "r") { if (game) game.reset(); }
    else KEYS[k] = true;
  };
  const up = e => { e.preventDefault(); if (!["e", "h", "g", "r"].includes(k)) KEYS[k] = false; };
  btn.addEventListener("touchstart", down, { passive: false });
  btn.addEventListener("touchend", up, { passive: false });
  btn.addEventListener("mousedown", down);
  btn.addEventListener("mouseup", up);
  btn.addEventListener("mouseleave", up);
});


/* ============================================================
   SOUND — everything is synthesised at runtime with Web Audio.
   No audio files: the page has to stay a single self-contained
   HTML, so the music is generated by a step sequencer and the
   effects are built from oscillators and noise buffers.
   ============================================================ */
const Snd = {
  ctx: null, master: null, musicBus: null, sfxBus: null, revSend: null,
  on: true, started: false, noiseBuf: null,
  zone: "default", zoneGoal: "default",
  bar: 0, step: 0, nextTime: 0, timer: null, duckT: 0,

  /* --- setup ------------------------------------------------ */
  init() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = this.ctx = new AC();

    /* master -> soft limiter -> out, so stacked voices never clip */
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 22;
    comp.ratio.value = 5; comp.attack.value = .004; comp.release.value = .22;
    this.master = ctx.createGain();
    this.master.gain.value = this.on ? .9 : 0;
    this.master.connect(comp); comp.connect(ctx.destination);

    /* a generated impulse response gives everything a shared space */
    const rev = ctx.createConvolver();
    rev.buffer = this.impulse(2.6, 2.4);
    const revGain = ctx.createGain(); revGain.gain.value = .9;
    rev.connect(revGain); revGain.connect(this.master);
    this.revSend = rev;

    this.musicBus = ctx.createGain(); this.musicBus.gain.value = .34;
    this.sfxBus = ctx.createGain(); this.sfxBus.gain.value = .85;
    this.musicBus.connect(this.master); this.sfxBus.connect(this.master);

    this.noiseBuf = this.noise(2);
    this.buildAmbience();
    return ctx;
  },

  impulse(sec, decay) {
    const ctx = this.ctx, len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  },
  noise(sec) {
    const ctx = this.ctx, len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {          // brown-ish: softer than white
      const w = Math.random() * 2 - 1;
      last = (last + .02 * w) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  },

  /* --- constant sea + wind bed ------------------------------ */
  buildAmbience() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf; src.loop = true;

    const sea = ctx.createBiquadFilter();
    sea.type = "lowpass"; sea.frequency.value = 420; sea.Q.value = .6;
    const seaGain = ctx.createGain(); seaGain.gain.value = .09;

    /* slow swell so the surf breathes instead of hissing flatly */
    const lfo = ctx.createOscillator(); lfo.frequency.value = .07;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = .045;
    lfo.connect(lfoAmt); lfoAmt.connect(seaGain.gain); lfo.start();

    const wind = ctx.createBiquadFilter();
    wind.type = "bandpass"; wind.frequency.value = 1250; wind.Q.value = .8;
    const windGain = ctx.createGain(); windGain.gain.value = .022;
    const lfo2 = ctx.createOscillator(); lfo2.frequency.value = .043;
    const lfo2Amt = ctx.createGain(); lfo2Amt.gain.value = .016;
    lfo2.connect(lfo2Amt); lfo2Amt.connect(windGain.gain); lfo2.start();

    src.connect(sea); sea.connect(seaGain); seaGain.connect(this.master);
    src.connect(wind); wind.connect(windGain); windGain.connect(this.master);
    src.start();
    this.ambience = { seaGain, windGain };
  },

  /* --- voices ----------------------------------------------- */
  env(node, t, a, d, peak) {
    const g = node.gain;
    g.setValueAtTime(1e-4, t);
    g.exponentialRampToValueAtTime(Math.max(1e-4, peak), t + a);
    g.exponentialRampToValueAtTime(1e-4, t + a + d);
  },
  mtof: m => 440 * Math.pow(2, (m - 69) / 12),

  /* soft sustained chord voice */
  pad(notes, t, dur, wave = "sawtooth", cut = 900) {
    const ctx = this.ctx;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass"; filt.frequency.value = cut; filt.Q.value = .8;
    const g = ctx.createGain(); g.gain.value = 0;
    filt.connect(g); g.connect(this.musicBus);
    const send = ctx.createGain(); send.gain.value = .3;
    g.connect(send); send.connect(this.revSend);

    for (const n of notes) for (const det of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = wave;
      o.frequency.value = this.mtof(n);
      o.detune.value = det;
      o.connect(filt);
      o.start(t); o.stop(t + dur + .6);
    }
    g.gain.setValueAtTime(1e-4, t);
    g.gain.linearRampToValueAtTime(.055, t + dur * .35);
    g.gain.linearRampToValueAtTime(1e-4, t + dur + .5);
  },

  pluck(note, t, dur = .5, wave = "triangle", vol = .1) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = wave;
    o.frequency.value = this.mtof(note);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(4200, t);
    f.frequency.exponentialRampToValueAtTime(700, t + dur);
    const g = ctx.createGain();
    o.connect(f); f.connect(g); g.connect(this.musicBus);
    const send = ctx.createGain(); send.gain.value = .35;
    g.connect(send); send.connect(this.revSend);
    this.env(g, t, .008, dur, vol);
    o.start(t); o.stop(t + dur + .1);
  },

  bass(note, t, dur = .7) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.value = this.mtof(note);
    const g = ctx.createGain();
    o.connect(g); g.connect(this.musicBus);
    this.env(g, t, .02, dur, .16);
    o.start(t); o.stop(t + dur + .1);
  },

  tick(t, vol = .03) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    s.playbackRate.value = 2.4;
    const f = ctx.createBiquadFilter();
    f.type = "highpass"; f.frequency.value = 5200;
    const g = ctx.createGain();
    s.connect(f); f.connect(g); g.connect(this.musicBus);
    this.env(g, t, .003, .05, vol);
    s.start(t); s.stop(t + .09);
  },

  /* --- musical palettes, one per temple --------------------- */
  PALETTE: {
    default:  { root: 0,  wave: "triangle", cut: 1000, arp: [0, 3, 7, 10], density: .55, tickVol: .022 },
    about:    { root: 0,  wave: "triangle", cut: 1100, arp: [0, 4, 7, 9],  density: .5,  tickVol: .018 },
    tfg:      { root: 2,  wave: "sine",     cut: 1500, arp: [0, 3, 7, 12], density: .75, tickVol: .02 },
    triniglass:{ root: -2, wave: "sawtooth", cut: 780,  arp: [0, 5, 7, 10], density: .8,  tickVol: .05 },
    mastermind:{ root: 1,  wave: "sine",     cut: 1700, arp: [0, 3, 6, 10], density: .45, tickVol: .014 },
    gamedev:  { root: 4,  wave: "square",   cut: 2200, arp: [0, 4, 7, 12], density: .95, tickVol: .04 },
    skills:   { root: -5, wave: "sawtooth", cut: 620,  arp: [0, 3, 5, 7],  density: .7,  tickVol: .045 },
    path:     { root: 3,  wave: "triangle", cut: 1300, arp: [0, 4, 9, 12], density: .6,  tickVol: .025 },
    contact:  { root: -3, wave: "sine",     cut: 900,  arp: [0, 7, 12, 16], density: .35, tickVol: .012 }
  },
  CHORDS: [
    { pad: [57, 60, 64], bass: 45 },   // Am
    { pad: [53, 57, 60], bass: 41 },   // F
    { pad: [52, 55, 60], bass: 40 },   // C/E
    { pad: [55, 59, 62], bass: 43 }    // G
  ],

  setZone(key) { this.zoneGoal = key || "default"; },

  /* --- sequencer -------------------------------------------- */
  startMusic() {
    if (!this.ctx || this.timer) return;
    this.nextTime = this.ctx.currentTime + .12;
    this.step = 0; this.bar = 0;
    this.timer = setInterval(() => this.schedule(), 28);
  },
  schedule() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;
    const stepDur = 60 / 76 / 4;                 // 16ths at 76bpm
    while (this.nextTime < ctx.currentTime + .18) {
      this.play(this.step, this.nextTime, stepDur);
      this.nextTime += stepDur;
      this.step++;
      if (this.step % 16 === 0) {
        this.bar++;
        this.zone = this.zoneGoal;               // switch palette on the bar
      }
    }
  },
  play(step, t, stepDur) {
    const p = this.PALETTE[this.zone] || this.PALETTE.default;
    const s = step % 16;
    const chord = this.CHORDS[this.bar % this.CHORDS.length];

    if (s === 0) {
      this.pad(chord.pad.map(n => n + p.root), t, stepDur * 15, "sawtooth", p.cut);
      this.bass(chord.bass + p.root, t, stepDur * 6);
    }
    if (s === 8) this.bass(chord.bass + p.root + 12, t, stepDur * 3);

    /* arpeggio rides on the current chord, thinned by the palette density */
    if (s % 2 === 0 && Math.random() < p.density) {
      const deg = p.arp[(s / 2) % p.arp.length];
      const oct = (s >= 8 ? 12 : 0);
      this.pluck(chord.bass + 24 + p.root + deg + oct, t, .55, p.wave, .085);
    }
    if (p.tickVol > .001 && (s === 4 || s === 12)) this.tick(t, p.tickVol);
    if (s === 14 && this.bar % 4 === 3)
      this.pluck(chord.pad[2] + p.root + 12, t, 1.4, "sine", .07);
  },

  /* --- lifecycle -------------------------------------------- */
  begin() {
    const ctx = this.init();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    if (!this.started) { this.started = true; this.startMusic(); }
  },
  setOn(v) {
    this.on = v;
    try { localStorage.setItem("rja_audio", v ? "1" : "0"); } catch { }
    if (!this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(v ? .9 : 0, t, .08);
  },
  /* pull the music down while an overlay is open so text reads quietly */
  duck(v) {
    if (!this.musicBus) return;
    this.musicBus.gain.setTargetAtTime(v ? .12 : .34, this.ctx.currentTime, .12);
  },

  /* --- effects ---------------------------------------------- */
  blip(freq, dur = .09, type = "square", vol = .07, slideTo = null) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = ctx.createGain();
    o.connect(g); g.connect(this.sfxBus);
    this.env(g, t, .006, dur, vol);
    o.start(t); o.stop(t + dur + .05);
  },

  step_(fast) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    s.playbackRate.value = 1.4 + Math.random() * .5;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 520 + Math.random() * 380;
    f.Q.value = 1.4;
    const g = ctx.createGain();
    s.connect(f); f.connect(g); g.connect(this.sfxBus);
    this.env(g, t, .004, fast ? .05 : .075, fast ? .05 : .035);
    s.start(t); s.stop(t + .14);
  },

  jump(dbl) {
    if (!this.ctx || !this.on) return;
    this.blip(dbl ? 560 : 380, .14, "sine", .09, dbl ? 1150 : 760);
    if (dbl) [1200, 1500, 1800].forEach((f, i) =>
      setTimeout(() => this.blip(f, .06, "triangle", .05), 40 + i * 45));
  },

  land(hard) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(210, t);
    o.frequency.exponentialRampToValueAtTime(58, t + .16);
    const g = ctx.createGain();
    o.connect(g); g.connect(this.sfxBus);
    this.env(g, t, .005, .17, hard ? .16 : .07);
    o.start(t); o.stop(t + .24);
    const s = ctx.createBufferSource(); s.buffer = this.noiseBuf;
    s.playbackRate.value = .8;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900;
    const ng = ctx.createGain();
    s.connect(f); f.connect(ng); ng.connect(this.sfxBus);
    this.env(ng, t, .004, .12, hard ? .09 : .04);
    s.start(t); s.stop(t + .2);
  },

  /* rising run that climbs a little with every fish collected */
  pickup(n) {
    if (!this.ctx || !this.on) return;
    const base = 72 + Math.min(11, n);
    [0, 4, 7].forEach((d, i) => setTimeout(() =>
      this.blip(this.mtof(base + d), .13, "triangle", .09), i * 62));
  },

  chime() {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t0 = ctx.currentTime;
    [64, 68, 71, 76].forEach((n, i) => {
      const t = t0 + i * .1;
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.value = this.mtof(n);
      const g = ctx.createGain();
      o.connect(g); g.connect(this.sfxBus);
      const send = ctx.createGain(); send.gain.value = .6;
      g.connect(send); send.connect(this.revSend);
      this.env(g, t, .01, 1.1, .1);
      o.start(t); o.stop(t + 1.3);
    });
  },

  fanfare() {
    if (!this.ctx || !this.on) return;
    [72, 76, 79, 84, 88].forEach((n, i) => setTimeout(() =>
      this.blip(this.mtof(n), .3, "triangle", .1), i * 110));
  },

  deny() {
    if (!this.ctx || !this.on) return;
    this.blip(200, .12, "square", .06);
    setTimeout(() => this.blip(150, .18, "square", .06), 110);
  },

  ui(open) {
    this.blip(open ? 760 : 520, .06, "sine", .05, open ? 980 : 400);
  },

  /* two band-passed formants over a saw give a much more cat-like meow
     than the single filtered oscillator this used to be */
  meow() {
    const ctx = this.init();
    if (!ctx || !this.on) { toast(TXT().toastHonk); return; }
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(300, t);
    o.frequency.linearRampToValueAtTime(560, t + .13);
    o.frequency.linearRampToValueAtTime(430, t + .34);
    o.frequency.linearRampToValueAtTime(300, t + .52);

    const vib = ctx.createOscillator(); vib.frequency.value = 22;
    const vibAmt = ctx.createGain(); vibAmt.gain.value = 11;
    vib.connect(vibAmt); vibAmt.connect(o.frequency); vib.start(t); vib.stop(t + .6);

    const out = ctx.createGain();
    this.env(out, t, .05, .5, .18);
    out.connect(this.sfxBus);
    const send = ctx.createGain(); send.gain.value = .25;
    out.connect(send); send.connect(this.revSend);

    /* vowel formants sweeping from "ee" to "ow" */
    [[900, 1700], [1300, 900]].forEach(([f0, f1], i) => {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass"; bp.Q.value = 7;
      bp.frequency.setValueAtTime(f0, t);
      bp.frequency.linearRampToValueAtTime(f1, t + .5);
      const g = ctx.createGain(); g.gain.value = i ? .5 : 1;
      o.connect(bp); bp.connect(g); g.connect(out);
    });
    o.start(t); o.stop(t + .58);
    toast(TXT().toastHonk);
  }
};

try { Snd.on = localStorage.getItem("rja_audio") !== "0"; } catch { }

function refreshAudioBtn() {
  const b = $("#audioBtn");
  if (b) { b.textContent = Snd.on ? "♪" : "🔇"; b.style.color = Snd.on ? "" : "var(--faint)"; }
}
$("#audioBtn").addEventListener("click", () => {
  Snd.begin();
  Snd.setOn(!Snd.on);
  refreshAudioBtn();
});
refreshAudioBtn();


/* ============================================================
   MINIGAME — Mastermind, playable inside the Ruins of the Riddle.
   Raúl shipped a Mastermind implementation, so the temple that
   represents it now actually plays it: crack the four-colour code
   the altar has been shuffling, and the orbs lock to your answer.
   Every colour carries a glyph as well as a hue so the board is
   readable without relying on colour alone.
   ============================================================ */
const MM_COLORS = [
  { hex: "#7fdca8", int: 0x7fdca8, glyph: "●", key: "1" },
  { hex: "#e8b06a", int: 0xe8b06a, glyph: "▲", key: "2" },
  { hex: "#f2a2c4", int: 0xf2a2c4, glyph: "◆", key: "3" },
  { hex: "#8fb0ff", int: 0x8fb0ff, glyph: "■", key: "4" },
  { hex: "#f07a6a", int: 0xf07a6a, glyph: "★", key: "5" },
  { hex: "#ffd76a", int: 0xffd76a, glyph: "✚", key: "6" }
];
const MM_LEN = 4, MM_TRIES = 10;

const MM_TXT = {
  es: {
    kicker: "Ruinas del Enigma · minijuego",
    title: "El código ancestral",
    hint: `Cuatro orbes guardan un código de ${MM_LEN} colores (pueden repetirse). Tienes ${MM_TRIES} intentos. Tras cada intento: <b style="color:#7fdca8">●</b> acierto en su sitio, <b>○</b> color correcto en otra posición.`,
    check: "Comprobar", clear: "Borrar", close: "Salir",
    left: n => `${n} intento${n === 1 ? "" : "s"}`,
    winT: "🏛 Código descifrado",
    winB: n => `Lo has roto en ${n} intento${n === 1 ? "" : "s"}. Los orbes del altar se han fijado a tu solución — el enigma es tuyo.`,
    loseT: "El enigma resiste",
    loseB: "Se acabaron los intentos. Este era el código. Pulsa Reintentar para otra ronda.",
    retry: "Reintentar",
    toastOpen: "Descifra el código de los orbes",
    needZone: "Acércate a las Ruinas del Enigma para jugar"
  },
  en: {
    kicker: "Ruins of the Riddle · minigame",
    title: "The ancient code",
    hint: `Four orbs guard a ${MM_LEN}-colour code (repeats allowed). You get ${MM_TRIES} tries. After each guess: <b style="color:#7fdca8">●</b> right colour in the right place, <b>○</b> right colour, wrong place.`,
    check: "Check", clear: "Clear", close: "Leave",
    left: n => `${n} tr${n === 1 ? "y" : "ies"} left`,
    winT: "🏛 Code cracked",
    winB: n => `Broken in ${n} guess${n === 1 ? "" : "es"}. The altar orbs have locked to your answer — the riddle is yours.`,
    loseT: "The riddle holds",
    loseB: "Out of tries. That was the code. Hit Retry for another round.",
    retry: "Retry",
    toastOpen: "Crack the orb code",
    needZone: "Get to the Ruins of the Riddle to play"
  }
};
const MT = () => MM_TXT[state.lang];

const MM = { code: [], guesses: [], cur: [], over: false, won: false };

function mmNewGame() {
  MM.code = Array.from({ length: MM_LEN }, () => Math.floor(Math.random() * MM_COLORS.length));
  MM.guesses = []; MM.cur = []; MM.over = false; MM.won = false;
}

/* classic scoring: exact matches first, then colours that exist elsewhere */
function mmScore(guess, code) {
  const used = new Array(MM_LEN).fill(false);
  const taken = new Array(MM_LEN).fill(false);
  let hit = 0, near = 0;
  for (let i = 0; i < MM_LEN; i++)
    if (guess[i] === code[i]) { hit++; used[i] = true; taken[i] = true; }
  for (let i = 0; i < MM_LEN; i++) {
    if (used[i]) continue;
    for (let j = 0; j < MM_LEN; j++) {
      if (taken[j] || guess[i] !== code[j]) continue;
      taken[j] = true; near++; break;
    }
  }
  return { hit, near };
}

function mmSlot(ci, extra = "") {
  if (ci == null) return `<div class="slot empty${extra}">·</div>`;
  const c = MM_COLORS[ci];
  return `<div class="slot${extra}" style="background:${c.hex}">${c.glyph}</div>`;
}

function mmRender() {
  const t = MT();
  const rows = [];
  MM.guesses.forEach((g, i) => {
    const pegs = [];
    for (let k = 0; k < MM_LEN; k++)
      pegs.push(`<div class="peg ${k < g.hit ? "hit" : k < g.hit + g.near ? "near" : ""}"></div>`);
    rows.push(`<div class="row"><span class="n">${i + 1}</span>
      <div class="slots">${g.guess.map(c => mmSlot(c)).join("")}</div>
      <div class="pegs">${pegs.join("")}</div></div>`);
  });
  if (!MM.over) {
    const slots = [];
    for (let i = 0; i < MM_LEN; i++) slots.push(mmSlot(MM.cur[i] ?? null));
    rows.push(`<div class="row live"><span class="n">${MM.guesses.length + 1}</span>
      <div class="slots" id="mmLive">${slots.join("")}</div>
      <div class="pegs"></div></div>`);
  }
  $("#mmRows").innerHTML = rows.join("");

  /* clicking a filled slot in the active row clears it again */
  const live = $("#mmLive");
  if (live) Array.from(live.children).forEach((el, i) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      if (MM.cur[i] == null) return;
      MM.cur.splice(i, 1);
      Snd.blip(320, .05, "sine", .05);
      mmRender();
    });
  });

  $("#mmPalette").innerHTML = MM_COLORS.map((c, i) =>
    `<button class="pick" data-i="${i}" style="background:${c.hex}"
       aria-label="${c.glyph}">${c.glyph}<i>${c.key}</i></button>`).join("");
  $$("#mmPalette .pick").forEach(b =>
    b.addEventListener("click", () => mmPick(+b.dataset.i)));

  $("#mmCheck").textContent = t.check;
  $("#mmClear").textContent = t.clear;
  $("#mmClose").textContent = t.close;
  $("#mmCheck").disabled = MM.over || MM.cur.length < MM_LEN;
  $("#mmClear").style.display = MM.over ? "none" : "";
  $("#mmCheck").style.display = MM.over ? "none" : "";
  $("#mmStatus").textContent = MM.over ? "" : t.left(MM_TRIES - MM.guesses.length);

  const done = $("#mmDone");
  if (MM.over) {
    done.classList.add("show");
    $("#mmDoneT").textContent = MM.won ? t.winT : t.loseT;
    $("#mmDoneT").style.color = MM.won ? "var(--green)" : "var(--amber)";
    $("#mmDoneB").innerHTML = MM.won
      ? t.winB(MM.guesses.length)
      : `${t.loseB}<div class="slots" style="margin-top:12px">${MM.code.map(c => mmSlot(c)).join("")}</div>`;
    if (!$("#mmRetry")) {
      const b = document.createElement("button");
      b.id = "mmRetry"; b.className = "btn primary"; b.style.marginTop = "14px";
      b.addEventListener("click", () => { mmNewGame(); Snd.ui(true); mmRender(); });
      done.appendChild(b);
    }
    $("#mmRetry").textContent = t.retry;
    $("#mmRetry").style.display = MM.won ? "none" : "";
    requestAnimationFrame(() => done.scrollIntoView({ block: "nearest" }));
  } else {
    done.classList.remove("show");
  }
}

function mmPick(i) {
  if (MM.over || MM.cur.length >= MM_LEN) return;
  MM.cur.push(i);
  Snd.blip(Snd.mtof(67 + i * 2), .08, "triangle", .07);
  mmRender();
}

function mmCheckGuess() {
  if (MM.over || MM.cur.length < MM_LEN) return;
  const guess = MM.cur.slice();
  const { hit, near } = mmScore(guess, MM.code);
  MM.guesses.push({ guess, hit, near });
  MM.cur = [];
  if (hit === MM_LEN) {
    MM.over = true; MM.won = true;
    state.mmSolved = true;
    Snd.fanfare();
    if (game) {
      game.lockRuneOrbs(MM.code.map(i => MM_COLORS[i].int));
      /* the riddle is only in the cave now, so celebrate wherever the cat is
         standing rather than at a temple that no longer exists */
      const p = game.catBody.position;
      game.confetti(p.x, p.y + 2, p.z, 70);
    }
    toast(MT().winT, 3200);
  } else if (MM.guesses.length >= MM_TRIES) {
    MM.over = true; MM.won = false;
    Snd.deny();
  } else {
    Snd.blip(hit ? 620 + hit * 90 : 300, .12, "sine", .07);
  }
  mmRender();
}

function mmOpen() {
  Snd.begin();
  if (!MM.code.length || MM.over && MM.won) mmNewGame();
  state.minigame = true;
  const t = MT();
  $("#mmKicker").textContent = t.kicker;
  $("#mmTitle").textContent = t.title;
  $("#mmHint").innerHTML = t.hint;
  mmRender();
  $("#mm").classList.add("show");
  Snd.duck(true);
  Snd.ui(true);
}
function mmClose() {
  state.minigame = false;
  $("#mm").classList.remove("show");
  Snd.duck(!!(state.activeProject != null || state.infoSection));
  Snd.ui(false);
}

$("#mmCheck").addEventListener("click", mmCheckGuess);
$("#mmClear").addEventListener("click", () => { MM.cur = []; Snd.blip(300, .06, "sine", .05); mmRender(); });
$("#mmClose").addEventListener("click", mmClose);
$("#mm").addEventListener("click", e => { if (e.target.id === "mm") mmClose(); });
$("#mPlay").addEventListener("click", () => { closeProject(); mmOpen(); });

/* keyboard: 1-6 pick a colour, Backspace undoes, Enter checks */
addEventListener("keydown", e => {
  if (!state.minigame) return;
  const k = e.key;
  if (k === "Escape") { mmClose(); return; }
  if (k === "Enter") { mmCheckGuess(); return; }
  if (k === "Backspace") {
    e.preventDefault();
    if (!MM.over && MM.cur.length) { MM.cur.pop(); Snd.blip(320, .05, "sine", .05); mmRender(); }
    return;
  }
  const n = MM_COLORS.findIndex(c => c.key === k);
  if (n >= 0) mmPick(n);
});

/* G opens the game from inside the ruins */
function tryOpenMinigame() {
  if (state.minigame) return;
  if (state.near && state.near.meta.key === "mastermind") mmOpen();
  else toast(MT().needZone, 1800);
}


/* ============================================================
   ARCADE — the cave under the island holds a handful of small
   games. They all share one 2D canvas, one loop and one score
   panel; a game only has to provide reset/update/draw/key, so
   adding another is a few dozen lines.
   ============================================================ */
const AW = 480, AH = 330;                       // logical canvas size

const ARC_TXT = {
  es: { kicker: "Cueva de Cristal · arcade", start: "Empezar", again: "Otra vez",
        close: "Salir", score: "puntos", best: "récord",
        ready: "¿Listo?", over: "Fin de la partida",
        readyB: "Pulsa Empezar o Espacio", overB: n => `Has hecho ${n} puntos. Espacio para reintentar.`,
        newBest: n => `¡Récord nuevo: ${n}!` },
  en: { kicker: "Crystal Cave · arcade", start: "Start", again: "Again",
        close: "Leave", score: "score", best: "best",
        ready: "Ready?", over: "Game over",
        readyB: "Hit Start or Space", overB: n => `You scored ${n}. Space to try again.`,
        newBest: n => `New best: ${n}!` }
};
const AT = () => ARC_TXT[state.lang];

/* ---------- tiny drawing helpers ---------- */
function arcText(g, s, x, y, size = 12, col = "#ecebe8", align = "left") {
  g.font = `700 ${size}px "JetBrains Mono", monospace`;
  g.textAlign = align; g.textBaseline = "middle";
  g.fillStyle = col;
  g.fillText(s, x, y);
}

/* ============================================================
   1 · PONG — beat the machine to 7
   ============================================================ */
const GAME_PONG = {
  id: "pong", color: "#7ce8e0",
  name: { es: "Pong del Sótano", en: "Basement Pong" },
  hint: { es: "Mueve la pala con W/S o las flechas. Primero a 7 gana. La máquina lleva décadas practicando.",
          en: "Move your paddle with W/S or the arrows. First to 7 wins. The machine has been practising for decades." },
  reset() {
    this.p1 = AH / 2; this.p2 = AH / 2; this.s1 = 0; this.s2 = 0;
    this.serve(1);
  },
  serve(dir) {
    this.bx = AW / 2; this.by = AH / 2;
    this.vx = 190 * dir; this.vy = (Math.random() * 2 - 1) * 130;
    this.wait = .7;
  },
  update(dt, keys) {
    const sp = 260;
    if (keys.up) this.p1 -= sp * dt;
    if (keys.down) this.p1 += sp * dt;
    this.p1 = Math.max(32, Math.min(AH - 32, this.p1));

    /* the AI leads the ball but is deliberately a touch late */
    const target = this.vx > 0 ? this.by : AH / 2;
    this.p2 += Math.max(-215 * dt, Math.min(215 * dt, target - this.p2));
    this.p2 = Math.max(32, Math.min(AH - 32, this.p2));

    if (this.wait > 0) { this.wait -= dt; return; }
    this.bx += this.vx * dt; this.by += this.vy * dt;
    if (this.by < 8) { this.by = 8; this.vy = Math.abs(this.vy); }
    if (this.by > AH - 8) { this.by = AH - 8; this.vy = -Math.abs(this.vy); }

    const hit = (px, py) => Math.abs(this.by - py) < 34;
    if (this.vx < 0 && this.bx < 30 && this.bx > 18) {
      if (hit(24, this.p1)) {
        this.vx = Math.abs(this.vx) * 1.06;
        this.vy += (this.by - this.p1) * 3.4;
        Snd.blip(560, .05, "square", .05);
      }
    }
    if (this.vx > 0 && this.bx > AW - 30 && this.bx < AW - 18) {
      if (hit(AW - 24, this.p2)) {
        this.vx = -Math.abs(this.vx) * 1.06;
        this.vy += (this.by - this.p2) * 3.4;
        Snd.blip(440, .05, "square", .05);
      }
    }
    this.vy = Math.max(-300, Math.min(300, this.vy));

    if (this.bx < 0) { this.s2++; Snd.deny(); this.serve(1); }
    if (this.bx > AW) { this.s1++; Snd.blip(880, .12, "triangle", .07); this.serve(-1); }

    if (this.s1 >= 7 || this.s2 >= 7) return { over: true, score: this.s1 * 10 };
  },
  draw(g) {
    g.fillStyle = "#07070b"; g.fillRect(0, 0, AW, AH);
    g.strokeStyle = "#1e2a33"; g.setLineDash([6, 8]); g.lineWidth = 2;
    g.beginPath(); g.moveTo(AW / 2, 0); g.lineTo(AW / 2, AH); g.stroke(); g.setLineDash([]);
    g.fillStyle = "#7ce8e0"; g.fillRect(18, this.p1 - 32, 6, 64);
    g.fillStyle = "#f2a2c4"; g.fillRect(AW - 24, this.p2 - 32, 6, 64);
    g.fillStyle = "#ecebe8"; g.fillRect(this.bx - 4, this.by - 4, 8, 8);
    arcText(g, this.s1, AW / 2 - 40, 30, 26, "#7ce8e0", "right");
    arcText(g, this.s2, AW / 2 + 40, 30, 26, "#f2a2c4", "left");
  }
};

/* ============================================================
   2 · SNAKE — the cat chasing golden fish
   ============================================================ */
const GAME_SNAKE = {
  id: "snake", color: "#ffd76a",
  name: { es: "El Gato Glotón", en: "The Greedy Cat" },
  hint: { es: "Dirige al gato con WASD o las flechas y cómete los peces. Chocar contigo mismo acaba la partida.",
          en: "Steer the cat with WASD or the arrows and eat the fish. Hitting yourself ends the run." },
  CELL: 15,
  reset() {
    this.cols = Math.floor(AW / this.CELL); this.rows = Math.floor(AH / this.CELL);
    this.body = [{ x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }];
    this.dir = { x: 1, y: 0 }; this.next = { x: 1, y: 0 };
    this.acc = 0; this.rate = .14; this.score = 0;
    this.dropFish();
  },
  dropFish() {
    let x, y, tries = 0;
    do { x = Math.floor(Math.random() * this.cols); y = Math.floor(Math.random() * this.rows); tries++; }
    while (tries < 200 && this.body.some(b => b.x === x && b.y === y));
    this.fish = { x, y };
  },
  key(k) {
    const d = this.dir;
    if ((k === "up") && d.y === 0) this.next = { x: 0, y: -1 };
    if ((k === "down") && d.y === 0) this.next = { x: 0, y: 1 };
    if ((k === "left") && d.x === 0) this.next = { x: -1, y: 0 };
    if ((k === "right") && d.x === 0) this.next = { x: 1, y: 0 };
  },
  update(dt) {
    this.acc += dt;
    if (this.acc < this.rate) return;
    this.acc = 0;
    this.dir = this.next;
    const head = { x: this.body[0].x + this.dir.x, y: this.body[0].y + this.dir.y };
    /* walls wrap — losing to a wall you cannot see is not fun */
    head.x = (head.x + this.cols) % this.cols;
    head.y = (head.y + this.rows) % this.rows;
    if (this.body.some(b => b.x === head.x && b.y === head.y)) {
      Snd.deny();
      return { over: true, score: this.score };
    }
    this.body.unshift(head);
    if (head.x === this.fish.x && head.y === this.fish.y) {
      this.score += 10;
      this.rate = Math.max(.06, this.rate * .97);
      Snd.pickup(Math.min(11, this.score / 10));
      this.dropFish();
    } else this.body.pop();
  },
  draw(g) {
    const C = this.CELL;
    g.fillStyle = "#07070b"; g.fillRect(0, 0, AW, AH);
    g.strokeStyle = "#12121a"; g.lineWidth = 1;
    for (let x = 0; x <= this.cols; x++) { g.beginPath(); g.moveTo(x * C, 0); g.lineTo(x * C, this.rows * C); g.stroke(); }
    for (let y = 0; y <= this.rows; y++) { g.beginPath(); g.moveTo(0, y * C); g.lineTo(this.cols * C, y * C); g.stroke(); }
    g.fillStyle = "#ffd76a";
    g.fillRect(this.fish.x * C + 3, this.fish.y * C + 4, C - 6, C - 8);
    this.body.forEach((b, i) => {
      g.fillStyle = i === 0 ? "#f5e6cc" : (i % 2 ? "#b5652a" : "#e08840");
      g.fillRect(b.x * C + 1, b.y * C + 1, C - 2, C - 2);
    });
    arcText(g, this.score, 10, 16, 14, "#ffd76a");
  }
};

/* ============================================================
   3 · SIMON — repeat what the runes chant
   ============================================================ */
const GAME_RUNES = {
  id: "runes", color: "#f2a2c4",
  name: { es: "Las Runas Cantoras", en: "The Singing Runes" },
  hint: { es: "Mira la secuencia y repítela con las teclas 1-4 o haciendo clic. Cada ronda añade una runa más.",
          en: "Watch the sequence and repeat it with keys 1-4 or by clicking. Every round adds one more rune." },
  PADS: [
    { col: "#7fdca8", lit: "#c9f5de", note: 64 },
    { col: "#e8b06a", lit: "#f7ddb8", note: 67 },
    { col: "#8fb0ff", lit: "#cddcff", note: 71 },
    { col: "#f07a6a", lit: "#f9c3ba", note: 76 }
  ],
  reset() {
    this.seq = []; this.step = 0; this.score = 0;
    this.mode = "show"; this.timer = .6; this.showIdx = -1; this.flash = -1;
    this.addStep();
  },
  addStep() {
    this.seq.push(Math.floor(Math.random() * 4));
    this.mode = "show"; this.showIdx = -1; this.timer = .5; this.step = 0;
  },
  padAt(i) {
    const w = AW / 2 - 24, h = AH / 2 - 30;
    return { x: 16 + (i % 2) * (w + 16), y: 40 + Math.floor(i / 2) * (h + 12), w, h };
  },
  key(k) {
    const n = "1234".indexOf(k);
    if (n >= 0) this.press(n);
  },
  click(mx, my) {
    for (let i = 0; i < 4; i++) {
      const p = this.padAt(i);
      if (mx >= p.x && mx <= p.x + p.w && my >= p.y && my <= p.y + p.h) return this.press(i);
    }
  },
  press(n) {
    if (this.mode !== "input") return;
    this.flash = n; this.flashT = .18;
    Snd.blip(Snd.mtof(this.PADS[n].note), .18, "triangle", .09);
    if (this.seq[this.step] !== n) { this.mode = "dead"; Snd.deny(); return; }
    this.step++;
    if (this.step >= this.seq.length) {
      this.score = this.seq.length * 10;
      this.mode = "wait"; this.timer = .5;
    }
  },
  update(dt) {
    if (this.flashT > 0) { this.flashT -= dt; if (this.flashT <= 0) this.flash = -1; }
    this.timer -= dt;
    if (this.mode === "dead") return { over: true, score: this.score };
    if (this.mode === "show" && this.timer <= 0) {
      this.showIdx++;
      if (this.showIdx >= this.seq.length) { this.mode = "input"; this.flash = -1; }
      else {
        this.flash = this.seq[this.showIdx]; this.flashT = .32;
        Snd.blip(Snd.mtof(this.PADS[this.flash].note), .3, "sine", .1);
        this.timer = .52;
      }
    }
    if (this.mode === "wait" && this.timer <= 0) this.addStep();
  },
  draw(g) {
    g.fillStyle = "#07070b"; g.fillRect(0, 0, AW, AH);
    for (let i = 0; i < 4; i++) {
      const p = this.padAt(i), on = this.flash === i;
      g.fillStyle = on ? this.PADS[i].lit : this.PADS[i].col;
      g.globalAlpha = on ? 1 : .32;
      g.fillRect(p.x, p.y, p.w, p.h);
      g.globalAlpha = 1;
      g.strokeStyle = this.PADS[i].col; g.lineWidth = 2;
      g.strokeRect(p.x, p.y, p.w, p.h);
      arcText(g, i + 1, p.x + p.w / 2, p.y + p.h / 2, 22, on ? "#07070b" : this.PADS[i].col, "center");
    }
    const label = this.mode === "show"
      ? (state.lang === "es" ? "mira…" : "watch…")
      : (state.lang === "es" ? "¡repite!" : "repeat!");
    arcText(g, label, AW / 2, 20, 13, "#b6b3ac", "center");
    arcText(g, (state.lang === "es" ? "ronda " : "round ") + this.seq.length, AW - 10, 20, 13, "#ffd76a", "right");
  }
};

/* ============================================================
   4 · FISHING — the reward for finding all twelve golden fish

   Side-on water. The hook drops on a line; steer the boat across the
   top and the hook up and down, touch a fish to hook it, then reel it
   back to the surface to bank it. Depth is worth money and costs time,
   which is the entire game: the fat fish live at the bottom and the
   clock does not care.

   Boots and crabs snap the line and cost you whatever was on it, so
   the deep run is a gamble rather than a grind.
   ============================================================ */
const SURFACE = 74;                              // waterline, in canvas pixels

const GAME_FISHING = {
  id: "fishing", color: "#7ce8e0",
  kicker: { es: "Estanque de la isla · pesca", en: "Island pond · fishing" },
  name: { es: "El Muelle de los Doce", en: "The Pier of Twelve" },
  hint: { es: "Flechas o WASD: mueve la barca y baja el anzuelo. Toca un pez para engancharlo y súbelo a la superficie para cobrarlo. Los peces del fondo pagan más. Botas y cangrejos te parten el sedal. 60 segundos.",
          en: "Arrows or WASD: steer the boat and drop the hook. Touch a fish to hook it, then reel it up to the surface to bank it. The deep ones pay more. Boots and crabs snap your line. 60 seconds." },

  reset() {
    this.boat = AW / 2;
    this.hookY = SURFACE + 14;
    this.score = 0;
    this.time = 60;
    this.hooked = null;
    this.flash = 0;
    this.msg = "";
    this.msgT = 0;
    this.things = [];
    for (let i = 0; i < 18; i++) this.spawn(true);
  },

  /* Depth bands: the shallows hold small fry, the bottom holds the ones
     worth going after, and junk is spread through the middle where it can
     actually get in the way. */
  spawn(initial) {
    const band = Math.random();
    const y = SURFACE + 26 + band * (AH - SURFACE - 54);
    const deep = (y - SURFACE) / (AH - SURFACE);
    const junk = Math.random() < .22;
    this.things.push({
      x: Math.random() < .5 ? -20 : AW + 20,
      y: initial ? y : y,
      vx: (Math.random() < .5 ? 1 : -1) * (16 + Math.random() * 34 + deep * 22),
      junk,
      crab: junk && Math.random() < .5,
      size: junk ? 9 : 6 + deep * 9,
      value: junk ? 0 : Math.round(5 + deep * 45),
      hue: junk ? "#6a5a4a" : ["#ffd76a", "#f0a35e", "#7ce8e0", "#f2a2c4"][Math.floor(Math.random() * 4)],
      wob: Math.random() * 6.28
    });
    if (initial) this.things[this.things.length - 1].x = Math.random() * AW;
  },

  update(dt, keys) {
    this.time -= dt;
    this.msgT = Math.max(0, this.msgT - dt);
    this.flash = Math.max(0, this.flash - dt * 3);

    const sp = 150;
    if (keys.left) this.boat -= sp * dt;
    if (keys.right) this.boat += sp * dt;
    this.boat = Math.max(24, Math.min(AW - 24, this.boat));

    /* Reeling in is slower than dropping, and slower still with a fish on
       the line — otherwise there is no decision to make about going deep. */
    const drop = 96, reel = this.hooked ? 58 : 78;
    if (keys.down && !this.hooked) this.hookY += drop * dt;
    if (keys.up) this.hookY -= reel * dt;
    this.hookY = Math.max(SURFACE + 6, Math.min(AH - 12, this.hookY));

    for (const th of this.things) {
      th.x += th.vx * dt;
      th.wob += dt * 3;
      if (th.vx > 0 && th.x > AW + 30) th.x = -30;
      if (th.vx < 0 && th.x < -30) th.x = AW + 30;
    }

    const hx = this.boat, hy = this.hookY;
    if (this.hooked) {
      this.hooked.x = hx; this.hooked.y = hy + 6;
      if (hy <= SURFACE + 8) {
        this.score += this.hooked.value;
        this.flash = 1;
        this.msg = (state.lang === "es" ? "+" : "+") + this.hooked.value;
        this.msgT = 1.1;
        this.things.splice(this.things.indexOf(this.hooked), 1);
        this.hooked = null;
        this.spawn(false);
        Snd.pickup(1);
      }
    } else {
      for (const th of this.things) {
        /* generous by seven pixels: a hook on a line is not a precision
           instrument, and playtesting a tight box gave two fish a minute */
        if (Math.abs(th.x - hx) > th.size + 7 || Math.abs(th.y - hy) > th.size + 7) continue;
        if (th.junk) {
          /* the line snaps: you keep the score you banked, you lose the run */
          this.hookY = SURFACE + 10;
          this.msg = th.crab
            ? (state.lang === "es" ? "¡un cangrejo!" : "a crab!")
            : (state.lang === "es" ? "una bota vieja" : "an old boot");
          this.msgT = 1.4;
          this.time -= 3;
          Snd.step_(true);
        } else {
          this.hooked = th;
          Snd.chime();
        }
        break;
      }
    }
    if (this.time <= 0) return { over: true, score: this.score };
  },

  key() { },

  draw(g) {
    /* sky over the pond, then the water, darkening with depth */
    const sky = g.createLinearGradient(0, 0, 0, SURFACE);
    sky.addColorStop(0, "#1a2b47"); sky.addColorStop(1, "#4a5a78");
    g.fillStyle = sky; g.fillRect(0, 0, AW, SURFACE);
    const wat = g.createLinearGradient(0, SURFACE, 0, AH);
    wat.addColorStop(0, "#1d5f78"); wat.addColorStop(.45, "#123f5c"); wat.addColorStop(1, "#07172c");
    g.fillStyle = wat; g.fillRect(0, SURFACE, AW, AH - SURFACE);

    /* a few strands of weed on the bottom so depth has a floor */
    g.strokeStyle = "rgba(60,120,90,.5)"; g.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const x = 18 + i * 40, h = 16 + ((i * 37) % 23);
      g.beginPath(); g.moveTo(x, AH); g.quadraticCurveTo(x + 6, AH - h * .6, x + 2, AH - h); g.stroke();
    }

    /* the waterline, drawn as a wave so it is not a ruled edge */
    g.strokeStyle = "#7ce8e0"; g.lineWidth = 2;
    g.beginPath();
    for (let x = 0; x <= AW; x += 8) {
      const y = SURFACE + Math.sin(x * .06 + this.time * 2) * 2;
      x ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();

    /* line and hook */
    g.strokeStyle = "rgba(236,235,232,.75)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(this.boat, SURFACE - 8); g.lineTo(this.boat, this.hookY); g.stroke();
    g.fillStyle = "#ecebe8";
    g.beginPath(); g.arc(this.boat, this.hookY, 3, 0, 7); g.fill();

    for (const th of this.things) {
      const wob = Math.sin(th.wob) * 1.5;
      if (th.junk && th.crab) {
        g.fillStyle = "#c2604a";
        g.beginPath(); g.arc(th.x, th.y + wob, th.size, 0, 7); g.fill();
        g.strokeStyle = "#c2604a"; g.lineWidth = 2;
        for (const s of [-1, 1]) {
          g.beginPath();
          g.moveTo(th.x + s * th.size, th.y + wob);
          g.lineTo(th.x + s * (th.size + 7), th.y + wob - 5);
          g.stroke();
        }
      } else if (th.junk) {
        g.fillStyle = "#6a5a4a";
        g.fillRect(th.x - 6, th.y - 8 + wob, 7, 14);
        g.fillRect(th.x - 6, th.y + 3 + wob, 14, 4);
      } else {
        const dir = th.vx > 0 ? 1 : -1;
        g.fillStyle = th.hue;
        g.beginPath();
        g.ellipse(th.x, th.y + wob, th.size, th.size * .58, 0, 0, 7);
        g.fill();
        g.beginPath();                                   // tail
        g.moveTo(th.x - dir * th.size, th.y + wob);
        g.lineTo(th.x - dir * (th.size + 7), th.y + wob - 5);
        g.lineTo(th.x - dir * (th.size + 7), th.y + wob + 5);
        g.closePath(); g.fill();
        g.fillStyle = "#14161c";
        g.beginPath(); g.arc(th.x + dir * th.size * .45, th.y - 1 + wob, 1.6, 0, 7); g.fill();
        if (th === this.hooked) {
          g.strokeStyle = "#ffd76a"; g.lineWidth = 2;
          g.beginPath(); g.arc(th.x, th.y + wob, th.size + 5, 0, 7); g.stroke();
        }
      }
    }

    /* the boat, riding the wave it sits on */
    const by = SURFACE - 6 + Math.sin(this.boat * .06 + this.time * 2) * 2;
    g.fillStyle = "#8a5a2b";
    g.beginPath();
    g.moveTo(this.boat - 18, by); g.lineTo(this.boat + 18, by);
    g.lineTo(this.boat + 12, by + 9); g.lineTo(this.boat - 12, by + 9);
    g.closePath(); g.fill();
    g.fillStyle = "#e08840";                             // the cat, fishing
    g.beginPath(); g.arc(this.boat - 4, by - 7, 6, 0, 7); g.fill();
    g.beginPath();
    g.moveTo(this.boat - 9, by - 11); g.lineTo(this.boat - 7, by - 16); g.lineTo(this.boat - 4, by - 12);
    g.closePath(); g.fill();
    g.strokeStyle = "#5d4433"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(this.boat - 2, by - 6); g.lineTo(this.boat + 10, by - 20); g.stroke();

    if (this.flash > 0) {
      g.fillStyle = `rgba(255,215,106,${this.flash * .3})`;
      g.fillRect(0, 0, AW, AH);
    }
    arcText(g, (state.lang === "es" ? "tiempo " : "time ") + Math.max(0, Math.ceil(this.time)),
      AW - 10, 18, 13, this.time < 11 ? "#f07a6a" : "#ffd76a", "right");
    if (this.msgT > 0) arcText(g, this.msg, AW / 2, 34, 15, "#7ce8e0", "center");
  }
};

const ARCADE_GAMES = [GAME_PONG, GAME_SNAKE, GAME_RUNES, GAME_FISHING];

/* ============================================================
   shared shell: loop, scores, curtain
   ============================================================ */
const Arc = {
  game: null, running: false, raf: 0, last: 0, score: 0, keys: {},

  best(id) {
    try { return +(localStorage.getItem("rja_best_" + id) || 0); } catch { return 0; }
  },
  setBest(id, v) {
    try { localStorage.setItem("rja_best_" + id, String(v)); } catch { }
  },

  open(id) {
    const gm = ARCADE_GAMES.find(g => g.id === id);
    if (!gm) return;
    Snd.begin();
    this.game = gm;
    state.minigame = true;
    const t = AT();
    /* the cave's games say "Crystal Cave"; the pier is above ground and above
       water, and labelling it a cave arcade reads as a copy-paste slip */
    $("#arcKicker").textContent = gm.kicker ? L(gm.kicker) : t.kicker;
    $("#arcKicker").style.color = gm.color;
    $("#arcTitle").textContent = L(gm.name);
    $("#arcHint").textContent = L(gm.hint);
    $("#arcClose").textContent = t.close;
    $("#arc").classList.add("show");
    Snd.duck(true); Snd.ui(true);
    this.showCurtain(t.ready, t.readyB, t.start);
    this.score = 0;
    /* seed the board before the first paint, otherwise draw() renders
       undefined state behind the curtain */
    gm.reset();
    this.paint();
    this.updateScores();
  },
  close() {
    this.stop();
    this.game = null;
    state.minigame = false;
    $("#arc").classList.remove("show");
    Snd.duck(false); Snd.ui(false);
  },

  showCurtain(title, body, btn) {
    $("#arcCurtain").classList.remove("gone");
    $("#arcCurtainT").textContent = title;
    $("#arcCurtainB").textContent = body;
    $("#arcStart").textContent = btn;
    $("#arcStart").style.display = "";
  },
  hideCurtain() {
    $("#arcCurtain").classList.add("gone");
    $("#arcStart").style.display = "none";
  },

  start() {
    if (!this.game) return;
    this.keys = {};
    this.game.reset();
    this.score = 0;
    this.updateScores();
    this.hideCurtain();
    this.running = true;
    this.last = 0;
    cancelAnimationFrame(this.raf);
    const step = ts => {
      if (!this.running) return;
      const now = ts / 1000;
      const dt = this.last ? Math.min(.05, now - this.last) : 1 / 60;
      this.last = now;
      const res = this.game.update(dt, this.keys);
      this.paint();
      if (res && res.over) return this.gameOver(res.score);
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  },
  stop() { this.running = false; cancelAnimationFrame(this.raf); },

  gameOver(score) {
    this.stop();
    this.score = score | 0;
    const t = AT();
    const prev = this.best(this.game.id);
    let msg = t.overB(this.score);
    if (this.score > prev) { this.setBest(this.game.id, this.score); msg = t.newBest(this.score); Snd.fanfare(); }
    this.updateScores();
    this.showCurtain(t.over, msg, t.again);
  },

  updateScores() {
    const t = AT();
    const live = this.running && this.game && this.game.score != null ? this.game.score : this.score;
    $("#arcScoreL").innerHTML = `${t.score} <b>${live | 0}</b>`;
    $("#arcBestL").innerHTML = `${t.best} <b>${this.game ? this.best(this.game.id) : 0}</b>`;
  },

  paint() {
    const cv = $("#arcCanvas"), g = cv.getContext("2d");
    if (this.game) this.game.draw(g);
    this.updateScores();
  }
};

$("#arcStart").addEventListener("click", () => Arc.start());
$("#arcClose").addEventListener("click", () => Arc.close());
$("#arc").addEventListener("click", e => { if (e.target.id === "arc") Arc.close(); });
$("#arcCanvas").addEventListener("click", e => {
  if (!Arc.game || !Arc.running || !Arc.game.click) return;
  const r = e.target.getBoundingClientRect();
  Arc.game.click((e.clientX - r.left) * AW / r.width, (e.clientY - r.top) * AH / r.height);
});

/* arcade input: swallowed before the cat ever sees it */
const ARC_MAP = { arrowup: "up", w: "up", arrowdown: "down", s: "down",
                  arrowleft: "left", a: "left", arrowright: "right", d: "right" };
addEventListener("keydown", e => {
  if (!Arc.game || !$("#arc").classList.contains("show")) return;
  const k = e.key.toLowerCase();
  if (k === "escape") { Arc.close(); return; }
  if (k === " " || k === "enter") { e.preventDefault(); if (!Arc.running) Arc.start(); return; }
  const dir = ARC_MAP[k];
  if (dir) { e.preventDefault(); Arc.keys[dir] = true; if (Arc.game.key) Arc.game.key(dir); }
  else if (Arc.game.key) Arc.game.key(k);
});
addEventListener("keyup", e => {
  const dir = ARC_MAP[e.key.toLowerCase()];
  if (dir) Arc.keys[dir] = false;
});


/* ============================================================
   GAME — world, physics, island
   ============================================================ */
let game = null;

/* Temple positions on the island (index-aligned with ZONES_META).
   The Ruins of the Riddle used to stand at (-56,-26) running the same
   Mastermind the Crypt of the Code runs underground, so the island had a
   temple that duplicated a cave hall. Its road now carries on past the old
   site and out to the bridge instead. */
const ZONE_POS = [
  { x: -42, z: 34, r: 9 },     // 0 casa del gato
  { x: 56, z: -2, r: 11 },     // 1 templo de la evolución
  { x: 38, z: -48, r: 11 },    // 2 gran almacén
  { x: 2, z: 60, r: 11 },      // 3 santuario arcade
  { x: -16, z: -60, r: 10 },   // 4 forja de skills
  { x: 58, z: 40, r: 13 },     // 5 colina del tiempo
  { x: -70, z: 10, r: 11 }     // 6 faro de señales
];

/* ============================================================
   TERRAIN — the island used to be a flat disc; it is now a real
   heightmap. Everything the player walks on (plaza, temples,
   paths) is carved back down to y=0 so the buildings and their
   colliders keep working unchanged, and the relief happens in
   between: rolling hills, dunes and an irregular coastline.

   cannon-es shipped here has no Heightfield shape (tree-shaken
   out), so the flat y=0 plane stays as the physics floor and the
   cat is lifted onto the hills analytically in the game loop.
   Nothing dynamic ever leaves the flat areas, so that is enough.
   ============================================================ */
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* deterministic value noise — heightAt() is queried from several
   places and must give the same answer every time */
function hash2(i, j) {
  let n = (Math.imul(i | 0, 374761393) + Math.imul(j | 0, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x, y) {
  const i = Math.floor(x), j = Math.floor(y);
  const fx = x - i, fy = y - j;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return hash2(i, j) * (1 - u) * (1 - v) + hash2(i + 1, j) * u * (1 - v)
       + hash2(i, j + 1) * (1 - u) * v + hash2(i + 1, j + 1) * u * v;
}
function fbm(x, y, oct = 4) {
  let sum = 0, amp = .5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { sum += vnoise(x * f, y * f) * amp; norm += amp; f *= 2; amp *= .5; }
  return sum / norm;
}


/* areas that must stay dead flat: plaza, playground, pond, every
   temple, and a corridor along each path out of the plaza */
const FLAT_DISCS = [
  { x: 0, z: 0, r: 19, fade: 9 },       // plaza + fountain
  { x: 15, z: 5, r: 15, fade: 7 },      // physics playground
  /* the second crate pyramid used to stand at (-13,-11), four metres past the
     plaza kerb, where it read as debris left on the doorstep. Moved out to the
     far side of the lawn; the lobby got a topiary and a bench instead. */
  { x: -27, z: -17, r: 9, fade: 8 },    // crate pyramid
  { x: -20, z: 12, r: 10, fade: 7 },    // pond
  { x: 0, z: -17, r: 9, fade: 7 },      // RAUL letters
  { x: -8, z: 20, r: 7, fade: 6 },      // seesaw
  { x: 24, z: -2, r: 8, fade: 6 },      // ramp
  { x: -26, z: 2, r: 8, fade: 6 },      // ramp
  ...ZONE_POS.map(p => ({ x: p.x, z: p.z, r: p.r + 3, fade: 8 }))
];
/* The spur to the bridgehead is appended once BRIDGE_A is known, further
   down. flatMask reads this array at call time, so a late push is fine. */
const PATH_LINES = ZONE_POS.map(p => ({ x1: 0, z1: 0, x2: p.x, z2: p.z }));

function distToSegment(x, z, s) {
  const dx = s.x2 - s.x1, dz = s.z2 - s.z1;
  const len2 = dx * dx + dz * dz || 1;
  const t = clamp01(((x - s.x1) * dx + (z - s.z1) * dz) / len2);
  return Math.hypot(x - (s.x1 + dx * t), z - (s.z1 + dz * t));
}

/* 0 where the ground must be flat, 1 where the relief is free */
function flatMask(x, z) {
  let m = 1;
  for (const s of FLAT_DISCS) {
    m = Math.min(m, smoothstep(s.r, s.r + s.fade, Math.hypot(x - s.x, z - s.z)));
    if (m <= 0) return 0;
  }
  for (const l of PATH_LINES) {
    m = Math.min(m, smoothstep(3.6, 9, distToSegment(x, z, l)));
    if (m <= 0) return 0;
  }
  return m;
}

/* the coast is not a circle: bays and headlands come from a few
   sine terms so the silhouette reads as an island, not a coin */
const COAST_R = 92;
function coastRadius(ang) {
  return COAST_R
    + 15 * Math.sin(ang * 3 + .6)
    + 9 * Math.cos(ang * 5 - 1.1)
    + 6 * Math.sin(ang * 2 + 2.3);
}

/* Height of the main island. Always >= 0 on land, so the flat
   physics plane never pokes through the terrain. */
function islandHeight(x, z) {
  const d = Math.hypot(x, z);
  const R = coastRadius(Math.atan2(z, x));
  const t = d / R;

  /* hills fade out as the shore approaches, leaving flat sand */
  const inland = smoothstep(1.0, .74, t);
  let h = (fbm(x * .0115, z * .0115, 4) - .46) * 44;
  h += (fbm(x * .042 + 11, z * .042 - 7, 3) - .5) * 5;
  h = Math.max(0, h) * inland;

  /* one long ridge so the island has a spine instead of only bumps */
  h += Math.max(0, 1 - Math.abs(fbm(x * .0075 - 5, z * .0075 + 3, 2) - .52) * 7) * 11 * inland;

  h *= flatMask(x, z);
  /* everything past the shoreline dives under the sea */
  h -= Math.max(0, t - 1.015) * 260;
  return h;
}

/* ============================================================
   THE CRAG AND THE BRIDGE

   The cave used to open in the flank of the island itself, and the
   rock face it needed to look like a cave took up a whole quadrant
   of the map and sat on top of the hillside. It lives on its own
   islet now, off the north-east shore, reached by a rope bridge —
   so the only thing the island has to give up is a bridgehead on an
   empty stretch of beach.

   Both the bridge deck and the islet are part of heightAt(), not
   props sitting on top of it: the cat rides the heightmap
   analytically, so anything walkable has to be in the field.
   ============================================================ */
/* The bridge takes over the road the Ruins of the Riddle used to sit on:
   straight out of the plaza, past the old site, onto the beach. Any bearing
   works for the walk because the road itself is in PATH_LINES and flatMask
   carves a level corridor along it — what matters is that the player already
   has a reason to walk this way. */
const BRG = Math.atan2(-26, -56);
const BU = { x: Math.cos(BRG), z: Math.sin(BRG) };
const atR = r => ({ x: BU.x * r, z: BU.z * r });

const ISLET_R = 28, ISLET_Y = 4;
const ISLET = atR(140);
const BRIDGE_A = atR(coastRadius(BRG) - 5);     // bridgehead on the beach
/* lands well inside the islet: the outline is noisy, and a deck ending on the
   nominal radius would sometimes stop short of the rock */
const BRIDGE_B = atR(140 - ISLET_R + 6);
const BRIDGE_HALF = 2.5;
/* The eighth road out of the plaza, in place of the one that used to end at
   the Ruins. Pushed here rather than declared with the others because it
   needs BRIDGE_A. */
const BRIDGE_ROAD = { x1: 0, z1: 0, x2: BRIDGE_A.x, z2: BRIDGE_A.z };
PATH_LINES.push(BRIDGE_ROAD);
const BRIDGE_Y0 = islandHeight(BRIDGE_A.x, BRIDGE_A.z) + .35;

/* The crag the cave is bored into. Three cones, all of them starting past
   r=138: the tunnel ends at 137, and terrain that reaches any further forward
   pokes up through the floor of the bore. The tallest sits behind the islet
   with its foot in the water, so the whole thing reads as a peak rising out
   of the sea rather than as a disc with a bump on it. */
const CRAGS = [
  { p: atR(150), r: 12, h: 26 },   // rises immediately behind the portal
  { p: { x: BU.x * 148 - BU.z * 13, z: BU.z * 148 + BU.x * 13 }, r: 10, h: 14 },
  { p: atR(164), r: 20, h: 34 }    // the peak, foot in the water
];

/* an irregular outline, or the islet reads as a poker chip. Both the height
   field and the confinement clamp go through this, so the edge you can see is
   the edge you can walk to. */
const isletEdge = a => ISLET_R * (.88 + .24 * fbm(Math.cos(a) * 3 + 11, Math.sin(a) * 3 - 4, 2));

function bridgeT(x, z) {
  const dx = BRIDGE_B.x - BRIDGE_A.x, dz = BRIDGE_B.z - BRIDGE_A.z;
  const len2 = dx * dx + dz * dz;
  return clamp01(((x - BRIDGE_A.x) * dx + (z - BRIDGE_A.z) * dz) / len2);
}
function bridgeSide(x, z, t) {
  const px = BRIDGE_A.x + (BRIDGE_B.x - BRIDGE_A.x) * t;
  const pz = BRIDGE_A.z + (BRIDGE_B.z - BRIDGE_A.z) * t;
  return Math.hypot(x - px, z - pz);
}
const bridgeDeckY = t => BRIDGE_Y0 + (ISLET_Y - BRIDGE_Y0) * t;

/* The deck is walkable, so it has to be in the height field — but it must not
   be in the *terrain*, or the island mesh grows a 5m ridge of grass along the
   whole span and the bridge ends up standing on a causeway. Hence two
   functions: terrainHeight() is what gets displaced into the mesh and
   coloured, heightAt() is what the cat rides. */
function bridgeHeight(x, z) {
  let best = null;
  for (const s of SPANS) {
    const t = clamp01(spanT(s, x, z));
    const px = s.a.x + (s.b.x - s.a.x) * t, pz = s.a.z + (s.b.z - s.a.z) * t;
    if (Math.hypot(x - px, z - pz) > s.half + 1.2) continue;
    const y = s.y0 + (s.y1 - s.y0) * t;
    if (best === null || y > best) best = y;
  }
  return best;
}

/* Kept apart from islandHeight so the vertex colouring can tell the two
   apart: run through the island's shore gradient, the islet would come out as
   one flat sheet of wet sand 60 units past a coastline it has nothing to do
   with. Returns null out at sea. */
function isletHeight(x, z) {
  let h = null;
  const d = Math.hypot(x - ISLET.x, z - ISLET.z);
  if (d <= ISLET_R * 1.2 + 12) {
    const edge = isletEdge(Math.atan2(z - ISLET.z, x - ISLET.x));
    /* the top stays dead flat: the tunnel floor is a level slab across the
       middle of it, and any relief here would show through the planks */
    h = ISLET_Y - Math.max(0, d - (edge - 2)) * 2.6;
  }
  for (const c of CRAGS) {
    const cd = Math.hypot(x - c.p.x, z - c.p.z);
    if (cd >= c.r) continue;
    const ch = ISLET_Y + (1 - cd / c.r) * c.h;
    h = h === null ? ch : Math.max(h, ch);
  }
  return h;
}

/* ============================================================
   THE PARK ISLAND

   A second island offshore, flat and low, carrying everything that
   is a ride rather than a place: the coaster, a wheel and a
   carousel. It exists because those things fought the island for
   room — the coaster alone needed a fifty-metre circuit that had to
   miss seven temples, eight roads and a plaza, and the only sites
   that cleared all of it were out on headlands nobody walks to.
   Off the coast there is nothing to miss.

   Same construction as the islet: a bearing, a bridgehead on an
   empty stretch of beach, a rope bridge, and an outline that both
   the height field and the confinement clamp read from, so the edge
   you can see is the edge you can walk to.
   ============================================================ */
const PARK_BRG = -78.3 * Math.PI / 180;      // the widest gap between roads
const PU = { x: Math.cos(PARK_BRG), z: Math.sin(PARK_BRG) };
const atP = r => ({ x: PU.x * r, z: PU.z * r });
const PARK_R = 44, PARK_Y = 3;
const PARK = atP(158);
const PARK_A = atP(coastRadius(PARK_BRG) - 5);
const PARK_B = atP(158 - PARK_R + 8);
const PARK_HALF = 3;
const PARK_ROAD = { x1: 0, z1: 0, x2: PARK_A.x, z2: PARK_A.z };
PATH_LINES.push(PARK_ROAD);
const PARK_Y0 = islandHeight(PARK_A.x, PARK_A.z) + .35;
/* flatter outline than the islet's: this one has a fairground laid out on it
   and a scalloped edge would leave the coaster's outer turn hanging in air */
const parkEdge = a => PARK_R * (.93 + .14 * fbm(Math.cos(a) * 2.4 - 7, Math.sin(a) * 2.4 + 5, 2));

function parkHeight(x, z) {
  const d = Math.hypot(x - PARK.x, z - PARK.z);
  if (d > PARK_R * 1.2 + 14) return null;
  const edge = parkEdge(Math.atan2(z - PARK.z, x - PARK.x));
  return PARK_Y - Math.max(0, d - (edge - 2)) * 2.4;
}

/* Every walkable span in the world. Two rope bridges now, and the deck
   arithmetic was written once for one of them — pulling it into a list is
   what stops the second bridge being a copy of the first with the names
   changed, which is how the first one grew its stuck-at-the-abutment bug. */
const SPANS = [
  { a: BRIDGE_A, b: BRIDGE_B, half: BRIDGE_HALF, y0: BRIDGE_Y0, y1: ISLET_Y },
  { a: PARK_A, b: PARK_B, half: PARK_HALF, y0: PARK_Y0, y1: PARK_Y }
];
/* raw t: negative or past one means you have stepped off the end of the span */
function spanT(s, x, z) {
  const dx = s.b.x - s.a.x, dz = s.b.z - s.a.z;
  return ((x - s.a.x) * dx + (z - s.a.z) * dz) / (dx * dx + dz * dz);
}

/* ============================================================
   THE COASTER

   A closed circuit on the park island, sited so its lift hill is
   the thing you see across the water from the beach.

   The track is a Catmull-Rom spline through fourteen control points
   given as (radius, height) around a circle: a station, a chain lift
   up to sixteen metres, a first drop, a wide banked turn out to the
   far radius, then two camelbacks back down to the platform. The
   shape lives in data because every other part of the coaster —
   rails, sleepers, supports, the train, the ride camera — is derived
   from the same curve, so moving a number here moves all of it.
   ============================================================ */
/* Site chosen against three constraints at once, because eyeballing it put
   the first attempt eight metres out to sea and its platform square in the
   middle of the road to the Great Warehouse: the whole ring has to sit inside
   the coastline with margin, no temple precinct may fall within its radius,
   and it wants to be far enough from the plaza to be a place you go rather
   than a thing in the way. The spin puts the station beside that road instead
   of across it — near enough to see from the path, clear of the walking line. */
/* On the park island now. It used to sit on the main island's south-west
   shoulder, where placing it meant satisfying four constraints at once and
   the answer was always "somewhere you would rather not walk". Out here the
   only thing it has to miss is the wheel and the carousel. */
const COASTER = { x: PARK.x - PU.x * 6, z: PARK.z - PU.z * 6 };
const COASTER_ROT = .55;
/* [radius, height] — the lift crest is the highest point and everything
   downstream of it trades that height back for speed */
const COASTER_SPEC = [
  [17.0, 3.4], [17.4, 3.5], [16.6, 8.0], [15.8, 16.2], [16.2, 15.4], [17.9, 5.2],
  [20.0, 9.2], [20.4, 3.6], [19.1, 8.2], [17.0, 2.6], [15.0, 6.8], [14.6, 3.0],
  [15.4, 5.0], [16.6, 3.5]
];
/* Filled in by initCoasterTrack() rather than at module load, because the
   heights are measured from the ground and heightAt() is not defined yet at
   this point in the file — flatMask, which it depends on, needs FLAT_DISCS
   below. */
let COASTER_CTRL = COASTER_SPEC.map(([r, h], i) => {
  const a = i / COASTER_SPEC.length * Math.PI * 2 + COASTER_ROT;
  return { x: COASTER.x + Math.cos(a) * r, y: h, z: COASTER.z + Math.sin(a) * r };
});
function initCoasterTrack() {
  /* The listed heights are the shape; the ground has the final say. This
     hillside rises ten metres across the circuit, so a track laid at the
     nominal heights would have run underground for a third of the lap. */
  COASTER_CTRL = COASTER_CTRL.map(p => ({ ...p, y: Math.max(p.y + PARK_Y, heightAt(p.x, p.z) + 2) }));
}

/* Closed Catmull-Rom. Written out rather than pulled from three: this build
   has no CatmullRomCurve3, and a uniform spline through evenly spaced points
   is six lines anyway. */
function coasterAt(t) {
  const P = COASTER_CTRL, n = P.length;
  const f = ((t % 1) + 1) % 1 * n, i = Math.floor(f), s = f - i;
  const p0 = P[(i - 1 + n) % n], p1 = P[i % n], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
  const s2 = s * s, s3 = s2 * s;
  const h = (a, b, c, d) => .5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3);
  return { x: h(p0.x, p1.x, p2.x, p3.x), y: h(p0.y, p1.y, p2.y, p3.y), z: h(p0.z, p1.z, p2.z, p3.z) };
}

/* Position, forward, right and up at a point on the circuit, with the track
   banked into its own turns. Without the bank a coaster is a garden hose:
   the roll is most of what makes a curve read as speed. */
function coasterFrame(t) {
  const e = 1 / 900;
  const p = coasterAt(t), a = coasterAt(t - e), b = coasterAt(t + e);
  let tx = b.x - a.x, ty = b.y - a.y, tz = b.z - a.z;
  const tl = Math.hypot(tx, ty, tz) || 1;
  tx /= tl; ty /= tl; tz /= tl;
  /* right = world-up x forward, then up = forward x right */
  let rx = tz, ry = 0, rz = -tx;
  const rl = Math.hypot(rx, rz) || 1;
  rx /= rl; rz /= rl;
  /* signed curvature in the horizontal plane, from how fast the tangent turns */
  const ax = a.x - p.x, az = a.z - p.z, bx = b.x - p.x, bz = b.z - p.z;
  const curl = (ax * bz - az * bx) / (e * e * 4e4);
  const bank = Math.max(-.75, Math.min(.75, curl * 1.5));
  const cb = Math.cos(bank), sb = Math.sin(bank);
  /* forward x right, not right x forward. Crossed the other way this comes
     out pointing at the ground: the rails were slung under their sleepers,
     the cars hung below the track, the bank rolled into the outside of every
     turn and the ride camera was upside down. Take t = +Z, up = +Y: right
     lands on +X, and (+X) x (+Z) is -Y. */
  let ux = ty * rz - tz * ry, uy = tz * rx - tx * rz, uz = tx * ry - ty * rx;
  const nrx = rx * cb + ux * sb, nry = ry * cb + uy * sb, nrz = rz * cb + uz * sb;
  ux = ux * cb - rx * sb; uy = uy * cb - ry * sb; uz = uz * cb - rz * sb;
  return { p, tx, ty, tz, rx: nrx, ry: nry, rz: nrz, ux, uy, uz };
}

function terrainHeight(x, z) {
  const i = isletHeight(x, z);
  const p = parkHeight(x, z);
  const h = islandHeight(x, z);
  return Math.max(h, i === null ? -1e9 : i, p === null ? -1e9 : p);
}

function heightAt(x, z) {
  const b = bridgeHeight(x, z);
  const h = terrainHeight(x, z);
  return b === null ? h : Math.max(h, b);
}

/* Keep the cat on solid ground: the beach, the deck, or the islet.
   One radial clamp against the coastline is no longer enough now that
   there is somewhere to walk to past it. */
function confineOutdoors(p) {
  /* Unclamped t on purpose. bridgeT() clamps to [0,1], which makes "distance
     to the span" collapse into "distance to the abutment" the moment you step
     past either end — and then the rail clamp below is no longer a corridor,
     it is a sphere of radius BRIDGE_HALF around the bridgehead. Walking home
     off the deck you got snapped back onto that sphere every frame and could
     never reach the side > BRIDGE_HALF + 1.6 that releases the branch: stuck
     on the spot, one step short of the beach. Past an abutment you are on
     land, so the span clamp has to let go and the island/islet clamps take
     over instead. */
  for (const s of SPANS) {
    const tRaw = spanT(s, p.x, p.z);
    if (tRaw <= 0 || tRaw >= 1) continue;
    const px = s.a.x + (s.b.x - s.a.x) * tRaw, pz = s.a.z + (s.b.z - s.a.z) * tRaw;
    const side = Math.hypot(p.x - px, p.z - pz);
    if (side > s.half + 1.6) continue;
    if (side > s.half) {                         // slide back onto the planks
      const k = s.half / side;
      p.x = px + (p.x - px) * k; p.z = pz + (p.z - pz) * k;
    }
    return;
  }
  const dIsl = Math.hypot(p.x - ISLET.x, p.z - ISLET.z);
  if (dIsl < ISLET_R * 1.2 + 4) {
    const edge = isletEdge(Math.atan2(p.z - ISLET.z, p.x - ISLET.x)) - 1.5;
    if (dIsl > edge) {
      const k = edge / dIsl;
      p.x = ISLET.x + (p.x - ISLET.x) * k; p.z = ISLET.z + (p.z - ISLET.z) * k;
    }
    return;
  }
  const dPark = Math.hypot(p.x - PARK.x, p.z - PARK.z);
  if (dPark < PARK_R * 1.2 + 4) {
    const edge = parkEdge(Math.atan2(p.z - PARK.z, p.x - PARK.x)) - 1.5;
    if (dPark > edge) {
      const k = edge / dPark;
      p.x = PARK.x + (p.x - PARK.x) * k; p.z = PARK.z + (p.z - PARK.z) * k;
    }
    return;
  }
  const dOut = Math.hypot(p.x, p.z);
  const limit = coastRadius(Math.atan2(p.z, p.x)) - 2;
  if (dOut > limit) { const k = limit / dOut; p.x *= k; p.z *= k; return true; }
  return false;
}

/* ============================================================
   CAVE NETWORK

   The caverns are built in an empty patch of world far out in XZ,
   at y=0, and you reach them through a short dark corridor that
   fades you across. That is a deliberate choice, not a shortcut:
   putting real tunnels under the island meant the terrain mesh,
   the sea and the static floor slabs all shared the same space as
   the corridors, and every one of them ended up drawn in front of
   the cat. Out here nothing overlaps, so the geometry can be as
   simple as it looks — flat slabs, upright walls, one level.

   The player never sees a load: they walk into the dark, the
   screen dims, and they walk out the other side.
   ============================================================ */
const CAVE_ORIGIN = { x: 0, z: 4000 };
/* The mouth is on the islet, at the foot of the crag, facing back down the
   bridge. Off the island entirely: the rock face a cave mouth needs to look
   like a cave was swallowing a whole quadrant of the map. */
const CAVE_MOUTH = atR(124);

/* entrance corridor: straight, level, roofed, sitting on the islet shelf.
   Short enough to stop before the crag cones start rising at r=138 — a
   corridor reaching into them would be buried by the terrain mesh. */
const ENTRY_DIR = Math.atan2(CAVE_MOUTH.x, CAVE_MOUTH.z);   // points into the crag
const ENTRY_LEN = 13;
const ENTRY_HALF = 3.2;
function entryAxis(t) {
  return { x: CAVE_MOUTH.x + Math.sin(ENTRY_DIR) * ENTRY_LEN * t,
           z: CAVE_MOUTH.z + Math.cos(ENTRY_DIR) * ENTRY_LEN * t };
}
const ENTRY_END = entryAxis(1);

/* chambers, all on one level, local to CAVE_ORIGIN */
/* Spread out enough that every corridor has real length once it is trimmed
   back to the chamber walls — chambers nearly touching left stubs of tunnel
   buried inside them, which is what read as walls stacked on walls. */
const CAVE_NODES = {
  gate:  { x: 0,   z: 46,  r: 9,  head: 11 },
  hub:   { x: 0,   z: 0,   r: 16, head: 16 },
  echo:  { x: -52, z: 10,  r: 14, head: 13 },   // Pong
  river: { x: 52,  z: 10,  r: 14, head: 13 },   // Snake
  runes: { x: -32, z: -46, r: 13, head: 13 },   // Simon
  crypt: { x: 32,  z: -46, r: 13, head: 13 }    // Mastermind
};
for (const k in CAVE_NODES) {                    // resolve to world space once
  CAVE_NODES[k].x += CAVE_ORIGIN.x;
  CAVE_NODES[k].z += CAVE_ORIGIN.z;
}
const CAVE_EDGES = [
  ["gate", "hub", 6], ["hub", "echo", 6], ["hub", "river", 6],
  ["hub", "runes", 6], ["hub", "crypt", 6]
];
const CAVE_Y = 0;                                // the caverns sit at ground level
const CORRIDOR_H = 9;                            // shared by corridors and chamber doorways
/* Radius of the bored tunnels. Comfortably wider than the walkable half-width
   (6) so the camera never ends up inside the rock, and short enough to pass
   under CORRIDOR_H where it opens into a chamber. */
const TUNNEL_R = 8.4;
/* the colour each chamber's crystal veins glow, so the halls read apart from
   one another at a glance rather than all being generic blue rock */
const CAVE_TINT = { gate: 0xe8b06a, hub: 0x9fd8ff, echo: 0x7ce8e0, river: 0xffd76a,
                    runes: 0xf2a2c4, crypt: 0x8fb0ff };

/* Distance along a unit ray to the first hit on a sphere, or null — the
   camera's occlusion test. This build's three.js has no Raycaster, and
   sphere tests are far cheaper than real geometry intersection anyway. */
function raySphere(ox, oy, oz, dx, dy, dz, sx, sy, sz, r) {
  const ex = sx - ox, ey = sy - oy, ez = sz - oz;
  const b = ex * dx + ey * dy + ez * dz;
  const c = ex * ex + ey * ey + ez * ez - r * r;
  if (c > 0 && b < 0) return null;
  const disc = b * b - c;
  if (disc < 0) return null;
  const t = b - Math.sqrt(disc);
  return t < 0 ? 0 : t;
}

function segT(x, z, a, b) {
  const dx = b.x - a.x, dz = b.z - a.z;
  const len2 = dx * dx + dz * dz || 1;
  return clamp01(((x - a.x) * dx + (z - a.z) * dz) / len2);
}

/* how far down the entrance corridor a point is: 0 at the arch, 1 at the
   far end. null when outside it. Used both to darken the screen and to
   trigger the crossing. */
function entryProgress(x, z) {
  const a = CAVE_MOUTH, b = ENTRY_END;
  const t = segT(x, z, a, b);
  const px = a.x + (b.x - a.x) * t, pz = a.z + (b.z - a.z) * t;
  if (Math.hypot(x - px, z - pz) > ENTRY_HALF + 1) return null;
  return t;
}

function caveFloorAt(x, z) {
  for (const k in CAVE_NODES) {
    const n = CAVE_NODES[k];
    if (Math.hypot(x - n.x, z - n.z) <= n.r) return CAVE_Y;
  }
  for (const [ka, kb, w] of CAVE_EDGES) {
    const a = CAVE_NODES[ka], b = CAVE_NODES[kb];
    const t = segT(x, z, a, b);
    if (Math.hypot(x - (a.x + (b.x - a.x) * t), z - (a.z + (b.z - a.z) * t)) <= w) return CAVE_Y;
  }
  return null;
}

/* True only when a point has real clearance from the rock, not merely when
   it is technically inside. The camera needs the stricter test: sitting 20cm
   from a corridor wall means the wall fills the screen. */
function caveRoomy(x, z, m) {
  return caveFloorAt(x, z) !== null
    && caveFloorAt(x + m, z) !== null && caveFloorAt(x - m, z) !== null
    && caveFloorAt(x, z + m) !== null && caveFloorAt(x, z - m) !== null;
}

function caveHeadAt(x, z) {
  for (const k in CAVE_NODES) {
    const n = CAVE_NODES[k];
    if (Math.hypot(x - n.x, z - n.z) <= n.r) return n.head;
  }
  return 9;
}

function confineToCave(p) {
  if (caveFloorAt(p.x, p.z) !== null) return false;
  let bx = p.x, bz = p.z, bd = 1e9;
  const consider = (cx, cz, rad) => {
    const d = Math.hypot(p.x - cx, p.z - cz);
    if (d - rad < bd) {
      bd = d - rad;
      const s = (rad - .8) / (d || 1);
      bx = cx + (p.x - cx) * s; bz = cz + (p.z - cz) * s;
    }
  };
  for (const k in CAVE_NODES) { const n = CAVE_NODES[k]; consider(n.x, n.z, n.r); }
  for (const [ka, kb, w] of CAVE_EDGES) {
    const a = CAVE_NODES[ka], b = CAVE_NODES[kb];
    const t = segT(p.x, p.z, a, b);
    consider(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, w);
  }
  p.x = bx; p.z = bz;
  return true;
}

/* ============================================================
   SHADER BITS

   Two things the bundle gives no ready-made pass for: a final colour
   grade, and per-pixel surface break-up. Both are small enough to
   write by hand against the standard material's include points.
   ============================================================ */

/* A 2D value noise, prepended to any fragment shader that wants detail.
   Cheap on purpose: three octaves of this cost less than one texture
   fetch would, and there are no image assets in this file to fetch. */
const NOISE_GLSL = `
float dh21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float dvnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(dh21(i), dh21(i + vec2(1.0, 0.0)), f.x),
             mix(dh21(i + vec2(0.0, 1.0)), dh21(i + vec2(1.0, 1.0)), f.x), f.y);
}
`;

/* ---------- final colour grade ----------
   Runs after OutputPass, so it works in display space on values already
   tone-mapped and encoded — which is exactly where the dither has to be.
   The sky is a smooth vertical gradient and bands visibly across an 8-bit
   framebuffer; a ±½ LSB of noise removes the rings for free.

   ShaderMaterial and FullScreenQuad are both in the bundle but neither is
   exported under a name this file can reach, so the pass borrows the
   constructors off two passes that already exist. That is deliberately not a
   hard-coded minified identifier: those change every time the bundle is
   rebuilt, the shape of these passes does not.

   The material has to come from the bloom pass, not from OutputPass: this
   build's OutputPass uses a *Raw* ShaderMaterial, which declares none of
   `uv`, `position`, `projectionMatrix` or even a float precision, so a
   shader written the ordinary way fails to compile against it. */
class GradePass {
  constructor(shaderDonor, quadDonor) {
    const ShaderMat = shaderDonor.compositeMaterial.constructor;
    const FSQuad = quadDonor.fsQuad.constructor;
    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;
    this.renderToScreen = false;
    this.uniforms = {
      tDiffuse: { value: null },
      uVig: { value: .62 },      // stronger underground, see applyDepth
      uWarm: { value: 1 }        // 1 outdoors, 0 in the caves
    };
    this.material = new ShaderMat({
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uVig;
        uniform float uWarm;
        varying vec2 vUv;
        void main(){
          vec3 c = texture2D(tDiffuse, vUv).rgb;
          float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
          c = mix(vec3(l), c, 1.08);                        // a shade more colour
          c = mix(c, c * c * (3.0 - 2.0 * c), 0.16);        // gentle S-curve, keeps the ends
          /* split tone: the sun is low and warm, so warm the highlights and let
             the shadows fall toward the sky's blue. Neutral in the caves. */
          c += (vec3( 0.032, 0.013, -0.022) * l +
                vec3(-0.010, 0.002,  0.028) * (1.0 - l)) * uWarm;
          vec2 d = vUv - 0.5;
          d.x *= 1.15;                                      // rounder corners on wide screens
          c *= 1.0 - dot(d, d) * uVig;
          float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
          c += (n - 0.5) / 255.0;                           // dither, kills the sky banding
          gl_FragColor = vec4(max(c, 0.0), 1.0);
        }`
    });
    this.fsQuad = new FSQuad(this.material);
  }
  setSize() {}
  dispose() { this.material.dispose(); this.fsQuad.dispose(); }
  render(renderer, writeBuffer, readBuffer) {
    this.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
  }
}

class Game {
  constructor(host) {
    this.host = host;
    this.renderer = new GLRenderer({ antialias: !IS_TOUCH, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, IS_TOUCH ? 1.5 : 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = SHADOW_SOFT;
    this.renderer.outputColorSpace = SRGB;
    this.renderer.toneMapping = TONE_ACES;
    this.renderer.toneMappingExposure = 1.22;
    host.appendChild(this.renderer.domElement);

    this.scene = new Scene3();
    this.sky = this.skyTexture();
    this.scene.background = this.sky;
    this.outdoorOnly = [];      // things that must vanish underground
    this.scene.fog = new Fog3(0x2a3c58, 90, 430);

    this.camera = new PerspCam(60, innerWidth / innerHeight, .1, 2400);
    this.camGoal = new V3(); this.camLook = new V3();
    this.camYaw = 0; this.fovGoal = 60;

    /* The composer is always in the chain now, even where bloom is not:
       the grade at the end of it costs one full-screen pass and is what
       keeps the sky from banding, which is worse on a phone, not better.
       Bloom is the expensive pass, so that is the one that gets switched
       off — it used to take the whole composer down with it. */
    this.useBloom = !IS_TOUCH && !REDUCED;
    this.composer = new Composer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new BloomPass(new V2(innerWidth, innerHeight), .42, .5, .82);
    this.bloom.enabled = this.useBloom;
    this.composer.addPass(this.bloom);
    const outPass = new OutPass();
    this.composer.addPass(outPass);
    this.grade = new GradePass(this.bloom, outPass);
    this.composer.addPass(this.grade);

    /* one clock shared by every swaying material, ticked once a frame */
    this.windU = { value: 0 };

    /* ---------- lighting rig: golden-hour dusk ----------
       The sun disc sits low toward -Z, so the key light comes from there and
       the shadows agree with the sky gradient. A cool fill from the opposite
       side keeps shadowed faces readable, and a faint up-light stands in for
       light bouncing off the sea. Every small lamp/fire/crystal goes through
       the light pool below instead of being its own PointLight. */
    this.sunDir = new V3(90, 95, -160).normalize();

    this.hemi = new HemiLight(0x7fa2dc, 0x3d4632, 1);
    this.scene.add(this.hemi);

    const sun = new DirLight(0xffc490, 2.5);
    sun.castShadow = true;
    const SMAP = IS_TOUCH ? 1024 : 2048;
    sun.shadow.mapSize.set(SMAP, SMAP);
    this.shadowExtent = IS_TOUCH ? 40 : 58;
    Object.assign(sun.shadow.camera, {
      left: -this.shadowExtent, right: this.shadowExtent,
      top: this.shadowExtent, bottom: -this.shadowExtent, near: 1, far: 260
    });
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = -3e-4;
    sun.shadow.normalBias = .04;
    sun.shadow.radius = 2.2;
    this.scene.add(sun, sun.target);
    this.sun = sun;
    this.shadowTexel = (this.shadowExtent * 2) / SMAP;

    const fill = new DirLight(0x8fb4ff, .8);
    fill.position.set(-90, 55, 120);
    this.scene.add(fill);

    const seaBounce = new DirLight(0x3d5f8a, .3);
    seaBounce.position.set(10, -40, 30);
    this.scene.add(seaBounce);
    this.outdoorLights = [fill, seaBounce];

    /* The cave needs its own key light. Routing it through the point-light
       pool did not work: the nine crystals are always nearer the camera, so
       they took every slot and the middle of the chamber stayed black. A
       dedicated directional light is position-independent and always on. */
    this.caveKey = new DirLight(0xa8c6f0, 1.5);
    this.caveKey.position.set(30, 70, -20);
    this.caveKey.visible = false;
    this.scene.add(this.caveKey);
    this.caveFill = new DirLight(0x6a5a86, .55);
    this.caveFill.position.set(-40, 20, 35);
    this.caveFill.visible = false;
    this.scene.add(this.caveFill);
    /* and one aimed up from below, or the vaults stay pitch black: every other
       light in the cave points down, so nothing ever hits a ceiling. */
    this.caveVault = new DirLight(0x5f7bb0, .5);
    this.caveVault.position.set(12, -60, 18);
    this.caveVault.visible = false;
    this.scene.add(this.caveVault);

    /* physics */
    this.world = new CWorld({ gravity: new CVec(0, -24, 0) });
    this.world.broadphase = new CSAP(this.world);
    this.world.defaultContactMaterial.friction = .35;
    this.world.defaultContactMaterial.restitution = .15;
    this.groundMat = new CMat("ground");
    this.bounceMat = new CMat("bounce");
    this.catMat = new CMat("cat");
    this.world.addContactMaterial(new CContact(this.groundMat, this.bounceMat, { friction: .2, restitution: .8 }));
    this.world.addContactMaterial(new CContact(this.groundMat, this.catMat, { friction: 0, restitution: 0 }));

    this.sync = [];          // dynamic mesh<->body pairs
    this.zones = [];         // interactive temple zones
    this.anims = [];         // fn(t, dt) called each frame
    this.fishes = [];        // collectibles
    this.caveSpots = [];
    this.occluders = [];     // bounding spheres the chase camera must avoid
    this.lightSources = [];  // every lamp/fire/crystal, lit through the pool
    this.lightPool = [];
    this.labels = [];        // floating temple names, faded by distance
    this.clock = new Clock3();
    this.elapsed = 0;

    /* Hand the registry the procedural builders before anything asks for a
       model. They are methods, so they need the instance — which is why this
       lives here and not next to the registry itself. */
    registerFallback("cat-statue", () => this.catStatue());
    registerFallback("pine", () => this.pineModel());
    registerFallback("lamp", () => this.lampModel());
    registerFallback("crate", () => this.crateModel());
    registerFallback("stele", () => this.steleModel());
    registerFallback("coaster-car", i => this.coasterCarModel(i));

    this.buildTerrain();
    this.buildPlaza();
    this.buildPlayground();
    this.buildNature();
    this.buildSky();
    this.buildTemples();
    this.buildFish();
    this.buildPier();
    this.buildParkBridge();
    this.buildPark();
    this.buildCoaster();
    this.buildCave();
    this.buildCat();
    this.initLightPool(IS_TOUCH ? 4 : 8);
    this._bind();
    this.loop = this.loop.bind(this);
  }

  /* Anything solid enough to hide the cat registers a bounding sphere here.
     The camera walks the ray from the cat to its ideal position and stops at
     the first one it hits. */
  addOccluder(x, y, z, r) { this.occluders.push({ x, y, z, r }); }

  /* ============ light pool ============
     The island has ~30 warm sources (lamps, fires, crystals, windows). Lighting
     them all at once would mean 30 point lights in every shader. Instead each
     one registers as a source here and a small fixed pool of real PointLights
     tracks whichever sources are nearest the camera, fading in and out so the
     hand-off is invisible. Fixed light count = no shader recompiles. */
  addLight(x, y, z, color, intensity, distance) {
    const src = { pos: new V3(x, y, z), color: new Col(color), intensity, distance, d: 0, want: false };
    this.lightSources.push(src);
    return src;
  }
  initLightPool(n) {
    for (let i = 0; i < n; i++) {
      const l = new PtLight(0xffffff, 0, 10, 2);
      l.k = 0; l.src = null;
      this.scene.add(l);
      this.lightPool.push(l);
    }
  }
  updateLights(dt) {
    const pool = this.lightPool, srcs = this.lightSources, cam = this.camera.position;
    for (const s of srcs) { s.d = s.pos.distanceTo(cam); s.want = false; }
    srcs.sort((a, b) => a.d - b.d);
    const n = Math.min(pool.length, srcs.length);
    for (let i = 0; i < n; i++) srcs[i].want = true;

    /* free any slot whose source dropped out and has finished fading */
    const free = [];
    for (const l of pool) {
      if (!l.src) { free.push(l); continue; }
      if (!l.src.want && l.k <= 0) { l.src = null; free.push(l); }
    }
    for (let i = 0; i < n && free.length; i++) {
      const s = srcs[i];
      if (pool.some(l => l.src === s)) continue;
      const l = free.pop();
      l.src = s; l.k = 0;
    }
    const step = dt * 3.5;
    for (const l of pool) {
      if (!l.src) { l.intensity = 0; continue; }
      l.k = l.src.want ? Math.min(1, l.k + step) : Math.max(0, l.k - step);
      l.position.copy(l.src.pos);
      l.color.copy(l.src.color);
      l.distance = l.src.distance;
      l.intensity = l.src.intensity * l.k;
    }
  }

  /* ============ small helpers ============ */
  mat(c, o = {}) { return new StdMat(Object.assign({ color: c, roughness: .85, metalness: .05 }, o)); }
  bmat(c, o = {}) { return new BasicMat(Object.assign({ color: c }, o)); }

  /* ---------- per-pixel surface detail ----------
     Vertex colours can only vary as fast as the mesh is subdivided, and the
     carved-flat lawn around the plaza is very nearly one enormous quad — it
     reads as painted plastic no matter how good the palette is. This mixes a
     world-space value noise into the albedo of a standard material, so the
     break-up is per-pixel and owes nothing to the geometry.

     World space, not UV: the terrain is a displaced plane whose UVs stretch
     over every slope, and neighbouring meshes that meet at a seam have to
     agree on the pattern or the join lights up.

     The fine octave fades out with view distance. Left on, it turns into
     aliasing fizz across the far half of the island the moment the camera
     moves — the one thing worse than a flat lawn. */
  detail(mat, scale = 1, amt = .16) {
    mat.onBeforeCompile = sh => {
      sh.uniforms.uDetail = { value: new V2(scale, amt) };
      sh.vertexShader = "varying vec3 vDetailPos;\n" + sh.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n  vDetailPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      /* after <color_fragment>, so vertex colours are already folded in and
         this modulates the finished albedo rather than fighting it */
      sh.fragmentShader = NOISE_GLSL + "uniform vec2 uDetail;\nvarying vec3 vDetailPos;\n" +
        sh.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        {
          vec2 q = vDetailPos.xz * uDetail.x;
          /* vViewPosition is view-space and always declared by the standard
             material, unlike cameraPosition which depends on the prefix */
          float near = 1.0 - smoothstep(45.0, 170.0, length(vViewPosition));
          float n = dvnoise(q * 0.33) * 0.50
                  + dvnoise(q * 1.30) * 0.32
                  + dvnoise(q * 5.10) * 0.18 * near - 0.5;
          diffuseColor.rgb *= 1.0 + n * uDetail.y * 2.0;
          diffuseColor.rgb += vec3(-0.010, 0.014, -0.012) * n;   // a little hue drift too
        }`);
    };
    /* Materials that share a program also share the uniforms added in
       onBeforeCompile — and the second one's hook never runs at all. Both
       numbers go in the cache key so a coarse surface and a fine one can
       never collapse into each other. */
    mat.customProgramCacheKey = () => "detail" + scale + "_" + amt;
    return mat;
  }

  /* ---------- wind ----------
     A rigid horizontal offset per mesh, phased off the mesh origin. Not a
     per-vertex bend: the crowns are cones and spheres a metre or two across,
     and displacing their vertices by world position shears them into
     lopsided blobs. Offsetting the whole crown a few centimetres reads as
     sway and leaves the silhouette intact. Trunks get no wind at all, so the
     join never opens up. */
  wind(mat, amp = .09) {
    if (REDUCED) return mat;          // ambient motion is exactly what that setting is asking us to stop
    mat.onBeforeCompile = sh => {
      sh.uniforms.uWind = this.windU;
      sh.uniforms.uWindAmp = { value: amp };
      sh.vertexShader = "uniform float uWind;\nuniform float uWindAmp;\n" + sh.vertexShader.replace(
        "#include <begin_vertex>", `#include <begin_vertex>
        {
          vec3 org = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          float w = sin(uWind * 1.15 + org.x * 0.13 + org.z * 0.09)
                  + 0.45 * sin(uWind * 2.60 + org.z * 0.19);
          transformed.x += w * uWindAmp;
          transformed.z += w * uWindAmp * 0.6;
        }`);
    };
    /* keyed by amplitude: the tufts sway at half the trees' and would
       otherwise inherit the trees' uniform off a shared program */
    mat.customProgramCacheKey = () => "wind" + amp;
    return mat;
  }

  /* ---- ground-lit ----
     Shade this material as if every fragment of it were the ground, whichever
     way its geometry actually faces.

     Grass is the reason. The blades already carry a straight-up normal so a
     vertical sliver is not lit edge-on and black — but they are double-sided,
     and three flips the normal on back faces. Up becomes down, the light comes
     from below, and every blade you happen to be looking at from behind
     renders black. Half a field of grass, at random, as black slivers.

     Forcing it in the fragment shader fixes both sides at once, and it is
     world up transformed into view space because that is the space `normal`
     lives in by the time normal_fragment_begin has run. */
  groundLit(mat) {
    const prevHook = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey;
    mat.onBeforeCompile = sh => {
      if (prevHook) prevHook.call(mat, sh);
      sh.fragmentShader = sh.fragmentShader.replace("#include <normal_fragment_begin>",
        "#include <normal_fragment_begin>\n  normal = normalize(mat3(viewMatrix) * vec3(0.0, 1.0, 0.0));");
    };
    mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : "") + "|groundlit";
    return mat;
  }

  /* One material per foliage colour instead of one per tree. Forty-six trees
     used to mean about a hundred and eighty standard materials, all of them
     identical in every way that matters — and wind needs them shared anyway,
     since the sway lives in the material. Nothing mutates these per instance. */
  foliageMat(hex) {
    this.folCache = this.folCache || new Map();
    let m = this.folCache.get(hex);
    if (!m) { m = this.wind(this.mat(hex, { flatShading: true })); this.folCache.set(hex, m); }
    return m;
  }

  /* Push the vertices of a cylinder-like shell in and out by noise so the cave
     stops looking like it was turned on a lathe. `amp` is the largest deviation
     either way, and the shells always sit far enough outside the walkable
     radius that even the deepest inward dent stays clear of it. The noise is
     sampled in world space, so neighbouring pieces that share an edge — a wall
     arc and the tunnel that meets it — agree along the seam. */
  rockify(geo, amp, ox = 0, oz = 0, freq = .17) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const r = Math.hypot(x, z);
      if (r < 1e-3) continue;
      const n = fbm((x + ox) * freq + y * .09, (z + oz) * freq - y * .07, 3);
      const k = (r + amp * (n - .5) * 2) / r;
      p.setX(i, x * k); p.setZ(i, z * k);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  /* Same idea for a dome/vault: displace along the surface normal of a sphere
     centred on the group origin, so the ceiling gets a lumpy vault instead of
     a lampshade. */
  rockifyDome(geo, amp, ox = 0, oz = 0) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const len = Math.hypot(x, y, z);
      if (len < 1e-3) continue;
      const n = fbm((x + ox) * .13, (z + oz) * .13 + y * .1, 3);
      const k = (len + amp * (n - .5) * 2) / len;
      p.setX(i, x * k); p.setY(i, y * k); p.setZ(i, z * k);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  m(geo, material, x = 0, y = 0, z = 0, o = {}) {
    const mesh = new Mesh(geo, material);
    mesh.position.set(x, y, z);
    if (o.rx) mesh.rotation.x = o.rx;
    if (o.ry) mesh.rotation.y = o.ry;
    if (o.rz) mesh.rotation.z = o.rz;
    mesh.castShadow = o.cast !== false;
    mesh.receiveShadow = !!o.recv;
    (o.parent || this.scene).add(mesh);
    return mesh;
  }

  /* Invisible static box collider. `rx` tilts it after the yaw — built by
     composing two axis-angle quaternions rather than passing an Euler triple,
     because the order the two rotations apply in is the difference between a
     sloped bridge deck and a deck skewed sideways. */
  sbox(sx, sy, sz, x, y, z, ry = 0, rx = 0) {
    const body = new CBody({ mass: 0, material: this.groundMat });
    body.addShape(new CBox(new CVec(sx / 2, sy / 2, sz / 2)));
    body.position.set(x, y, z);
    if (rx) {
      const Q = body.quaternion.constructor;
      const qy = new Q(), qp = new Q();
      qy.setFromAxisAngle(new CVec(0, 1, 0), ry);
      qp.setFromAxisAngle(new CVec(1, 0, 0), rx);
      qy.mult(qp, body.quaternion);
    } else if (ry) body.quaternion.setFromEuler(0, ry, 0);
    this.world.addBody(body);
    return body;
  }
  scyl(r, h, x, y, z) {
    const body = new CBody({ mass: 0, material: this.groundMat });
    body.addShape(new CCyl(r, r, h, 10));
    body.position.set(x, y, z);
    this.world.addBody(body);
    return body;
  }

  /* dynamic physics box with mesh */
  dbox(sx, sy, sz, x, y, z, color, mass, o = {}) {
    const mesh = this.m(new BoxGeo(sx, sy, sz), this.mat(color, o.matOpts || { roughness: .9, flatShading: true }), x, y, z, { recv: true });
    const body = new CBody({ mass, material: o.phys || null });
    body.addShape(new CBox(new CVec(sx / 2, sy / 2, sz / 2)));
    body.position.set(x, y, z);
    if (o.ry) { body.quaternion.setFromEuler(0, o.ry, 0); mesh.quaternion.copy(body.quaternion); }
    this.world.addBody(body);
    this.sync.push({ mesh, body });
    return { mesh, body };
  }
  dsphere(r, x, y, z, color, mass, o = {}) {
    const mesh = this.m(new SphGeo(r, 18, 14), this.mat(color, o.matOpts || { roughness: .4 }), x, y, z);
    const body = new CBody({ mass, material: o.phys || this.bounceMat });
    body.addShape(new CSph(r));
    body.position.set(x, y, z);
    this.world.addBody(body);
    this.sync.push({ mesh, body });
    return { mesh, body };
  }

  /* canvas helpers */
  makeCanvas(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const tex = new CanvasTex(c);
    tex.colorSpace = SRGB;
    return tex;
  }
  noiseTexture(base, spots, n = 260, repeat = 26) {
    const tex = this.makeCanvas(256, 256, (g) => {
      g.fillStyle = base; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < n; i++) {
        g.fillStyle = spots[i % spots.length];
        const s = 2 + Math.random() * 7;
        g.beginPath();
        g.arc(Math.random() * 256, Math.random() * 256, s, 0, 7);
        g.fill();
      }
    });
    tex.wrapS = tex.wrapT = WRAP_REPEAT;
    tex.repeat.set(repeat, repeat);
    return tex;
  }

  /* Floating text label. The canvas is sized to the measured text instead of a
     fixed 512px, so long names ("Templo de la Evolución") never get clipped;
     `height` is the world height of the plate, and the width follows from the
     text, which keeps glyphs the same size on every label. */
  makeLabel(text, color, height = 2.4) {
    const FONT = 64, PADX = 34, PADY = 22;
    const font = `700 ${FONT}px "JetBrains Mono", monospace`;
    const probe = document.createElement("canvas").getContext("2d");
    probe.font = font;
    const mt = probe.measureText(text);
    /* actualBoundingBox covers glyph overhang that `width` alone misses */
    const tw = Math.ceil(Math.max(mt.width, (mt.actualBoundingBoxLeft || 0) + (mt.actualBoundingBoxRight || 0)) * 1.04);
    const w = tw + PADX * 2, h = FONT + PADY * 2;

    const plate = (g, x, y, ww, hh, r) => {
      g.beginPath();
      g.moveTo(x + r, y);
      g.lineTo(x + ww - r, y); g.quadraticCurveTo(x + ww, y, x + ww, y + r);
      g.lineTo(x + ww, y + hh - r); g.quadraticCurveTo(x + ww, y + hh, x + ww - r, y + hh);
      g.lineTo(x + r, y + hh); g.quadraticCurveTo(x, y + hh, x, y + hh - r);
      g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
      g.closePath();
    };

    const tex = this.makeCanvas(w, h, g => {
      plate(g, 3, 3, w - 6, h - 6, 18);
      g.fillStyle = "rgba(10,12,16,0.62)";
      g.fill();
      g.strokeStyle = color; g.globalAlpha = .5; g.lineWidth = 3;
      g.stroke();
      g.globalAlpha = 1;
      g.font = font;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.shadowColor = color; g.shadowBlur = 22;
      g.fillStyle = color;
      g.fillText(text, w / 2, h / 2 + 2);
      g.shadowBlur = 0;
      g.fillText(text, w / 2, h / 2 + 2);
    });
    tex.anisotropy = 8;
    const sp = new Sprite3(new SpriteMat({ map: tex, transparent: true, depthWrite: false }));
    sp.scale.set(height * w / h, height, 1);
    return sp;
  }

  radialTexture() {
    if (this._radial) return this._radial;
    this._radial = this.makeCanvas(128, 128, g => {
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(.45, "rgba(255,255,255,0.35)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    });
    return this._radial;
  }
  glowSprite(color, size, pos) {
    const s = new Sprite3(new SpriteMat({ map: this.radialTexture(), color, transparent: true, depthWrite: false, blending: BLEND_ADD }));
    s.scale.set(size, size, 1);
    s.position.copy(pos);
    return s;
  }

  /* wooden sign with engraved name */
  sign(x, z, ry, text, color) {
    const g = new Grp(); g.position.set(x, 0, z); g.rotation.y = ry;
    const wood = this.mat(0x4a3628, { roughness: .95 });
    this.m(new CylGeo(.12, .16, 2.1, 6), wood, -.55, 1.05, 0, { parent: g });
    this.m(new CylGeo(.12, .16, 2.1, 6), wood, .55, 1.05, 0, { parent: g });
    const board = this.m(new BoxGeo(2.3, 1, .12), this.mat(0x5d4433, { roughness: .9 }), 0, 1.75, 0, { parent: g });
    /* Board text is wrapped to the widest line that fits, then the font is
       shrunk until even that line clears the frame — long temple names used to
       run off the plank. */
    const tex = this.makeCanvas(256, 112, ctx => {
      ctx.fillStyle = "#5d4433"; ctx.fillRect(0, 0, 256, 112);
      ctx.strokeStyle = "#3c2b1e"; ctx.lineWidth = 6; ctx.strokeRect(6, 6, 244, 100);
      const MAXW = 214;
      const words = text.split(" ");
      let lines = [text];
      if (words.length > 1) {
        const mid = Math.ceil(words.length / 2);
        lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
      }
      let size = 30;
      const widest = () => {
        ctx.font = `700 ${size}px "JetBrains Mono", monospace`;
        return Math.max(...lines.map(l => ctx.measureText(l).width));
      };
      while (widest() > MAXW && size > 12) size -= 1;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      const step = size + 6;
      lines.forEach((l, i) => ctx.fillText(l, 128, 56 + (i - (lines.length - 1) / 2) * step));
    });
    board.material = new StdMat({ map: tex, roughness: .9 });
    this.scene.add(g);
    return g;
  }

  skyTexture() {
    const c = document.createElement("canvas");
    c.width = 8; c.height = 256;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#070d24");
    grad.addColorStop(.28, "#122a4e");
    grad.addColorStop(.5, "#254368");
    grad.addColorStop(.66, "#4d5a7c");
    grad.addColorStop(.78, "#8a6d84");   // the violet band where dusk actually lives
    grad.addColorStop(.89, "#c08659");
    grad.addColorStop(.97, "#e8ab6c");
    grad.addColorStop(1, "#f4c489");
    g.fillStyle = grad; g.fillRect(0, 0, 8, 256);
    const tex = new CanvasTex(c);
    tex.colorSpace = SRGB;
    tex.mapping = MAP_EQUIRECT;
    return tex;
  }

  /* ============ terrain: island, water, paths ============ */
  buildTerrain() {
    /* No infinite ground plane: it would sit at y=0 across the whole world and
       make the descent into the caves impossible. Loose physics props only ever
       live on the carved-flat areas, so one static slab under each of those is
       all cannon actually needs. The cat itself rides the heightmap
       analytically in the loop. */
    for (const d of FLAT_DISCS) {
      if (Math.hypot(d.x - CAVE_MOUTH.x, d.z - CAVE_MOUTH.z) < 2) continue;   // keep the ramp open
      this.sbox(d.r * 2, 2, d.r * 2, d.x, -1, d.z);
    }

    /* ---- sea ---- */
    /* A ring, not a disc: a full disc at y=-0.85 spans the whole island, so
       anything below sea level inland — the entrance ravine, the caverns —
       ends up hidden behind a sheet of water. The inner edge sits well inside
       the narrowest point of the coast, where there is always land above it. */
    /* Two rings: the near one is subdivided and its vertices ride a couple of
       crossed swells every frame, the far one is a single quad ring that only
       has to be the right colour. Animating out to 900 units would be 20k
       vertices of sine for water nobody can see move. */
    /* low metalness on purpose: there is no environment map in this build, so
       a metallic surface has nothing to reflect and renders near-black */
    /* low metalness on purpose: there is no environment map in this build, so
       a metallic surface has nothing to reflect and renders near-black. The
       depth gradient comes from vertex colours instead: turquoise over the
       shallows, ink out where the bottom drops away. */
    /* roughness is what tames the moon path: any tighter and the cool fill
       light's specular clips to pure white across a third of the sea */
    const seaMat = this.mat(0x2a688f, { roughness: .52, metalness: .06, flatShading: true, vertexColors: true });
    /* Fresnel sheen. Without an environment map the sea has nothing to
       reflect, so grazing angles come out as dull as the water underfoot and
       the horizon dies. Adding it to the emissive term rather than the albedo
       keeps it out of the shadow and light maths, which is what makes it read
       as reflected sky instead of as glowing paint. Injected after
       <emissivemap_fragment> because that is the first point where both the
       shaded normal and the view vector exist — and `normal`, not vNormal,
       since the material is flat-shaded and vNormal is compiled out. */
    seaMat.onBeforeCompile = sh => {
      sh.fragmentShader = sh.fragmentShader.replace("#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        {
          float fres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 4.0);
          totalEmissiveRadiance += vec3(0.085, 0.135, 0.180) * fres;
        }`);
    };
    seaMat.customProgramCacheKey = () => "sea";
    const water = this.m(new RingGeo(66, 260, IS_TOUCH ? 64 : 128, IS_TOUCH ? 12 : 22), seaMat, 0, -.85, 0,
      { rx: -Math.PI / 2, cast: false, recv: true });
    const far = this.m(new RingGeo(258, 900, 72, 1), seaMat, 0, -.85, 0,
      { rx: -Math.PI / 2, cast: false });
    this.water = water;
    {
      const tint = (geo) => {
        const p = geo.attributes.position, arr = new Float32Array(p.count * 3);
        const shallow = new Col(0x6fd8cc), mid = new Col(0x2f86b4), deep = new Col(0x16406b), c = new Col();
        for (let i = 0; i < p.count; i++) {
          /* the ring is built in XY and laid down with rx=-90°, so its local
             +y ends up on world -z; get that wrong and the shallows sit on the
             wrong side of the island */
          const wx = p.getX(i), wz = -p.getY(i);
          const d = Math.hypot(wx, wz);
          const coast = coastRadius(Math.atan2(wz, wx));
          /* the ring starts at r=66 but the coast can reach 100+, so the whole
             gradient is measured from the shoreline, not from the origin —
             anchored to the ring instead, the turquoise ends up buried under
             the island and every visible metre of sea is the same navy */
          c.copy(shallow).lerp(mid, smoothstep(coast + 3, coast + 42, d)).lerp(deep, smoothstep(coast + 40, coast + 140, d));
          arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
        }
        geo.setAttribute("color", new F32Attr(arr, 3));
      };
      tint(water.geometry); tint(far.geometry);

      const p = water.geometry.attributes.position;
      const bx = new Float32Array(p.count), bz = new Float32Array(p.count);
      for (let i = 0; i < p.count; i++) { bx[i] = p.getX(i); bz[i] = p.getY(i); }
      this.anims.push(t => {
        for (let i = 0; i < p.count; i++) {
          const x = bx[i], z = bz[i];
          const d = Math.hypot(x, z);
          /* swells flatten out toward the horizon so the far seam never pops */
          const k = 1 - smoothstep(150, 250, d);
          p.setZ(i, (Math.sin(x * .13 + t * 1.15) * .5 + Math.sin(z * .1 - t * .9) * .42
                   + Math.sin((x + z) * .045 + t * .5) * .3) * k);
        }
        p.needsUpdate = true;
        /* no computeVertexNormals: the material is flat-shaded, so the normal
           comes from the fragment derivatives and recomputing 6k of them every
           frame would buy nothing */
      });
    }
    this.outdoorOnly.push(far);

    /* laid flat rather than a sprite, so the reflection stays on the sea
       instead of swinging around with the camera */
    const sunLane = new Grp();
    sunLane.rotation.y = Math.atan2(this.sunDir.x, this.sunDir.z);
    this.scene.add(sunLane);
    const lane = this.m(new PlaneGeo(52, 240),
      new BasicMat({ map: this.radialTexture(), color: 0xffb877, transparent: true,
                     opacity: .3, depthWrite: false, blending: BLEND_ADD }),
      0, -.7, 132, { rx: -Math.PI / 2, cast: false, parent: sunLane });
    this.anims.push(t => { lane.material.opacity = .26 + Math.sin(t * .8) * .05; });

    /* ---- island mesh ----
       A subdivided plane displaced by heightAt(), tinted per vertex so sand,
       grass, rock and the odd snowy top come from the shape itself instead of
       a texture that would stretch over the slopes. */
    /* wide enough to contain the islet and its crag at r=168 and the park
       island, whose skirt reaches r=220 */
    const SEG = IS_TOUCH ? 148 : 256, SIZE = 460;
    const geo = new PlaneGeo(SIZE, SIZE, SEG, SEG);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    /* A wider palette than sand/grass/rock/snow: a wet band right at the water
       line, a second warmer green for the low meadows and a bare dirt tone
       under the steepest faces. Same cost, far less of a painted look. */
    const WET = new Col(0x4b4437), SAND = new Col(0x7a684e), MEADOW = new Col(0x4b7a3f),
          GRASS = new Col(0x2c5733), GRASS2 = new Col(0x3f6b3e), DIRT = new Col(0x554634),
          ROCK = new Col(0x4d4a5c), SNOW = new Col(0xcfd6e4);
    const tmp = new Col();

    /* terrainHeight, not heightAt: the bridge deck belongs in the walkable
       field but not in the ground, or the mesh grows a causeway under it */
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);          // plane is XY before rotation
      pos.setZ(i, terrainHeight(x, -y));
    }
    /* slope needs neighbouring heights, so colour in a second pass */
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = -y;
      const h = pos.getZ(i);
      const e = 1.6;
      const slope = Math.min(1, (Math.abs(terrainHeight(x + e, z) - h) + Math.abs(terrainHeight(x, z + e) - h)) / e * .8);
      const tint = fbm(x * .09, z * .09, 2);

      /* The islet and the bridge deck are their own place: run through the
         island's shore gradient they would come out as one flat sheet of wet
         sand, 60 units past a coastline they have nothing to do with. */
      if (isletHeight(x, z) !== null && h > islandHeight(x, z)) {
        tmp.copy(ROCK).lerp(GRASS, smoothstep(1, .3, slope) * .5);
        tmp.lerp(SNOW, smoothstep(17, 24, h));
        tmp.multiplyScalar(.8 + tint * .32);
        colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
        continue;
      }
      /* The park has its own ground: worn grass on top, sand around the rim.
         Run through the island's shore gradient it comes out as one sheet of
         wet sand a hundred metres past a coastline it has nothing to do
         with — the same reason the islet needs its own branch. */
      if (parkHeight(x, z) !== null && h > islandHeight(x, z)) {
        tmp.copy(MEADOW).lerp(GRASS2, tint);
        tmp.lerp(SAND, smoothstep(PARK_Y - .1, PARK_Y - 2.2, h));
        tmp.lerp(WET, smoothstep(PARK_Y - 2.4, PARK_Y - 3.6, h));
        tmp.multiplyScalar(.86 + tint * .28);
        colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
        continue;
      }
      const shore = Math.hypot(x, z) / coastRadius(Math.atan2(z, x));
      tmp.copy(GRASS).lerp(GRASS2, tint);
      tmp.lerp(MEADOW, smoothstep(4, .5, h) * (.35 + tint * .4));   // lush in the hollows
      tmp.lerp(DIRT, smoothstep(.35, .7, slope) * .55);
      tmp.lerp(ROCK, smoothstep(.55, 1, slope));
      tmp.lerp(ROCK, smoothstep(13, 20, h) * .8);
      tmp.lerp(SNOW, smoothstep(20, 27, h));
      tmp.lerp(SAND, smoothstep(.88, .975, shore));
      tmp.lerp(WET, smoothstep(.975, 1.005, shore));
      tmp.multiplyScalar(.86 + tint * .28);
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new F32Attr(colors, 3));
    geo.computeVertexNormals();
    const island = new Mesh(geo, this.detail(
      new StdMat({ vertexColors: true, roughness: 1, flatShading: false }), 1.5, .4));
    island.rotation.x = -Math.PI / 2;
    island.receiveShadow = true;
    island.castShadow = true;
    this.scene.add(island);
    this.island = island;
    this.outdoorOnly.push(island, water, sunLane);

    /* ---- surf line hugging the irregular coast ---- */
    const foamGeo = new BufGeo();
    const N = 260, fArr = new Float32Array(N * 2 * 3), fUv = new Float32Array(N * 2 * 2);
    const idx = [];
    for (let i = 0; i < N; i++) {
      const a = i / (N - 1) * Math.PI * 2;
      const R = coastRadius(a);
      const ca = Math.cos(a), sa = Math.sin(a);
      fArr[i * 6] = ca * (R - 2.5); fArr[i * 6 + 1] = .06; fArr[i * 6 + 2] = sa * (R - 2.5);
      fArr[i * 6 + 3] = ca * (R + 3.5); fArr[i * 6 + 4] = -.5; fArr[i * 6 + 5] = sa * (R + 3.5);
      fUv[i * 4] = i / N * 40; fUv[i * 4 + 1] = 0;
      fUv[i * 4 + 2] = i / N * 40; fUv[i * 4 + 3] = 1;
      if (i < N - 1) { const b = i * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    foamGeo.setAttribute("position", new F32Attr(fArr, 3));
    foamGeo.setAttribute("uv", new F32Attr(fUv, 2));
    foamGeo.setIndex(idx);
    foamGeo.computeVertexNormals();
    const foam = new Mesh(foamGeo, this.bmat(0xdff0f4, {
      transparent: true, opacity: .16, side: SIDE_DOUBLE, depthWrite: false }));
    this.scene.add(foam);
    this.outdoorOnly.push(foam);
    this.anims.push(t => { foam.material.opacity = .12 + Math.sin(t * 1.2) * .06; });

    /* ---- dirt paths from plaza to each temple, and out to the bridge ---- */
    this.pathSegs = [];
    for (const p of ZONE_POS.concat([{ x: BRIDGE_A.x, z: BRIDGE_A.z, r: -2 }])) {
      const dx = p.x, dz = p.z;
      const len = Math.hypot(dx, dz) - p.r - 6;
      const ang = Math.atan2(dx, dz);
      const cx = Math.sin(ang) * (10 + len / 2), cz = Math.cos(ang) * (10 + len / 2);
      const pathTex = this.noiseTexture("#33302a", ["#2a2823", "#3d3931", "#37332c"], 160, 1);
      pathTex.repeat.set(1, Math.max(2, Math.round(len / 6)));
      const seg = this.m(new PlaneGeo(2.6, len), new StdMat({ map: pathTex, roughness: 1 }),
        cx, .05, cz, { rx: -Math.PI / 2, cast: false, recv: true });
      seg.rotation.z = -ang;
      this.pathSegs.push({ x1: 0, z1: 0, x2: dx, z2: dz });
    }

    /* ---- pond with lily pads ---- */
    const pond = new Grp(); pond.position.set(-20, 0, 12); this.scene.add(pond);
    this.m(new CircleGeo(6.5, 28), this.mat(0x123650, { roughness: .15, metalness: .5 }), 0, .06, 0, { rx: -Math.PI / 2, cast: false, parent: pond });
    this.m(new RingGeo(6.4, 7.2, 28), this.mat(0x3a3427, { roughness: 1 }), 0, .07, 0, { rx: -Math.PI / 2, cast: false, parent: pond });
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * 6.28, r = 1 + Math.random() * 4.6;
      const pad = this.m(new CylGeo(.55, .55, .06, 7), this.mat(0x2f6b3c, { roughness: .8 }),
        Math.cos(a) * r, .12, Math.sin(a) * r, { cast: false, parent: pond });
      this.anims.push(t => { pad.position.y = .1 + Math.sin(t * 1.4 + i * 2) * .03; });
    }
    /* jumping fish in the pond */
    const jumper = this.m(new ConeGeo(.22, .7, 5), this.mat(0xf0a35e, { flatShading: true }), 0, -.4, 0, { parent: pond });
    this.anims.push(t => {
      const ph = (t * .7 + .3) % 3;
      if (ph < 1) {
        const y = Math.sin(ph * Math.PI) * 1.6;
        jumper.visible = true;
        jumper.position.set(Math.cos(t * .4) * 2.4, y, Math.sin(t * .4) * 2.4);
        jumper.rotation.z = ph * Math.PI * (jumper.position.x > 0 ? -1 : 1);
      } else jumper.visible = false;
    });

    this.pondPos = { x: -20, z: 12, r: 8 };
    this.buildHorizon();
  }

  /* ============ horizon ============
     Rings of mountain silhouettes at three depths. They opt out of the fog and
     carry pre-mixed atmospheric colours instead, which keeps the far distance
     reading as depth rather than as an empty backdrop behind the sea. */
  buildHorizon() {
    /* Three ranges, each one merged buffer.

       They used to be forty-odd separate cones painted a single flat colour
       per ring, spaced far enough apart that you could see sky between them:
       a row of blue triangles standing on the sea rather than a range. Now
       each range is a continuous ridgeline of pyramids sharing one geometry,
       and the colour is per vertex — dark at the summits, fading toward the
       haze colour at the feet. That vertical fade is the whole illusion of
       distance; a flat fill has no distance in it at all, however far away you
       put the mesh.

       Still no fog on them. Fog is linear in distance and these sit at ten
       times the range it is tuned for, so it would swallow them whole; the
       aerial perspective is baked into the vertex colours instead. */
    const rings = [
      { dist: 700, h: 96, w: 150, n: 26, ridge: 0x2c3752, haze: 0x5a627e, jitter: .5, snow: .80 },
      { dist: 1050, h: 165, w: 230, n: 22, ridge: 0x3a4562, haze: 0x6b718f, jitter: .4, snow: .84 },
      { dist: 1500, h: 250, w: 360, n: 18, ridge: 0x4d5875, haze: 0x7b809b, jitter: .3, snow: .88 }
    ];
    const snowCol = new Col(0x9aa4bc);
    for (const r of rings) {
      const ridge = new Col(r.ridge), haze = new Col(r.haze), c = new Col();
      const verts = [], cols = [];
      /* one pyramid: apex plus a square footing, four faces, no index buffer —
         at this size a shared vertex would have to average two colours anyway */
      const peak = (cx, cz, ww, hh, lean, capped) => {
        const base = [[-ww, -ww], [ww, -ww], [ww, ww], [-ww, ww]];
        for (let f = 0; f < 4; f++) {
          const p0 = base[f], p1 = base[(f + 1) % 4];
          const tri = [[cx + p0[0], -14, cz + p0[1]],
                       [cx + p1[0], -14, cz + p1[1]],
                       [cx + lean, hh - 14, cz]];
          for (const v of tri) {
            verts.push(v[0], v[1], v[2]);
            const k = Math.max(0, v[1] + 14) / hh;
            /* feet in haze, summits dark, and snow only on the summits that
               earn it — capping every shoulder as well turned the skyline
               into a row of white teeth */
            c.copy(haze).lerp(ridge, Math.min(1, k * 1.35));
            if (capped && k > r.snow) c.lerp(snowCol, Math.min(1, (k - r.snow) / (1 - r.snow) * 1.6));
            cols.push(c.r, c.g, c.b);
          }
        }
      };
      for (let i = 0; i < r.n; i++) {
        const a = (i / r.n) * Math.PI * 2 + (hash2(i, r.n) - .5) * (Math.PI / r.n);
        const d = r.dist * (1 + (hash2(i, 7) - .5) * r.jitter * .2);
        const hh = r.h * (.5 + hash2(i, 13) * 1.05);
        const ww = r.w * (.55 + hash2(i, 29) * .85);
        /* Local frame for this slot, laid out by hand rather than by lookAt:
           everything goes into one buffer, so there is no per-peak object left
           to hold a rotation. */
        const ca = Math.cos(a), sa = Math.sin(a);
        const px = ca * d, pz = sa * d;
        /* two shoulders either side of the main summit, so consecutive slots
           overlap into a ridge instead of standing apart as separate hills */
        for (const [off, s] of [[-1.15, .62], [0, 1], [1.05, .7], [1.9, .45]]) {
          const ox = px - sa * ww * off, oz = pz + ca * ww * off;
          peak(ox, oz, ww * .62 * (s * .55 + .45), hh * s,
            (hash2(i, off * 7 + 3) - .5) * ww * .3, hh * s > r.h * .92);
        }
      }
      const geo = new BufGeo();
      geo.setAttribute("position", new F32Attr(new Float32Array(verts), 3));
      geo.setAttribute("color", new F32Attr(new Float32Array(cols), 3));
      const mesh = new Mesh(geo, new BasicMat({ vertexColors: true, fog: false, side: SIDE_DOUBLE }));
      mesh.frustumCulled = false;             // the bounds wrap the whole world
      /* Nearest range first. These three cover most of the sky band and
         overlap heavily, and because their bounding spheres are all centred on
         the world three cannot sort them front-to-back on its own — drawn in
         the wrong order the far ranges shade every pixel the near one is about
         to cover, which was most of the cost of the whole horizon. */
      mesh.renderOrder = -10 + rings.indexOf(r);
      this.scene.add(mesh);
      this.outdoorOnly.push(mesh);
    }

    /* Two bands of haze standing in front of the far ranges. Mountains that
       end in a hard line at the sea look like cardboard cut-outs propped up
       behind it; a range wants to dissolve into its own distance. */
    /* Kept low and thin. A first pass put these at eight tenths opacity and
       ninety units tall, and since they are shells seen from the inside that
       is a translucent wall wrapped round the whole world — the sky went flat
       and the ranges behind them disappeared. Haze belongs in the last few
       degrees above the sea, not across the upper half of the frame. */
    const hazeTex = this.makeCanvas(4, 128, g => {
      const grad = g.createLinearGradient(0, 128, 0, 0);
      grad.addColorStop(0, "rgba(104,114,150,0.46)");
      grad.addColorStop(.4, "rgba(100,110,146,0.17)");
      grad.addColorStop(1, "rgba(96,106,142,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 4, 128);
    });
    for (const [d, h] of [[820, 52], [1240, 84]]) {
      const band = this.m(new CylGeo(d, d, h, 48, 1, true),
        new BasicMat({ map: hazeTex, transparent: true, depthWrite: false,
                       side: SIDE_BACK, fog: false }),
        0, h * .5 - 16, 0, { cast: false });
      band.frustumCulled = false;
      this.outdoorOnly.push(band);
    }
  }

  /* ============ central plaza — the lobby ============

     This is the first thing anyone sees, so it is the one part of the island
     built like a place rather than scattered with props. A paved circle with
     a kerb, a tiered fountain carrying the island's cat deity, a ring of
     standing stones that name the seven temples and point down their roads,
     and enough benches and topiary that the space between them is furnished.

     Everything is composed from the primitives this build still has — no
     lathe, no extrude, no loader, no mesh file to load. Anything that reads
     as a curve is a stack of cylinders; anything that reads as carving is
     drawn into a canvas and used as a map. */
  buildPlaza() {
    const PAVE_R = 12;
    /* One stone family for the whole square, and a warm one. The island's rock
       is a cool purple-grey, and built out of that the whole plaza sank into
       the dusk as a single navy mass — indistinguishable from the sea behind
       it and from every prop standing on it. Sandstone reads against both the
       green of the lawn and the blue of the hour, and it agrees with the amber
       lamps that light it. detail() supplies the grain, same as the lawn. */
    const stone = this.detail(this.mat(0x8a7c69, { roughness: .8, metalness: .03 }), 3, .16);
    const stoneD = this.detail(this.mat(0x5e5548, { roughness: .9 }), 3, .16);
    const stonePale = this.detail(this.mat(0xa1937c, { roughness: .82 }), 3.4, .15);
    const bronze = this.mat(0x9c7a44, { roughness: .45, metalness: .5 });

    /* ---- paving ----
       Drawn at 1024 so the joints stay crisp when you stand on them: at 512 a
       one-pixel joint line is four centimetres wide on the ground. */
    const tex = this.makeCanvas(1024, 1024, g => {
      const C = 512;
      g.fillStyle = "#3a342b"; g.fillRect(0, 0, 1024, 1024);
      /* concentric courses of flags, each ring a slightly different stone */
      const tones = ["#463f33", "#3d372d", "#4e463a", "#413a30", "#524936"];
      for (let i = 10; i >= 0; i--) {
        g.fillStyle = tones[i % tones.length];
        g.beginPath(); g.arc(C, C, 46 + i * 44, 0, 7); g.fill();
      }
      /* joints: radial every 7.5°, staggered course to course so the pattern
         never lines up into spokes */
      g.strokeStyle = "rgba(24,19,12,.72)"; g.lineWidth = 3;
      for (let i = 0; i <= 10; i++) {
        const r0 = 46 + i * 44, r1 = r0 + 44;
        g.beginPath(); g.arc(C, C, r0, 0, 7); g.stroke();
        const n = 24 + i * 4, off = (i % 2) * Math.PI / n;
        for (let k = 0; k < n; k++) {
          const a = k / n * Math.PI * 2 + off;
          g.beginPath();
          g.moveTo(C + Math.cos(a) * r0, C + Math.sin(a) * r0);
          g.lineTo(C + Math.cos(a) * r1, C + Math.sin(a) * r1);
          g.stroke();
        }
      }
      /* a bronze compass band, mostly hidden by the fountain but it catches
         the light where it runs out past the basin */
      g.strokeStyle = "#8a6c3e"; g.lineWidth = 7;
      g.beginPath(); g.arc(C, C, 300, 0, 7); g.stroke();
      g.lineWidth = 3;
      g.beginPath(); g.arc(C, C, 318, 0, 7); g.stroke();
      for (let k = 0; k < 16; k++) {
        const a = k / 16 * Math.PI * 2, long = k % 4 === 0;
        g.lineWidth = long ? 9 : 4;
        g.beginPath();
        g.moveTo(C + Math.cos(a) * 300, C + Math.sin(a) * 300);
        g.lineTo(C + Math.cos(a) * (long ? 356 : 330), C + Math.sin(a) * (long ? 356 : 330));
        g.stroke();
      }
      /* weathering: dark blotches so the flags are not all the same age */
      for (let i = 0; i < 220; i++) {
        const a = Math.random() * 7, r = Math.random() * 500;
        g.fillStyle = `rgba(20,15,9,${.03 + Math.random() * .07})`;
        g.beginPath();
        g.arc(C + Math.cos(a) * r, C + Math.sin(a) * r, 6 + Math.random() * 26, 0, 7);
        g.fill();
      }
    });
    this.m(new CircleGeo(PAVE_R, 72), new StdMat({ map: tex, roughness: .84 }), 0, .06, 0,
      { rx: -Math.PI / 2, cast: false, recv: true });
    /* Kerb, laid flush. A raised one would be the right look and the wrong
       thing entirely: the cat rides heightAt(), which is flat here, so a step
       with real height is a step it walks straight through. */
    this.m(new RingGeo(PAVE_R, PAVE_R + .8, 72), this.mat(0x6d6354, { roughness: .92 }), 0, .05, 0,
      { rx: -Math.PI / 2, cast: false, recv: true });

    /* ---- the roads out, and a bronze marker inlaid at each mouth ----
       Eight ways leave this square and until now nothing on the ground said
       so. Each strip is the colour of what it leads to. */
    const roads = ZONE_POS.map((p, i) => ({ a: Math.atan2(p.x, p.z), col: ZONES_META[i].color, i }));
    roads.push({ a: Math.atan2(BRIDGE_A.x, BRIDGE_A.z), col: CYAN, i: -1 });
    for (const r of roads) {
      const bx = Math.sin(r.a), bz = Math.cos(r.a);
      const c = new Col(r.col);
      /* Inlay, not signage. A full-colour plate lying flat under five lamps is
         a lit surface facing straight up: whatever colour you give it, it
         comes back as a bright card dropped on the floor. So the plate is dark
         bronze and only a narrow bar down the middle of it carries the colour,
         which is also how a real inlaid strip would catch your eye. */
      this.m(new BoxGeo(.72, .05, 1.7), this.mat(0x3f3a31, { roughness: .95 }),
        bx * 10.5, .08, bz * 10.5, { ry: r.a, cast: false, recv: true });
      /* No emissive at all on the bar. Anything self-lit and horizontal here
         clears the bloom threshold and comes back as a strip light embedded in
         the floor; a matte coloured stone under five lamps is bright enough. */
      this.m(new BoxGeo(.2, .06, 1.42), this.mat(c, { roughness: .92 }),
        bx * 10.5, .095, bz * 10.5, { ry: r.a, cast: false });
      /* a chevron of two smaller studs, pointing the way */
      for (const k of [0, 1])
        this.m(new BoxGeo(.22, .05, .22), bronze, bx * (11.35 + k * .42) + bz * (k ? .2 : -.2),
          .08, bz * (11.35 + k * .42) - bx * (k ? .2 : -.2), { ry: r.a, cast: false, recv: true });
    }

    /* ---- fountain ---- */
    this.fountain(stone, stoneD, stonePale, bronze);

    /* ---- the ring of standing stones ----
       One per temple, set a little to the left of its road so it flanks the
       way out instead of blocking it, turned to face the middle of the square.
       An eighth marks the road to the bridge and the caves. */
    const OFF = .23;                     // radians off the road centre ≈ 3.2 m out here
    for (const r of roads) {
      const a = r.a + OFF, R = 13.9;
      const name = r.i >= 0 ? ZONES_META[r.i].name[state.lang] || ZONES_META[r.i].name.es
                            : (state.lang === "es" ? "Cuevas de Cristal" : "Crystal Caves");
      this.stele(Math.sin(a) * R, Math.cos(a) * R, a + Math.PI, r.col, name);
    }

    /* ---- lamps, benches, topiary ----
       The lamps used to sit on a fixed five-fold ring, which put some of them
       square in the mouth of a road. They now stand in the widest gaps between
       roads, which is both tidier and the reason the roads read as roads. */
    const bearings = roads.map(r => r.a).sort((p, q) => p - q);
    const gaps = bearings.map((b, i) => {
      const nxt = i === bearings.length - 1 ? bearings[0] + Math.PI * 2 : bearings[i + 1];
      return { mid: (b + nxt) / 2, size: nxt - b };
    }).sort((p, q) => q.size - p.size);
    for (const gp of gaps.slice(0, 5))
      this.lampPost(Math.sin(gp.mid) * 13.4, Math.cos(gp.mid) * 13.4);
    /* Bench and planter both dead centre of the gap. Offsetting the planter
       by a fixed angle put one of them in the mouth of the road you spawn
       facing — the gaps are not all the same width, so "a bit to the side"
       means something different at each one. */
    if (!IS_TOUCH)
      for (const gp of gaps.slice(0, 4)) {
        this.bench(Math.sin(gp.mid) * 8.4, Math.cos(gp.mid) * 8.4, gp.mid + Math.PI, stone, stoneD);
        this.planter(Math.sin(gp.mid) * 11.4, Math.cos(gp.mid) * 11.4, stoneD);
      }
    /* the corner the crate pyramid used to occupy */
    this.planter(-14.6, -11.4, stoneD);
    this.bench(-12.2, -14.2, 2.3, stone, stoneD);

    /* ---- physics letters R A U L ----
       Bruno-Simon style: they are the one thing in the square you are allowed
       to knock over, so they sit on the paving where you will hit them rather
       than dropped from six metres onto the grass behind it. */
    const letterCols = [GREEN, AMBER, BLUE, PINK];
    "RAUL".split("").forEach((ch, i) => {
      const tex2 = this.makeCanvas(256, 256, g => {
        g.fillStyle = "#22202a"; g.fillRect(0, 0, 256, 256);
        g.strokeStyle = "#3a3648"; g.lineWidth = 10; g.strokeRect(5, 5, 246, 246);
        g.font = '700 184px "Space Grotesk", sans-serif';
        g.textAlign = "center"; g.textBaseline = "middle";
        g.shadowColor = letterCols[i]; g.shadowBlur = 26;
        g.fillStyle = letterCols[i];
        g.fillText(ch, 128, 140);
      });
      const x = -4.5 + i * 3, z = -15.5;
      const mesh = this.m(new BoxGeo(1.8, 1.8, 1.8),
        new StdMat({ map: tex2, roughness: .55, metalness: .1 }), x, 2.4, z, { recv: true });
      const body = new CBody({ mass: 2.5 });
      body.addShape(new CBox(new CVec(.9, .9, .9)));
      body.position.set(x, 1.6 + i * .35, z);
      body.quaternion.setFromEuler(0, (Math.random() - .5) * .4, 0);
      this.world.addBody(body);
      this.sync.push({ mesh, body });
    });
  }

  /* ---- the fountain ----
     Three tiers, because one basin at one height is a birdbath and the thing
     has to hold the eye from across the square. Water is a plain disc with
     ripple rings crawling outward over it: with no environment map to reflect
     there is nothing to gain from a fancier surface, and the movement is what
     sells it anyway. */
  fountain(stone, stoneD, stonePale, bronze) {
    const F = new Grp(); this.scene.add(F);
    const water = this.mat(0x11405e, { roughness: .16, metalness: .35 });

    /* Lower basin. Kept under four metres across: at the five and a half it
       started at, the fountain was two thirds the width of the paving and the
       square read as a pond with a path round it. */
    this.m(new CylGeo(3.6, 3.9, .3, 40), stonePale, 0, .15, 0, { parent: F, recv: true });
    this.m(new CylGeo(3.2, 3.34, .82, 40), stone, 0, .7, 0, { parent: F, recv: true });
    this.m(new TorusGeo(3.28, .16, 8, 40), stonePale, 0, 1.08, 0, { parent: F, rx: Math.PI / 2 });
    this.m(new CircleGeo(3.16, 40), water, 0, .88, 0, { parent: F, rx: -Math.PI / 2, cast: false });
    /* scalloped apron: twelve blocks stepped out around the wall, which is
       what stops a plain cylinder reading as a bucket */
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      this.m(new BoxGeo(.6, .54, .3), stoneD,
        Math.cos(a) * 3.4, .54, Math.sin(a) * 3.4, { parent: F, ry: -a, recv: true });
    }

    /* stem and upper bowl */
    this.m(new CylGeo(.72, 1, .5, 16), stone, 0, 1.1, 0, { parent: F, recv: true });
    this.m(new CylGeo(.42, .58, 1.2, 12), stone, 0, 1.9, 0, { parent: F });
    this.m(new TorusGeo(.5, .085, 6, 16), bronze, 0, 1.7, 0, { parent: F, rx: Math.PI / 2 });
    this.m(new CylGeo(1.45, .82, .42, 24), stone, 0, 2.68, 0, { parent: F, recv: true });
    this.m(new TorusGeo(1.45, .11, 8, 28), stonePale, 0, 2.87, 0, { parent: F, rx: Math.PI / 2 });
    this.m(new CircleGeo(1.37, 24), water, 0, 2.85, 0, { parent: F, rx: -Math.PI / 2, cast: false });

    /* four spouts, and the sheets of water falling off them */
    const sheet = new StdMat({ color: 0xbfe6ff, transparent: true, opacity: .3,
                               roughness: .1, depthWrite: false });
    for (let i = 0; i < 4; i++) {
      const a = i / 4 * Math.PI * 2 + Math.PI / 4;
      const sx = Math.cos(a), sz = Math.sin(a);
      this.m(new CylGeo(.11, .14, .42, 8), bronze, sx * 1.38, 2.78, sz * 1.38,
        { parent: F, rz: Math.PI / 2, ry: -a });
      const fall = this.m(new BoxGeo(.28, 1.85, .05), sheet, sx * 1.5, 1.85, sz * 1.5,
        { parent: F, ry: -a, cast: false });
      this.anims.push(t => {
        fall.scale.y = 1 + Math.sin(t * 3.1 + i) * .06;
        fall.material.opacity = .26 + Math.sin(t * 2.3 + i * 1.7) * .05;
      });
    }

    /* ripples on the lower basin: three rings crawling out and fading, which
       is cheaper and reads better than displacing a 48-segment disc */
    for (let i = 0; i < 3; i++) {
      const ring = this.m(new RingGeo(.5, .74, 40), new BasicMat({
        color: 0xa8dcff, transparent: true, opacity: .3, depthWrite: false, blending: BLEND_ADD }),
        0, .9, 0, { parent: F, rx: -Math.PI / 2, cast: false });
      this.anims.push(t => {
        const ph = ((t * .42 + i / 3) % 1);
        const s = .8 + ph * 3.4;
        ring.scale.set(s, s, 1);
        ring.material.opacity = .34 * (1 - ph) * Math.min(1, ph * 5);
      });
    }

    /* The deity, scaled up rather than the fountain scaled down around it:
       from across the square the statue is the thing you should be able to
       name, and at native size on a shrunk bowl it read as an ornament. */
    /* Through the registry, not straight to the builder. If public/models
       holds a cat-statue file it arrives here instead, and nothing else in
       this function changes — that is the whole contract the folder offers. */
    const statue = getModel("cat-statue");
    statue.position.y = 3.06;
    statue.scale.setScalar(1.34);
    F.add(statue);

    /* Lit from below like a monument, not from a lantern hung over its head.
       The old rig had a 4.4-unit green sprite parked at the statue's shoulder,
       which is exactly where it stops being a statue and becomes a blob. */
    this.addLight(0, 2.2, 0, 0x7fdca8, 5, 20);
    F.add(this.glowSprite(0x7fdca8, 1.7, new V3(0, 3.1, 0)));

    /* spray, arcing off the upper bowl into the basin */
    const drops = IS_TOUCH ? 22 : 44;
    const geo = new BufGeo();
    geo.setAttribute("position", new F32Attr(new Float32Array(drops * 3), 3));
    const pts = new Points3(geo, new PointsMat({ color: 0x9fd8ff, size: .26,
      map: this.radialTexture(), transparent: true, opacity: .8, depthWrite: false, blending: BLEND_ADD }));
    this.scene.add(pts);
    this.anims.push(t => {
      const a = pts.geometry.attributes.position.array;
      for (let i = 0; i < drops; i++) {
        const ph = (t * .9 + i / drops) % 1;
        const ang = i * 2.399;
        const r = 1.35 + ph * 1.7;                      // outward as it falls
        a[i * 3] = Math.cos(ang) * r;
        a[i * 3 + 1] = 3.15 + Math.sin(ph * 2.1) * .9 - ph * ph * 2.9;
        a[i * 3 + 2] = Math.sin(ang) * r;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    });

    this.scyl(3.6, 4, 0, 2, 0);
    this.addOccluder(0, 2.6, 0, 2.6);
  }

  /* ---- the cat deity ----
     A seated cat in stone, about two metres of it. Built the way you would
     rough one out of a block: haunches, chest, head, then the details that
     make it a cat rather than a bear — the ear cones, the muzzle, the tail
     curled round the base. Twenty-odd primitives, which is a lot for one prop
     and the right amount for the thing at the centre of the first screen.

     The eyes are emissive and they pulse. That is the whole trick that keeps
     a grey statue from disappearing into a grey fountain at dusk. */
  catStatue() {
    const G = new Grp();
    /* Paler and warmer than the fountain it stands on, deliberately: carved
       from the same block it disappeared into the basin at any distance, and
       the one thing in the square that has to read from the far kerb is this. */
    const stone = this.mat(0xb9ac93, { roughness: .58, metalness: .06, flatShading: false });
    const stoneW = this.mat(0x9c907a, { roughness: .68 });
    const gold = this.mat(0xc9a24a, { roughness: .3, metalness: .7 });

    /* pedestal */
    this.m(new CylGeo(1.05, 1.2, .22, 20), stoneW, 0, -.75, 0, { parent: G, recv: true });
    this.m(new CylGeo(.92, .95, .42, 20), stone, 0, -.43, 0, { parent: G, recv: true });
    this.m(new TorusGeo(.93, .07, 6, 24), stoneW, 0, -.22, 0, { parent: G, rx: Math.PI / 2 });

    /* haunches and rump — one squashed sphere does the whole seated mass */
    const rump = this.m(new SphGeo(.62, 18, 14), stone, 0, .34, -.12, { parent: G, recv: true });
    rump.scale.set(1, .82, 1.15);
    for (const s of [-1, 1]) {
      const thigh = this.m(new SphGeo(.3, 14, 10), stone, s * .42, .2, .14, { parent: G, recv: true });
      thigh.scale.set(.8, .78, 1.35);
      this.m(new SphGeo(.15, 12, 8), stone, s * .4, .1, .58, { parent: G });   // hind paw
    }

    /* chest, tapering up out of the rump */
    this.m(new CylGeo(.29, .46, .82, 16), stone, 0, .82, .1, { parent: G, recv: true });
    const chest = this.m(new SphGeo(.31, 16, 12), stone, 0, .78, .26, { parent: G });
    chest.scale.set(1, 1.1, .85);

    /* forelegs, straight down to the plinth the way a seated cat holds them */
    for (const s of [-1, 1]) {
      this.m(new CylGeo(.095, .12, .84, 10), stone, s * .2, .38, .38, { parent: G });
      const paw = this.m(new SphGeo(.135, 12, 8), stone, s * .2, .0, .46, { parent: G, recv: true });
      paw.scale.set(1, .7, 1.3);
    }

    /* head */
    const head = this.m(new SphGeo(.36, 18, 14), stone, 0, 1.42, .12, { parent: G });
    head.scale.set(1, .94, .98);
    const muzzle = this.m(new SphGeo(.19, 14, 10), stone, 0, 1.32, .38, { parent: G });
    muzzle.scale.set(1.2, .82, .95);
    /* The face has to survive being ten metres away and two metres up. At the
       size a real cat's features are it came out as a blank pale egg, so the
       nose, the inner ears and the eyes are all cut deeper and darker than
       anatomy would have them — this is a carving, and carvings exaggerate. */
    const shade = this.mat(0x6b5f4c, { roughness: .8 });
    this.m(new ConeGeo(.08, .1, 4), shade, 0, 1.37, .54, { parent: G, rx: -Math.PI / 2 });
    for (const s of [-1, 1]) {
      this.m(new ConeGeo(.17, .36, 5), stone, s * .21, 1.8, .08, { parent: G, rz: s * .16 });
      this.m(new ConeGeo(.1, .24, 5), shade, s * .21, 1.76, .15, { parent: G, rz: s * .16 });
      this.m(new BoxGeo(.13, .035, .04), shade, s * .075, 1.28, .52, { parent: G, rz: -s * .3, cast: false });
    }
    const eyeMat = new StdMat({ color: 0xbdfbf0, emissive: new Col(CYAN),
                                emissiveIntensity: 1.5, roughness: .22 });
    const eyes = [];
    for (const s of [-1, 1]) {
      /* a socket behind each eye: without it the eye is a bright bead sitting
         on the surface instead of set into the head */
      this.m(new SphGeo(.105, 10, 8), shade, s * .14, 1.47, .32, { parent: G, cast: false });
      const e = this.m(new SphGeo(.082, 10, 8), eyeMat, s * .14, 1.47, .36, { parent: G, cast: false });
      e.scale.set(1, 1.3, .75);
      eyes.push(e);
    }
    /* whisker studs, so the muzzle is not a blank lump */
    for (const s of [-1, 1])
      for (let k = 0; k < 3; k++)
        this.m(new SphGeo(.018, 6, 5), stoneW, s * (.1 + k * .03), 1.3 - k * .035, .5,
          { parent: G, cast: false });

    /* collar with a bell — the one warm thing on it */
    this.m(new TorusGeo(.28, .045, 6, 20), gold, 0, 1.12, .16, { parent: G, rx: Math.PI / 2 - .18 });
    this.m(new SphGeo(.075, 10, 8), gold, 0, 1.0, .36, { parent: G });

    /* tail, curled round the right of the base: nine shrinking beads on an
       arc, which is the only way to get a curve with no lathe and no tube */
    for (let i = 0; i < 9; i++) {
      const t = i / 8;
      const a = -.5 + t * 2.5;
      const r = .62 + t * .26;
      this.m(new SphGeo(.115 - t * .045, 10, 8), stone,
        Math.sin(a) * r * .95, .1 + t * t * .5, Math.cos(a) * r * .8 - .1, { parent: G });
    }

    this.anims.push(t => {
      eyeMat.emissiveIntensity = 1.25 + Math.sin(t * 1.35) * .5;
      /* and every nine seconds or so, a blink */
      for (const e of eyes) e.scale.y = 1.3 * (1 - Math.max(0, Math.sin(t * .7 + 1.2) - .96) * 22);
    });
    return G;
  }

  /* ---- standing stone ----
     A marker per road. It carries the temple's colour in an inset panel and
     its name cut into the face, so the square explains its own exits instead
     of leaving you to walk down all eight and find out. */
  /* The stone only. The colour and the name are not part of the model: eight
     of these stand around the square and each one belongs to a different
     temple, so the identity is the scene's business and the rock is what the
     folder can replace. The recessed face is named `panel` so a replacement
     can put its inset somewhere else and still be found. */
  steleModel() {
    const G = new Grp();
    /* eight of these get built; one pair of materials between them, or the
       square alone accounts for sixteen identical standard materials */
    if (!this.steleMats) this.steleMats = {
      rock: this.detail(this.mat(0x6b6153, { roughness: .9, flatShading: true }), 2.6, .2),
      rockD: this.mat(0x4e463c, { roughness: .95, flatShading: true })
    };
    const { rock, rockD } = this.steleMats;

    /* Eight of these stand round a twelve-metre square, so a centimetre of
       extra girth is eight more centimetres of blocked view. Kept under three
       metres and narrow enough to see the roads between them. */
    this.m(new CylGeo(.74, .88, .3, 6), rockD, 0, .15, 0, { parent: G, recv: true });
    this.m(new CylGeo(.4, .56, 2.15, 6), rock, 0, 1.35, 0, { parent: G, recv: true });
    this.m(new ConeGeo(.5, .46, 6), rock, 0, 2.62, 0, { parent: G });
    /* two shoulders so the shaft is not a plain post */
    for (const s of [-1, 1])
      this.m(new BoxGeo(.2, .44, .2), rockD, s * .42, 2.05, 0, { parent: G, rz: s * .3 });
    this.m(new BoxGeo(.68, 1.3, .09), rockD, 0, 1.5, .36, { parent: G, recv: true }).name = "panel";
    return G;
  }

  stele(x, z, ry, color, name) {
    const G = getModel("stele");
    G.position.set(x, 0, z); G.rotation.y = ry; this.scene.add(G);
    /* everything from here down is this particular temple's, not the stone's,
       and rides on wherever the model put its panel */
    const panel = G.getObjectByName("panel");
    const py = panel ? panel.position.y : 1.5;
    const pz = panel ? panel.position.z : .36;

    const c = new Col(color);
    this.m(new BoxGeo(.44, .44, .07), new StdMat({ color: c, emissive: c,
      emissiveIntensity: 1.15, roughness: .3 }), 0, py + .32, pz + .06, { parent: G, cast: false });
    const plate = this.makeCanvas(256, 128, g => {
      g.fillStyle = "#3a3546"; g.fillRect(0, 0, 256, 128);
      g.font = '700 30px "Space Grotesk", sans-serif';
      g.textAlign = "center"; g.textBaseline = "middle";
      /* two lines if the name is long — "Templo de la Evolución" on one line
         at this width comes out four pixels tall and unreadable */
      const words = name.split(" ");
      const lines = [];
      let cur = "";
      for (const w of words) {
        if ((cur + " " + w).trim().length > 13) { lines.push(cur.trim()); cur = w; }
        else cur += " " + w;
      }
      lines.push(cur.trim());
      const use = lines.slice(0, 3);
      g.fillStyle = "#" + c.getHexString();
      use.forEach((ln, i) => g.fillText(ln, 128, 64 + (i - (use.length - 1) / 2) * 34));
    });
    this.m(new PlaneGeo(.6, .3), new BasicMat({ map: plate, transparent: true }),
      0, py - .26, pz + .07, { parent: G, cast: false });

    G.add(this.glowSprite(color, 1.3, new V3(0, py + .32, pz + .12)));
    this.scyl(.55, 2.8, x, 1.4, z);
    this.addOccluder(x, 1.6, z, .72);
  }

  /* ---- stone bench ---- */
  bench(x, z, ry, stone, stoneD) {
    const G = new Grp(); G.position.set(x, 0, z); G.rotation.y = ry; this.scene.add(G);
    for (const s of [-1, 1])
      this.m(new BoxGeo(.34, .44, .78), stoneD, s * .95, .22, 0, { parent: G, recv: true });
    this.m(new BoxGeo(2.6, .18, .86), stone, 0, .53, 0, { parent: G, recv: true });
    this.m(new BoxGeo(2.6, .07, .12), stone, 0, .63, -.37, { parent: G });   // lip
    /* backrest, leaned back a touch so it is a bench and not a shelf */
    this.m(new BoxGeo(2.5, .5, .12), stone, 0, .92, -.4, { parent: G, rx: -.16, recv: true });
    this.sbox(2.6, .7, .9, x, .35, z, ry);
    this.addOccluder(x, .6, z, 1.2);
  }

  /* ---- planter with topiary ----
     The foliage goes through foliageMat so it picks up the same wind as the
     trees; a clipped ball that stands dead still next to swaying pines is the
     kind of thing you notice without knowing why. */
  planter(x, z, stoneD) {
    const G = new Grp(); G.position.set(x, 0, z); this.scene.add(G);
    this.m(new CylGeo(.86, .68, .78, 12), stoneD, 0, .39, 0, { parent: G, recv: true });
    this.m(new TorusGeo(.86, .08, 6, 16), stoneD, 0, .76, 0, { parent: G, rx: Math.PI / 2 });
    this.m(new CircleGeo(.8, 12), this.mat(0x3a3026, { roughness: 1 }), 0, .77, 0,
      { parent: G, rx: -Math.PI / 2, cast: false });
    this.m(new CylGeo(.09, .11, .5, 6), this.mat(0x4a3324, { roughness: 1 }), 0, 1, 0, { parent: G });
    const ball = this.m(new IcoGeo(.72, 1), this.foliageMat(0x2f6b3c), 0, 1.72, 0, { parent: G, recv: true });
    ball.scale.set(1, .88, 1);
    this.m(new IcoGeo(.42, 1), this.foliageMat(0x3a7d4a), .18, 2.32, -.1, { parent: G });
    this.scyl(.88, 1, x, .5, z);
    this.addOccluder(x, 1.6, z, 1);
  }

  /* One car of the train, nose toward +Z, origin on the axle line. */
  coasterCarModel(i = 0) {
    if (!this.carMats) this.carMats = {
      shell: this.mat(0xd6543c, { roughness: .55, flatShading: true }),
      lead: this.mat(0xf0a35e, { roughness: .55, flatShading: true }),
      trim: this.mat(0xffd76a, { roughness: .4, metalness: .3 }),
      dark: this.mat(0x2e2b34, { roughness: .7 })
    };
    const { shell, lead, trim, dark } = this.carMats;
    const car = new Grp();
    this.m(new BoxGeo(1.05, .62, 1.5), i ? shell : lead, 0, .42, 0, { parent: car, recv: true });
    this.m(new BoxGeo(1.12, .12, 1.56), trim, 0, .74, 0, { parent: car, cast: false });
    if (!i) this.m(new ConeGeo(.34, .62, 6), shell, 0, .46, .92, { parent: car, rx: Math.PI / 2 });
    this.m(new BoxGeo(.9, .28, .1), dark, 0, .78, -.4, { parent: car, cast: false });   // lap bar
    for (const s of [-1, 1]) for (const z of [-.5, .5])
      this.m(new CylGeo(.17, .17, .1, 8), dark, s * .52, .16, z, { parent: car, rz: Math.PI / 2, cast: false });
    /* a passenger, so the thing has a reason to be moving */
    this.m(new SphGeo(.2, 10, 8), this.mat([0xe08840, 0x8fb0ff, 0x7fdca8][i % 3], { roughness: .8 }),
      0, .82, -.1, { parent: car, cast: false }).name = "rider";
    return car;
  }

  crateModel() {
    if (!this.crateMat) this.crateMat = new StdMat({ map: this.crateTexture(), roughness: .92 });
    const g = new Grp();
    this.m(new BoxGeo(1.3, 1.3, 1.3), this.crateMat, 0, 0, 0, { parent: g, recv: true });
    return g;
  }

  lampModel() {
    const g = new Grp();
    const iron = this.mat(0x232028, { roughness: .6, metalness: .5 });
    this.m(new CylGeo(.09, .13, 3.4, 7), iron, 0, 1.7, 0, { parent: g });
    /* named, because the scene hangs the glow and the light off it and a
       replacement model has to offer the same handle — the folder's README
       lists it for exactly this reason */
    this.m(new SphGeo(.26, 10, 8), new StdMat({ color: 0xffd9a0, emissive: new Col(0xffb96a), emissiveIntensity: .85, roughness: .3 }), 0, 3.5, 0, { parent: g, cast: false }).name = "bulb";
    this.m(new ConeGeo(.4, .3, 8), iron, 0, 3.85, 0, { parent: g });
    return g;
  }
  lampPost(x, z) {
    const g = getModel("lamp");
    g.position.set(x, 0, z); this.scene.add(g);
    /* the glow follows the bulb wherever the model puts it, so a taller lamp
       does not leave its halo hanging at the old height */
    const bulb = g.getObjectByName("bulb");
    const by = bulb ? bulb.position.y : 3.5;
    g.add(this.glowSprite(0xffb96a, 2, new V3(0, by, 0)));
    const lamp = this.addLight(x, by, z, 0xffb371, 7, 17);
    /* gas-lamp wobble */
    this.anims.push(t => { lamp.intensity = 6.4 + Math.sin(t * 4.3 + x) * .5 + Math.sin(t * 9.7 + z) * .3; });
  }

  /* ============ physics playground near plaza ============ */

  /* One crate texture for every crate on the island. Planks, end grain, iron
     corner straps and a stencil, drawn once — a mesh per plank would be eight
     draw calls apiece for something you are meant to knock over, not study. */
  crateTexture() {
    if (this._crateTex) return this._crateTex;
    this._crateTex = this.makeCanvas(256, 256, g => {
      g.fillStyle = "#7a4f24"; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 5; i++) {                       // planks
        const y = i * 51;
        g.fillStyle = ["#8a5a2b", "#7a4f24", "#936133", "#6d4620", "#845629"][i];
        g.fillRect(0, y + 2, 256, 47);
        g.strokeStyle = "rgba(40,24,10,.55)"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke();
        for (let k = 0; k < 7; k++) {                     // grain
          g.strokeStyle = `rgba(60,36,14,${.10 + Math.random() * .16})`;
          g.lineWidth = 1 + Math.random();
          g.beginPath();
          const gy = y + 6 + Math.random() * 38;
          g.moveTo(0, gy);
          g.bezierCurveTo(80, gy + (Math.random() - .5) * 9, 170, gy + (Math.random() - .5) * 9, 256, gy);
          g.stroke();
        }
      }
      g.fillStyle = "#3b3540";                            // iron straps
      g.fillRect(0, 0, 18, 256); g.fillRect(238, 0, 18, 256);
      g.fillStyle = "#4a4450";
      for (let i = 0; i < 6; i++) { g.fillRect(4, 18 + i * 42, 10, 10); g.fillRect(242, 18 + i * 42, 10, 10); }
      g.strokeStyle = "rgba(20,14,8,.5)"; g.lineWidth = 6;
      g.strokeRect(3, 3, 250, 250);
      g.save();                                           // stencil
      g.translate(128, 132); g.rotate(-.05);
      g.globalAlpha = .5; g.fillStyle = "#d8cdb6";
      g.font = '700 40px "JetBrains Mono", monospace';
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("RJA", 0, 0);
      g.font = '700 17px "JetBrains Mono", monospace';
      g.fillText("FRAGIL", 0, 30);
      g.restore();
    });
    return this._crateTex;
  }

  buildPlayground() {
    /* ---- crate pyramids ---- */
    const crate = (x, y, z, s) => {
      /* Centred on its own origin, unlike everything else in the folder,
         because this one is driven by a physics body and cannon puts a box's
         origin at its centre. The registry note says so. */
      const mesh = getModel("crate");
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(s / 1.3);          // the model is authored at 1.3m
      this.scene.add(mesh);
      const body = new CBody({ mass: 1.8 });
      body.addShape(new CBox(new CVec(s / 2, s / 2, s / 2)));
      body.position.set(x, y, z);
      body.quaternion.setFromEuler(0, (Math.random() - .5) * .12, 0);
      this.world.addBody(body);
      this.sync.push({ mesh, body });
    };
    const pyramid = (px, pz, n) => {
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n - r; c++)
          crate(px + (c - (n - r - 1) / 2) * 1.36, .68 + r * 1.33, pz, 1.3);
    };
    pyramid(14, 10, 4);
    pyramid(-27, -17, 3);

    /* ---- bowling corner ----
       Turned pins rather than a cone: a shoulder, a neck and a head, on one
       group synced to a single capsule-ish body. The collider stays the plain
       cylinder it always was — the shape you knock over should be the shape
       you can predict, not the silhouette. */
    const pinMat = this.mat(0xf2efe7, { roughness: .42 });
    const pinRed = this.mat(0xd6543c, { roughness: .45 });
    for (let i = 0; i < 6; i++) {
      const row = Math.floor(i / 3), col = i % 3;
      const x = 17 + col * 1.1 - row * .5, z = -8 - row * 1.1;
      const G = new Grp(); this.scene.add(G);
      this.m(new CylGeo(.30, .40, .34, 12), pinMat, 0, -.66, 0, { parent: G, recv: true });  // foot
      this.m(new CylGeo(.20, .30, .62, 12), pinMat, 0, -.18, 0, { parent: G, recv: true });  // belly
      this.m(new CylGeo(.12, .20, .40, 12), pinMat, 0, .33, 0, { parent: G });               // neck
      this.m(new SphGeo(.155, 12, 10), pinMat, 0, .62, 0, { parent: G });                    // head
      this.m(new CylGeo(.163, .163, .1, 12), pinRed, 0, .42, 0, { parent: G });              // collar stripes
      this.m(new CylGeo(.185, .185, .08, 12), pinRed, 0, .28, 0, { parent: G });
      const body = new CBody({ mass: .7 });
      body.addShape(new CCyl(.33, .45, 1.7, 8));
      body.position.set(x, .95, z);
      this.world.addBody(body);
      this.sync.push({ mesh: G, body });
    }
    /* the ball: a marbled bowling ball with finger holes, not a black sphere */
    const ballTex = this.makeCanvas(256, 128, g => {
      g.fillStyle = "#241f2e"; g.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 70; i++) {
        g.strokeStyle = `rgba(${120 + Math.random() * 90},${90 + Math.random() * 80},${170 + Math.random() * 80},${.05 + Math.random() * .12})`;
        g.lineWidth = 1 + Math.random() * 7;
        g.beginPath();
        const y = Math.random() * 128;
        g.moveTo(0, y);
        g.bezierCurveTo(70, y + (Math.random() - .5) * 60, 180, y + (Math.random() - .5) * 60, 256, y);
        g.stroke();
      }
      g.fillStyle = "#0d0b12";
      for (const [hx, hy] of [[92, 44], [126, 36], [110, 66]]) {
        g.beginPath(); g.arc(hx, hy, 9, 0, 7); g.fill();
      }
    });
    this.dsphere(.85, 12, 1, -4, 0xffffff, 3,
      { matOpts: { map: ballTex, roughness: .22, metalness: .25 } });

    /* beach ball */
    const ball = this.dsphere(1.15, -14, 2, 14, 0xffffff, .6);
    const btex = this.makeCanvas(128, 64, g => {
      const cols = ["#f0f0ea", "#f07a6a", "#f0f0ea", "#7fdca8", "#f0f0ea", "#8fb0ff"];
      cols.forEach((c, i) => { g.fillStyle = c; g.fillRect(i * 22, 0, 22, 64); });
    });
    btex.wrapS = WRAP_REPEAT;
    ball.mesh.material = new StdMat({ map: btex, roughness: .5 });

    /* dominoes */
    for (let i = 0; i < 8; i++)
      this.dbox(.28, 2.2, 1.2, 6 + i * 1.5, 1.15, 18 + Math.sin(i * .5) * 2, 0xe8e4da, .9,
        { ry: -Math.cos(i * .5) * .35, matOpts: { roughness: .5 } });

    /* seesaw: plank balanced on a wedge (no hinge in bundle, pure physics) */
    const timber = this.mat(0x6a4a2f, { roughness: .95, flatShading: true });
    this.m(new ConeGeo(1, 1.4, 4), timber, -8, .7, 20, {});
    /* a pair of braces either side of the wedge, so it reads as built rather
       than as a cone somebody dropped on the grass */
    for (const s of [-1, 1])
      this.m(new BoxGeo(.24, 1.5, .24), timber, -8 + s * .95, .75, 20, { rz: s * .5, recv: true });
    this.sbox(1.4, 1.4, 1.4, -8, .6, 20);
    const plank = this.dbox(7, .3, 1.6, -8, 1.8, 20, 0xffffff, 1.4,
      { matOpts: { map: this.crateTexture(), roughness: .85 } });
    /* handles at each end: the thing is only fun if you can see which way it
       tips before you jump on it */
    for (const s of [-1, 1])
      this.m(new CylGeo(.07, .07, .5, 6), timber, s * 2.9, .35, 0,
        { parent: plank.mesh, rz: Math.PI / 2, cast: true });

    /* ---- two ramps ----
       Was a bare blue slab. Now a planked deck on stone piers with a kerb rail
       down each side, which also makes it obvious which end you are meant to
       hit. The collider is unchanged: one tilted box, as before. */
    const rampDeck = new StdMat({ map: this.crateTexture(), roughness: .88 });
    const pier = this.mat(0x4c4757, { roughness: .95, flatShading: true });
    const ramp = (x, z, ry) => {
      const G = new Grp(); G.position.set(x, .9, z); this.scene.add(G);
      const body = new CBody({ mass: 0, material: this.groundMat });
      body.addShape(new CBox(new CVec(4, .5, 2.5)));
      body.position.set(x, .9, z);
      body.quaternion.setFromEuler(.34, ry, 0);
      G.quaternion.copy(body.quaternion);
      this.world.addBody(body);
      this.m(new BoxGeo(8, 1, 5), rampDeck, 0, 0, 0, { parent: G, recv: true });
      for (const s of [-1, 1]) {
        this.m(new BoxGeo(8, .34, .34), pier, 0, .58, s * 2.4, { parent: G, recv: true });
        this.m(new CylGeo(.13, .13, .8, 6), pier, -2.6, .9, s * 2.4, { parent: G });
        this.m(new CylGeo(.13, .13, .8, 6), pier, 2.6, .9, s * 2.4, { parent: G });
      }
      /* stone footing under the high end, in world space — inside the tilted
         group it would lean with the deck and hang in the air */
      const fx = Math.sin(ry), fz = Math.cos(ry);
      this.m(new BoxGeo(1.6, 1.6, 5.4), pier, x - fz * 3.2, .45, z + fx * 3.2,
        { ry, recv: true, cast: false });
      this.addOccluder(x, 1.2, z, 3.2);
    };
    ramp(24, -2, 0);
    ramp(-26, 2, .5);
  }

  /* ---- clumps of grass ----
     A painted card, three copies of it crossed at sixty degrees per clump, and
     every clump on the island merged into one buffer. Three hundred separate
     clumps would be nine hundred draw calls for ground cover, which is the
     same trap buildGrass() already avoids for the small blades.

     Merging costs you the per-object model matrix the wind normally phases
     off, so the phase rides along as a vertex attribute instead — along with
     a sway weight that is zero at the root and one at the tip, so the blades
     bend rather than slide, which is what a rigid per-mesh offset could never
     do anyway.

     The card is bottom-anchored: a tuft grows out of the ground, and a centred
     plane buries half of itself in the hill. */
  buildGrassCards(spots) {
    if (!spots.length) return;
    this.grassCardMat();
    const V = [], U = [], PH = [], SW = [];
    for (const [x, y, z, s, yaw] of spots) {
      for (let k = 0; k < 3; k++) {
        const a = yaw + k * Math.PI / 3;
        const dx = Math.cos(a) * .52 * s, dz = Math.sin(a) * .52 * s;
        const h = .8 * s, ph = Math.random() * 6.283;
        /* two triangles, wound so the alpha-tested card has no seam */
        const quad = [[-1, 0], [1, 0], [1, 1], [-1, 0], [1, 1], [-1, 1]];
        for (const [ux, uy] of quad) {
          V.push(x + dx * ux, y + h * uy, z + dz * ux);
          U.push((ux + 1) / 2, uy);
          PH.push(ph);
          SW.push(uy * uy);            // squared, so the bend is in the top half
        }
      }
    }
    const geo = new BufGeo();
    geo.setAttribute("position", new F32Attr(new Float32Array(V), 3));
    geo.setAttribute("uv", new F32Attr(new Float32Array(U), 2));
    geo.setAttribute("aPh", new F32Attr(new Float32Array(PH), 1));
    geo.setAttribute("aSway", new F32Attr(new Float32Array(SW), 1));
    const nrm = new Float32Array(V.length);
    for (let i = 1; i < nrm.length; i += 3) nrm[i] = 1;
    geo.setAttribute("normal", new F32Attr(nrm, 3));
    const mesh = new Mesh(geo, this.grassCards);
    mesh.castShadow = false; mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.outdoorOnly.push(mesh);
  }

  grassCardMat() {
    if (this.grassCards) return this.grassCards;
    /* Blades painted with a soft tip and a wide root so the alpha test cuts a
       blade shape and not a rectangle with frayed corners. */
    const tex = this.makeCanvas(128, 128, g => {
      g.clearRect(0, 0, 128, 128);
      const blade = (bx, lean, w, h, c0, c1) => {
        const grad = g.createLinearGradient(0, 128, 0, 128 - h);
        grad.addColorStop(0, c0); grad.addColorStop(1, c1);
        g.fillStyle = grad;
        g.beginPath();
        g.moveTo(bx - w, 128);
        g.quadraticCurveTo(bx - w * .35 + lean * .5, 128 - h * .6, bx + lean, 128 - h);
        g.quadraticCurveTo(bx + w * .35 + lean * .5, 128 - h * .55, bx + w, 128);
        g.closePath(); g.fill();
      };
      const seeds = [[22, -14, 7, 74], [40, -6, 8, 104], [58, 4, 9, 122],
                     [76, 12, 8, 96], [94, 20, 7, 68], [110, 26, 6, 50]];
      seeds.forEach(([bx, lean, w, h], i) => blade(bx, lean, w, h,
        i % 2 ? "#20512c" : "#26602f", i % 3 ? "#5da95c" : "#7cc36a"));
      /* a couple of dry stems, or a clump is one flat green */
      blade(30, -20, 3, 112, "#4a5a2a", "#b9ab5e");
      blade(88, 24, 3, 100, "#4a5a2a", "#a89a52");
    });
    /* Same lighting rule as the merged blade field: shaded as ground, not as
       a vertical plate. Three cards at sixty degrees means one of them is
       always near edge-on to a sun this low, and edge-on is black. */
    const mat = this.groundLit(new StdMat({
      map: tex, alphaTest: .45, side: SIDE_DOUBLE, roughness: .95
    }));
    /* Wind straight on the attributes, not through wind(): that helper phases
       off the model matrix, and after the merge every clump shares one. */
    if (!REDUCED) {
      const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey;
      mat.onBeforeCompile = sh => {
        if (prev) prev.call(mat, sh);
        sh.uniforms.uWind = this.windU;
        sh.vertexShader = "uniform float uWind;\nattribute float aPh;\nattribute float aSway;\n" +
          sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
          {
            float w = sin(uWind * 1.1 + aPh) + 0.45 * sin(uWind * 2.4 + aPh * 1.7);
            transformed.x += w * aSway * 0.13;
            transformed.z += w * aSway * 0.08;
          }`);
      };
      mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : "") + "|grasswind";
    }
    this.grassCards = mat;
    return mat;
  }

  /* ============ the pier: the fishing spot at the pond ============
     Locked until the twelfth golden fish is in. It is built either way and
     stands where you will walk past it early — a door you can see but not
     open is worth more than one that appears when you have earned it. */
  buildPier() {
    const P = this.pondPos;
    /* Built on the far shore, looking back across the water. On the near
       shore the hut lands inside the plaza paving — the pond is only sixteen
       metres from the kerb, and a fishing shack standing on the flagstones of
       the lobby is not a fishing shack. */
    const ang = Math.atan2(P.x, P.z) + Math.PI;    // deck runs back at the pond centre
    const bx = P.x - Math.sin(ang) * (P.r + 1.4), bz = P.z - Math.cos(ang) * (P.r + 1.4);
    const G = new Grp(); G.position.set(bx, 0, bz); G.rotation.y = ang; this.scene.add(G);
    const wood = this.mat(0x6a4a2f, { roughness: .95, flatShading: true });
    const plank = new StdMat({ map: this.crateTexture(), roughness: .9 });

    /* decking out over the water, on piles */
    for (let i = 0; i < 7; i++)
      this.m(new BoxGeo(2.4, .16, 1), plank, 0, .42, i * 1.05, { parent: G, recv: true });
    for (let i = 0; i < 4; i++)
      for (const s of [-1, 1])
        this.m(new CylGeo(.13, .16, 1.6, 6), wood, s * .95, -.3, i * 2.1 + .4, { parent: G });
    /* handrail down one side only, so the other side reads as where you fish */
    for (let i = 0; i < 4; i++)
      this.m(new CylGeo(.07, .08, .9, 5), wood, -1.05, .9, i * 2.1 + .4, { parent: G });
    this.m(new BoxGeo(.09, .09, 6.6), wood, -1.05, 1.32, 3.1, { parent: G });

    /* a hut at the shore end, with a lantern that only burns once the pier
       is open — the state of the lock, readable from across the lawn */
    this.m(new BoxGeo(2.6, 2.2, 2.2), this.mat(0x7a6a52, { roughness: 1 }), 0, 1.2, -1.9, { parent: G, recv: true });
    this.m(new BoxGeo(3.2, .22, 2.8), this.mat(0x8a4838, { roughness: .9, flatShading: true }), 0, 2.5, -1.9, { parent: G });
    this.m(new BoxGeo(1, 1.5, .1), wood, 0, .95, -.82, { parent: G });
    const lampM = new StdMat({ color: 0x3a3a42, emissive: new Col(0x7ce8e0), emissiveIntensity: 0, roughness: .4 });
    this.m(new SphGeo(.2, 10, 8), lampM, 0, 2.35, -.7, { parent: G, cast: false });
    const glow = this.glowSprite(CYAN, 1.6, new V3(0, 2.35, -.7));
    glow.material.opacity = 0; G.add(glow);
    const light = this.addLight(bx, 2.4, bz, 0x7ce8e0, 0, 16);

    /* rods leaning on the rail, and a bucket */
    for (let i = 0; i < 2; i++) {
      const rod = this.m(new CylGeo(.03, .05, 3.2, 5), wood, -.8 + i * .25, 1.6, 1.4 + i * .5, { parent: G, cast: false });
      rod.rotation.set(-.5, 0, .25 + i * .1);
    }
    this.m(new CylGeo(.32, .26, .5, 10), this.mat(0x4a4a52, { roughness: .8 }), .7, .68, 2.4, { parent: G, recv: true });

    this.sbox(2.8, 2.4, 2.4, bx + Math.sin(ang) * 1.9, 1.2, bz + Math.cos(ang) * 1.9, ang);

    /* Registered as a zone so it gets the prompt, the sound cue and the ring
       for free. portal:true keeps it out of the temple count — it is a
       minigame door, not an eighth temple. */
    const meta = { key: "pier", kind: "fishing", color: CYAN, portal: true,
      name: { es: "El Muelle de los Doce", en: "The Pier of Twelve" },
      lore: { es: "Doce peces dorados nadan por la isla. Tráelos todos y el viejo te presta la barca.",
              en: "Twelve golden fish swim around this island. Bring them all in and the old man lends you the boat." } };
    const zx = bx + Math.sin(ang) * 2.4, zz = bz + Math.cos(ang) * 2.4;
    const ring = this.m(new RingGeo(3, 3.5, 36),
      this.bmat(new Col(CYAN).getHex(), { transparent: true, opacity: .3, side: SIDE_DOUBLE }),
      zx, .09, zz, { rx: -Math.PI / 2, cast: false });
    /* No `light` on the zone: the proximity loop drives zone.light itself, and
       this one is the lock indicator — it answers to the fish count, not to
       how close you are standing. */
    const zone = { x: zx, z: zz, r: 4, meta, ring, discovered: false };
    this.zones.push(zone);
    this.pierZone = zone;
    this.anims.push(t => {
      const open = state.fish >= state.fishTotal;
      lampM.emissiveIntensity = open ? 1.1 + Math.sin(t * 3) * .25 : 0;
      glow.material.opacity = open ? .8 : 0;
      light.intensity = open ? 7 : 0;
      ring.material.opacity = (open ? .34 : .12) + Math.sin(t * 2) * .07 + (state.near === zone ? .3 : 0);
    });
  }

  /* ============ the coaster ============
     Rails, sleepers and supports all go into a single buffer. A tube per
     segment would be a couple of thousand draw calls for one prop, and
     nothing about a rail needs its own transform — the curve already knows
     where every piece of it belongs. */
  /* ============ the boardwalk out to the park ============
     Not a second rope bridge. The cave islet is somewhere you arrive at, and
     its bridge is a rickety plank thing that says so; the park is somewhere
     that wants you to come, so its crossing is a lit timber pier with bunting
     on it. Same walkable span underneath — SPANS carries both — but there was
     never a reason for them to look alike. */
  buildParkBridge() {
    const ang = Math.atan2(PU.x, PU.z);
    const L = Math.hypot(PARK_B.x - PARK_A.x, PARK_B.z - PARK_A.z);
    const G = new Grp(); G.position.set(PARK_A.x, 0, PARK_A.z); G.rotation.y = ang;
    this.scene.add(G); this.outdoorOnly.push(G);
    const deck = new StdMat({ map: this.crateTexture(), roughness: .9 });
    const timber = this.mat(0x6a4a2f, { roughness: .95, flatShading: true });
    const paint = this.mat(0xd6543c, { roughness: .8, flatShading: true });
    const dY = t => PARK_Y0 + (PARK_Y - PARK_Y0) * t;
    const pitch = Math.atan2(PARK_Y - PARK_Y0, L);

    const steps = Math.round(L / 1.1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, lz = t * L, y = dY(t);
      this.m(new BoxGeo(PARK_HALF * 2, .18, 1.06), i % 4 ? deck : timber, 0, y - .09, lz,
        { parent: G, recv: true });
      /* piles every third bay, down into the water */
      if (i % 3 === 0) for (const s of [-1, 1])
        this.m(new CylGeo(.2, .24, y + 6, 6), timber, s * (PARK_HALF - .3), (y - 6) / 2, lz, { parent: G });
      /* posts and a rope every other bay */
      if (i % 2 === 0) for (const s of [-1, 1])
        this.m(new CylGeo(.09, .11, 1.1, 6), timber, s * PARK_HALF, y + .55, lz, { parent: G });
    }
    for (const s of [-1, 1]) {
      const mid = L / 2;
      this.m(new BoxGeo(.1, .1, L), timber, s * PARK_HALF, dY(.5) + 1.05, mid,
        { parent: G, rx: -pitch, cast: false });
      /* strings of little flags, the whole way across */
      for (let i = 0; i < steps; i += 2) {
        const t = i / steps;
        this.m(new ConeGeo(.13, .3, 3), this.bmat([GREEN, AMBER, PINK, BLUE, CYAN][i % 5], { side: SIDE_DOUBLE }),
          s * PARK_HALF, dY(t) + .95, t * L, { parent: G, rx: Math.PI, cast: false });
      }
    }
    /* colliders so loose props do not drop through */
    const mx = PARK_A.x + (PARK_B.x - PARK_A.x) * .5, mz = PARK_A.z + (PARK_B.z - PARK_A.z) * .5;
    this.sbox(PARK_HALF * 2, .5, L + 2, mx, dY(.5) - .25, mz, ang, -pitch);
    for (const s of [-1, 1]) {
      const off = PARK_HALF + 1;
      this.sbox(.4, .6, L + 2, mx + Math.cos(ang) * s * off, dY(.5) + .3, mz - Math.sin(ang) * s * off, ang, -pitch);
    }

    /* the gate you walk through at the far end */
    for (const s of [-1, 1])
      this.m(new CylGeo(.3, .38, 6, 8), paint, s * (PARK_HALF + .6), PARK_Y + 3, L + 2.2, { parent: G, recv: true });
    this.m(new BoxGeo(PARK_HALF * 2 + 2.4, .9, .5), paint, 0, PARK_Y + 6.2, L + 2.2, { parent: G });
    const gate = this.makeLabel(state.lang === "es" ? "PARQUE DEL GATO" : "CAT'S FUNFAIR", "#ffd76a", 1.7);
    gate.position.set(0, PARK_Y + 8.2, L + 2.2); G.add(gate);
    for (const s of [-1, 1]) {
      const w = { x: PARK_A.x + Math.cos(ang) * s * (PARK_HALF + .6) + Math.sin(ang) * (L + 2.2),
                  z: PARK_A.z - Math.sin(ang) * s * (PARK_HALF + .6) + Math.cos(ang) * (L + 2.2) };
      this.addLight(w.x, PARK_Y + 5.4, w.z, 0xffb371, 8, 22);
      this.addOccluder(w.x, PARK_Y + 3, w.z, 1);
    }
  }

  /* ============ the fairground ============ */
  buildPark() {
    const perp = { x: -PU.z, z: PU.x };
    const at = (fwd, side) => ({ x: PARK.x + PU.x * fwd + perp.x * side,
                                 z: PARK.z + PU.z * fwd + perp.z * side });
    /* a worn midway between the gate and the rides */
    const mid = at(20, 0);
    this.m(new CircleGeo(13, 40), this.detail(this.mat(0x6f6555, { roughness: .95 }), 2.6, .17),
      mid.x, PARK_Y + .06, mid.z, { rx: -Math.PI / 2, cast: false, recv: true });

    /* Pulled in from twenty-five: the rim is fourteen metres, so out there
       half the wheel hung over the water. */
    const wheel = at(2, 21);
    /* The rim lies in the group's ZY plane, so the wheel's face normal is its
       local +X. Aim that at the middle of the park or you get a fourteen-metre
       wheel presented edge-on to everyone walking the midway. */
    this.ferrisWheel(wheel.x, wheel.z, Math.atan2(perp.z, -perp.x));
    const car = at(4, -23);
    this.carousel(car.x, car.z);

    /* kiosks along the midway, because a fair with only rides is a car park */
    const stallCols = [0xd6543c, 0x3f8f6a, 0x3f6aa8];
    for (let i = 0; i < 3; i++) {
      const s = at(16 + i * 5, (i % 2 ? 1 : -1) * (9 + i));
      this.stall(s.x, s.z, Math.atan2(PARK.x - s.x, PARK.z - s.z), stallCols[i]);
    }
    /* lamps down the midway */
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      const p = { x: mid.x + Math.cos(a) * 12.5, z: mid.z + Math.sin(a) * 12.5 };
      const g = new Grp(); g.position.set(p.x, PARK_Y, p.z); this.scene.add(g);
      this.outdoorOnly.push(g);
      this.m(new CylGeo(.09, .13, 3.2, 7), this.mat(0x232028, { roughness: .6, metalness: .5 }),
        0, 1.6, 0, { parent: g });
      this.m(new SphGeo(.24, 10, 8), new StdMat({ color: 0xffd9a0, emissive: new Col(0xffb96a),
        emissiveIntensity: .9, roughness: .3 }), 0, 3.3, 0, { parent: g, cast: false });
      g.add(this.glowSprite(0xffb96a, 1.8, new V3(0, 3.3, 0)));
      if (i % 2 === 0) this.addLight(p.x, PARK_Y + 3.3, p.z, 0xffb371, 6, 18);
    }
  }

  /* ---- ferris wheel ----
     Two rims in the XY plane with the hub on Z, which is the one orientation
     TorusGeometry gives you for free. The gondolas hang off the rim and are
     counter-rotated every frame: parented to a turning wheel they would ride
     round upside down at the top, which is a fairground ride nobody survives. */
  ferrisWheel(x, z, ry) {
    const R = 14, W = 2.6, N = 12;
    const G = new Grp(); G.position.set(x, PARK_Y, z); G.rotation.y = ry;
    this.scene.add(G); this.outdoorOnly.push(G);
    const steel = this.mat(0xb8bcc8, { roughness: .5, metalness: .35, flatShading: true });
    const paint = this.mat(0xd6543c, { roughness: .7, flatShading: true });

    /* A-frames either side, carrying the axle */
    for (const s of [-1, 1]) for (const d of [-1, 1])
      this.m(new CylGeo(.28, .38, R + 2.4, 6), steel, s * W, (R + 2.4) / 2 - .6, d * 5.5,
        { parent: G, rx: -d * .38, recv: true });
    const hub = new Grp(); hub.position.y = R + 1.2; G.add(hub);
    this.m(new CylGeo(.55, .55, W * 2 + .8, 10), steel, 0, R + 1.2, 0, { parent: G, rz: Math.PI / 2 });

    const spin = new Grp(); hub.add(spin);
    for (const s of [-1, 1])
      this.m(new TorusGeo(R, .16, 6, 40), paint, s * W, 0, 0, { parent: spin, ry: Math.PI / 2 });
    const cabs = [];
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2;
      const cx = Math.cos(a) * R, cy = Math.sin(a) * R;
      for (const s of [-1, 1])                                   // spokes
        this.m(new BoxGeo(.1, R, .1), steel, s * W, cy / 2, cx / 2,
          { parent: spin, rx: -a + Math.PI / 2, cast: false });
      this.m(new BoxGeo(W * 2, .12, .12), steel, 0, cy, cx, { parent: spin, cast: false });
      const cab = new Grp(); cab.position.set(0, cy, cx); spin.add(cab);
      const col = [GREEN, AMBER, PINK, BLUE, CYAN, RED][i % 6];
      this.m(new CylGeo(.16, .16, 1.1, 6), steel, 0, -.55, 0, { parent: cab, cast: false });
      this.m(new BoxGeo(1.9, 1.1, 1.7), this.mat(new Col(col).getHex(), { roughness: .7, flatShading: true }),
        0, -1.65, 0, { parent: cab, recv: true });
      this.m(new ConeGeo(1.5, .6, 6), this.mat(0xf2efe7, { roughness: .8, flatShading: true }),
        0, -.95, 0, { parent: cab, cast: false });
      cabs.push(cab);
    }
    this.scyl(3, 6, x, PARK_Y + 3, z);
    this.addOccluder(x, PARK_Y + R, z, R * .5);
    this.anims.push(t => {
      spin.rotation.x = t * .18;
      for (const c of cabs) c.rotation.x = -spin.rotation.x;    // stay level
    });
  }

  /* ---- carousel ---- */
  carousel(x, z) {
    const G = new Grp(); G.position.set(x, PARK_Y, z); this.scene.add(G);
    this.outdoorOnly.push(G);
    const wood = this.mat(0x8a6a48, { roughness: .9, flatShading: true });
    const gold = this.mat(0xc9a24a, { roughness: .35, metalness: .6 });
    const stripes = this.makeCanvas(256, 64, g => {
      const cols = ["#e8433a", "#f5efe4", "#3f8f6a", "#f5efe4"];
      for (let i = 0; i < 16; i++) { g.fillStyle = cols[i % 4]; g.fillRect(i * 16, 0, 16, 64); }
    });
    this.m(new CylGeo(7.4, 7.8, .6, 24), wood, 0, .3, 0, { parent: G, recv: true });
    this.m(new CylGeo(.7, .9, 5.4, 12), gold, 0, 3.2, 0, { parent: G });
    const spin = new Grp(); spin.position.y = .6; G.add(spin);
    this.m(new ConeGeo(7.8, 2.6, 16), new StdMat({ map: stripes, roughness: .7, side: SIDE_DOUBLE }),
      0, 6.1, 0, { parent: spin });
    this.m(new SphGeo(.5, 10, 8), gold, 0, 7.6, 0, { parent: spin, cast: false });
    this.m(new CylGeo(6.6, 6.6, .18, 20), wood, 0, 4.7, 0, { parent: spin, cast: false, recv: true });
    const mounts = [];
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2, r = 5.4;
      const m = new Grp(); m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); spin.add(m);
      this.m(new CylGeo(.07, .07, 4.4, 6), gold, 0, 2.5, 0, { parent: m, cast: false });
      /* the mounts are cats, obviously */
      const body = this.m(new SphGeo(.5, 12, 9), this.mat([0xe08840, 0xf2efe7, 0x4a4557, 0xd6543c][i % 4],
        { roughness: .85 }), 0, 1.5, 0, { parent: m, recv: true });
      body.scale.set(.8, .72, 1.35);
      this.m(new SphGeo(.3, 10, 8), this.mat([0xe08840, 0xf2efe7, 0x4a4557, 0xd6543c][i % 4],
        { roughness: .85 }), 0, 1.95, .55, { parent: m });
      for (const s of [-1, 1])
        this.m(new ConeGeo(.13, .26, 4), this.mat(0xe0b090, { roughness: .9 }), s * .16, 2.24, .48, { parent: m });
      mounts.push(m);
    }
    this.scyl(7.8, 4, x, PARK_Y + 2, z);
    this.addOccluder(x, PARK_Y + 4, z, 5);
    this.addLight(x, PARK_Y + 5, z, 0xffc48a, 8, 24);
    this.anims.push(t => {
      spin.rotation.y = t * .5;
      mounts.forEach((m, i) => { m.position.y = Math.sin(t * 2 + i * .8) * .45; });
    });
  }

  /* ---- a kiosk with a striped awning ---- */
  stall(x, z, ry, col) {
    const G = new Grp(); G.position.set(x, PARK_Y, z); G.rotation.y = ry;
    this.scene.add(G); this.outdoorOnly.push(G);
    const wood = this.mat(0x7a6046, { roughness: .95, flatShading: true });
    this.m(new BoxGeo(3.4, 2.2, 2.4), wood, 0, 1.1, 0, { parent: G, recv: true });
    this.m(new BoxGeo(3.8, .3, .5), wood, 0, 2, 1.35, { parent: G });          // counter
    /* the awning: alternating panels rather than a texture, so the scallop
       reads at the size these are actually seen from */
    for (let i = 0; i < 7; i++)
      this.m(new BoxGeo(.52, .12, 1.7), this.mat(i % 2 ? 0xf2efe7 : col, { roughness: .8 }),
        -1.56 + i * .52, 2.6, 1.7, { parent: G, rx: .3, cast: false, recv: true });
    this.m(new BoxGeo(3.6, .5, .12), this.mat(col, { roughness: .8 }), 0, 3.05, .9, { parent: G });
    for (const s of [-1, 1])
      this.m(new CylGeo(.07, .07, 2.6, 5), wood, s * 1.6, 1.3, 2.3, { parent: G });
    this.m(new SphGeo(.22, 10, 8), new StdMat({ color: 0xffd9a0, emissive: new Col(0xffb96a),
      emissiveIntensity: 1, roughness: .3 }), 0, 2.9, 1.5, { parent: G, cast: false });
    this.sbox(3.6, 2.4, 2.6, x, PARK_Y + 1.2, z, ry);
    this.addOccluder(x, PARK_Y + 1.4, z, 2);
  }

  buildCoaster() {
    initCoasterTrack();
    const N = IS_TOUCH ? 200 : 320;
    const frames = [];
    for (let i = 0; i < N; i++) frames.push(coasterFrame(i / N));
    this.coasterFrames = frames;

    const V = [], C = [], c = new Col();
    const push = (a, b, d, e, col) => {          // one quad, two triangles
      for (const v of [a, b, d, a, d, e]) { V.push(v[0], v[1], v[2]); C.push(col.r, col.g, col.b); }
    };
    const steel = new Col(0x9aa0b0), tie = new Col(0x6a4a2f), post = new Col(0x7c5a38);

    /* rails: a square tube either side, swept along the banked frame */
    const RAIL = .55, W = .11;
    for (let i = 0; i < N; i++) {
      const f = frames[i], g2 = frames[(i + 1) % N];
      for (const s of [-1, 1]) {
        const corners = (fr) => {
          const cx = fr.p.x + fr.rx * RAIL * s + fr.ux * .34;
          const cy = fr.p.y + fr.ry * RAIL * s + fr.uy * .34;
          const cz = fr.p.z + fr.rz * RAIL * s + fr.uz * .34;
          return [
            [cx - fr.rx * W - fr.ux * W, cy - fr.ry * W - fr.uy * W, cz - fr.rz * W - fr.uz * W],
            [cx + fr.rx * W - fr.ux * W, cy + fr.ry * W - fr.uy * W, cz + fr.rz * W - fr.uz * W],
            [cx + fr.rx * W + fr.ux * W, cy + fr.ry * W + fr.uy * W, cz + fr.rz * W + fr.uz * W],
            [cx - fr.rx * W + fr.ux * W, cy - fr.ry * W + fr.uy * W, cz - fr.rz * W + fr.uz * W]
          ];
        };
        const A = corners(f), B = corners(g2);
        for (let k = 0; k < 4; k++) {
          const k2 = (k + 1) % 4;
          /* the top face of a rail catches the light; shade the rest down so
             the track has a readable line along it from a distance */
          c.copy(steel).multiplyScalar(k === 2 ? 1.15 : k === 0 ? .55 : .82);
          push(A[k], A[k2], B[k2], B[k], c);
        }
      }
      /* sleepers */
      if (i % 3 === 0) {
        const L = RAIL + .34, T = .09, D = .17;
        const box = (fr, o) => [
          [fr.p.x + fr.rx * o * L + fr.ux * .2 + fr.tx * D, fr.p.y + fr.ry * o * L + fr.uy * .2 + fr.ty * D, fr.p.z + fr.rz * o * L + fr.uz * .2 + fr.tz * D],
          [fr.p.x + fr.rx * o * L + fr.ux * .2 - fr.tx * D, fr.p.y + fr.ry * o * L + fr.uy * .2 - fr.ty * D, fr.p.z + fr.rz * o * L + fr.uz * .2 - fr.tz * D],
          [fr.p.x + fr.rx * o * L + fr.ux * (.2 - T) - fr.tx * D, fr.p.y + fr.ry * o * L + fr.uy * (.2 - T) - fr.ty * D, fr.p.z + fr.rz * o * L + fr.uz * (.2 - T) - fr.tz * D],
          [fr.p.x + fr.rx * o * L + fr.ux * (.2 - T) + fr.tx * D, fr.p.y + fr.ry * o * L + fr.uy * (.2 - T) + fr.ty * D, fr.p.z + fr.rz * o * L + fr.uz * (.2 - T) + fr.tz * D]
        ];
        const L1 = box(f, -1), R1 = box(f, 1);
        for (let k = 0; k < 4; k++) {
          const k2 = (k + 1) % 4;
          c.copy(tie).multiplyScalar(k === 0 ? 1.1 : .78);
          push(L1[k], L1[k2], R1[k2], R1[k], c);
        }
      }
      /* supports, every so often, straight down to whatever ground is there */
      if (i % 14 === 0) {
        const f2 = frames[i];
        const gy = heightAt(f2.p.x, f2.p.z);
        const top = f2.p.y - .1;
        if (top - gy > .8) {
          const S = .17;
          const legs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [
            f2.p.x + f2.tx * a * S * 2 + f2.rx * b * S * 2,
            f2.p.z + f2.tz * a * S * 2 + f2.rz * b * S * 2
          ]);
          for (let k = 0; k < 4; k++) {
            const k2 = (k + 1) % 4;
            c.copy(post).multiplyScalar(k % 2 ? .72 : 1);
            push([legs[k][0], gy, legs[k][1]], [legs[k2][0], gy, legs[k2][1]],
                 [legs[k2][0], top, legs[k2][1]], [legs[k][0], top, legs[k][1]], c);
          }
          /* one cross brace halfway up, which is what makes a post a trestle */
          const my = (gy + top) / 2;
          c.copy(post).multiplyScalar(.85);
          for (let k = 0; k < 4; k++) {
            const k2 = (k + 1) % 4;
            push([legs[k][0], my - .12, legs[k][1]], [legs[k2][0], my - .12, legs[k2][1]],
                 [legs[k2][0], my + .12, legs[k2][1]], [legs[k][0], my + .12, legs[k][1]], c);
          }
          this.addOccluder(f2.p.x, (gy + top) / 2, f2.p.z, 1.2);
        }
      }
    }
    const geo = new BufGeo();
    geo.setAttribute("position", new F32Attr(new Float32Array(V), 3));
    geo.setAttribute("color", new F32Attr(new Float32Array(C), 3));
    geo.computeVertexNormals();
    const track = new Mesh(geo, new StdMat({ vertexColors: true, roughness: .62, metalness: .25,
                                             flatShading: true, side: SIDE_DOUBLE }));
    track.castShadow = true; track.receiveShadow = true;
    this.scene.add(track);
    this.outdoorOnly.push(track);

    this.buildCoasterStation();
    this.buildCoasterTrain();
  }

  buildCoasterStation() {
    const f = coasterFrame(0);
    const ang = Math.atan2(f.tx, f.tz);
    const G = new Grp(); G.position.set(f.p.x, 0, f.p.z); G.rotation.y = ang; this.scene.add(G);
    this.outdoorOnly.push(G);
    const wood = this.mat(0x6a4a2f, { roughness: .95, flatShading: true });
    const deck = new StdMat({ map: this.crateTexture(), roughness: .9 });
    const iron = this.mat(0x2e2b34, { roughness: .6, metalness: .45 });

    /* a platform beside the track, not under it */
    this.m(new BoxGeo(2.6, .3, 9), deck, -2.1, f.p.y - .5, 0, { parent: G, recv: true });
    for (let i = 0; i < 4; i++)
      this.m(new CylGeo(.16, .2, f.p.y, 6), wood, -2.1, (f.p.y - .5) / 2, -3.6 + i * 2.4, { parent: G });
    this.sbox(2.6, .6, 9, f.p.x - Math.cos(ang) * 2.1, f.p.y - .5, f.p.z + Math.sin(ang) * 2.1, ang);
    /* posts and a canopy, so it reads as a station and not as a jetty */
    for (const s of [-1, 1]) for (const zz of [-3.6, 3.6])
      this.m(new CylGeo(.11, .13, 3.2, 6), iron, -2.1 + s * 1.05, f.p.y + 1.25, zz, { parent: G });
    this.m(new BoxGeo(3.2, .18, 8.6), this.mat(0x8a4838, { roughness: .9, flatShading: true }),
      -2.1, f.p.y + 2.9, 0, { parent: G, recv: true });
    /* bunting along the canopy edge */
    for (let i = 0; i < 14; i++) {
      const col = [GREEN, AMBER, PINK, BLUE][i % 4];
      this.m(new ConeGeo(.16, .34, 3), this.bmat(col, { side: SIDE_DOUBLE }),
        -.55, f.p.y + 2.66, -4 + i * .62, { parent: G, rx: Math.PI, cast: false });
    }
    const sign = this.makeLabel(state.lang === "es" ? "LA BAJADA DEL GATO" : "THE CAT'S PLUNGE", "#f0a35e", 1.5);
    sign.position.set(-2.1, f.p.y + 4.3, 0); G.add(sign);
    this.addLight(f.p.x - Math.cos(ang) * 2.1, f.p.y + 2.4, f.p.z + Math.sin(ang) * 2.1, 0xffb371, 7, 18);
    this.addOccluder(f.p.x, f.p.y + 1, f.p.z, 3);

    const meta = { key: "coaster", kind: "ride", color: AMBER, portal: true,
      name: { es: "La Bajada del Gato", en: "The Cat's Plunge" },
      lore: { es: "Dieciséis metros de subida por cadena y todo lo demás por gravedad. El gato no la construyó; simplemente estaba aquí.",
              en: "Sixteen metres up on a chain and everything after that on gravity alone. The cat did not build it; it was simply here." } };
    const zx = f.p.x - Math.cos(ang) * 3.4, zz2 = f.p.z + Math.sin(ang) * 3.4;
    const ring = this.m(new RingGeo(3, 3.6, 36),
      this.bmat(new Col(AMBER).getHex(), { transparent: true, opacity: .35, side: SIDE_DOUBLE }),
      zx, .09, zz2, { rx: -Math.PI / 2, cast: false });
    const zone = { x: zx, z: zz2, r: 4.2, meta, ring, discovered: false };
    this.zones.push(zone);
    this.anims.push(t => {
      ring.material.opacity = .3 + Math.sin(t * 2) * .08 + (state.near === zone ? .35 : 0);
    });
  }

  /* ---- the train ----
     Three cars nose to tail, riding the same curve everything else was built
     from. Speed comes out of a height budget rather than a constant: the
     train trades the lift hill back for pace, so it crawls over the crests
     and howls through the dips without any of that being animated by hand. */
  buildCoasterTrain() {
    const G = new Grp(); this.scene.add(G); this.outdoorOnly.push(G);
    const shell = this.mat(0xd6543c, { roughness: .55, flatShading: true });
    const trim = this.mat(0xffd76a, { roughness: .4, metalness: .3 });
    const dark = this.mat(0x2e2b34, { roughness: .7 });
    const cars = [];
    for (let i = 0; i < 3; i++) {
      /* The lead car is not the same object as the two behind it — it has the
         nose cone and a different shell — so the index goes to the builder.
         A replacement .glb is one car and gets used for all three; that is
         the trade for making it swappable, and a coaster train whose front
         car matches the rest is not wrong, just plainer. */
      const car = getModel("coaster-car", i);
      G.add(car);
      const rider = car.getObjectByName("rider");
      if (!i && rider) this.frontRider = rider;   // hidden while you are in that seat
      cars.push(car);
    }
    this.coaster = { u: 0, v: 6, cars, riding: false, rideU: 0, group: G };

    const CREST = 16.4, GRAV = 9.5, LIFT_A = .10, LIFT_B = .235;
    /* one lap in track units, so speed in m/s converts to progress */
    let len = 0;
    for (let i = 0; i < this.coasterFrames.length; i++) {
      const a = this.coasterFrames[i], b = this.coasterFrames[(i + 1) % this.coasterFrames.length];
      len += Math.hypot(b.p.x - a.p.x, b.p.y - a.p.y, b.p.z - a.p.z);
    }
    this.coaster.len = len;

    this.anims.push((t, dt) => {
      const C = this.coaster;
      const here = coasterAt(C.u);
      /* the chain lift is the one stretch that does not obey the height
         budget — that is what a chain lift is for */
      if (C.u > LIFT_A && C.u < LIFT_B) C.v += (5.2 - C.v) * Math.min(1, dt * 2);
      else C.v = Math.sqrt(Math.max(9, 2 * GRAV * (CREST - here.y) + 4));
      C.u = (C.u + C.v * dt / len) % 1;
      for (let i = 0; i < C.cars.length; i++) {
        const f = coasterFrame(C.u - i * (1.7 / len));
        C.cars[i].position.set(f.p.x, f.p.y + .34, f.p.z);
        /* build the car's basis straight from the track frame: three.js here
           has no Matrix4.lookAt helper worth the round trip */
        C.cars[i].matrixAutoUpdate = false;
        const m = C.cars[i].matrix.elements;
        m[0] = f.rx; m[1] = f.ry; m[2] = f.rz; m[3] = 0;
        m[4] = f.ux; m[5] = f.uy; m[6] = f.uz; m[7] = 0;
        m[8] = f.tx; m[9] = f.ty; m[10] = f.tz; m[11] = 0;
        m[12] = f.p.x + f.ux * .34; m[13] = f.p.y + f.uy * .34; m[14] = f.p.z + f.uz * .34; m[15] = 1;
        C.cars[i].matrixWorldNeedsUpdate = true;
      }
      if (C.riding) {
        C.rideU += C.v * dt / len;
        if (C.rideU >= 1) this.leaveCoaster();
      }
    });
  }

  boardCoaster() {
    const C = this.coaster;
    if (!C || C.riding) return;
    C.riding = true; C.rideU = 0;
    state.riding = true;
    this.catGrp.visible = false;
    if (this.frontRider) this.frontRider.visible = false;
    this.catBody.velocity.setZero();
    toast(state.lang === "es" ? "¡Agárrate!" : "Hold on!", 1800);
    Snd.chime();
  }
  leaveCoaster() {
    const C = this.coaster;
    C.riding = false;
    state.riding = false;
    this.catGrp.visible = true;
    if (this.frontRider) this.frontRider.visible = true;
    /* put the cat back on the platform rather than wherever the train stopped */
    const f = coasterFrame(0);
    const ang = Math.atan2(f.tx, f.tz);
    this.catBody.position.set(f.p.x - Math.cos(ang) * 2.1, f.p.y + .4, f.p.z + Math.sin(ang) * 2.1);
    this.catBody.velocity.setZero();
    this.camDistSmooth = null;
    Snd.fanfare();
  }

  /* the ride camera: in the front car, looking down the track */
  rideCamera() {
    const C = this.coaster, f = coasterFrame(C.u);
    /* Seat height, not head-in-the-headrest: the first pass sat the lens
       exactly where the front passenger's head is and the whole ride was an
       orange sphere. The rider is hidden while you are in their seat. */
    this.camera.up.set(f.ux, f.uy, f.uz);
    /* Dead centre of the front car, at head height. Offsetting backwards to
       "see the car" puts the lens inside the second one, which is 1.7 metres
       behind and 1.5 long: there is no gap between them to sit in. */
    this.camera.position.set(
      f.p.x + f.ux * 1.35,
      f.p.y + f.uy * 1.35,
      f.p.z + f.uz * 1.35);
    /* look a little way down the track rather than straight along the
       tangent: on a crest the tangent points at the sky, and the drop you
       cannot see is the drop that does not scare anyone */
    const a = coasterFrame(C.u + .03);
    this.camera.lookAt(new V3(a.p.x + a.ux * .9, a.p.y + a.uy * .9, a.p.z + a.uz * .9));
  }

  /* ============ nature: trees, rocks, flowers ============ */
  isClearOf(x, z, margin = 6) {
    /* nothing grows through the coaster */
    {
      const d = Math.hypot(x - COASTER.x, z - COASTER.z);
      if (d > 12 && d < 23) return false;
    }
    const d = Math.hypot(x, z);
    if (d > coastRadius(Math.atan2(z, x)) - 7) return false;                // in the sea
    if (heightAt(x, z) < .5) return false;                                  // on the sand
    if (d < 15 + margin) return false;                                      // plaza
    if (Math.hypot(x - this.pondPos.x, z - this.pondPos.z) < this.pondPos.r + 2) return false;
    if (Math.hypot(x - 15, z - 5) < 14) return false;                        // playground
    if (Math.hypot(x + 12, z + 10) < 8) return false;
    /* keep the bridgehead and its spur clear so the way across is not behind a pine */
    if (bridgeSide(x, z, bridgeT(x, z)) < 9) return false;
    if (distToSegment(x, z, BRIDGE_ROAD) < 4) return false;
    for (const p of ZONE_POS) if (Math.hypot(x - p.x, z - p.z) < p.r + margin) return false;
    for (const s of this.pathSegs) {
      const dx = s.x2 - s.x1, dz = s.z2 - s.z1;
      const len2 = dx * dx + dz * dz;
      const t = Math.max(0, Math.min(1, ((x - s.x1) * dx + (z - s.z1) * dz) / len2));
      if (Math.hypot(x - (s.x1 + dx * t), z - (s.z1 + dz * t)) < 4) return false;
    }
    return true;
  }

  /* One conifer, built at the origin with its roots on y=0 and nothing about
     where it is going to stand. That split is what the folder needs: the
     shape is swappable, the placing is the scene's business, and a .glb
     dropped in for `pine` inherits all 46 positions for free. */
  pineModel() {
    const g = new Grp();
    this.m(new CylGeo(.35, .55, 2.6, 7), this.mat(0x4a3324, { roughness: 1 }), 0, 1.3, 0, { parent: g });
    const greens = [0x1e4d30, 0x256240, 0x2c7048];
    for (let i = 0; i < 3; i++)
      this.m(new ConeGeo(2.6 - i * .7, 2.6, 7), this.foliageMat(greens[i]),
        0, 3 + i * 1.7, 0, { parent: g, recv: true });
    return g;
  }
  pine(x, z, s = 1) {
    const y = heightAt(x, z);
    const g = getModel("pine");
    g.position.set(x, y, z); g.rotation.y = Math.random() * 6;
    g.scale.setScalar(s); this.scene.add(g);
    this.scyl(.5 * s, 3 * s, x, y + 1.5 * s, z);
    this.addOccluder(x, y + 3.5 * s, z, 2.0 * s);
  }
  oak(x, z, s = 1) {
    const y = heightAt(x, z);
    const g = new Grp(); g.position.set(x, y, z); g.rotation.y = Math.random() * 6;
    g.scale.setScalar(s); this.scene.add(g);
    this.m(new CylGeo(.4, .7, 3, 7), this.mat(0x54402c, { roughness: 1 }), 0, 1.5, 0, { parent: g });
    const cols = [0x2d6b3d, 0x3a7d4a, 0x27593a];
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1;
      this.m(new IcoGeo(1.7 - i * .25, 0), this.foliageMat(cols[i]),
        Math.cos(a) * .9, 3.6 + Math.sin(a * 2) * .6, Math.sin(a) * .9, { parent: g, recv: true });
    }
    this.scyl(.6 * s, 3 * s, x, y + 1.5 * s, z);
    this.addOccluder(x, y + 3.5 * s, z, 1.9 * s);
  }
  autumnTree(x, z, s = 1) {
    const y = heightAt(x, z);
    const g = new Grp(); g.position.set(x, y, z); g.scale.setScalar(s); this.scene.add(g);
    this.m(new CylGeo(.32, .5, 2.8, 6), this.mat(0x4c3527, { roughness: 1 }), 0, 1.4, 0, { parent: g });
    this.m(new IcoGeo(1.9, 0), this.foliageMat(0xb0692f), 0, 3.8, 0, { parent: g, recv: true });
    this.m(new IcoGeo(1.2, 0), this.foliageMat(0xc98a3a), .8, 4.8, .4, { parent: g, recv: true });
    this.scyl(.5 * s, 3 * s, x, y + 1.5 * s, z);
    this.addOccluder(x, y + 3.7 * s, z, 1.8 * s);
  }

  buildNature() {
    const nTrees = IS_TOUCH ? 26 : 46;
    let placed = 0, guard = 0;
    while (placed < nTrees && guard++ < 400) {
      const a = Math.random() * Math.PI * 2, r = 20 + Math.random() * 95;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!this.isClearOf(x, z)) continue;
      const kind = Math.random();
      const s = .7 + Math.random() * .8;
      if (kind < .45) this.pine(x, z, s);
      else if (kind < .8) this.oak(x, z, s);
      else this.autumnTree(x, z, s);
      placed++;
    }
    /* rocks */
    for (let i = 0; i < (IS_TOUCH ? 10 : 20); i++) {
      const a = Math.random() * 6.28, r = 25 + Math.random() * 88;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!this.isClearOf(x, z, 2)) continue;
      this.m(new DodGeo(.5 + Math.random() * 1.3, 0), this.mat(0x53506a, { flatShading: true, roughness: 1 }),
        x, heightAt(x, z) + .35, z, { recv: true, ry: Math.random() * 6 });
    }
    /* flowers + grass tufts */
    const petals = [0xf2a2c4, 0xffd76a, 0xf07a6a, 0x8fb0ff];
    for (let i = 0; i < (IS_TOUCH ? 16 : 34); i++) {
      const a = Math.random() * 6.28, r = 16 + Math.random() * 95;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!this.isClearOf(x, z, 1)) continue;
      const g = new Grp(); g.position.set(x, heightAt(x, z), z); this.scene.add(g);
      this.m(new CylGeo(.03, .03, .55, 4), this.mat(0x2f6b3c), 0, .27, 0, { parent: g, cast: false });
      this.m(new SphGeo(.16, 7, 6), new StdMat({ color: petals[i % 4], emissive: new Col(petals[i % 4]), emissiveIntensity: .25, roughness: .6 }), 0, .6, 0, { parent: g, cast: false });
      this.anims.push(t => { g.rotation.z = Math.sin(t * 1.3 + x) * .08; });
    }
    /* ---- grass ----
       These were four-sided flat-shaded cones. With the sun this low that
       gives you exactly one lit face and three black ones, so every tuft read
       as a little paper dart half-painted black, and the hillsides were
       speckled with them. Crossed painted planes instead: alpha-tested rather
       than transparent, so they sort like solid geometry and need no blending
       order, and they look like grass from every angle because there is no
       angle where you are staring at an unlit facet. */
    const spots = [];
    for (let i = 0; i < (IS_TOUCH ? 90 : 360); i++) {
      const a = Math.random() * 6.28, r = 15 + Math.random() * 98;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!this.isClearOf(x, z, 0)) continue;
      spots.push([x, heightAt(x, z), z, .75 + Math.random() * .8, Math.random() * 6.283]);
    }
    this.buildGrassCards(spots);
    /* butterflies */
    this.butterflies = [];
    for (let i = 0; i < (IS_TOUCH ? 3 : 6); i++) {
      const g = new Grp(); this.scene.add(g);
      const colr = petals[i % 4];
      const wingGeo = new PlaneGeo(.34, .3);
      const wmat = this.bmat(colr, { side: SIDE_DOUBLE });
      const w1 = this.m(wingGeo, wmat, -.17, 0, 0, { parent: g, cast: false });
      const w2 = this.m(wingGeo, wmat, .17, 0, 0, { parent: g, cast: false });
      const cx = (Math.random() - .5) * 120, cz = (Math.random() - .5) * 120;
      this.butterflies.push({ g, w1, w2, cx, cz, ph: Math.random() * 6, spd: .5 + Math.random() * .5 });
    }
    this.anims.push(t => {
      for (const B of this.butterflies) {
        const bx = B.cx + Math.sin(t * B.spd + B.ph) * 6, bz = B.cz + Math.cos(t * B.spd * .8 + B.ph) * 6;
        B.g.position.set(bx, Math.max(0, heightAt(bx, bz)) + 1.4 + Math.sin(t * 1.7 + B.ph) * .6, bz);
        B.g.rotation.y = t * B.spd + B.ph + Math.PI / 2;
        const flap = Math.sin(t * 14 + B.ph) * 1;
        B.w1.rotation.y = flap; B.w2.rotation.y = -flap;
      }
    });

    /* three tiny islands with mountains on the horizon */
    const isle = (x, z, s) => {
      const g = new Grp(); g.position.set(x, -.4, z); g.scale.setScalar(s); this.scene.add(g);
      this.m(new CylGeo(9, 12, 1.6, 9), this.mat(0x57493a, { flatShading: true }), 0, .4, 0, { parent: g, cast: false });
      this.m(new ConeGeo(6, 12, 7), this.mat(0x3d4258, { flatShading: true }), 0, 6.6, 0, { parent: g });
      this.m(new ConeGeo(2, 3.4, 7), this.mat(0xd8dde8, { flatShading: true }), 0, 12.2, 0, { parent: g });
      this.m(new ConeGeo(2.2, 3, 6), this.mat(0x1e4d30, { flatShading: true }), 5, 2.4, 2, { parent: g });
      this.m(new ConeGeo(1.8, 2.6, 6), this.mat(0x256240, { flatShading: true }), -4.5, 2.2, -3, { parent: g });
    };
    isle(-205, -150, 1.8); isle(230, -95, 1.3); isle(140, 235, 2.2);

    this.buildGrass();
    this.buildShore();
    this.buildOutcrops();
    this.buildBridge();
    this.buildPollen();
  }

  /* ============ the rope bridge ============
     Everything here is placed by walking t from 0 to 1 and asking
     bridgeDeckY(t) where the deck is, so the planks, the beams, the rails and
     the colliders all sit on the same line the cat walks on. The previous
     version mixed that up: some pieces were positioned at the midpoint and
     rotated by the pitch, others at a fixed height, and the rails ran the
     whole span as one cylinder — so the further you walked the further the
     handrail drifted from the deck.

     The deck also gets real colliders. The cat rides the heightmap and does
     not need them, but anything dynamic — a crate, the beach ball — fell
     straight through the planks into the sea. */
  buildBridge() {
    const ang = Math.atan2(BU.x, BU.z);
    const L = Math.hypot(BRIDGE_B.x - BRIDGE_A.x, BRIDGE_B.z - BRIDGE_A.z);
    const G = new Grp();
    G.position.set(BRIDGE_A.x, 0, BRIDGE_A.z);
    G.rotation.y = ang;
    this.scene.add(G);
    this.outdoorOnly.push(G);

    const plank = this.mat(0x6b4f34, { roughness: 1, flatShading: true });
    const plankB = this.mat(0x5d442d, { roughness: 1, flatShading: true });
    const beam = this.mat(0x4c3826, { roughness: 1, flatShading: true });
    const rope = this.mat(0x8a7550, { roughness: 1 });
    /* Rotating a Z-aligned box by +x tips its far end DOWN (Rx sends +Z to
       -Y), so every piece that runs along the span tilts by -pitch. Getting
       this backwards is what made the old deck slope against itself. */
    const pitch = Math.atan2(ISLET_Y - BRIDGE_Y0, L), tilt = -pitch;
    /* world position of a point on the deck's centreline */
    const W = t => ({
      x: BRIDGE_A.x + (BRIDGE_B.x - BRIDGE_A.x) * t,
      y: bridgeDeckY(t),
      z: BRIDGE_A.z + (BRIDGE_B.z - BRIDGE_A.z) * t
    });

    /* ---- deck ---- */
    const N = Math.round(L / 1.1);
    for (let i = 0; i < N; i++) {
      const t = (i + .5) / N, lz = t * L;
      const p = this.m(new BoxGeo(BRIDGE_HALF * 2, .16, .95), i % 3 ? plank : plankB,
        (hash2(i, 3) - .5) * .1, bridgeDeckY(t) - .08, lz, { parent: G, recv: true });
      p.rotation.x = tilt;
      p.rotation.z = (hash2(i, 7) - .5) * .04;
    }
    /* the two stringers under it, in short pieces that each follow the slope */
    for (const s of [-1, 1]) {
      const b = this.m(new BoxGeo(.3, .3, L), beam, s * (BRIDGE_HALF - .18), (BRIDGE_Y0 + ISLET_Y) / 2 - .3, L / 2,
        { parent: G });
      b.rotation.x = tilt;
    }

    /* ---- trestles down into the water, with a cross-brace ---- */
    const posts = Math.max(3, Math.round(L / 8));
    for (let i = 1; i < posts; i++) {
      const t = i / posts, lz = t * L, dy = bridgeDeckY(t);
      for (const s of [-1, 1])
        this.m(new CylGeo(.26, .34, dy + 7, 6), beam, s * (BRIDGE_HALF - .05), (dy - 7) / 2, lz,
          { parent: G, recv: true });
      this.m(new BoxGeo(BRIDGE_HALF * 2, .22, .3), beam, 0, dy - .55, lz, { parent: G, cast: false });
      const brace = this.m(new BoxGeo(BRIDGE_HALF * 2 + .6, .16, .16), beam, 0, dy - 3.4, lz, { parent: G });
      brace.rotation.z = .18;
    }

    /* ---- railing ----
       Posts every couple of metres, and the rails built as one short segment
       between consecutive posts, so the handrail tracks the deck exactly
       instead of being one long stick pinned at its middle. */
    const RP = Math.max(4, Math.round(L / 2.4));
    const railH = [.55, 1.15];
    for (const s of [-1, 1]) {
      for (let i = 0; i <= RP; i++) {
        const t = i / RP;
        this.m(new CylGeo(.09, .11, 1.4, 5), beam, s * BRIDGE_HALF, bridgeDeckY(t) + .6, t * L,
          { parent: G, recv: true });
      }
      for (let i = 0; i < RP; i++) {
        const t0 = i / RP, t1 = (i + 1) / RP;
        for (const hy of railH) {
          const y0 = bridgeDeckY(t0) + hy, y1 = bridgeDeckY(t1) + hy;
          const dz = (t1 - t0) * L, dy = y1 - y0;
          const seg = this.m(new CylGeo(.055, .055, Math.hypot(dz, dy), 5), rope,
            s * BRIDGE_HALF, (y0 + y1) / 2, (t0 + t1) / 2 * L, { parent: G, cast: false });
          seg.rotation.x = Math.PI / 2 - Math.atan2(dy, dz);
        }
      }
    }

    /* ---- colliders ----
       A chain of flat boxes along the deck plus a low kerb each side. Cannon
       has no heightfield here, so without these the bridge is scenery a crate
       drops through. */
    /* One tilted slab for the whole span, not a staircase of flat ones: a
       chain of level boxes leaves each of them proud of the deck at its
       downhill end, and things come to rest hovering above the planks. */
    const mid = W(.5);
    this.sbox(BRIDGE_HALF * 2, .5, L + 2, mid.x, mid.y - .25, mid.z, ang, tilt);
    /* The kerb sits a whole cat-radius outside the railing on purpose.
       confineOutdoors already clamps the cat's centre to BRIDGE_HALF, and its
       collision sphere is .8 wide — a kerb flush with the rail would be
       permanently inside the cat and fight the clamp every frame. */
    for (const s of [-1, 1]) {
      const off = BRIDGE_HALF + 1;
      const ox = Math.cos(ang) * s * off, oz = -Math.sin(ang) * s * off;
      this.sbox(.4, .6, L + 2, mid.x + ox, mid.y + .3, mid.z + oz, ang, tilt);
    }

    /* ---- abutments and landings ---- */
    const stone = this.mat(0x5b5462, { roughness: 1, flatShading: true });
    for (const [t, lz] of [[0, -1.1], [1, L + 1.1]]) {
      const dy = bridgeDeckY(t);
      this.m(new BoxGeo(BRIDGE_HALF * 2 + 2.6, 3, 2.6), stone, 0, dy - 1.6, lz, { parent: G, recv: true });
      for (const s of [-1, 1])
        this.m(new BoxGeo(.9, 1.5, .9), stone, s * (BRIDGE_HALF + .9), dy + .5, lz, { parent: G, recv: true });
    }

    /* two cairns on the beach so the bridgehead is findable without a sign */
    for (const s of [-1, 1]) {
      const bx = BRIDGE_A.x - BU.x * 5 + BU.z * s * 3.4;
      const bz = BRIDGE_A.z - BU.z * 5 - BU.x * s * 3.4;
      const y = heightAt(bx, bz);
      for (let k = 0; k < 3; k++)
        this.m(new DodGeo(.5 - k * .12, 0), k % 2 ? beam : stone,
          bx, y + .3 + k * .5, bz, { recv: true, ry: hash2(k, s + 2) * 6 });
    }

    /* ---- the islet: pines on the shelf, boulders round the crag ---- */
    for (let i = 0; i < 9; i++) {
      const a = hash2(i, 5) * 6.283, r = 8 + hash2(i, 9) * (ISLET_R - 12);
      const x = ISLET.x + Math.cos(a) * r, z = ISLET.z + Math.sin(a) * r;
      /* nothing in the doorway or on top of the tunnel */
      if (Math.abs((x - CAVE_MOUTH.x) * BU.z - (z - CAVE_MOUTH.z) * BU.x) < 8
          && (x - CAVE_MOUTH.x) * BU.x + (z - CAVE_MOUTH.z) * BU.z > -12) continue;
      if (bridgeSide(x, z, bridgeT(x, z)) < 5) continue;
      this.pine(x, z, .7 + hash2(i, 13) * .5);
    }
    const crag = this.mat(0x565266, { roughness: 1, flatShading: true });
    for (let i = 0; i < 12; i++) {
      const a = hash2(i, 21) * 6.283, r = 6 + hash2(i, 27) * (ISLET_R - 8);
      const x = ISLET.x + Math.cos(a) * r, z = ISLET.z + Math.sin(a) * r;
      if (bridgeSide(x, z, bridgeT(x, z)) < 5) continue;
      const s = .6 + hash2(i, 31) * 1.8;
      const rk = this.m(new DodGeo(s, 0), crag, x, heightAt(x, z) + s * .35, z, { recv: true });
      rk.rotation.set(hash2(i, 1) * 3, hash2(i, 2) * 6, hash2(i, 3) * 3);
      if (s > 1.3) this.addOccluder(x, heightAt(x, z) + s * .35, z, s * .85);
    }
  }

  /* ============ ground cover ============
     Thousands of separate little meshes would be thousands of draw calls, so
     every blade on the island goes into one buffer. There is no InstancedMesh
     in this build and no way to add one, but a merged geometry gets to the
     same place: one call, one material, and the wind lives in the shape rather
     than in an update loop. */
  buildGrass() {
    const TUFTS = REDUCED ? 0 : (IS_TOUCH ? 380 : 1200);
    if (!TUFTS) return;
    const BLADES = 5, tris = TUFTS * BLADES;
    const pos = new Float32Array(tris * 9), col = new Float32Array(tris * 9);
    const c = new Col(), A = new Col(0x4a7f45), B = new Col(0x6f9a4a), C = new Col(0x37623a);
    let placed = 0, guard = 0, v = 0;
    while (placed < TUFTS && guard++ < TUFTS * 8) {
      const a = Math.random() * 6.283, r = 17 + Math.sqrt(Math.random()) * 78;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!this.isClearOf(x, z, 1)) continue;
      const y = heightAt(x, z);
      for (let b = 0; b < BLADES; b++) {
        const ba = Math.random() * 6.283, br = Math.random() * .55;
        const bx = x + Math.cos(ba) * br, bz = z + Math.sin(ba) * br;
        const h = .26 + Math.random() * .34, w = .16 + Math.random() * .1;
        const dir = Math.random() * 6.283, lean = (Math.random() - .5) * .3;
        const sx = Math.cos(dir), sz = Math.sin(dir);
        /* two base corners across the blade, one tip leaning downwind */
        pos[v] = bx - sx * w; pos[v + 1] = y; pos[v + 2] = bz - sz * w;
        pos[v + 3] = bx + sx * w; pos[v + 4] = y; pos[v + 5] = bz + sz * w;
        pos[v + 6] = bx + sz * lean; pos[v + 7] = y + h; pos[v + 8] = bz - sx * lean;
        c.copy(A).lerp(B, Math.random()).lerp(C, Math.random() * .5);
        for (let k = 0; k < 3; k++) {
          const s = k === 2 ? 1.25 : .8;      // tips catch the light, roots sit in shade
          col[v + k * 3] = c.r * s; col[v + k * 3 + 1] = c.g * s; col[v + k * 3 + 2] = c.b * s;
        }
        v += 9;
      }
      placed++;
    }
    const geo = new BufGeo();
    geo.setAttribute("position", new F32Attr(pos.subarray(0, v), 3));
    geo.setAttribute("color", new F32Attr(col.subarray(0, v), 3));
    /* Every normal points straight up rather than out of the blade's own face.
       A vertical triangle lit by a low sun goes almost black, and a field of
       black slivers looks like a burnt lawn; borrowing the ground's normal
       makes the grass sit in the same light as the hill it grows on.

       The attribute alone was not enough, and that is why the hillsides were
       speckled: these are double-sided, and three negates the normal on back
       faces, so up became down and every blade seen from behind was lit from
       underneath. groundLit() pins it in the shader, where the flip has
       already happened. */
    const nrm = new Float32Array(v);
    for (let i = 1; i < v; i += 3) nrm[i] = 1;
    geo.setAttribute("normal", new F32Attr(nrm, 3));
    const mesh = new Mesh(geo, this.groundLit(
      new StdMat({ vertexColors: true, roughness: 1, side: SIDE_DOUBLE })));
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.outdoorOnly.push(mesh);
  }

  /* ============ shoreline ============
     The coast used to end in a clean sand line. A scatter of wet boulders and
     driftwood along it gives the silhouette something to bite on. */
  buildShore() {
    const n = IS_TOUCH ? 30 : 64;
    const wet = this.mat(0x3b3a44, { roughness: .55, flatShading: true });
    const dry = this.mat(0x5a5148, { roughness: 1, flatShading: true });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + hash2(i, 3) * .09;
      const R = coastRadius(a) - 1 + (hash2(i, 7) - .5) * 7;
      const x = Math.cos(a) * R, z = Math.sin(a) * R;
      const y = terrainHeight(x, z);        // never perch a boulder on the deck
      if (y < -2.5 || bridgeSide(x, z, bridgeT(x, z)) < 6) continue;
      const s = .5 + hash2(i, 11) * 1.7;
      const rk = this.m(new DodGeo(s, 0), y < .35 ? wet : dry, x, y + s * .3, z, { recv: true });
      rk.rotation.set(hash2(i, 1) * 3, hash2(i, 2) * 6, hash2(i, 3) * 3);
      rk.scale.y = .6 + hash2(i, 17) * .5;
      if (s > 1.3) this.addOccluder(x, y + s * .3, z, s * .8);
    }
    /* a few bleached logs above the tide line */
    for (let i = 0; i < (IS_TOUCH ? 3 : 7); i++) {
      const a = hash2(i, 23) * 6.283, R = coastRadius(a) - 5 - hash2(i, 29) * 4;
      const x = Math.cos(a) * R, z = Math.sin(a) * R;
      const log = this.m(new CylGeo(.28, .34, 3 + hash2(i, 31) * 2.4, 6),
        this.mat(0x8a7f6d, { roughness: 1, flatShading: true }), x, heightAt(x, z) + .3, z, { recv: true });
      log.rotation.set(Math.PI / 2, hash2(i, 37) * 6, .12);
    }
  }

  /* ============ rock outcrops ============
     Bare stone breaking out of the hilltops, so the relief reads as an island
     with bones instead of a green blanket. */
  buildOutcrops() {
    let placed = 0, guard = 0;
    const stone = this.mat(0x585569, { roughness: 1, flatShading: true });
    const dark = this.mat(0x413f4e, { roughness: 1, flatShading: true });
    while (placed < (IS_TOUCH ? 5 : 11) && guard++ < 300) {
      const a = Math.random() * 6.283, r = 30 + Math.random() * 60;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!this.isClearOf(x, z, 9) || heightAt(x, z) < 5) continue;
      const y = heightAt(x, z);
      const g = new Grp(); g.position.set(x, y, z); g.rotation.y = Math.random() * 6;
      this.scene.add(g); this.outdoorOnly.push(g);
      const n = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const s = 1.2 + Math.random() * 1.7;
        const b = this.m(new DodGeo(s, 0), i % 2 ? stone : dark,
          (Math.random() - .5) * 5, s * .45, (Math.random() - .5) * 5, { parent: g, recv: true });
        b.rotation.set(Math.random() * 3, Math.random() * 6, Math.random() * 3);
        b.scale.y = .7 + Math.random() * .6;
      }
      this.addOccluder(x, y + 2, z, 4);
      placed++;
    }
  }

  /* ============ pollen ============
     Warm motes drifting over the grass. The fireflies already glow; these do
     not, they only catch the last of the sun, which is what sells the hour. */
  buildPollen() {
    const count = REDUCED ? 0 : (IS_TOUCH ? 40 : 120);
    if (!count) return;
    const geo = new BufGeo(), arr = new Float32Array(count * 3), base = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * 6.283, r = 12 + Math.random() * 82;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const y = Math.max(0, heightAt(x, z)) + .8 + Math.random() * 5;
      arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
      base.push({ x, y, z, ph: Math.random() * 6.283, sp: .16 + Math.random() * .22 });
    }
    geo.setAttribute("position", new F32Attr(arr, 3));
    const pts = new Points3(geo, new PointsMat({ color: 0xffe2b0, size: .42, map: this.radialTexture(),
      transparent: true, opacity: .45, depthWrite: false, blending: BLEND_ADD }));
    this.scene.add(pts);
    this.outdoorOnly.push(pts);
    this.anims.push(t => {
      const a = pts.geometry.attributes.position.array;
      for (let i = 0; i < base.length; i++) {
        const b = base[i];
        a[i * 3] = b.x + Math.sin(t * b.sp + b.ph) * 3.5 + t * .35 % 6;
        a[i * 3 + 1] = b.y + Math.sin(t * b.sp * 1.3 + b.ph) * 1.1;
        a[i * 3 + 2] = b.z + Math.cos(t * b.sp * .8 + b.ph) * 3.5;
      }
      pts.geometry.attributes.position.needsUpdate = true;
      pts.material.opacity = .3 + Math.sin(t * .9) * .12;
    });
  }

  /* ============ sky: clouds, stars, balloon, birds ============ */
  buildSky() {
    /* Stars, in two layers: a dense faint field and a sparse bright one. One
       uniform size reads as noise; two reads as a sky. */
    for (const [n, size, opa, col] of [[520, .75, .55, 0xbfd2ff], [90, 1.7, .95, 0xf0f4ff]]) {
      const starGeo = new BufGeo();
      const sarr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, e = Math.random() * .55, R = 260;
        sarr[i * 3] = Math.cos(a) * Math.cos(e) * R;
        sarr[i * 3 + 1] = 60 + Math.random() * 150;
        sarr[i * 3 + 2] = Math.sin(a) * Math.cos(e) * R;
      }
      starGeo.setAttribute("position", new F32Attr(sarr, 3));
      const stars = new Points3(starGeo, new PointsMat({ color: col, size, map: this.radialTexture(),
        transparent: true, opacity: opa, depthWrite: false, blending: BLEND_ADD }));
      this.scene.add(stars);
      this.outdoorOnly.push(stars);
      this.anims.push(t => { stars.material.opacity = opa * (.82 + Math.sin(t * .5 + n) * .18); });
    }

    /* the moon, opposite the sun, with a halo */
    const moonPos = new V3(-130, 125, 160);
    const moon = this.m(new SphGeo(6, 20, 16), this.bmat(0xdae3f6), moonPos.x, moonPos.y, moonPos.z,
      { cast: false });
    moon.material.fog = false;
    /* an additive halo this size reads as a lens flare across a third of the
       sky; keep it just wide enough to soften the disc */
    const halo = this.glowSprite(0x7d94c4, 22, moonPos);
    this.scene.add(halo);
    this.outdoorOnly.push(moon, halo);

    /* sun glow on horizon */
    const sunA = this.glowSprite(0xd8a878, 78, new V3(90, 62, -160));
    const sunB = this.glowSprite(0xc98a55, 34, new V3(90, 54, -160));
    this.scene.add(sunA, sunB);
    this.outdoorOnly.push(sunA, sunB);

    /* fireflies */
    const count = REDUCED ? 0 : (IS_TOUCH ? 50 : 130);
    if (count) {
      const g = new BufGeo(), arr = new Float32Array(count * 3);
      this.fireBase = [];
      for (let i = 0; i < count; i++) {
        const a = Math.random() * 6.28, r = 8 + Math.random() * 80, y = 1 + Math.random() * 9;
        const x = Math.cos(a) * r, z = Math.sin(a) * r;
        arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
        this.fireBase.push({ x, y, z, ph: Math.random() * 6.28 });
      }
      g.setAttribute("position", new F32Attr(arr, 3));
      this.fireflies = new Points3(g, new PointsMat({ color: 0xffe680, size: .7, map: this.radialTexture(), transparent: true, opacity: .9, depthWrite: false, blending: BLEND_ADD }));
      this.scene.add(this.fireflies);
      this.anims.push(t => {
        const a = this.fireflies.geometry.attributes.position.array;
        for (let i = 0; i < this.fireBase.length; i++) {
          const f = this.fireBase[i];
          a[i * 3] = f.x + Math.sin(t * .6 + f.ph) * 1.6;
          a[i * 3 + 1] = f.y + Math.sin(t * .9 + f.ph * 1.7) * .8;
          a[i * 3 + 2] = f.z + Math.cos(t * .5 + f.ph) * 1.6;
        }
        this.fireflies.geometry.attributes.position.needsUpdate = true;
        this.fireflies.material.opacity = .6 + Math.sin(t * 2) * .25;
      });
    }

    /* drifting low-poly clouds */
    this.clouds = [];
    for (let i = 0; i < (IS_TOUCH ? 4 : 8); i++) {
      const g = new Grp();
      const puffMat = new StdMat({ color: 0xbcc4de, roughness: 1, transparent: true, opacity: .85, flatShading: true });
      const n = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < n; j++)
        this.m(new IcoGeo(2.2 + Math.random() * 2.4, 0), puffMat,
          j * 3.2 - n * 1.5, Math.random() * 1.4, (Math.random() - .5) * 3, { parent: g, cast: false });
      g.scale.y = .55;
      g.position.set((Math.random() - .5) * 260, 42 + Math.random() * 26, (Math.random() - .5) * 260);
      this.scene.add(g);
      this.outdoorOnly.push(g);
      this.clouds.push({ g, spd: .8 + Math.random() * 1.4 });
    }
    this.anims.push((t, dt) => {
      for (const c of this.clouds) {
        c.g.position.x += c.spd * dt;
        if (c.g.position.x > 170) c.g.position.x = -170;
      }
    });

    /* hot-air balloon with OPEN TO WORK banner */
    const bal = new Grp(); this.scene.add(bal); this.outdoorOnly.push(bal);
    const stripes = this.makeCanvas(128, 128, g => {
      const cols = ["#e8b06a", "#f07a6a", "#7fdca8", "#8fb0ff"];
      for (let i = 0; i < 8; i++) { g.fillStyle = cols[i % 4]; g.fillRect(i * 16, 0, 16, 128); }
    });
    this.m(new SphGeo(3.4, 16, 14), new StdMat({ map: stripes, roughness: .7 }), 0, 0, 0, { parent: bal });
    this.m(new ConeGeo(1.6, 2.6, 10), this.mat(0xc98a3a), 0, -3.4, 0, { parent: bal, rx: Math.PI });
    this.m(new BoxGeo(1.4, 1, 1.4), this.mat(0x6a4a2f, { roughness: 1 }), 0, -5.2, 0, { parent: bal });
    const banner = this.makeLabel("OPEN TO WORK", "#ffd76a", 2.2);
    banner.position.y = -7.2; bal.add(banner);
    this.anims.push(t => {
      const a = t * .05;
      bal.position.set(Math.cos(a) * 55, 30 + Math.sin(t * .4) * 1.5, Math.sin(a) * 55);
    });

    /* birds circling */
    this.birds = [];
    for (let i = 0; i < (IS_TOUCH ? 3 : 5); i++) {
      const g = new Grp(); this.scene.add(g); this.outdoorOnly.push(g);
      const bodyM = this.mat(0x2c2a38, { flatShading: true });
      this.m(new ConeGeo(.18, .8, 4), bodyM, 0, 0, 0, { parent: g, rx: Math.PI / 2, cast: false });
      const w1 = this.m(new PlaneGeo(1, .34), this.bmat(0x2c2a38, { side: SIDE_DOUBLE }), -.5, 0, 0, { parent: g, cast: false });
      const w2 = this.m(new PlaneGeo(1, .34), this.bmat(0x2c2a38, { side: SIDE_DOUBLE }), .5, 0, 0, { parent: g, cast: false });
      w1.rotation.x = w2.rotation.x = -Math.PI / 2;
      this.birds.push({ g, w1, w2, r: 25 + i * 12, h: 16 + i * 4, ph: i * 1.9, spd: .12 + Math.random() * .1 });
    }
    this.anims.push(t => {
      for (const B of this.birds) {
        const a = t * B.spd + B.ph;
        B.g.position.set(Math.cos(a) * B.r, B.h + Math.sin(t * .8 + B.ph) * 1.2, Math.sin(a) * B.r);
        B.g.rotation.y = -a - Math.PI / 2;
        const flap = Math.sin(t * 9 + B.ph) * .7;
        B.w1.rotation.z = flap; B.w2.rotation.z = -flap;
      }
    });
  }


  /* ============ zone framework ============ */
  registerZone(i, opts = {}) {
    const meta = ZONES_META[i], p = ZONE_POS[i];
    const col = new Col(meta.color).getHex();

    /* ---- the precinct ----
       Every temple used to be marked by one glowing circle painted on the
       grass and nothing else, so however much architecture each of them had,
       they all stood on a decal. A shared shell instead: a band of flagstones
       edging the ground the temple occupies, a carved kerb outside it and a
       ring of pylons carrying the zone's colour. Seven temples, one piece of
       code — and because it is shared, they read as belonging to the same
       island rather than as seven unrelated set pieces.

       Flush with the ground, like the plaza and for the same reason: the cat
       rides heightAt(), which is carved flat under every temple, so anything
       with real height here is something it walks through. */
    if (!this.precinctMats) this.precinctMats = {
      pave: this.detail(this.mat(0x6f6555, { roughness: .9 }), 2.6, .17),
      kerb: this.mat(0x554c40, { roughness: .95 }),
      pylon: this.detail(this.mat(0x5b5346, { roughness: .92, flatShading: true }), 2.4, .2)
    };
    const PM = this.precinctMats;
    this.m(new RingGeo(p.r - 2.6, p.r + .4, 56), PM.pave, p.x, .05, p.z,
      { rx: -Math.PI / 2, cast: false, recv: true });
    this.m(new RingGeo(p.r + .4, p.r + 1.1, 56), PM.kerb, p.x, .04, p.z,
      { rx: -Math.PI / 2, cast: false, recv: true });

    /* Pylons, skipped where the road comes in — a marker post planted in the
       mouth of the only way to the door is the one place it must not go. */
    const road = Math.atan2(p.x, p.z) + Math.PI;      // bearing the path arrives on
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * Math.PI * 2;
      let d = Math.abs(((a - road + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < .5) continue;
      const px = p.x + Math.sin(a) * (p.r - 1), pz = p.z + Math.cos(a) * (p.r - 1);
      const G = new Grp(); G.position.set(px, 0, pz); G.rotation.y = a; this.scene.add(G);
      /* Only the shaft casts. Seven precincts of eight pylons is a couple of
         hundred casters, and the shadow map is re-rendered every frame — the
         base ring and the collar contribute nothing you would ever notice. */
      this.m(new CylGeo(.42, .52, .26, 6), PM.kerb, 0, .13, 0, { parent: G, recv: true, cast: false });
      this.m(new CylGeo(.2, .32, 1.7, 6), PM.pylon, 0, 1.05, 0, { parent: G, recv: true });
      this.m(new TorusGeo(.26, .05, 5, 12), PM.kerb, 0, 1.86, 0, { parent: G, rx: Math.PI / 2, cast: false });
      this.m(new OctGeo(.2, 0), new StdMat({ color: col, emissive: new Col(col),
        emissiveIntensity: 1.25, roughness: .25 }), 0, 2.14, 0, { parent: G, cast: false });
      G.add(this.glowSprite(col, 1.15, new V3(0, 2.14, 0)));
      this.scyl(.36, 2.2, px, 1.1, pz);
    }

    const ring = this.m(new RingGeo(p.r - 1.2, p.r - .4, 48),
      this.bmat(col, { transparent: true, opacity: .4, side: SIDE_DOUBLE }),
      p.x, .09, p.z, { rx: -Math.PI / 2, cast: false });
    const light = this.addLight(p.x, opts.lightY ?? 7, p.z, col, 9, p.r * 3);
    const label = this.makeLabel(L(meta.name), meta.color, 2.5);
    label.position.set(p.x, opts.labelY ?? 10.5, p.z);
    this.scene.add(label);
    this.labels.push(label);
    /* sign at path entrance, facing walkers */
    const ang = Math.atan2(p.x, p.z);
    const sx = p.x - Math.sin(ang) * (p.r + 1.2), sz = p.z - Math.cos(ang) * (p.r + 1.2);
    this.sign(sx + 2 * Math.cos(ang), sz - 2 * Math.sin(ang), ang + Math.PI, L(meta.name), meta.color);
    const zone = { x: p.x, z: p.z, r: p.r, meta, ring, light, discovered: false, baseI: 7 };
    this.zones.push(zone);
    this.anims.push(t => {
      ring.material.opacity = .3 + Math.sin(t * 2 + p.x) * .1 + (state.near === zone ? .35 : 0);
    });
    return zone;
  }

  /* flickering fire: light + embers + glow */
  makeFire(x, y, z, scale = 1, color = 0xff8a3c) {
    const light = this.addLight(x, y + .8 * scale, z, color, 9 * scale, 17 * scale);
    this.scene.add(this.glowSprite(color, 2.4 * scale, new V3(x, y + .6 * scale, z)));
    const n = IS_TOUCH ? 8 : 14;
    const g = new BufGeo(), arr = new Float32Array(n * 3);
    g.setAttribute("position", new F32Attr(arr, 3));
    const pts = new Points3(g, new PointsMat({ color: 0xffb36a, size: .3 * scale, map: this.radialTexture(), transparent: true, opacity: .9, depthWrite: false, blending: BLEND_ADD }));
    this.scene.add(pts);
    const phases = Array.from({ length: n }, () => Math.random());
    this.anims.push(t => {
      light.intensity = (7 + Math.sin(t * 11 + x) * 2 + Math.sin(t * 23) * 1.5) * scale;
      const a = pts.geometry.attributes.position.array;
      for (let i = 0; i < n; i++) {
        const ph = (t * .8 + phases[i]) % 1;
        a[i * 3] = x + Math.sin((phases[i] + t * .2) * 20) * .25 * scale;
        a[i * 3 + 1] = y + ph * 2.2 * scale;
        a[i * 3 + 2] = z + Math.cos((phases[i] + t * .3) * 17) * .25 * scale;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    });
    return light;
  }

  /* smoke column (chimneys) */
  makeSmoke(x, y, z) {
    const n = 5, sprites = [];
    for (let i = 0; i < n; i++) {
      const s = new Sprite3(new SpriteMat({ map: this.radialTexture(), color: 0x8a8a96, transparent: true, opacity: .3, depthWrite: false }));
      this.scene.add(s);
      sprites.push(s);
    }
    this.anims.push(t => {
      for (let i = 0; i < n; i++) {
        const ph = (t * .25 + i / n) % 1;
        sprites[i].position.set(x + Math.sin(ph * 9 + i) * .5, y + ph * 4.5, z + Math.cos(ph * 7) * .3);
        const sc = .6 + ph * 2;
        sprites[i].scale.set(sc, sc, 1);
        sprites[i].material.opacity = .28 * (1 - ph);
      }
    });
  }

  buildTemples() {
    this.buildHouse();
    this.buildLab();
    this.buildWarehouse();
    this.buildArcade();
    this.buildForge();
    this.buildHill();
    this.buildLighthouse();
  }

  /* ============ 0 · La Casa del Gato (about) ============ */
  buildHouse() {
    const p = ZONE_POS[0];
    const G = new Grp(); G.position.set(p.x, 0, p.z);
    G.rotation.y = Math.atan2(-p.x, -p.z);   // door faces the plaza
    this.scene.add(G);
    const wallM = this.mat(0xd8c4a4, { roughness: .95 });
    const woodM = this.mat(0x6a4a2f, { roughness: .9 });
    const roofM = this.mat(0xa04838, { roughness: .85, flatShading: true });

    this.m(new BoxGeo(9.4, .5, 7.4), this.mat(0x8f8a80), 0, .25, 0, { parent: G, recv: true });
    /* walls: back, left, right, front split around door */
    this.m(new BoxGeo(8.6, 3.4, .35), wallM, 0, 2.2, -3.2, { parent: G, recv: true });
    this.m(new BoxGeo(.35, 3.4, 6.4), wallM, -4.15, 2.2, 0, { parent: G, recv: true });
    this.m(new BoxGeo(.35, 3.4, 6.4), wallM, 4.15, 2.2, 0, { parent: G, recv: true });
    this.m(new BoxGeo(3, 3.4, .35), wallM, -2.8, 2.2, 3.2, { parent: G });
    this.m(new BoxGeo(3, 3.4, .35), wallM, 2.8, 2.2, 3.2, { parent: G });
    this.m(new BoxGeo(2.6, .9, .35), wallM, 0, 3.45, 3.2, { parent: G });
    /* door */
    this.m(new BoxGeo(1.5, 2.5, .18), woodM, 0, 1.75, 3.28, { parent: G });
    this.m(new SphGeo(.09, 8, 6), this.mat(0xffd76a, { metalness: .7, roughness: .3 }), .5, 1.7, 3.42, { parent: G, cast: false });
    /* glowing windows */
    const winM = new StdMat({ color: 0xffe0a0, emissive: new Col(0xffb96a), emissiveIntensity: 1.4, roughness: .4 });
    this.m(new BoxGeo(1.1, 1.1, .1), winM, -2.7, 2.3, 3.3, { parent: G, cast: false });
    this.m(new BoxGeo(1.1, 1.1, .1), winM, 2.7, 2.3, 3.3, { parent: G, cast: false });
    this.m(new BoxGeo(.1, 1.1, 1.3), winM, 4.25, 2.3, -.8, { parent: G, cast: false });
    /* warm glow spilling out of the windows */
    {
      const ry0 = G.rotation.y;
      const wx = p.x + 0 * Math.cos(ry0) + 2.6 * Math.sin(ry0);
      const wz = p.z - 0 * Math.sin(ry0) + 2.6 * Math.cos(ry0);
      this.addLight(wx, 2.4, wz, 0xffbe7a, 8, 18);
    }
    /* window frames */
    for (const wx of [-2.7, 2.7]) {
      this.m(new BoxGeo(1.3, .12, .16), woodM, wx, 2.9, 3.32, { parent: G, cast: false });
      this.m(new BoxGeo(1.3, .12, .16), woodM, wx, 1.7, 3.32, { parent: G, cast: false });
    }
    /* gabled roof */
    const roofL = this.m(new BoxGeo(5.6, .3, 8.4), roofM, -2.25, 4.85, 0, { parent: G, rz: .72, recv: true });
    const roofR = this.m(new BoxGeo(5.6, .3, 8.4), roofM, 2.25, 4.85, 0, { parent: G, rz: -.72 });
    this.m(new BoxGeo(.5, .5, 8.5), this.mat(0x7a352a), 0, 5.75, 0, { parent: G });
    /* gable infill */
    this.m(new ConeGeo(3.1, 2.2, 4), wallM, 0, 4.95, 0, { parent: G, ry: Math.PI / 4 });
    /* chimney */
    this.m(new BoxGeo(1, 2.6, 1), this.mat(0x8f6a52, { roughness: 1 }), 2.6, 5.6, -1.6, { parent: G });

    /* colliders (in world space, approximate with rotation) */
    const ry = G.rotation.y;
    const rot = (lx, lz) => ({ x: p.x + lx * Math.cos(ry) + lz * Math.sin(ry), z: p.z - lx * Math.sin(ry) + lz * Math.cos(ry) });
    let w = rot(0, -3.2); this.sbox(8.6, 4, .5, w.x, 2, w.z, ry);
    w = rot(-4.15, 0); this.sbox(.5, 4, 6.4, w.x, 2, w.z, ry);
    w = rot(4.15, 0); this.sbox(.5, 4, 6.4, w.x, 2, w.z, ry);
    w = rot(-2.8, 3.2); this.sbox(3, 4, .5, w.x, 2, w.z, ry);
    w = rot(2.8, 3.2); this.sbox(3, 4, .5, w.x, 2, w.z, ry);
    w = rot(0, 3.2); this.sbox(2.6, 1.2, .5, w.x, 4, w.z, ry); // over the door

    /* chimney smoke */
    const ch = rot(2.6, -1.6);
    this.makeSmoke(ch.x, 7, ch.z);

    /* garden: fence, mailbox, pumpkins, cat bed, yarn ball */
    const fenceM = this.mat(0x9a8a70, { roughness: 1 });
    for (let i = 0; i < 10; i++) {
      const a = -1 + i * .25;
      const fx = Math.cos(a) * 8.2, fz = Math.sin(a) * 8.2;
      this.m(new BoxGeo(.18, 1, .18), fenceM, fx, .5, fz, { parent: G, cast: false });
    }
    const mb = new Grp(); mb.position.set(3.4, 0, 5.4); G.add(mb);
    this.m(new CylGeo(.08, .1, 1.2, 6), woodM, 0, .6, 0, { parent: mb });
    this.m(new BoxGeo(.8, .55, .5), this.mat(0xd6543c, { roughness: .6 }), 0, 1.4, 0, { parent: mb });
    /* pumpkin patch */
    for (const [px, pz, s] of [[-3.4, 5, .45], [-2.6, 5.7, .3], [-4, 5.9, .35]]) {
      this.m(new SphGeo(s, 9, 7), this.mat(0xd97b2e, { roughness: .8, flatShading: true }), px, s * .8, pz, { parent: G, cast: false });
      this.m(new CylGeo(.04, .06, .2, 5), this.mat(0x3f5c2a), px, s * 1.7, pz, { parent: G, cast: false });
    }
    /* cat bed + fish bowl by the door */
    this.m(new TorusGeo(.75, .28, 8, 16), this.mat(0x8fb0ff, { roughness: .9 }), -1.8, .3, 4.8, { parent: G, rx: -Math.PI / 2, cast: false });
    this.m(new CylGeo(.6, .6, .12, 12), this.mat(0xf2d8c4), -1.8, .32, 4.8, { parent: G, cast: false });
    /* yarn ball to push around */
    const yb = rot(2, 6.5);
    this.dsphere(.55, yb.x, 1, yb.z, 0xf2a2c4, .4, { matOpts: { roughness: .95 } });

    this.registerZone(0, { labelY: 9.5 });
  }

  /* ============ 1 · Templo de la Evolución (TFG) ============ */
  buildLab() {
    const p = ZONE_POS[1];
    const G = new Grp(); G.position.set(p.x, 0, p.z); this.scene.add(G);
    const stoneM = this.mat(0x3d4258, { roughness: .8 });

    /* stepped circular platform */
    this.m(new CylGeo(9.5, 10, .5, 28), stoneM, 0, .25, 0, { parent: G, recv: true });
    this.m(new CylGeo(8, 8.5, .5, 28), stoneM, 0, .75, 0, { parent: G, recv: true });
    this.scyl(9.7, .6, p.x, .3, p.z);
    this.scyl(8.2, 1.1, p.x, .55, p.z);

    /* observatory dome with slit */
    const dome = this.m(new SphGeo(4.6, 20, 12, 0, Math.PI * 1.82, 0, Math.PI / 2),
      this.mat(0x2c3248, { roughness: .5, metalness: .3, side: SIDE_DOUBLE }), 0, 1, -2, { parent: G });
    this.m(new CylGeo(4.6, 4.9, 1.2, 20), stoneM, 0, 1, -2, { parent: G });
    this.scyl(4.9, 4, p.x, 2, p.z - 2);
    /* telescope poking out */
    this.m(new CylGeo(.5, .7, 4.2, 10), this.mat(0x7fdca8, { roughness: .4, metalness: .4 }),
      0, 5, -.6, { parent: G, rx: -.7 });
    this.anims.push(t => { dome.rotation.y = Math.sin(t * .2) * .6; });

    /* DNA double helix hologram */
    const dna = new Grp(); dna.position.set(4.5, 3.4, 3.5); G.add(dna);
    const aM = new StdMat({ color: 0x7fdca8, emissive: new Col(0x7fdca8), emissiveIntensity: .9, roughness: .3 });
    const bM = new StdMat({ color: 0x8fb0ff, emissive: new Col(0x8fb0ff), emissiveIntensity: .9, roughness: .3 });
    for (let i = 0; i < 12; i++) {
      const y = i * .42 - 2.5, a = i * .62;
      this.m(new SphGeo(.16, 8, 6), aM, Math.cos(a) * .8, y, Math.sin(a) * .8, { parent: dna, cast: false });
      this.m(new SphGeo(.16, 8, 6), bM, -Math.cos(a) * .8, y, -Math.sin(a) * .8, { parent: dna, cast: false });
      if (i % 2 === 0) {
        const rung = this.m(new CylGeo(.045, .045, 1.6, 5), this.bmat(0xcfe0ff, { transparent: true, opacity: .5 }), 0, y, 0, { parent: dna, cast: false });
        rung.rotation.z = Math.PI / 2; rung.rotation.y = -a;
      }
    }
    this.anims.push(t => { dna.rotation.y = t * .8; });
    G.add(this.glowSprite(0x7fdca8, 4, new V3(4.5, 3.4, 3.5)));
    this.addLight(p.x + 4.5, 3.4, p.z + 3.5, 0x7fdca8, 8, 20);
    this.m(new CylGeo(.9, 1.1, 1, 10), stoneM, 4.5, .9, 3.5, { parent: G });

    /* live population graph screen (nod to live_graph.py) */
    const gc = document.createElement("canvas"); gc.width = 256; gc.height = 128;
    const gtex = new CanvasTex(gc); gtex.colorSpace = SRGB;
    const screen = this.m(new BoxGeo(3.4, 2, .2), new StdMat({ map: gtex, emissive: new Col(0x3a5a4a), emissiveIntensity: .4, roughness: .4 }), -4.6, 2.6, 3.4, { parent: G });
    screen.rotation.y = .9;
    this.m(new BoxGeo(.3, 1.6, .3), stoneM, -4.6, .8, 3.4, { parent: G });
    this.popHistory = Array.from({ length: 64 }, () => 20 + Math.random() * 10);
    this.foodHistory = Array.from({ length: 64 }, () => 25 + Math.random() * 10);
    let lastG = 0;
    this.anims.push(t => {
      if (t - lastG < .25) return;
      lastG = t;
      const ph = this.popHistory, fh = this.foodHistory;
      ph.push(Math.max(4, Math.min(48, ph[ph.length - 1] + (Math.random() - .48) * 4))); ph.shift();
      fh.push(Math.max(4, Math.min(48, fh[fh.length - 1] + (Math.random() - .5) * 5))); fh.shift();
      const g = gc.getContext("2d");
      g.fillStyle = "#0c1410"; g.fillRect(0, 0, 256, 128);
      g.strokeStyle = "#1e3328"; g.lineWidth = 1;
      for (let y = 20; y < 128; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
      const plot = (hist, col) => {
        g.strokeStyle = col; g.lineWidth = 2; g.beginPath();
        hist.forEach((v, i) => { const x = i * 4, y = 120 - v * 2.2; i ? g.lineTo(x, y) : g.moveTo(x, y); });
        g.stroke();
      };
      plot(ph, "#7fdca8"); plot(fh, "#e8b06a");
      g.font = '10px "JetBrains Mono", monospace';
      g.fillStyle = "#7fdca8"; g.fillText("agents: " + Math.round(ph[63]), 8, 14);
      g.fillStyle = "#e8b06a"; g.fillText("food: " + Math.round(fh[63]), 100, 14);
      gtex.needsUpdate = true;
    });

    /* wandering agents hunting food orbs */
    this.agents = []; this.foods = [];
    const agentCols = [0x7fdca8, 0xa2e8c0, 0x5fc890];
    for (let i = 0; i < 5; i++) {
      const g = new Grp();
      const body = this.m(new TetGeo(.42, 0), this.mat(agentCols[i % 3], { flatShading: true, roughness: .6 }), 0, .35, 0, { parent: g });
      body.rotation.x = .6;
      const eyeM = this.bmat(0x14161c);
      this.m(new SphGeo(.07, 6, 5), eyeM, -.13, .5, .28, { parent: g, cast: false });
      this.m(new SphGeo(.07, 6, 5), eyeM, .13, .5, .28, { parent: g, cast: false });
      g.position.set(p.x + (Math.random() - .5) * 10, 0, p.z + (Math.random() - .5) * 10);
      this.scene.add(g);
      this.agents.push({ g, target: null, speed: 1.4 + Math.random() * .9, wob: Math.random() * 6 });
    }
    for (let i = 0; i < 6; i++) {
      const orb = this.m(new SphGeo(.2, 8, 6), new StdMat({ color: 0xe8b06a, emissive: new Col(0xe8b06a), emissiveIntensity: 1, roughness: .3 }), 0, .3, 0, { cast: false });
      const f = { mesh: orb, cool: 0 };
      this.respawnFood(f);
      this.foods.push(f);
    }
    this.anims.push((t, dt) => {
      for (const f of this.foods) {
        if (f.cool > 0) { f.cool -= dt; if (f.cool <= 0) this.respawnFood(f); continue; }
        f.mesh.position.y = .3 + Math.sin(t * 3 + f.mesh.position.x) * .08;
      }
      for (const A of this.agents) {
        if (!A.target || A.target.cool > 0) {
          let best = null, bd = 1e9;
          for (const f of this.foods) if (f.cool <= 0) {
            const d = A.g.position.distanceTo(f.mesh.position);
            if (d < bd) { bd = d; best = f; }
          }
          A.target = best;
        }
        if (!A.target) continue;
        const tp = A.target.mesh.position;
        const dx = tp.x - A.g.position.x, dz = tp.z - A.g.position.z;
        const d = Math.hypot(dx, dz);
        if (d < .45) {
          A.target.cool = 2 + Math.random() * 2;
          A.target.mesh.position.y = -5;
          A.target = null;
          continue;
        }
        A.g.position.x += dx / d * A.speed * dt;
        A.g.position.z += dz / d * A.speed * dt;
        A.g.rotation.y = Math.atan2(dx, dz);
        A.g.position.y = Math.abs(Math.sin(t * 9 + A.wob)) * .12;
      }
    });

    this.registerZone(1, { labelY: 11 });
  }
  respawnFood(f) {
    const p = ZONE_POS[1];
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 8.5;
    f.mesh.position.set(p.x + Math.cos(a) * r, .3, p.z + Math.sin(a) * r);
    f.cool = 0;
  }

  /* ============ 2 · El Gran Almacén (TriniGlass) ============ */
  buildWarehouse() {
    const p = ZONE_POS[2];
    const G = new Grp(); G.position.set(p.x, 0, p.z);
    G.rotation.y = Math.atan2(-p.x, -p.z) + Math.PI;  // open front toward the path
    this.scene.add(G);
    const ry = G.rotation.y;
    const rot = (lx, lz) => ({ x: p.x + lx * Math.cos(ry) + lz * Math.sin(ry), z: p.z - lx * Math.sin(ry) + lz * Math.cos(ry) });
    const steelM = this.mat(0x4a5060, { roughness: .5, metalness: .6 });
    const wallM = this.mat(0x5c6472, { roughness: .8, metalness: .3 });

    /* slab + frame */
    this.m(new BoxGeo(17, .4, 13), this.mat(0x3a3d46, { roughness: .9 }), 0, .2, 0, { parent: G, recv: true });
    for (const [cx, cz] of [[-8, -6], [8, -6], [-8, 6], [8, 6], [-8, 0], [8, 0]])
      this.m(new BoxGeo(.5, 6.4, .5), steelM, cx, 3.2, cz, { parent: G });
    /* roof: two slight slopes + skylight strip */
    this.m(new BoxGeo(17.6, .3, 7), wallM, 0, 6.6, -3.4, { parent: G, rx: .1 });
    this.m(new BoxGeo(17.6, .3, 7), wallM, 0, 6.6, 3.4, { parent: G, rx: -.1 });
    this.m(new BoxGeo(17.6, .2, 1.6), new StdMat({ color: 0xbfe8ff, emissive: new Col(0x88b8d8), emissiveIntensity: .5, transparent: true, opacity: .8 }), 0, 6.95, 0, { parent: G, cast: false });
    /* walls: back + sides (front open) */
    this.m(new BoxGeo(17, 6, .3), wallM, 0, 3.2, 6.4, { parent: G, recv: true });
    this.m(new BoxGeo(.3, 6, 12.8), wallM, -8.5, 3.2, 0, { parent: G, recv: true });
    this.m(new BoxGeo(.3, 6, 12.8), wallM, 8.5, 3.2, 0, { parent: G, recv: true });
    let w = rot(0, 6.4); this.sbox(17, 6.5, .5, w.x, 3.2, w.z, ry);
    w = rot(-8.5, 0); this.sbox(.5, 6.5, 12.8, w.x, 3.2, w.z, ry);
    w = rot(8.5, 0); this.sbox(.5, 6.5, 12.8, w.x, 3.2, w.z, ry);

    /* big TG sign */
    const signTex = this.makeCanvas(256, 96, g => {
      g.fillStyle = "#20242c"; g.fillRect(0, 0, 256, 96);
      g.font = '700 44px "Space Grotesk", sans-serif';
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "#e8b06a"; g.fillText("TRINIGLASS", 128, 50);
    });
    this.m(new BoxGeo(7, 2.4, .3), new StdMat({ map: signTex, emissive: new Col(0x503818), emissiveIntensity: .5, roughness: .5 }), 0, 7.9, -5.6, { parent: G });

    /* shelving racks with stored crates */
    const rack = (rx0, rz0) => {
      const R = new Grp(); R.position.set(rx0, 0, rz0); G.add(R);
      for (const ox of [-3, 3])
        this.m(new BoxGeo(.28, 4.6, 1.6), this.mat(0xc06030, { roughness: .6 }), ox, 2.3, 0, { parent: R });
      this.m(new BoxGeo(6.6, .22, 1.7), steelM, 0, 1.7, 0, { parent: R });
      this.m(new BoxGeo(6.6, .22, 1.7), steelM, 0, 3.6, 0, { parent: R });
      const crateM = [0x8a5a2b, 0x936133, 0x7a4f24];
      for (let i = 0; i < 4; i++) {
        this.m(new BoxGeo(1.15, 1.15, 1.15), this.mat(crateM[i % 3], { roughness: .9, flatShading: true }), -2.2 + i * 1.5, 2.4, 0, { parent: R });
        if (i % 2) this.m(new BoxGeo(1, 1, 1), this.mat(crateM[(i + 1) % 3], { roughness: .9, flatShading: true }), -2.2 + i * 1.5, 4.2, 0, { parent: R });
      }
      const wp = rot(rx0, rz0);
      this.sbox(7, 4.6, 1.8, wp.x, 2.3, wp.z, ry);
    };
    rack(-3.5, 4.8); rack(4.5, 4.8);

    /* loose crates to shove around */
    for (let i = 0; i < 4; i++) {
      const c = rot(-5 + i * 2.6, -2 + (i % 2) * 2);
      this.dbox(1.25, 1.25, 1.25, c.x, .85, c.z, [0x8a5a2b, 0x936133][i % 2], 1.6);
    }
    /* pallet stack */
    for (let i = 0; i < 3; i++)
      this.m(new BoxGeo(2.2, .18, 1.8), this.mat(0xb08b5a, { roughness: 1 }), 6.4, .5 + i * .22, -3.4, { parent: G, cast: false });

    /* forklift */
    const FL = new Grp(); FL.position.set(-5.6, 0, 1.8); FL.rotation.y = .7; G.add(FL);
    this.m(new BoxGeo(1.8, 1.2, 2.6), this.mat(0xe8b02a, { roughness: .5 }), 0, 1.1, 0, { parent: FL });
    this.m(new BoxGeo(1.5, .9, 1), this.mat(0x2c2a30, { roughness: .6 }), 0, 2.1, -.5, { parent: FL });
    this.m(new BoxGeo(.16, 2.6, .16), steelM, -.5, 1.7, 1.5, { parent: FL });
    this.m(new BoxGeo(.16, 2.6, .16), steelM, .5, 1.7, 1.5, { parent: FL });
    this.m(new BoxGeo(.5, .1, 1.1), steelM, -.35, .35, 2.1, { parent: FL });
    this.m(new BoxGeo(.5, .1, 1.1), steelM, .35, .35, 2.1, { parent: FL });
    for (const [wx, wz] of [[-.95, .9], [.95, .9], [-.95, -.9], [.95, -.9]])
      this.m(new CylGeo(.42, .42, .3, 10), this.mat(0x1c1a20, { roughness: .8 }), wx, .42, wz, { parent: FL, rz: Math.PI / 2 });
    const fw = rot(-5.6, 1.8);
    this.sbox(2.2, 2.6, 3, fw.x, 1.3, fw.z, ry + .7);

    /* barcode floor markings */
    for (let i = 0; i < 5; i++)
      this.m(new PlaneGeo(.18 + Math.random() * .2, 2.6), this.bmat(0xe8e4da, { transparent: true, opacity: .5 }),
        -2 + i * .8, .41, -4.6, { parent: G, rx: -Math.PI / 2, cast: false });

    /* warm interior work lights */
    for (const lx of [-4, 4]) {
      const lp = rot(lx, 2);
      this.m(new BoxGeo(1.6, .12, .4), new StdMat({ color: 0xfff2d0, emissive: new Col(0xffe0a0), emissiveIntensity: 1.5, roughness: .4 }),
        0, 0, 0, { cast: false }).position.set(lp.x, 6.2, lp.z);
      this.addLight(lp.x, 6, lp.z, 0xffd9a0, 7, 20);
    }

    this.registerZone(2, { labelY: 11, lightY: 8 });
  }

  /* Called by the Mastermind minigame once the player solves it. The orbs it
     lights used to be the ones in the Ruins; now that the riddle only exists
     underground, they are the four in the niches of the Crypt of the Code. */
  lockRuneOrbs(colors) {
    if (!this.mmOrbs) return;
    this.mmOrbs.forEach((orb, i) => {
      const c = new Col(colors[i % colors.length]);
      orb.material.color.copy(c);
      orb.material.emissive.copy(c);
      orb.material.emissiveIntensity = 1.9;
    });
  }

  /* ============ 3 · Santuario Arcade (gamedev) ============ */
  buildArcade() {
    const p = ZONE_POS[3];
    const G = new Grp(); G.position.set(p.x, 0, p.z);
    G.rotation.y = Math.atan2(-p.x, -p.z) + Math.PI;
    this.scene.add(G);
    const ry = G.rotation.y;
    const rot = (lx, lz) => ({ x: p.x + lx * Math.cos(ry) + lz * Math.sin(ry), z: p.z - lx * Math.sin(ry) + lz * Math.cos(ry) });

    /* dance floor: blinking tiles */
    const tileCols = [0x7ce8e0, 0xf2a2c4, 0xffd76a, 0x8fb0ff];
    this.arcadeTiles = [];
    for (let tx = 0; tx < 5; tx++) for (let tz = 0; tz < 4; tz++) {
      const tile = this.m(new PlaneGeo(1.9, 1.9),
        this.bmat(tileCols[(tx + tz) % 4], { transparent: true, opacity: .2 }),
        (tx - 2) * 2, .1, (tz - 1.5) * 2 - 1, { parent: G, rx: -Math.PI / 2, cast: false });
      this.arcadeTiles.push({ tile, ph: (tx * 7 + tz * 3) % 12 });
    }
    this.anims.push(t => {
      for (const T of this.arcadeTiles)
        T.tile.material.opacity = .12 + Math.max(0, Math.sin(t * 2.2 + T.ph)) * .4;
    });

    /* giant arcade cabinet with self-playing pong */
    const CAB = new Grp(); CAB.position.set(0, 0, 5.2); G.add(CAB);
    const cabM = this.mat(0x2c2438, { roughness: .6 });
    this.m(new BoxGeo(6.5, 8.5, 3), cabM, 0, 4.25, 0, { parent: CAB, recv: true });
    this.m(new BoxGeo(6.9, 1, 3.4), this.mat(0x7ce8e0, { roughness: .4, emissive: new Col(0x2c5854), emissiveIntensity: .6 }), 0, 8.9, 0, { parent: CAB });
    /* marquee text */
    const marqueeTex = this.makeCanvas(256, 64, g => {
      g.fillStyle = "#141020"; g.fillRect(0, 0, 256, 64);
      g.font = '700 30px "JetBrains Mono", monospace';
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "#7ce8e0"; g.shadowColor = "#7ce8e0"; g.shadowBlur = 12;
      g.fillText("GAMEDEV", 128, 34);
    });
    this.m(new PlaneGeo(6, .9), new BasicMat({ map: marqueeTex }), 0, 8.9, -1.75, { parent: CAB, ry: Math.PI });
    /* pong screen */
    const pc = document.createElement("canvas"); pc.width = 160; pc.height = 120;
    const ptex = new CanvasTex(pc); ptex.colorSpace = SRGB;
    this.m(new PlaneGeo(4.6, 3.4), new StdMat({ map: ptex, emissive: new Col(0x445566), emissiveIntensity: .8, roughness: .3 }), 0, 5.6, -1.53, { parent: CAB, ry: Math.PI });
    const pong = { by: 60, bx: 80, vx: 42, vy: 26, p1: 50, p2: 60 };
    this.anims.push((t, dt) => {
      pong.bx += pong.vx * dt; pong.by += pong.vy * dt;
      if (pong.by < 6 || pong.by > 114) pong.vy *= -1;
      if (pong.bx < 12 && Math.abs(pong.by - pong.p1) < 14) pong.vx = Math.abs(pong.vx);
      if (pong.bx > 148 && Math.abs(pong.by - pong.p2) < 14) pong.vx = -Math.abs(pong.vx);
      if (pong.bx < 2 || pong.bx > 158) { pong.bx = 80; pong.by = 60; }
      pong.p1 += Math.max(-38 * dt, Math.min(38 * dt, pong.by - pong.p1));
      pong.p2 += Math.max(-38 * dt, Math.min(38 * dt, pong.by - pong.p2));
      const g = pc.getContext("2d");
      g.fillStyle = "#0a0e18"; g.fillRect(0, 0, 160, 120);
      g.strokeStyle = "#2a3448"; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(80, 0); g.lineTo(80, 120); g.stroke(); g.setLineDash([]);
      g.fillStyle = "#7ce8e0";
      g.fillRect(6, pong.p1 - 12, 4, 24); g.fillRect(150, pong.p2 - 12, 4, 24);
      g.fillRect(pong.bx - 2.5, pong.by - 2.5, 5, 5);
      ptex.needsUpdate = true;
    });
    /* joystick + buttons shelf */
    this.m(new BoxGeo(6.5, .5, 1.8), cabM, 0, 3.4, -2.2, { parent: CAB });
    const stick = this.m(new CylGeo(.12, .12, 1, 8), this.mat(0xd6d2c8), -1.4, 4.1, -2.2, { parent: CAB });
    this.m(new SphGeo(.34, 10, 8), this.mat(0xf07a6a, { roughness: .3 }), 0, .62, 0, { parent: stick });
    this.anims.push(t => { stick.rotation.x = Math.sin(t * 2.6) * .35; stick.rotation.z = Math.cos(t * 1.9) * .35; });
    for (let i = 0; i < 3; i++)
      this.m(new CylGeo(.3, .3, .2, 10),
        new StdMat({ color: tileCols[i], emissive: new Col(tileCols[i]), emissiveIntensity: .8, roughness: .4 }),
        .6 + i * .9, 3.7, -2.2, { parent: CAB, cast: false });
    const cb = rot(0, 5.2);
    this.sbox(6.7, 9, 3.2, cb.x, 4.25, cb.z, ry);
    /* the screen and marquee wash the whole sanctuary in cyan */
    const screenGlow = this.addLight(cb.x, 6, cb.z, 0x7ce8e0, 10, 26);
    this.anims.push(t => { screenGlow.intensity = 9 + Math.sin(t * 7) * 1.2; });

    /* bouncy bumpers */
    for (const [bx, bz] of [[-5.5, -1], [5.5, -1], [0, -6.5]]) {
      const wp = rot(bx, bz);
      const bumper = this.m(new CylGeo(1.1, 1.3, 1, 14),
        new StdMat({ color: 0xf2a2c4, emissive: new Col(0xf2a2c4), emissiveIntensity: .7, roughness: .4 }),
        wp.x, .5, wp.z, {});
      const body = new CBody({ mass: 0, material: this.bounceMat });
      body.addShape(new CCyl(1.2, 1.3, 1.2, 12));
      body.position.set(wp.x, .5, wp.z);
      this.world.addBody(body);
      this.anims.push(t => {
        const s = 1 + Math.sin(t * 5 + bx) * .05;
        bumper.scale.set(s, 1, s);
      });
      this.m(new TorusGeo(1.32, .07, 6, 20), this.bmat(0xf2a2c4, { transparent: true, opacity: .6 }), wp.x, 1.05, wp.z, { rx: -Math.PI / 2, cast: false });
    }

    /* spinning gold coins */
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * Math.PI * 2 + 1;
      const coin = this.m(new CylGeo(.55, .55, .12, 14),
        new StdMat({ color: 0xffd76a, emissive: new Col(0xb8922a), emissiveIntensity: .6, metalness: .8, roughness: .25 }),
        p.x + Math.cos(a) * 8, 1.6, p.z + Math.sin(a) * 8, { rz: Math.PI / 2 });
      this.anims.push(t => { coin.rotation.y = t * 2.4 + i; coin.position.y = 1.6 + Math.sin(t * 2 + i * 2) * .25; });
    }

    /* neon entrance arch */
    const arch = this.m(new TorusGeo(3.2, .14, 8, 24, Math.PI),
      new StdMat({ color: 0x7ce8e0, emissive: new Col(0x7ce8e0), emissiveIntensity: 1.3, roughness: .3 }),
      0, .2, -8.4, { parent: G, cast: false });
    this.m(new CylGeo(.18, .18, 3.4, 8), this.mat(0x2c2438), -3.2, 1.7, -8.4, { parent: G });
    this.m(new CylGeo(.18, .18, 3.4, 8), this.mat(0x2c2438), 3.2, 1.7, -8.4, { parent: G });
    arch.position.y = 3.4;
    const ap = rot(-3.2, -8.4), ap2 = rot(3.2, -8.4);
    this.scyl(.3, 3.4, ap.x, 1.7, ap.z); this.scyl(.3, 3.4, ap2.x, 1.7, ap2.z);
    const archMid = rot(0, -8.4);
    this.addLight(archMid.x, 3.4, archMid.z, 0x7ce8e0, 6, 16);

    this.registerZone(3, { labelY: 12 });
  }

  /* ============ 4 · La Forja de Skills ============ */
  buildForge() {
    const p = ZONE_POS[4];
    const G = new Grp(); G.position.set(p.x, 0, p.z);
    G.rotation.y = Math.atan2(-p.x, -p.z) + Math.PI;
    this.scene.add(G);
    const ry = G.rotation.y;
    const rot = (lx, lz) => ({ x: p.x + lx * Math.cos(ry) + lz * Math.sin(ry), z: p.z - lx * Math.sin(ry) + lz * Math.cos(ry) });
    const stoneM = this.mat(0x4c4452, { roughness: .95 });
    const darkM = this.mat(0x2c2830, { roughness: .7, metalness: .4 });

    /* stone floor */
    this.m(new CylGeo(8.5, 9, .35, 20), stoneM, 0, .17, 0, { parent: G, recv: true });
    this.scyl(8.7, .4, p.x, .2, p.z);

    /* furnace with fire */
    const F = new Grp(); F.position.set(0, 0, 5); G.add(F);
    this.m(new BoxGeo(4.4, 3.6, 3), this.mat(0x5a4a42, { roughness: 1 }), 0, 2.1, 0, { parent: F, recv: true });
    this.m(new BoxGeo(1.8, 1.6, .5), this.bmat(0x1a0f08), 0, 1.4, -1.35, { parent: F, cast: false });
    this.m(new BoxGeo(1.2, 4.2, 1.2), this.mat(0x5a4a42, { roughness: 1 }), 1.2, 5.5, .6, { parent: F });
    const fp = rot(0, 5);
    this.sbox(4.6, 4, 3.2, fp.x, 2, fp.z, ry);
    const firePos = rot(0, 3.4);
    this.makeFire(firePos.x, .4, firePos.z, 1.1);
    const smokePos = rot(1.2, 5.6);
    this.makeSmoke(smokePos.x, 8, smokePos.z);

    /* anvil on a stump */
    this.m(new CylGeo(.8, 1, 1, 9), this.mat(0x6a4a2f, { roughness: 1 }), -2.2, .5, 1.8, { parent: G });
    this.m(new BoxGeo(1.6, .5, .7), darkM, -2.2, 1.25, 1.8, { parent: G });
    this.m(new ConeGeo(.35, .9, 6), darkM, -3.1, 1.25, 1.8, { parent: G, rz: Math.PI / 2 });
    const anv = rot(-2.2, 1.8);
    this.sbox(1.8, 1.6, .9, anv.x, .8, anv.z, ry);
    /* floating hammer striking the anvil */
    const hammer = new Grp(); hammer.position.set(-2.2, 2.6, 1.8); G.add(hammer);
    this.m(new CylGeo(.07, .07, 1.3, 6), this.mat(0x8a6a4a), 0, 0, 0, { parent: hammer, rz: .5 });
    this.m(new BoxGeo(.55, .35, .35), darkM, .55, .35, 0, { parent: hammer });
    this.anims.push(t => {
      const s = Math.abs(Math.sin(t * 2.4));
      hammer.rotation.z = -.4 + s * 1.1;
    });
    /* quench barrel */
    this.m(new CylGeo(.75, .65, 1.1, 10), this.mat(0x6a4a2f, { roughness: 1 }), 2.6, .55, 1.4, { parent: G });
    this.m(new CircleGeo(.65, 10), this.mat(0x123650, { roughness: .1, metalness: .5 }), 2.6, 1.12, 1.4, { parent: G, rx: -Math.PI / 2, cast: false });

    /* skill totems: gamedev / backend / frontend */
    const totems = [
      { x: -5.5, z: -2, col: 0x7fdca8, geo: new IcoGeo(.65, 0), tag: "GAME" },
      { x: 0, z: -6.4, col: 0xe8b06a, geo: new OctGeo(.7, 0), tag: "BACK" },
      { x: 5.5, z: -2, col: 0x8fb0ff, geo: new TetGeo(.8, 0), tag: "FRONT" }
    ];
    for (const T of totems) {
      const TG = new Grp(); TG.position.set(T.x, 0, T.z); G.add(TG);
      this.m(new BoxGeo(1.5, 1, 1.5), stoneM, 0, .5, 0, { parent: TG });
      this.m(new BoxGeo(1.2, .9, 1.2), this.mat(0x5a5262, { roughness: .9 }), 0, 1.4, 0, { parent: TG });
      this.m(new BoxGeo(.9, .8, .9), stoneM, 0, 2.2, 0, { parent: TG });
      const gem = this.m(T.geo, new StdMat({ color: T.col, emissive: new Col(T.col), emissiveIntensity: 1.1, roughness: .25, flatShading: true }), 0, 3.4, 0, { parent: TG, cast: false });
      const lbl = this.makeLabel(T.tag, "#" + new Col(T.col).getHexString(), 1.1);
      lbl.position.set(0, 4.6, 0); TG.add(lbl);
      const wp = rot(T.x, T.z);
      this.sbox(1.6, 3, 1.6, wp.x, 1.5, wp.z, ry);
      this.anims.push(t => {
        gem.rotation.y = t * 1.2; gem.rotation.x = t * .5;
        gem.position.y = 3.4 + Math.sin(t * 1.7 + T.x) * .25;
      });
      this.scene.add(this.glowSprite(T.col, 2.2, new V3(wp.x, 3.4, wp.z)));
      this.addLight(wp.x, 3.4, wp.z, T.col, 6, 14);
    }
    /* tool rack */
    const RK = new Grp(); RK.position.set(-4.6, 0, 4.2); RK.rotation.y = .5; G.add(RK);
    this.m(new BoxGeo(2.6, 2.2, .18), this.mat(0x6a4a2f, { roughness: 1 }), 0, 1.5, 0, { parent: RK });
    this.m(new CylGeo(.05, .05, 1.2, 5), darkM, -.8, 1.5, .15, { parent: RK });
    this.m(new BoxGeo(.3, .3, .1), darkM, -.8, 2, .15, { parent: RK });
    this.m(new CylGeo(.05, .05, 1.1, 5), darkM, -.2, 1.5, .15, { parent: RK });
    this.m(new ConeGeo(.16, .4, 5), darkM, -.2, 2, .15, { parent: RK });
    this.m(new CylGeo(.06, .06, 1.3, 5), this.mat(0x8a6a4a), .5, 1.5, .15, { parent: RK });
    this.m(new BoxGeo(.4, .22, .1), darkM, .5, 2.05, .15, { parent: RK });

    this.registerZone(4, { labelY: 10.5 });
  }

  /* ============ 5 · La Colina del Tiempo (path) ============ */
  buildHill() {
    const p = ZONE_POS[5];
    const G = new Grp(); G.position.set(p.x, 0, p.z); this.scene.add(G);
    const earthCols = [0x3a5a34, 0x46683c, 0x527544];
    const eras = [
      { y: 0, r: 12, label: "2020–2022 · UdG", col: CYAN, colHex: 0x7ce8e0 },
      { y: 1.6, r: 8.6, label: "2023–2026 · UAB", col: BLUE, colHex: 0x8fb0ff },
      { y: 3.2, r: 5.4, label: "2026 → ∞", col: GREEN, colHex: 0x7fdca8 }
    ];
    /* terraces */
    eras.forEach((e, i) => {
      this.m(new CylGeo(e.r, e.r + .8, 1.6, 26), this.mat(earthCols[i], { roughness: 1, flatShading: true }),
        0, e.y + .8, 0, { parent: G, recv: true });
      this.scyl(e.r + .1, 1.6, p.x, e.y + .8, p.z);
    });
    /* spiral ramps between terraces */
    const rampAt = (ang, y0, rIn) => {
      const rx = Math.cos(ang) * rIn, rz = Math.sin(ang) * rIn;
      const mesh = this.m(new BoxGeo(3, .4, 6.5), this.mat(0x8a7a5a, { roughness: .9 }),
        rx, y0 + .8, rz, { recv: true, parent: G });
      const body = new CBody({ mass: 0, material: this.groundMat });
      body.addShape(new CBox(new CVec(1.5, .2, 3.25)));
      body.position.set(p.x + rx, y0 + .8, p.z + rz);
      body.quaternion.setFromEuler(-.28, -ang + Math.PI / 2, 0, "YXZ");
      mesh.quaternion.copy(body.quaternion);
      mesh.position.set(rx, y0 + .8, rz);
      this.world.addBody(body);
    };
    rampAt(-.5, .1, 12.4);
    rampAt(1.6, 1.7, 9);
    rampAt(3.7, 3.3, 5.8);

    /* era arches + monuments on each terrace */
    const arch = (ang, r, y, colHex, label) => {
      const ax = Math.cos(ang) * r, az = Math.sin(ang) * r;
      const A = new Grp(); A.position.set(ax, y, az); A.rotation.y = -ang + Math.PI / 2; G.add(A);
      const am = this.mat(colHex, { roughness: .6 });
      this.m(new BoxGeo(.4, 3.4, .4), am, -1.7, 1.7, 0, { parent: A });
      this.m(new BoxGeo(.4, 3.4, .4), am, 1.7, 1.7, 0, { parent: A });
      this.m(new BoxGeo(4.6, .4, .6), am, 0, 3.5, 0, { parent: A });
      this.m(new BoxGeo(3.8, .3, .5), am, 0, 4, 0, { parent: A });
      const lbl = this.makeLabel(label, "#" + new Col(colHex).getHexString(), 1.4);
      lbl.position.set(0, 5, 0); A.add(lbl);
    };
    arch(-.5, 10.5, 1.6, eras[0].colHex, eras[0].label);
    arch(1.6, 7.2, 3.2, eras[1].colHex, eras[1].label);
    arch(3.7, 4.2, 4.8, eras[2].colHex, eras[2].label);

    /* terrace 1: giant gamepad (UdG game dev degree) */
    const padG = new Grp(); padG.position.set(7.5, 1.9, 5.5); padG.rotation.y = .7; G.add(padG);
    const padM = this.mat(0x2c2a38, { roughness: .5 });
    this.m(new BoxGeo(2.4, .5, 1.2), padM, 0, 0, 0, { parent: padG });
    this.m(new CylGeo(.55, .55, .5, 10), padM, -1.2, 0, .1, { parent: padG });
    this.m(new CylGeo(.55, .55, .5, 10), padM, 1.2, 0, .1, { parent: padG });
    this.m(new CylGeo(.16, .16, .3, 8), this.mat(0x8f8d87), -.6, .35, .25, { parent: padG });
    this.m(new SphGeo(.2, 8, 6), this.mat(0x7ce8e0, { emissive: new Col(0x2c5854), emissiveIntensity: .6 }), -.6, .55, .25, { parent: padG, cast: false });
    const btnCols = [0x7fdca8, 0xf07a6a, 0xffd76a, 0x8fb0ff];
    [[.95, .05], [1.35, -.15], [.95, -.35], [.55, -.15]].forEach(([bx, bz], i) =>
      this.m(new CylGeo(.13, .13, .2, 8),
        new StdMat({ color: btnCols[i], emissive: new Col(btnCols[i]), emissiveIntensity: .5, roughness: .4 }),
        bx, .3, bz + .3, { parent: padG, cast: false }));
    this.m(new BoxGeo(.5, .14, .5), this.mat(0x8f8d87), -1.05, .3, -.15, { parent: padG });

    /* terrace 2: UAB books + graduation cap */
    const bookCols = [0x8fb0ff, 0xf07a6a, 0xffd76a];
    for (let i = 0; i < 3; i++)
      this.m(new BoxGeo(1.6 - i * .2, .4, 1.1), this.mat(bookCols[i], { roughness: .7 }),
        6.2, 3.4 + i * .42, -3.2, { parent: G, ry: i * .4 });
    this.m(new BoxGeo(1.5, .12, 1.5), this.mat(0x2c2a38), 6.2, 4.9, -3.2, { parent: G, ry: .8 });
    this.m(new SphGeo(.12, 6, 5), this.mat(0xffd76a), 6.8, 4.8, -2.8, { parent: G, cast: false });

    /* terrace 2: mini DNA (thesis) */
    const dna2 = new Grp(); dna2.position.set(-4.5, 4, 3.5); G.add(dna2);
    for (let i = 0; i < 7; i++) {
      const y = i * .34, a = i * .8;
      this.m(new SphGeo(.12, 7, 5), new StdMat({ color: 0xe8b06a, emissive: new Col(0xe8b06a), emissiveIntensity: .8 }), Math.cos(a) * .45, y, Math.sin(a) * .45, { parent: dna2, cast: false });
      this.m(new SphGeo(.12, 7, 5), new StdMat({ color: 0x7fdca8, emissive: new Col(0x7fdca8), emissiveIntensity: .8 }), -Math.cos(a) * .45, y, -Math.sin(a) * .45, { parent: dna2, cast: false });
    }
    this.anims.push(t => { dna2.rotation.y = t; });
    this.m(new CylGeo(.5, .65, .8, 8), this.mat(0x5a5262), -4.5, 3.6, 3.5, { parent: G });

    /* terrace 3 (top): growth chart + flag + telescope */
    for (let i = 0; i < 4; i++)
      this.m(new BoxGeo(.6, .8 + i * .55, .6),
        new StdMat({ color: 0x7fdca8, emissive: new Col(0x7fdca8), emissiveIntensity: .35 + i * .12, roughness: .5 }),
        -1.6 + i * .9, 4.8 + (.8 + i * .55) / 2, -1.4, { parent: G });
    const pole = this.m(new CylGeo(.08, .1, 4.4, 7), this.mat(0xd6d2c8, { metalness: .5 }), 2, 7, 1.6, { parent: G });
    const flagTex = this.makeCanvas(128, 80, g => {
      g.fillStyle = "#7fdca8"; g.fillRect(0, 0, 128, 80);
      g.fillStyle = "#0a0a0c"; g.font = '700 34px "Space Grotesk", sans-serif';
      g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("RJA", 64, 42);
    });
    const flag = this.m(new PlaneGeo(1.9, 1.2), new BasicMat({ map: flagTex, side: SIDE_DOUBLE }), 3, 8.4, 1.6, { parent: G, cast: false });
    this.anims.push(t => { flag.rotation.y = Math.sin(t * 2.2) * .3; flag.scale.y = 1 + Math.sin(t * 4.4) * .04; });

    this.registerZone(5, { labelY: 13.5, lightY: 9 });
  }

  /* ============ 6 · El Faro de Señales (contact) ============ */
  buildLighthouse() {
    const p = ZONE_POS[6];
    const G = new Grp(); G.position.set(p.x, 0, p.z); this.scene.add(G);

    /* rocky outcrop */
    this.m(new CylGeo(7, 8.5, 1.4, 12), this.mat(0x53506a, { flatShading: true, roughness: 1 }), 0, .7, 0, { parent: G, recv: true });
    this.scyl(7.6, 1.5, p.x, .7, p.z);
    this.m(new DodGeo(1.6, 0), this.mat(0x5d5a76, { flatShading: true }), 5.5, 1.6, 3, { parent: G });
    this.m(new DodGeo(1.1, 0), this.mat(0x4a4760, { flatShading: true }), -5, 1.5, -3.6, { parent: G });

    /* striped tower */
    const cols = [0xe8e4da, 0xd6543c];
    for (let i = 0; i < 4; i++)
      this.m(new CylGeo(1.7 - i * .18, 1.9 - i * .18, 2.6, 14), this.mat(cols[i % 2], { roughness: .7 }),
        0, 2.6 + i * 2.6, 0, { parent: G, recv: true });
    this.scyl(2, 10.5, p.x, 5.5, p.z);
    /* gallery + lamp room */
    this.m(new CylGeo(1.7, 1.7, .3, 14), this.mat(0x2c2a38, { metalness: .5 }), 0, 12.1, 0, { parent: G });
    const lampM = new StdMat({ color: 0xffe9b0, emissive: new Col(0xffd76a), emissiveIntensity: 2.2, roughness: .2, transparent: true, opacity: .95 });
    this.m(new CylGeo(1, 1.1, 1.6, 10), lampM, 0, 13, 0, { parent: G, cast: false });
    this.m(new ConeGeo(1.4, 1.2, 10), this.mat(0xd6543c, { roughness: .6 }), 0, 14.4, 0, { parent: G });
    /* rotating double beam */
    const beams = new Grp(); beams.position.set(p.x, 13, p.z); this.scene.add(beams);
    const beamGeo = new ConeGeo(2.6, 26, 10, 1, true);
    const beamMat = this.bmat(0xffe9b0, { transparent: true, opacity: .13, blending: BLEND_ADD, depthWrite: false, side: SIDE_DOUBLE });
    const b1 = new Mesh(beamGeo, beamMat); b1.rotation.z = Math.PI / 2; b1.position.x = 13; beams.add(b1);
    const b2 = new Mesh(beamGeo, beamMat); b2.rotation.z = -Math.PI / 2; b2.position.x = -13; beams.add(b2);
    const lampLight = this.addLight(p.x, 13, p.z, 0xffd76a, 14, 55);
    this.scene.add(this.glowSprite(0xffd76a, 7, new V3(p.x, 13, p.z)));
    this.anims.push(t => {
      beams.rotation.y = t * .7;
      lampLight.intensity = 11 + Math.sin(t * .7 * 4) * 4;
    });

    /* keeper's hut */
    const hut = new Grp(); hut.position.set(4.4, 1.4, -2.6); hut.rotation.y = .8; G.add(hut);
    this.m(new BoxGeo(2.6, 1.8, 2.2), this.mat(0xd8c4a4, { roughness: 1 }), 0, .9, 0, { parent: hut });
    this.m(new ConeGeo(2.1, 1.2, 4), this.mat(0xa04838, { flatShading: true }), 0, 2.4, 0, { parent: hut, ry: Math.PI / 4 });
    this.m(new BoxGeo(.6, .9, .1), this.mat(0x6a4a2f), 0, .65, 1.12, { parent: hut });

    /* pier over the water */
    const pier = new Grp(); G.add(pier);
    const ang = Math.atan2(p.x, p.z);   // pointing away from island center
    pier.rotation.y = ang;
    const plankM = this.mat(0x6a5a42, { roughness: 1 });
    for (let i = 0; i < 9; i++)
      this.m(new BoxGeo(2.4, .18, 1.05), plankM, 0, .9, 8 + i * 1.15, { parent: pier, recv: true });
    for (const [px2, pz2] of [[-1, 9], [1, 9], [-1, 13], [1, 13], [-1, 17.5], [1, 17.5]])
      this.m(new CylGeo(.14, .17, 2.4, 6), plankM, px2, -.1, pz2, { parent: pier });
    /* pier collider along its direction */
    const midD = 13, mx = p.x + Math.sin(ang) * midD, mz = p.z + Math.cos(ang) * midD;
    this.sbox(2.4, .3, 10.5, mx, .9, mz, ang);
    /* giant mailbox at pier start */
    const MB = new Grp(); MB.position.set(Math.sin(ang) * 7, 1.4, Math.cos(ang) * 7); MB.rotation.y = ang; G.add(MB);
    this.m(new CylGeo(.16, .2, 2.2, 7), this.mat(0x2c2a38), 1.6, .6, 0, { parent: MB });
    const mbBody = this.m(new BoxGeo(1.6, 1.1, 2.4), this.mat(0xd6543c, { roughness: .5 }), 1.6, 2.2, 0, { parent: MB });
    this.m(new CylGeo(.8, .8, 2.4, 12, 1, false, 0, Math.PI), this.mat(0xd6543c, { roughness: .5 }), 1.6, 2.75, 0, { parent: MB, rz: Math.PI / 2 });
    const atTex = this.makeCanvas(96, 96, g => {
      g.fillStyle = "#d6543c"; g.fillRect(0, 0, 96, 96);
      g.font = '700 64px "JetBrains Mono", monospace';
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "#ffe9b0"; g.fillText("@", 48, 52);
    });
    this.m(new PlaneGeo(1, 1), new BasicMat({ map: atTex }), 1.6, 2.3, 1.25, { parent: MB, cast: false });
    /* little flag on the mailbox */
    this.m(new BoxGeo(.08, .7, .08), this.mat(0xffd76a), 2.3, 3.1, .8, { parent: MB });
    this.m(new BoxGeo(.4, .25, .06), this.mat(0xffd76a), 2.45, 3.4, .8, { parent: MB });

    /* paper boat bobbing near the pier */
    const boat = new Grp(); this.scene.add(boat);
    const bm = this.mat(0xf0ede4, { roughness: .8, flatShading: true });
    this.m(new BoxGeo(1.6, .4, .7), bm, 0, 0, 0, { parent: boat });
    this.m(new ConeGeo(.5, .8, 4), bm, .95, .1, 0, { parent: boat, rz: -Math.PI / 2, ry: Math.PI / 4 });
    this.m(new ConeGeo(.5, .8, 4), bm, -.95, .1, 0, { parent: boat, rz: Math.PI / 2, ry: Math.PI / 4 });
    this.m(new BoxGeo(.06, .9, .06), bm, 0, .6, 0, { parent: boat });
    this.m(new PlaneGeo(.7, .5), this.bmat(0xf07a6a, { side: SIDE_DOUBLE }), .2, .75, 0, { parent: boat, cast: false });
    const bx0 = p.x + Math.sin(ang) * 20 + 3, bz0 = p.z + Math.cos(ang) * 20;
    this.anims.push(t => {
      boat.position.set(bx0 + Math.sin(t * .4) * 1.5, -.35 + Math.sin(t * 1.3) * .18, bz0 + Math.cos(t * .3) * 1.5);
      boat.rotation.y = t * .1; boat.rotation.z = Math.sin(t * 1.1) * .08;
    });
    /* buoy with blinking light */
    const buoy = new Grp(); this.scene.add(buoy);
    this.m(new CylGeo(.5, .7, 1.1, 8), this.mat(0xd6543c), 0, 0, 0, { parent: buoy });
    const buoyLight = this.m(new SphGeo(.18, 8, 6), new StdMat({ color: 0xff4a2a, emissive: new Col(0xff4a2a), emissiveIntensity: 2 }), 0, .8, 0, { parent: buoy, cast: false });
    const ux = p.x + Math.sin(ang + .7) * 16, uz = p.z + Math.cos(ang + .7) * 16;
    this.anims.push(t => {
      buoy.position.set(ux, -.4 + Math.sin(t * 1.6) * .2, uz);
      buoy.rotation.z = Math.sin(t * 1.2) * .12;
      buoyLight.material.emissiveIntensity = (Math.sin(t * 3) > .4) ? 2.4 : .3;
    });

    this.registerZone(6, { labelY: 17, lightY: 6 });
  }

  /* ============ golden fish collectibles ============ */
  makeFishMesh() {
    const g = new Grp();
    const goldM = new StdMat({ color: 0xffd76a, emissive: new Col(0xb8922a), emissiveIntensity: .8, metalness: .6, roughness: .3, flatShading: true });
    const body = this.m(new IcoGeo(.42, 0), goldM, 0, 0, 0, { parent: g, cast: false });
    body.scale.set(1.25, .8, .6);
    this.m(new TetGeo(.3, 0), goldM, -.62, 0, 0, { parent: g, cast: false });
    const eyeM = this.bmat(0x14161c);
    this.m(new SphGeo(.06, 6, 5), eyeM, .3, .1, .2, { parent: g, cast: false });
    this.m(new SphGeo(.06, 6, 5), eyeM, .3, .1, -.2, { parent: g, cast: false });
    return g;
  }
  buildFish() {
    const spots = [
      [8, -22, 1.1],            /* south of the letters */
      [-20, 12, 1.3],           /* pond centre */
      [14, 46, 1.1],            /* NE meadow, clear of the ravine */
      [-42, 42, 1.2],           /* behind the cat house */
      [64, -14, 1.1],           /* behind the lab */
      [30, -56, 1.2],           /* warehouse side */
      [-66, -34, 1.1],          /* far ruins corner */
      [10, 70, 1.2],            /* behind the arcade */
      [-28, -68, 1.1],          /* forge outskirts */
      [ZONE_POS[5].x, ZONE_POS[5].z, 6.6],   /* hilltop! */
      [-70 + Math.sin(Math.atan2(-70, 10)) * 0, 10 + 0, 1], /* placeholder replaced below */
      [0, -34, 1.1]             /* south path */
    ];
    /* fish 10: end of the lighthouse pier */
    const p7 = ZONE_POS[6], ang7 = Math.atan2(p7.x, p7.z);
    spots[10] = [p7.x + Math.sin(ang7) * 17.5, p7.z + Math.cos(ang7) * 17.5, 2];
    for (const [x, z, y0] of spots) {
      const y = y0 + Math.max(0, heightAt(x, z));
      const mesh = this.makeFishMesh();
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      const glow = this.glowSprite(0xffd76a, 2.2, new V3(x, y, z));
      this.scene.add(glow);
      this.fishes.push({ mesh, glow, x, z, y, taken: false });
    }
    this.anims.push(t => {
      for (const f of this.fishes) {
        if (f.taken) continue;
        f.mesh.rotation.y = t * 2 + f.x;
        f.mesh.position.y = f.y + Math.sin(t * 2.2 + f.z) * .16;
        f.glow.position.y = f.mesh.position.y;
      }
    });
  }




  /* ============ the caverns ============
     Only two primitives are used down here: axis-aligned boxes for the
     corridors (rotated about Y only) and upright cylinders for the chambers.
     Nothing tilts, so nothing can drift out of alignment with the floor the
     cat actually walks on. */
  buildCave() {
    const G = new Grp(); this.scene.add(G);
    this.caveGrp = G;
    this.caveSpots = [];
    this.rock = this.mat(0x6c6280, { roughness: 1, flatShading: true });
    this.rockDark = this.mat(0x4a4257, { roughness: 1, flatShading: true });
    /* The walls are one huge displaced shell per corridor, so a facet can span
       several metres — the same problem the lawn has, and the same fix. Finer
       and stronger than outdoors: down here the wall is right next to you. */
    this.rockWall = this.detail(
      new StdMat({ color: 0x5c5471, roughness: 1, flatShading: true, side: SIDE_BACK }), 2.1, .34);
    /* A mottled floor keeps the big flat discs from reading as painted metal;
       the wall is faceted enough to carry itself. */
    this.rockFloor = new StdMat({
      map: this.noiseTexture("#453e52", ["#3a3446", "#514a61", "#4c4458", "#5a5268"], 340, 9),
      roughness: 1
    });

    for (const [ka, kb, w] of CAVE_EDGES) this.corridor(G, CAVE_NODES[ka], CAVE_NODES[kb], w);
    for (const k in CAVE_NODES) this.chamber(G, CAVE_NODES[k], k);
    this.caveMotes();

    this.buildEntrance();
    this.buildGateRoom();
    this.buildHub();
    this.buildEchoHall();
    this.buildRiverHall();
    this.buildRuneHall();
    this.buildCryptHall();

    for (const sp of this.caveSpots) {
      const ring = this.m(new RingGeo(sp.r - 1.3, sp.r - .6, 40),
        this.bmat(new Col(sp.meta.color).getHex(), { transparent: true, opacity: .4, side: SIDE_DOUBLE }),
        sp.x, CAVE_Y + .12, sp.z, { rx: -Math.PI / 2, cast: false, parent: G });
      this.anims.push(t => {
        ring.material.opacity = .3 + Math.sin(t * 2 + sp.x) * .1 + (state.near === sp ? .35 : 0);
      });
    }
  }

  /* Dust hanging in the lamplight. One Points cloud for the whole cave, parented
     to caveGrp — which lives 4km away — so it never has to be toggled. */
  caveMotes() {
    const count = REDUCED ? 0 : (IS_TOUCH ? 90 : 240);
    if (!count) return;
    const keys = Object.keys(CAVE_NODES);
    const geo = new BufGeo(), arr = new Float32Array(count * 3);
    const base = [];
    for (let i = 0; i < count; i++) {
      const n = CAVE_NODES[keys[i % keys.length]];
      const a = hash2(i, 5) * 6.28, r = Math.sqrt(hash2(i, 9)) * (n.r - 1);
      const x = n.x + Math.cos(a) * r, y = CAVE_Y + .6 + hash2(i, 13) * (n.head - 3), z = n.z + Math.sin(a) * r;
      arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
      base.push({ x, y, z, ph: hash2(i, 21) * 6.28, sp: .3 + hash2(i, 27) * .5 });
    }
    geo.setAttribute("position", new F32Attr(arr, 3));
    const pts = new Points3(geo, new PointsMat({
      color: 0xa8e4ff, size: .5, map: this.radialTexture(),
      transparent: true, opacity: .5, depthWrite: false, blending: BLEND_ADD }));
    this.caveGrp.add(pts);
    this.anims.push(t => {
      const a2 = pts.geometry.attributes.position.array;
      for (let i = 0; i < base.length; i++) {
        const b = base[i];
        a2[i * 3] = b.x + Math.sin(t * b.sp + b.ph) * 1.4;
        a2[i * 3 + 1] = b.y + Math.sin(t * b.sp * .7 + b.ph * 1.7) * .9;
        a2[i * 3 + 2] = b.z + Math.cos(t * b.sp * .8 + b.ph) * 1.4;
      }
      pts.geometry.attributes.position.needsUpdate = true;
      pts.material.opacity = .35 + Math.sin(t * 1.3) * .15;
    });
  }

  /* still water on the cave floor: dark, low-roughness disc with a lit rim */
  cavePuddle(parent, x, z, r, col) {
    this.m(new CircleGeo(r, 26), this.mat(0x0b1520, { roughness: .08, metalness: .6 }),
      x, .09, z, { rx: -Math.PI / 2, cast: false, parent });
    const rim = this.m(new RingGeo(r - .35, r + .25, 26),
      this.bmat(col, { transparent: true, opacity: .3, side: SIDE_DOUBLE }),
      x, .11, z, { rx: -Math.PI / 2, cast: false, parent });
    this.anims.push(t => { rim.material.opacity = .18 + Math.sin(t * 1.1 + x) * .12; });
    for (let i = 0; i < 5; i++) {
      const a = hash2(i, Math.round(x)) * 6.28, rr = r * (1.05 + hash2(i, 3) * .25);
      const s = .25 + hash2(i, 8) * .4;
      this.m(new DodGeo(s, 0), this.rockDark, x + Math.cos(a) * rr, s * .4, z + Math.sin(a) * rr,
        { parent, recv: true, ry: hash2(i, 12) * 6 });
    }
  }

  /* A corridor is a round tunnel bored between two chamber walls, not centre
     to centre: a tunnel stub buried inside a chamber is exactly what shows up
     as walls stacked on top of each other. The tube is inside-out (BACK side)
     and displaced by noise, so it reads as rock rather than as plumbing, and
     it is wide enough that confineToCave never lets the cat touch it. */
  corridor(parent, a, b, w) {
    const dx = b.x - a.x, dz = b.z - a.z;
    const dist = Math.hypot(dx, dz);
    const ang = Math.atan2(dx, dz);
    const from = a.r + 1.2, to = b.r + 1.2;
    const len = dist - from - to;
    if (len < 2) return;
    const mid = from + len / 2;
    const R = TUNNEL_R;

    const g = new Grp();
    g.position.set(a.x + Math.sin(ang) * mid, CAVE_Y, a.z + Math.cos(ang) * mid);
    g.rotation.y = ang;
    parent.add(g);

    /* the bore. Built along its own Y then tipped onto Z, which is also the
       axis rockify() displaces around. */
    const tube = new Mesh(
      this.rockify(new CylGeo(R, R, len + 3, 22, Math.max(3, Math.round(len / 5)), true), 1.3,
                   g.position.x, g.position.z),
      this.rockWall);
    tube.rotation.x = Math.PI / 2;
    g.add(tube);

    /* floor: wider than the bore, so it caps the lower half of the tube from
       the inside and no sliver of the underside is ever visible */
    this.m(new BoxGeo((R + 1.5) * 2, 1.4, len + 3), this.rockFloor, 0, -.7, 0,
      { parent: g, cast: false, recv: true });

    /* rubble along the walls, to break the perfect circle at eye level */
    const nr = Math.max(2, Math.round(len / 5));
    for (let i = 0; i < nr; i++) {
      const side = hash2(i, 3) > .5 ? 1 : -1;
      const lz = ((i + .5) / nr - .5) * len;
      const s = .5 + hash2(i, 11) * 1.3;
      const rk = this.m(new DodGeo(s, 0), i % 2 ? this.rock : this.rockDark,
        side * (w + .9 + hash2(i, 17) * .8), s * .5, lz, { parent: g, recv: true });
      rk.rotation.set(hash2(i, 1) * 3, hash2(i, 2) * 6, hash2(i, 3) * 3);
    }

    const n = Math.max(1, Math.round(len / 14));
    for (let i = 0; i < n; i++) {
      const t = (i + .5) / n, side = i % 2 ? 1 : -1;
      const lz = (t - .5) * len;
      const col = [0x7ce8e0, 0x8fb0ff, 0x9fe8d0][i % 3];
      const c = this.m(new OctGeo(.32, 0),
        new StdMat({ color: col, emissive: new Col(col), emissiveIntensity: 1.3, roughness: .2, flatShading: true }),
        side * (w + .6), 3.4, lz, { parent: g, cast: false });
      c.scale.y = 1.6;
      const wx = g.position.x + Math.cos(ang) * side * w + Math.sin(ang) * lz;
      const wz = g.position.z - Math.sin(ang) * side * w + Math.cos(ang) * lz;
      const src = this.addLight(wx, CAVE_Y + 3.4, wz, col, 6, 24);
      this.addOccluder(wx, CAVE_Y + 3.4, wz, 1.3);
      this.anims.push(t2 => { src.intensity = 5.5 + Math.sin(t2 * 1.4 + i) * 1.2; });
    }
  }

  /* A chamber wall is built as arcs between its doorways rather than one
     closed cylinder, so corridors open into it instead of intersecting it.
     Above corridor height the ring closes up, and a lumpy vault caps it. */
  chamber(parent, n, key) {
    const g = new Grp(); g.position.set(n.x, CAVE_Y, n.z); parent.add(g);
    const R = n.r + 2;
    this.m(new CylGeo(R + 1.4, R + 1.4, 1, 44), this.rockFloor, 0, -.5, 0,
      { parent: g, cast: false, recv: true });

    /* where the corridors arrive, as angles measured the way CylinderGeometry
       measures theta: atan2(x, z). The opening has to clear the whole bore,
       not just the walkable width, or the tube clips the wall it comes through. */
    const doors = [];
    for (const [ka, kb, w] of CAVE_EDGES) {
      const other = ka === key ? CAVE_NODES[kb] : kb === key ? CAVE_NODES[ka] : null;
      if (!other) continue;
      doors.push({ a: Math.atan2(other.x - n.x, other.z - n.z), half: Math.atan2(TUNNEL_R + .8, R) });
    }
    doors.sort((p, q) => p.a - q.a);

    const H = CORRIDOR_H;
    const arc = (from, span, h, y0) => {
      const segs = Math.max(4, Math.round(span * 14));
      const seg = new Mesh(this.rockify(new CylGeo(R, R, h, segs, 4, true, from, span), 1.7, n.x, n.z),
        this.rockWall);
      seg.position.y = y0 + h / 2; g.add(seg);
    };
    if (!doors.length) arc(0, Math.PI * 2, H, 0);
    else for (let i = 0; i < doors.length; i++) {
      const from = doors[i].a + doors[i].half;
      const to = doors[(i + 1) % doors.length].a - doors[(i + 1) % doors.length].half
               + (i === doors.length - 1 ? Math.PI * 2 : 0);
      if (to - from > .04) arc(from, to - from, H, 0);
    }
    arc(0, Math.PI * 2, n.head + 1 - H, H);          // continuous above the doorways

    /* carved arch around each opening, hiding the corner where the round bore
       meets the round wall */
    for (const d of doors) {
      const A = new Grp();
      A.position.set(Math.sin(d.a) * (R - .4), 0, Math.cos(d.a) * (R - .4));
      A.rotation.y = d.a;
      g.add(A);
      this.m(new TorusGeo(TUNNEL_R + .5, .75, 6, 20, Math.PI), this.rockDark,
        0, 0, 0, { parent: A, recv: true });
      for (const s of [-1, 1])
        this.m(new BoxGeo(1.5, TUNNEL_R + .4, 1.5), this.rockDark,
          s * (TUNNEL_R + .5), (TUNNEL_R + .4) / 2, 0, { parent: A, recv: true });
    }

    /* the vault, and the teeth hanging from it */
    const domeH = Math.max(4, R * .42);
    const dome = new Mesh(
      this.rockifyDome(new SphGeo(R, 34, 12, 0, Math.PI * 2, 0, Math.PI / 2), 1.8, n.x, n.z),
      this.rockWall);
    dome.scale.y = domeH / R;
    dome.position.y = n.head + .6;
    g.add(dome);
    this.m(new CylGeo(R + .9, R + .9, 1.6, 44), this.rockDark, 0, n.head + .6, 0,
      { parent: g, cast: false });

    for (let i = 0; i < 14; i++) {
      const a = hash2(i, Math.round(n.z)) * 6.28, rr = R * (.28 + hash2(i, 31) * .6);
      const h = 1.6 + hash2(i, 41) * 3.4;
      const tip = this.m(new ConeGeo(.35 + hash2(i, 7) * .5, h, 5), i % 2 ? this.rock : this.rockDark,
        Math.cos(a) * rr, n.head + 1.2 - h / 2, Math.sin(a) * rr, { parent: g, cast: false });
      tip.rotation.x = Math.PI;
    }

    /* Veins of crystal in the rock. Emissive only — they read through bloom
       without a light each, which matters when the pool is eight slots wide. */
    const vein = CAVE_TINT[key] || 0x7ce8e0;
    const veinMat = new StdMat({ color: vein, emissive: new Col(vein), emissiveIntensity: 1.1,
                                 roughness: .25, flatShading: true });
    for (let i = 0; i < 16; i++) {
      const a = hash2(i, Math.round(n.z) + 3) * 6.28;
      const y = 1.2 + hash2(i, 51) * (n.head - 4);
      const s = .16 + hash2(i, 61) * .3;
      const c = this.m(new OctGeo(s, 0), veinMat,
        Math.sin(a) * (R - .9), y, Math.cos(a) * (R - .9), { parent: g, cast: false });
      c.scale.y = 1.4 + hash2(i, 71) * 2.2;
      c.rotation.y = a;
      c.rotation.z = (hash2(i, 81) - .5) * .8;
    }

    /* stalagmites hugging the wall, well clear of the middle */
    for (let i = 0; i < 10; i++) {
      const a = hash2(i, Math.round(n.x)) * 6.28, r = n.r * (.84 + hash2(i, 9) * .13);
      const h = 1.8 + hash2(i, 21) * 3;
      this.m(new ConeGeo(.5 + hash2(i, 5) * .6, h, 6), i % 3 ? this.rock : this.rockDark,
        Math.cos(a) * r, h / 2, Math.sin(a) * r, { parent: g, recv: true });
      this.addOccluder(n.x + Math.cos(a) * r, CAVE_Y + h / 2, n.z + Math.sin(a) * r, .55 + h * .1);
    }
  }

  crystalCluster(parent, x, y, z, col, scale = 1) {
    const cl = new Grp(); cl.position.set(x, y, z); cl.rotation.y = hash2(Math.round(x), Math.round(z)) * 6;
    parent.add(cl);
    for (let k = 0; k < 3; k++) {
      const sh = (1.4 + hash2(k, Math.round(x)) * 1.8) * scale;
      const c = this.m(new OctGeo((.35 + hash2(k, 3) * .35) * scale, 0),
        new StdMat({ color: col, emissive: new Col(col), emissiveIntensity: .75, roughness: .2, flatShading: true }),
        (hash2(k, 5) - .5) * 2 * scale, sh * .5, (hash2(k, 7) - .5) * 2 * scale, { parent: cl, cast: false });
      c.scale.y = sh;
    }
    parent.add(this.glowSprite(col, 1.8 * scale, new V3(x, y + 1.5, z)));
    this.addOccluder(parent.position.x + x, CAVE_Y + y + 1.6, parent.position.z + z, 1.7 * scale);
    return this.addLight(parent.position.x + x, CAVE_Y + y + 2, parent.position.z + z, col, 4.5 * scale, 22 * scale);
  }

  /* a themed altar, one per chamber, in place of an arcade cabinet */
  caveAltar(parent, node, opts) {
    const A = new Grp(); A.position.set(node.x, CAVE_Y, node.z); parent.add(A);
    const col = opts.col;
    this.m(new CylGeo(2.6, 3.1, .5, 12), this.rockDark, 0, .25, 0, { parent: A, recv: true });
    this.m(new CylGeo(1.5, 1.9, 1.5, 10), this.rock, 0, 1.2, 0, { parent: A, recv: true });
    this.m(new BoxGeo(2.6, .3, 2.6), this.rockDark, 0, 2.05, 0, { parent: A });
    const orb = this.m(opts.geo || new IcoGeo(.9, 0),
      new StdMat({ color: col, emissive: new Col(col), emissiveIntensity: 1.3, roughness: .2, flatShading: true }),
      0, 3.3, 0, { parent: A, cast: false });
    this.anims.push(t => {
      orb.rotation.y = t * .8; orb.rotation.x = t * .3;
      orb.position.y = 3.3 + Math.sin(t * 1.4) * .22;
    });
    A.add(this.glowSprite(col, 2.4, new V3(0, 3.3, 0)));
    this.addLight(node.x, CAVE_Y + 3.4, node.z, col, 5.5, 22);
    this.addOccluder(node.x, CAVE_Y + 1.4, node.z, 1.9);
    const lbl = this.makeLabel(L(opts.label), "#" + new Col(col).getHexString(), 1.3);
    lbl.position.set(0, 5.6, 0); A.add(lbl);
    this.caveSpots.push({
      x: node.x, z: node.z, y: CAVE_Y, r: 6,
      meta: { kind: opts.kind, game: opts.game, color: "#" + new Col(col).getHexString(),
              name: opts.name, lore: opts.lore, portal: true, cave: true }
    });
    return A;
  }

  /* ---- the entrance, on the islet ----
     A portal bored into the foot of the crag, standing on the islet shelf at
     the far end of the rope bridge. It used to be a wall of stone slabs cut
     into the island's own hillside, and at the size a cave mouth needs to be
     it took over a whole quadrant of the map. Out here the crag is terrain,
     so the entrance itself only has to be a doorway.

     Level all the way: the shelf is flat at ISLET_Y and the crag cones only
     start rising past the far end of the bore, so nothing here is dug under
     walkable ground and nothing can be drawn in front of the cat. */
  buildEntrance() {
    const M = new Grp();
    M.position.set(CAVE_MOUTH.x, ISLET_Y, CAVE_MOUTH.z);
    M.rotation.y = ENTRY_DIR;                 // local +Z runs into the crag
    this.scene.add(M);
    const stone = this.mat(0x4f4c57, { roughness: 1, flatShading: true });
    const dark = this.mat(0x36343d, { roughness: 1, flatShading: true });
    const pale = this.mat(0x615d68, { roughness: 1, flatShading: true });
    const R = ENTRY_HALF + 2.4;
    /* world position of a point given in the group's local frame */
    const W = (dx, dz) => ({ x: CAVE_MOUTH.x + Math.cos(ENTRY_DIR) * dx + Math.sin(ENTRY_DIR) * dz,
                             z: CAVE_MOUTH.z - Math.sin(ENTRY_DIR) * dx + Math.cos(ENTRY_DIR) * dz });

    /* ---- the bore ----
       A bare tube is a thin shell and leaves a slit of daylight running
       straight through the rock above and beside it, so a solid frame closes
       it in on every side but the front. */
    const AMP = .45, IN = R + AMP + .2;
    const tube = new Mesh(
      this.rockify(new CylGeo(R, R, ENTRY_LEN + 4, 20, 5, true), AMP, CAVE_MOUTH.x, CAVE_MOUTH.z),
      this.rockWall);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(0, 0, ENTRY_LEN / 2 + 1);
    M.add(tube);
    /* The frame only has to be light-tight, not massive: a thick one is the
       tallest thing on the islet and reads as a shipping container parked in
       front of the crag. Boulders on top do the silhouette instead. */
    const TL = ENTRY_LEN + 5, TZ = ENTRY_LEN / 2 + 1.5, FT = 1.6;
    for (const s of [-1, 1])
      this.m(new BoxGeo(FT, IN * 2 + FT, TL), stone, s * (IN + FT / 2), 0, TZ, { parent: M, recv: true });
    this.m(new BoxGeo(IN * 2 + FT * 2, FT, TL), stone, 0, IN + FT / 2, TZ, { parent: M, recv: true });
    for (let i = 0; i < 10; i++) {
      const s = 1.6 + hash2(i, 23) * 2.2;
      const b = this.m(new IcoGeo(s, 0), i % 2 ? stone : dark,
        (hash2(i, 29) - .5) * (IN * 2 + 4), IN + hash2(i, 33) * 3.4, -1 + i * 1.7,
        { parent: M, recv: true });
      b.rotation.set(hash2(i, 1) * 3, hash2(i, 2) * 6, hash2(i, 3) * 3);
    }
    this.m(new BoxGeo(IN * 2, 1.2, TL), this.mat(0x4b4356, { roughness: 1 }),
      0, -.54, TZ, { parent: M, cast: false, recv: true });
    this.m(new CircleGeo(R, 20), this.bmat(0x03040a), 0, 0, ENTRY_LEN + 2.4,
      { parent: M, cast: false, ry: Math.PI });
    this.m(new BoxGeo(IN * 2 + 1, IN * 2 + 1, 1.2), dark, 0, 0, ENTRY_LEN + 4, { parent: M });

    /* the carved arch you step through. TorusGeometry is built in the XY
       plane with its axis on Z, which is already the tunnel axis here. */
    this.m(new TorusGeo(R + .5, .8, 6, 22, Math.PI), pale, 0, 0, -.7, { parent: M, recv: true });
    for (const s of [-1, 1])
      this.m(new BoxGeo(1.7, R + .5, 1.7), pale, s * (R + 1.3), (R + .5) / 2 - 1, -.7, { parent: M, recv: true });
    /* Keystone with a cat's paw cut into it — the only worked stone here. It
       has to stand proud of the frame; flush with it, the frame swallows it. */
    const key = R + 1.9;
    this.m(new BoxGeo(2.8, 1.8, 1.8), stone, 0, key, -1.1, { parent: M });
    const glyph = this.mat(0x7ce8e0, { emissive: new Col(0x7ce8e0), emissiveIntensity: 1.1 });
    for (let i = 0; i < 4; i++)
      this.m(new SphGeo(.16, 8, 6), glyph, -.6 + i * .4, key + .48 + (i === 0 || i === 3 ? -.14 : .07), -.1,
        { parent: M, cast: false });
    this.m(new SphGeo(.3, 8, 6), glyph, 0, key - .3, -.1, { parent: M, cast: false });

    /* a handful of boulders so the portal grows out of the crag instead of
       being parked in front of it */
    for (let i = 0; i < 6; i++) {
      const s = 1.1 + hash2(i, 13) * 1.8;
      const dx = (i % 2 ? 1 : -1) * (R + 2 + hash2(i, 5) * 3.4);
      const b = this.m(new IcoGeo(s, 0), i % 2 ? stone : pale, dx, hash2(i, 9) * 4, -1.6 - hash2(i, 17) * 1.4,
        { parent: M, recv: true });
      b.rotation.set(hash2(i, 1) * 3, hash2(i, 2) * 6, hash2(i, 3) * 3);
      const w = W(dx, -1.6);
      this.addOccluder(w.x, ISLET_Y + 1, w.z, s * .8);
    }

    /* crystals leading you in, and the glow that spills out of the mouth */
    for (let i = 0; i < 4; i++) {
      const sd = i % 2 ? 1 : -1;
      const dz = 2.6 + i * 2.8;
      const c = this.m(new OctGeo(.3, 0),
        new StdMat({ color: 0x7ce8e0, emissive: new Col(0x7ce8e0), emissiveIntensity: 1.2, roughness: .2, flatShading: true }),
        sd * (ENTRY_HALF + .4), 2.2, dz, { parent: M, cast: false });
      c.scale.y = 1.5;
      const w = W(sd * (ENTRY_HALF + .4), dz);
      this.addLight(w.x, ISLET_Y + 2.2, w.z, 0x7ce8e0, 5, 16);
    }
    this.addLight(CAVE_MOUTH.x, ISLET_Y + 2.4, CAVE_MOUTH.z, 0x7ce8e0, 7, 20);
    /* the glow reads as light spilling out of the tunnel, so it belongs inside
       it — parked at the threshold it just covered the opening */
    M.add(this.glowSprite(0x7ce8e0, 2.2, new V3(0, 1.8, 5)));

    /* two braziers marking the threshold */
    for (const s of [-1, 1]) {
      const bx = s * (R + 2.6), bz = -3.2;
      this.m(new CylGeo(.45, .62, 1.4, 7), dark, bx, .7, bz, { parent: M, recv: true });
      this.m(new CylGeo(.68, .45, .45, 7), pale, bx, 1.6, bz, { parent: M });
      const w = W(bx, bz);
      this.makeFire(w.x, ISLET_Y + 1.9, w.z, .5, 0x7ce8e0);
    }

    /* The name only fades in once you are on the islet: crossing the bridge is
       the signpost, the mouth itself does not need one. */
    const lbl = this.makeLabel(state.lang === "es" ? "Cuevas de Cristal" : "Crystal Caves", "#7ce8e0", 1.4);
    const lw = W(0, -9);
    lbl.position.set(lw.x, ISLET_Y + 10, lw.z);   // clear of the arch it names
    this.scene.add(lbl);
    this.nearLabels = this.nearLabels || [];
    this.nearLabels.push(lbl);
  }

  /* ---- crossing between the island and the caverns ---- */
  crossTo(cave) {
    if (this.crossing) return;
    this.crossing = true;
    const el = $("#fade");
    el.classList.add("on");
    setTimeout(() => {
      state.inCave = cave;
      const b = this.catBody;
      if (cave) {
        const g = CAVE_NODES.gate;
        /* Past the middle of the room, not up against the arch: you used to
           land two metres under the exit lamp, which is the one spot in the
           caverns bright enough to wash the cat out completely. From here the
           arch is still behind you and the corridor to the hub is ahead. */
        b.position.set(g.x, 1.2, g.z - 2);
        this.heading = Math.PI;                       // face the hub
        toast(state.lang === "es" ? "Cuevas de Cristal" : "Crystal Caves", 2000);
      } else {
        const p = entryAxis(.35);
        b.position.set(p.x, ISLET_Y + 1.2, p.z);   // the mouth is up on the islet shelf
        this.heading = ENTRY_DIR + Math.PI;           // face back out to daylight
      }
      b.velocity.setZero();
      this.camYaw = 0;
      this.camDistSmooth = null;
      this.camera.position.set(b.position.x, b.position.y + 5, b.position.z + 8);
      setTimeout(() => { el.classList.remove("on"); this.crossing = false; }, 120);
    }, 320);
  }

  /* ---- 0 · the crossroads ---- */
  /* the arch you arrive at, framing the way home */
  buildGateRoom() {
    const n = CAVE_NODES.gate;
    const P = new Grp(); P.position.set(n.x, CAVE_Y, n.z); this.caveGrp.add(P);
    const stone = this.mat(0x59516a, { roughness: 1, flatShading: true });
    this.m(new BoxGeo(2, 9, 2.4), stone, -6, 4.5, n.r - 2, { parent: P, recv: true });
    this.m(new BoxGeo(2, 9, 2.4), stone, 6, 4.5, n.r - 2, { parent: P, recv: true });
    this.m(new BoxGeo(14, 1.6, 2.4), stone, 0, 9.2, n.r - 2, { parent: P });
    this.m(new PlaneGeo(10, 8), this.bmat(0x04040a), 0, 4, n.r - 1.2, { parent: P, cast: false });
    P.add(this.glowSprite(0x7ce8e0, 3, new V3(0, 2.4, n.r - 3)));
    /* Up at the lintel, not down at head height. Point lights here decay with
       the square of the distance, so at eye level this one was handing the cat
       roughly four times the irradiance of anything else in the caverns and
       blowing it out to a white blob — the arch is what wants lighting, not
       the floor in front of it. */
    this.addLight(n.x, CAVE_Y + 5.4, n.z + n.r - 4, 0x7ce8e0, 6, 24);
    const lbl = this.makeLabel(state.lang === "es" ? "SALIDA" : "EXIT", "#7ce8e0", 1);
    lbl.position.set(0, 6.4, n.r - 2); P.add(lbl);
  }

  buildHub() {
    const n = CAVE_NODES.hub;
    const H = new Grp(); H.position.set(n.x, CAVE_Y, n.z); this.caveGrp.add(H);
    /* a mosaic ring echoing the plaza above */
    this.m(new CircleGeo(9, 36), this.mat(0x4e4660, { roughness: .9 }), 0, .06, 0,
      { rx: -Math.PI / 2, cast: false, recv: true, parent: H });
    this.m(new RingGeo(6.4, 7, 36), this.bmat(0x7ce8e0, { transparent: true, opacity: .3, side: SIDE_DOUBLE }),
      0, .1, 0, { rx: -Math.PI / 2, cast: false, parent: H });
    /* a great crystal column holding the ceiling up */
    /* The pillar used to stand dead centre, exactly where every corridor
       arrives — the camera spent the whole crossing inside it. It now hangs
       from the ceiling instead, leaving the floor of the junction clear. */
    const colM = new StdMat({ color: 0x9fd8ff, emissive: new Col(0x3a7fa8), emissiveIntensity: .8, roughness: .25, flatShading: true });
    const shaft = this.m(new ConeGeo(3.2, n.head * .55, 7), colM, 0, n.head - n.head * .275 + 2, 0,
      { parent: H, rx: Math.PI, cast: false });
    this.anims.push(t => { shaft.material.emissiveIntensity = .7 + Math.sin(t * .9) * .25; });
    this.addLight(n.x, CAVE_Y + n.head * .6, n.z, 0x9fd8ff, 15, 50);
    H.add(this.glowSprite(0x9fd8ff, 5, new V3(0, n.head * .55, 0)));
    for (let i = 0; i < 5; i++)
      this.crystalCluster(H, Math.cos(i * 1.26 + .3) * (n.r - 1.2), 0, Math.sin(i * 1.26 + .3) * (n.r - 1.2),
        [0x7ce8e0, 0x8fb0ff, 0xf2a2c4, 0xffd76a, 0x7fdca8][i], .9);

    /* signposts pointing down each corridor */
    const dests = [["echo", "PONG", 0x7ce8e0], ["river", "GLOTÓN", 0xffd76a],
                   ["runes", "RUNAS", 0xf2a2c4], ["crypt", "ENIGMA", 0x8fb0ff],
                   ["gate", state.lang === "es" ? "SALIDA" : "EXIT", 0xe8b06a]];
    for (const [key, text, col] of dests) {
      const d = CAVE_NODES[key];
      const a = Math.atan2(d.x - n.x, d.z - n.z);
      const px = Math.sin(a) * (n.r - 4), pz = Math.cos(a) * (n.r - 4);
      this.m(new CylGeo(.16, .2, 3.4, 6), this.rockDark, px, 1.7, pz, { parent: H });
      const lbl = this.makeLabel(text, "#" + new Col(col).getHexString(), .95);
      lbl.position.set(px, 4, pz); H.add(lbl);
      this.addLight(n.x + px, CAVE_Y + 3.6, n.z + pz, col, 4, 12);
    }
  }

  /* ---- 1 · Hall of Echoes (Pong) ---- */
  buildEchoHall() {
    const n = CAVE_NODES.echo;
    const H = new Grp(); H.position.set(n.x, CAVE_Y, n.z); this.caveGrp.add(H);
    /* the chamber itself is the court: two stone paddles facing off across
       a line of crystals, with a stone ball hanging over the centre */
    const line = new Grp(); H.add(line);
    for (let i = -4; i <= 4; i++)
      this.m(new OctGeo(.5, 0), new StdMat({ color: 0x7ce8e0, emissive: new Col(0x7ce8e0), emissiveIntensity: 1, roughness: .2 }),
        0, .9 + Math.abs(i) * .12, i * 1.7, { parent: line, cast: false });
    this.m(new PlaneGeo(1.2, 17), this.bmat(0x7ce8e0, { transparent: true, opacity: .18, side: SIDE_DOUBLE }),
      0, .07, 0, { rx: -Math.PI / 2, cast: false, parent: H });
    for (const sx of [-1, 1]) {
      const w = this.m(new BoxGeo(1.4, 5, 8), this.rock, sx * (n.r - 4), 2.5, 0, { parent: H, recv: true });
      this.m(new BoxGeo(1.7, .6, 8.6), this.rockDark, sx * (n.r - 4), 5.2, 0, { parent: H });
      this.addLight(n.x + sx * (n.r - 4), CAVE_Y + 5.6, n.z, 0x7ce8e0, 5, 16);
    }
    const ball = this.m(new IcoGeo(.85, 0), this.mat(0xd6d2c8, { flatShading: true }), 0, 5, 0, { parent: H });
    this.anims.push(t => {
      ball.position.set(Math.sin(t * .9) * (n.r - 6), 5 + Math.abs(Math.cos(t * 1.8)) * 1.4, Math.sin(t * 1.7) * 5);
      ball.rotation.set(t, t * .7, 0);
    });
    this.crystalCluster(H, -n.r + 2, 0, n.r - 3, 0x7ce8e0, 1.1);
    this.crystalCluster(H, n.r - 2, 0, -n.r + 3, 0x7ce8e0, .9);
    this.caveAltar(this.caveGrp, { x: n.x, z: n.z + n.r - 6 }, {
      kind: "arcade", game: "pong", col: 0x7ce8e0, geo: new OctGeo(.9, 0),
      label: { es: "PONG", en: "PONG" },
      name: { es: "La Sala de Ecos", en: "The Hall of Echoes" },
      lore: { es: "Dos paredes que llevan siglos devolviéndose la misma piedra.",
              en: "Two walls that have been returning the same stone for centuries." }
    });
  }

  /* ---- 2 · The Fish River (Snake) ---- */
  buildRiverHall() {
    const n = CAVE_NODES.river;
    const H = new Grp(); H.position.set(n.x, CAVE_Y, n.z); this.caveGrp.add(H);
    /* a winding underground river with golden fish in it */
    const pts = [];
    for (let i = 0; i <= 22; i++) {
      const t = i / 22;
      pts.push({ x: (t - .5) * (n.r * 2 - 4), z: Math.sin(t * 7) * (n.r - 8) });
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
      const len = Math.hypot(b.x - a.x, b.z - a.z) * 1.25;
      /* no env map in this build, so a shiny metal river renders as a hole in
         the floor; a faint emissive is what makes it read as water */
      const seg = this.m(new PlaneGeo(4.4, len),
        new StdMat({ color: 0x1d5a76, emissive: new Col(0x0d3348), emissiveIntensity: .8, roughness: .25, metalness: .05 }),
        mid.x, .08, mid.z, { rx: -Math.PI / 2, cast: false, parent: H });
      seg.rotation.z = -Math.atan2(b.x - a.x, b.z - a.z);
    }
    const fishM = new StdMat({ color: 0xffd76a, emissive: new Col(0xb8922a), emissiveIntensity: .9, roughness: .3, flatShading: true });
    this.riverFish = [];
    for (let i = 0; i < 7; i++) {
      const f = this.m(new IcoGeo(.42, 0), fishM, 0, .5, 0, { parent: H, cast: false });
      f.scale.set(1.3, .7, .6);
      this.riverFish.push({ f, off: i / 7 });
    }
    this.anims.push(t => {
      for (const r of this.riverFish) {
        const u = (t * .06 + r.off) % 1;
        const i = Math.min(pts.length - 2, Math.floor(u * (pts.length - 1)));
        const a = pts[i], b = pts[i + 1], k = u * (pts.length - 1) - i;
        r.f.position.set(a.x + (b.x - a.x) * k, .5 + Math.sin(t * 4 + r.off * 9) * .12, a.z + (b.z - a.z) * k);
        r.f.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
      }
    });
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * 6.28, r = 6 + Math.random() * (n.r - 8);
      const s = .3 + Math.random() * .5;
      this.m(new CylGeo(.08 * s, .12 * s, s * 2, 5), this.mat(0xd8d2c4), Math.cos(a) * r, s, Math.sin(a) * r, { parent: H, cast: false });
      this.m(new SphGeo(s * .8, 8, 6, 0, 6.3, 0, Math.PI / 2),
        new StdMat({ color: 0xd8bd78, emissive: new Col(0x8a6c1e), emissiveIntensity: .5, roughness: .6 }),
        Math.cos(a) * r, s * 2, Math.sin(a) * r, { parent: H, cast: false });
    }
    this.crystalCluster(H, -n.r + 2, 0, -n.r + 3, 0xffd76a, 1);
    this.caveAltar(this.caveGrp, { x: n.x, z: n.z + n.r - 6 }, {
      kind: "arcade", game: "snake", col: 0xffd76a, geo: new IcoGeo(.9, 0),
      label: { es: "GLOTÓN", en: "GREEDY" },
      name: { es: "El Río de los Peces", en: "The Fish River" },
      lore: { es: "Un río que baja lleno de peces dorados y ningún gato que los pesque.",
              en: "A river running thick with golden fish and no cat to catch them." }
    });
  }

  /* ---- 3 · Circle of Runes (Simon) ---- */
  buildRuneHall() {
    const n = CAVE_NODES.runes;
    const H = new Grp(); H.position.set(n.x, CAVE_Y, n.z); this.caveGrp.add(H);
    const cols = [0x7fdca8, 0xe8b06a, 0x8fb0ff, 0xf07a6a];
    this.runePillars = [];
    for (let i = 0; i < 4; i++) {
      const a = i / 4 * Math.PI * 2 + .78, r = n.r - 6;
      const px = Math.cos(a) * r, pz = Math.sin(a) * r;
      this.m(new BoxGeo(2.2, 1, 2.2), this.rockDark, px, .5, pz, { parent: H, recv: true });
      this.m(new CylGeo(.9, 1.1, 5.4, 8), this.rock, px, 3.4, pz, { parent: H, recv: true });
      this.addOccluder(n.x + px, CAVE_Y + 3.4, n.z + pz, 1.8);
      const glyph = this.m(new OctGeo(.85, 0),
        new StdMat({ color: cols[i], emissive: new Col(cols[i]), emissiveIntensity: .5, roughness: .2, flatShading: true }),
        px, 6.6, pz, { parent: H, cast: false });
      const src = this.addLight(n.x + px, CAVE_Y + 6.6, n.z + pz, cols[i], 4, 18);
      this.runePillars.push({ glyph, src, i });
    }
    /* the pillars chant a rolling sequence, a preview of the game */
    this.anims.push(t => {
      const active = Math.floor(t * .9) % 4;
      for (const p of this.runePillars) {
        const on = p.i === active;
        p.glyph.material.emissiveIntensity += ((on ? 1.8 : .35) - p.glyph.material.emissiveIntensity) * .12;
        p.src.intensity += ((on ? 11 : 3) - p.src.intensity) * .12;
        p.glyph.rotation.y += .01;
      }
    });
    this.m(new CircleGeo(n.r - 8, 32), this.mat(0x4a4159, { roughness: .9 }), 0, .07, 0,
      { rx: -Math.PI / 2, cast: false, recv: true, parent: H });
    this.m(new RingGeo(n.r - 8.4, n.r - 7.8, 32), this.bmat(0xf2a2c4, { transparent: true, opacity: .35, side: SIDE_DOUBLE }),
      0, .11, 0, { rx: -Math.PI / 2, cast: false, parent: H });
    this.caveAltar(this.caveGrp, { x: n.x, z: n.z }, {
      kind: "arcade", game: "runes", col: 0xf2a2c4, geo: new DodGeo(.85, 0),
      label: { es: "RUNAS", en: "RUNES" },
      name: { es: "El Círculo de Runas", en: "The Circle of Runes" },
      lore: { es: "Cuatro pilares que se turnan para cantar. Alguien debería contestarles.",
              en: "Four pillars taking turns to sing. Somebody ought to answer them." }
    });
  }

  /* ---- 4 · Crypt of the Code (Mastermind) ---- */
  buildCryptHall() {
    const n = CAVE_NODES.crypt;
    const H = new Grp(); H.position.set(n.x, CAVE_Y, n.z); this.caveGrp.add(H);
    const orbCols = [0x7fdca8, 0xe8b06a, 0xf2a2c4, 0x8fb0ff];
    /* niches carved into the wall, each holding one orb of the code */
    this.mmOrbs = [];
    for (let i = 0; i < 4; i++) {
      const a = -1.1 + i * .73, r = n.r - 2.5;
      const px = Math.cos(a) * r, pz = Math.sin(a) * r;
      const N = new Grp(); N.position.set(px, 0, pz); N.rotation.y = -a + Math.PI / 2; H.add(N);
      this.m(new BoxGeo(3.2, 5, 1.4), this.rockDark, 0, 2.5, 0, { parent: N, recv: true });
      this.m(new BoxGeo(2.4, 3.4, .6), this.bmat(0x14111c), 0, 2.4, .55, { parent: N, cast: false });
      const orb = this.m(new SphGeo(.7, 14, 10),
        new StdMat({ color: orbCols[i], emissive: new Col(orbCols[i]), emissiveIntensity: 1.2, roughness: .25 }),
        0, 2.5, .9, { parent: N, cast: false });
      this.anims.push(t => { orb.position.y = 2.5 + Math.sin(t * 1.3 + i * 1.7) * .2; });
      this.addLight(n.x + px, CAVE_Y + 2.6, n.z + pz, orbCols[i], 5, 14);
      this.mmOrbs.push(orb);
    }
    /* broken columns and a sarcophagus lid on the floor */
    for (let i = 0; i < 5; i++) {
      const a = 2 + i * .8, r = n.r - 5;
      this.m(new CylGeo(.7, .8, 1.4 + hash2(i, 44) * 3, 8), this.rock,
        Math.cos(a) * r, .8, Math.sin(a) * r, { parent: H, recv: true, rz: (hash2(i, 12) - .5) * .3 });
    }
    this.m(new BoxGeo(4.4, .6, 2.4), this.rockDark, -4, .3, -5, { parent: H, ry: .5, recv: true });
    this.crystalCluster(H, -n.r + 2, 0, 4, 0x8fb0ff, 1);
    this.caveAltar(this.caveGrp, { x: n.x, z: n.z - 2 }, {
      kind: "mm", col: 0x8fb0ff, geo: new BoxGeo(1.3, 1.3, 1.3),
      label: { es: "ENIGMA", en: "RIDDLE" },
      name: { es: "La Cripta del Código", en: "The Crypt of the Code" },
      lore: { es: "Cuatro nichos, cuatro orbes y un código que nadie ha sabido leer.",
              en: "Four niches, four orbs and a code nobody has managed to read." }
    });
  }

  /* fog and lights ease between daylight and cave as the cat descends */
  applyDepth(k) {
    if (Math.abs(k - (this._depthK ?? -1)) < .002) return;
    this._depthK = k;
    const f = this.scene.fog;
    f.color.setRGB(.165 + (.027 - .165) * k, .235 + (.027 - .235) * k, .345 + (.051 - .345) * k);
    f.near = 90 + (14 - 90) * k;
    f.far = 430 + (95 - 430) * k;
    this.sun.intensity = 2.5 * (1 - k);
    this.hemi.intensity = 1 + (.72 - 1) * k;
    this.caveKey.visible = k > .05;
    this.caveFill.visible = k > .05;
    this.caveVault.visible = k > .05;
    this.caveKey.intensity = 2.2 * k;
    this.caveFill.intensity = 1.15 * k;
    this.caveVault.intensity = .55 * k;
    for (const l of this.outdoorLights) l.intensity = (l === this.outdoorLights[0] ? .8 : .3) * (1 - k);
    /* underground the vignette closes in and the golden-hour split tone goes
       away — down there the only warm light is the crystals' own */
    this.grade.uniforms.uVig.value = .62 + (1.30 - .62) * k;
    this.grade.uniforms.uWarm.value = 1 - k;
    const outside = k < .96;
    for (const o of this.outdoorOnly) o.visible = outside;
    this.scene.background = outside ? this.sky : null;
  }


  /* ============ the cat ============ */

  /* A mackerel tabby coat, painted once into a canvas.
     SphereGeometry lays u around the axis and v from pole to pole, and the
     body sphere's axis is Y — so columns of the image become stripes running
     over the spine and down the flanks, and rows become the back-to-belly
     gradient. Which is exactly how a tabby is put together.
     The stripes are drawn a second time one canvas-width to each side so the
     u=0/u=1 seam has no visible join. */
  catFurTexture(isHead) {
    const W = 512, H = 256;
    return this.makeCanvas(W, H, g => {
      const grad = g.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#c9702e");        // spine
      grad.addColorStop(.28, "#e08840");
      grad.addColorStop(.6, "#e79b58");       // flank
      grad.addColorStop(.8, "#efc79a");
      grad.addColorStop(1, "#f5e6cc");        // belly
      g.fillStyle = grad; g.fillRect(0, 0, W, H);

      /* mackerel bars: wavy, tapering, only over the back and flanks */
      const bars = isHead ? 7 : 13;
      g.lineCap = "round";
      for (let i = 0; i < bars; i++) {
        const x0 = (i + .5) / bars * W;
        const lean = (i % 2 ? 1 : -1) * (10 + (i * 37 % 23));
        for (const off of [-W, 0, W]) {
          g.strokeStyle = i % 3 ? "rgba(150,79,30,0.72)" : "rgba(120,60,22,0.62)";
          g.lineWidth = 13 + (i * 17 % 9);
          g.beginPath();
          g.moveTo(x0 + off, 0);
          g.quadraticCurveTo(x0 + off + lean, H * .3, x0 + off + lean * .4, H * (isHead ? .5 : .62));
          g.stroke();
        }
      }
      /* a darker saddle right along the spine */
      const sp = g.createLinearGradient(0, 0, 0, H * .22);
      sp.addColorStop(0, "rgba(110,55,20,0.5)");
      sp.addColorStop(1, "rgba(110,55,20,0)");
      g.fillStyle = sp; g.fillRect(0, 0, W, H * .22);
      /* and a soft edge where the coat meets the belly, so the change of
         colour is a fur line rather than a hard band */
      g.globalAlpha = .5;
      for (let i = 0; i < 220; i++) {
        const x = Math.random() * W, y = H * (.66 + Math.random() * .16);
        g.strokeStyle = "rgba(226,150,90,0.7)";
        g.lineWidth = 2.5;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - .5) * 6, y - 9 - Math.random() * 10); g.stroke();
      }
      /* flecks, so a large flat area is never truly flat */
      for (let i = 0; i < 700; i++) {
        const y = Math.random() * H;
        g.fillStyle = Math.random() < .5 ? "rgba(255,220,180,0.16)" : "rgba(120,66,28,0.16)";
        g.fillRect(Math.random() * W, y, 2 + Math.random() * 3, 1 + Math.random() * 2);
      }
      g.globalAlpha = 1;
    });
  }

  buildCat() {
    this.spawn = { pos: new CVec(0, 3, 12) };
    const body = new CBody({ mass: 6, material: this.catMat });
    body.addShape(new CSph(.8));
    body.position.copy(this.spawn.pos);
    body.fixedRotation = true;
    body.updateMassProperties();
    body.linearDamping = 0;
    this.catBody = body;
    this.world.addBody(body);
    this.heading = Math.PI;
    this.legPhase = 0; this.speedSmooth = 0;
    this.grounded = true; this.jumpsLeft = 2; this.jumpLatch = false;
    this.flipT = 1; this.flipDir = -1; this.idleT = 0; this.sitF = 0;
    this.squash = 1; this.wasGrounded = true;

    const G = new Grp(); this.scene.add(G);
    this.catGrp = G;
    const inner = new Grp(); G.add(inner);       // for squash & sit pose
    this.catInner = inner;

    /* The coat is a painted texture rather than flat colour plus three boxes
       glued to the back: a mackerel tabby wants stripes that wrap around the
       barrel and fade into a cream belly, which is a two-minute canvas and no
       extra geometry at all. */
    const fur = new StdMat({ map: this.catFurTexture(false), roughness: .82 });
    const furHead = new StdMat({ map: this.catFurTexture(true), roughness: .82 });
    const orange = this.mat(0xe08840, { roughness: .8 });
    const darkOr = this.mat(0xb5652a, { roughness: .85 });
    const cream = this.mat(0xf5e6cc, { roughness: .85 });
    const pinkM = this.mat(0xd98a80, { roughness: .7 });

    /* body */
    const bodyMesh = this.m(new SphGeo(.62, 22, 16), fur, 0, .1, 0, { parent: inner });
    bodyMesh.scale.set(1, .82, 1.45);
    /* shoulders, so the neck is not a ball balanced on an egg */
    const shoulders = this.m(new SphGeo(.44, 14, 11), fur, 0, .18, .48, { parent: inner });
    shoulders.scale.set(1.02, .92, .8);
    const chest = this.m(new SphGeo(.34, 14, 10), cream, 0, -.12, .62, { parent: inner, cast: false });
    chest.scale.set(.8, .78, .7);
    /* haunches */
    for (const sx of [-1, 1]) {
      const hip = this.m(new SphGeo(.3, 12, 9), fur, sx * .22, -.06, -.5, { parent: inner });
      hip.scale.set(.75, .95, 1.05);
    }

    /* head */
    const head = new Grp(); head.position.set(0, .62, .78); inner.add(head);
    this.catHead = head;
    const skull = this.m(new SphGeo(.44, 20, 15), furHead, 0, 0, 0, { parent: head });
    skull.scale.set(1, .92, .95);
    /* cheeks: fur-coloured mass at the jaw, which is what widens a cat's face.
       Cream spikes here read as thorns, not fur, at this scale. */
    for (const sx of [-1, 1]) {
      const cheek = this.m(new SphGeo(.2, 10, 8), furHead, sx * .3, -.12, .1, { parent: head, cast: false });
      cheek.scale.set(.85, .8, .95);
    }
    const muzzle = this.m(new SphGeo(.21, 12, 9), cream, 0, -.17, .34, { parent: head, cast: false });
    muzzle.scale.set(1.18, .7, .86);
    this.m(new SphGeo(.11, 10, 8), cream, 0, -.27, .22, { parent: head, cast: false }).scale.set(1, .55, .9);
    /* nose: a rounded wedge, and a philtrum line under it */
    const nose = this.m(new SphGeo(.075, 8, 6), pinkM, 0, -.045, .52, { parent: head, cast: false });
    nose.scale.set(1.25, .85, .8);
    this.m(new BoxGeo(.02, .1, .02), pinkM, 0, -.12, .53, { parent: head, cast: false });
    /* ears + inner ears */
    for (const sx of [-1, 1]) {
      const ear = this.m(new ConeGeo(.2, .44, 5), furHead, sx * .26, .48, -.02, { parent: head });
      ear.rotation.z = -sx * .3; ear.rotation.y = sx * .4;
      this.m(new ConeGeo(.11, .26, 5), pinkM, 0, .02, .035, { parent: ear, cast: false });
      if (sx < 0) this.earL = ear; else this.earR = ear;
    }
    /* eyes: green iris, slit pupil, and a catchlight — the highlight is what
       makes them read as eyes instead of beads at any distance */
    this.eyes = [];
    for (const sx of [-1, 1]) {
      const eye = this.m(new SphGeo(.11, 12, 9), new StdMat({ color: 0x63cf96, emissive: new Col(0x2f7d55), emissiveIntensity: .35, roughness: .18 }), sx * .19, .06, .35, { parent: head, cast: false });
      eye.scale.set(1, 1.05, .8);
      /* A vertical slit, not a dot — it is the pupil that says "cat". It has
         to sit far enough forward to break the surface of the eyeball: the
         eye is opaque, so a pupil tucked inside it is simply invisible. */
      const pupil = this.m(new SphGeo(.075, 10, 8), this.bmat(0x14161c), 0, 0, .078, { parent: eye, cast: false });
      pupil.scale.set(.4, 1.2, .8);
      this.m(new SphGeo(.024, 6, 5), this.bmat(0xffffff), -sx * .045, .052, .105, { parent: eye, cast: false });
      this.eyes.push(eye);
    }
    this.blinkT = 0;
    /* whiskers */
    const whiskM = this.mat(0xf5f0e0, { roughness: .5 });
    for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) {
      const w = this.m(new BoxGeo(.46, .012, .012), whiskM, sx * .43, -.1 + i * .05, .42, { parent: head, cast: false });
      w.rotation.y = sx * .38; w.rotation.z = (i - 1) * .14 * sx;
    }
    /* collar + bell */
    const collar = this.m(new TorusGeo(.3, .055, 8, 18), this.mat(0xd6543c, { roughness: .5 }), 0, .33, .69, { parent: inner, cast: false });
    collar.rotation.x = Math.PI / 2 - .45;      // hugs the neck instead of hanging off it
    this.m(new SphGeo(.085, 10, 8), new StdMat({ color: 0xffd76a, metalness: .8, roughness: .25, emissive: new Col(0x806018), emissiveIntensity: .4 }), 0, .19, .95, { parent: inner, cast: false });

    /* legs: a tapered upper, a narrower ankle and a paw with toes */
    this.legs = [];
    [[-.32, .5], [.32, .5], [-.32, -.48], [.32, -.48]].forEach(([lx, lz], i) => {
      const pivot = new Grp(); pivot.position.set(lx, -.28, lz); inner.add(pivot);
      this.m(new CylGeo(.145, .105, .3, 9), fur, 0, -.13, 0, { parent: pivot });
      this.m(new CylGeo(.095, .105, .26, 9), i < 2 ? orange : darkOr, 0, -.36, 0, { parent: pivot });
      const paw = this.m(new SphGeo(.135, 10, 8), cream, 0, -.5, .04, { parent: pivot, cast: false });
      paw.scale.set(1, .8, 1.15);
      for (let k = 0; k < 3; k++)
        this.m(new SphGeo(.05, 6, 5), cream, (k - 1) * .075, -.52, .15, { parent: pivot, cast: false });
      this.legs.push(pivot);
    });

    /* tail: a tapering chain, ringed like the coat */
    this.tailSegs = [];
    let parent = inner;
    for (let i = 0; i < 5; i++) {
      const seg = new Grp();
      seg.position.set(0, i === 0 ? .25 : 0, i === 0 ? -.85 : -.21);
      const r = .115 - i * .012;
      this.m(new CylGeo(r, r * .9, .2, 8), i % 2 ? darkOr : orange, 0, 0, -.1, { parent: seg, cast: false, rx: Math.PI / 2 });
      this.m(new SphGeo(r * .95, 8, 6), i === 4 ? cream : (i % 2 ? darkOr : orange), 0, 0, -.2, { parent: seg, cast: false });
      parent.add(seg);
      this.tailSegs.push(seg);
      parent = seg;
    }

    G.position.copy(body.position);

    /* soft blob shadow */
    const blob = new Mesh(new PlaneGeo(2.6, 2.6),
      new BasicMat({ map: this.radialTexture(), color: 0x000000, transparent: true, opacity: .5, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2;
    blob.position.set(body.position.x, .04, body.position.z);
    this.scene.add(blob);
    this.catShadow = blob;

    /* dust puff pool */
    this.dustPool = [];
    for (let i = 0; i < 10; i++) {
      const s = new Sprite3(new SpriteMat({ map: this.radialTexture(), color: 0xb8a888, transparent: true, opacity: 0, depthWrite: false }));
      this.scene.add(s);
      this.dustPool.push({ s, life: 0 });
    }
    this.dustTimer = 0;
    this.effects = [];
  }

  spawnDust(x, y, z, big = false) {
    const d = this.dustPool.find(d => d.life <= 0);
    if (!d) return;
    d.life = .5;
    d.big = big;
    d.s.position.set(x + (Math.random() - .5) * .5, y, z + (Math.random() - .5) * .5);
  }
  confetti(x, y, z, n = 50) {
    const geo = new BufGeo();
    const arr = new Float32Array(n * 3);
    const vel = [];
    for (let i = 0; i < n; i++) {
      arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
      const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 6;
      vel.push({ x: Math.cos(a) * sp, y: 4 + Math.random() * 6, z: Math.sin(a) * sp });
    }
    geo.setAttribute("position", new F32Attr(arr, 3));
    const cols = [0x7fdca8, 0xe8b06a, 0xf2a2c4, 0x8fb0ff, 0xffd76a];
    const pts = new Points3(geo, new PointsMat({ color: cols[Math.floor(Math.random() * 5)], size: .35, transparent: true, opacity: 1, depthWrite: false }));
    this.scene.add(pts);
    let life = 1.4;
    this.effects.push(dt => {
      life -= dt;
      const a = pts.geometry.attributes.position.array;
      for (let i = 0; i < n; i++) {
        vel[i].y -= 14 * dt;
        a[i * 3] += vel[i].x * dt; a[i * 3 + 1] += vel[i].y * dt; a[i * 3 + 2] += vel[i].z * dt;
        if (a[i * 3 + 1] < .1) { a[i * 3 + 1] = .1; vel[i].y *= -.4; vel[i].x *= .8; vel[i].z *= .8; }
      }
      pts.geometry.attributes.position.needsUpdate = true;
      pts.material.opacity = Math.min(1, life);
      if (life <= 0) { this.scene.remove(pts); return false; }
      return true;
    });
  }

  reset() {
    const b = this.catBody;
    state.inCave = false;
    this.entryK = 0;
    this.applyDepth(0);
    b.position.set(this.spawn.pos.x, this.spawn.pos.y, this.spawn.pos.z);
    b.velocity.setZero(); b.angularVelocity.setZero();
    this.heading = Math.PI;
    toast(TXT().toastReset);
  }

  _bind() {
    addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.composer.setSize(innerWidth, innerHeight);
      this.bloom.setSize(innerWidth, innerHeight);
    });
    let dragging = false, lastX = 0, moved = 0;
    const cv = this.renderer.domElement;
    cv.addEventListener("pointerdown", e => { dragging = true; moved = 0; lastX = e.clientX; });
    addEventListener("pointerup", () => dragging = false);
    addEventListener("pointermove", e => {
      if (!dragging) return;
      this.camYaw -= (e.clientX - lastX) * .005;
      moved += Math.abs(e.clientX - lastX);
      lastX = e.clientX;
    });
    cv.addEventListener("click", () => { if (moved < 6) interact(); });
  }

  /* grounded check: the heightmap first, then real physics contacts */
  checkGrounded() {
    const p = this.catBody.position;
    if (p.y - .8 <= (this.groundY ?? 0) + .09) return true;
    for (const c of this.world.contacts) {
      if (c.bi === this.catBody || c.bj === this.catBody) {
        const n = c.ni;
        const up = (c.bi === this.catBody) ? -n.y : n.y;
        if (up > .45) return true;
      }
    }
    return false;
  }

  control(dt) {
    const b = this.catBody;
    if (state.minigame || state.riding) {
      b.velocity.x *= .82; b.velocity.z *= .82;
      return;
    }
    const turnSpd = 2.9;
    const sprint = KEYS.shift;
    const maxSpd = sprint ? 16 : 9;
    if (KEYS.a || KEYS.arrowleft) this.heading += turnSpd * dt;
    if (KEYS.d || KEYS.arrowright) this.heading -= turnSpd * dt;
    let fwd = 0;
    if (KEYS.w || KEYS.arrowup) fwd = 1;
    else if (KEYS.s || KEYS.arrowdown) fwd = -.55;
    const sx = Math.sin(this.heading), cz = Math.cos(this.heading);
    const lerp = Math.min(1, dt * 8);
    b.velocity.x += (sx * maxSpd * fwd - b.velocity.x) * lerp;
    b.velocity.z += (cz * maxSpd * fwd - b.velocity.z) * lerp;

    this.fallSpeed = this.grounded ? 0 : Math.max(this.fallSpeed || 0, -b.velocity.y);
    this.grounded = this.checkGrounded();
    if (this.grounded && b.velocity.y <= .01) this.jumping = false;
    if (this.grounded) {
      this.jumpsLeft = 2;
      if (!this.wasGrounded && Math.abs(b.velocity.y) < 4) {
        this.squash = .62;                       // landing squash
        Snd.land(this.fallSpeed > 9);
        const gy = this.groundY;
        for (let i = 0; i < 3; i++) this.spawnDust(b.position.x, gy + .15, b.position.z, true);
      }
    }
    this.wasGrounded = this.grounded;

    if (KEYS[" "]) {
      if (!this.jumpLatch && this.jumpsLeft > 0) {
        this.jumpLatch = true;
        const isAir = !this.grounded;
        this.jumpsLeft = isAir ? 0 : 1;
        b.velocity.y = isAir ? 10 : 11.5;
        this.jumping = true;
        this.squash = 1.35;                      // stretch
        Snd.jump(isAir);
        if (isAir) {
          /* coin-flip the spin direction so the mid-air trick is not always
             the same animation */
          /* +1 tips the head down and forward, -1 throws it up and back */
          this.flipDir = Math.random() < .5 ? 1 : -1;
          this.flipT = 0;
          toast(TXT()[this.flipDir > 0 ? "flipFront" : "flipBack"], 700);
        }
        for (let i = 0; i < 2; i++) this.spawnDust(b.position.x, this.groundY + .15, b.position.z);
      }
    } else this.jumpLatch = false;

    /* sprint dust */
    const spd = Math.hypot(b.velocity.x, b.velocity.z);
    this.dustTimer -= dt;
    if (sprint && this.grounded && spd > 10 && this.dustTimer <= 0) {
      this.dustTimer = .1;
      this.spawnDust(b.position.x - sx, this.groundY + .15, b.position.z - cz);
    }
  }

  loop() {
    requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), .05);
    const t = this.clock.elapsedTime;
    this.control(dt);
    this.world.step(1 / 60, dt, 3);
    for (const s of this.sync) {
      s.mesh.position.copy(s.body.position);
      s.mesh.quaternion.copy(s.body.quaternion);
    }

    const b = this.catBody, pos = b.position;
    /* cannon's floor is a flat plane, so lift the cat onto the terrain by hand.
       Built areas are carved to y=0, which is exactly where that plane sits, so
       the two never fight each other. */
    /* The physics floor is an infinite plane, so without this the cat would
       happily stroll out across the sea. A radial clamp against the real
       coastline is watertight in a way a ring of wall boxes was not. */
    /* Two walkable surfaces can share the same x/z — the island above and a
       tunnel below — so pick whichever the cat is actually standing on, then
       apply the matching confinement. */
    /* Surface and caverns are two separate places, so the ground rule is a
       simple either/or — no two-surface arbitration, no overlap to resolve. */
    if (state.inCave) {
      confineToCave(pos);
      this.groundY = CAVE_Y;
      const head = caveHeadAt(pos.x, pos.z);
      if (pos.y > CAVE_Y + head) { pos.y = CAVE_Y + head; if (b.velocity.y > 0) b.velocity.y = 0; }
      /* walking back out through the arch sends you home */
      const gate = CAVE_NODES.gate;
      if (pos.z > gate.z + gate.r - 2.5 && Math.abs(pos.x - gate.x) < 7) this.crossTo(false);
    } else {
      /* the beach, the bridge deck and the islet are all walkable, so the old
         single radial clamp against the coastline is not enough any more */
      const px = pos.x, pz = pos.z;
      confineOutdoors(pos);
      if (pos.x !== px || pos.z !== pz) { b.velocity.x *= .25; b.velocity.z *= .25; }
      this.groundY = heightAt(pos.x, pos.z);
      /* the entrance corridor dims as you walk in, then carries you across */
      const ep = entryProgress(pos.x, pos.z);
      this.entryK = ep === null ? 0 : ep;
      if (ep !== null && ep > .82) this.crossTo(true);
    }
    this.applyDepth(state.inCave ? 1 : clamp01((this.entryK || 0) * 1.15));
    const gap = pos.y - .8 - this.groundY;
    if (gap < 0) {
      pos.y = this.groundY + .8;
      if (b.velocity.y < 0) b.velocity.y = 0;
    } else if (this.wasGrounded && !this.jumping && gap < 1.4 && b.velocity.y <= 0) {
      /* running downhill would otherwise launch the cat off every slope, so
         stick to the surface as long as it was already walking on it */
      pos.y = this.groundY + .8;
      b.velocity.y = 0;
    }
    this.catGrp.position.set(pos.x, pos.y, pos.z);
    this.catGrp.rotation.y = this.heading;
    if (pos.y < -80) this.reset();

    /* cat animation */
    const spd = Math.hypot(b.velocity.x, b.velocity.z);
    this.speedSmooth += (spd - this.speedSmooth) * .2;
    const airborne = !this.grounded;
    this.legPhase += dt * (6 + this.speedSmooth * 1.1);
    const amp = airborne ? .95 : Math.min(.75, .05 + this.speedSmooth * .07);
    const swing = Math.sin(this.legPhase) * amp;
    const swing2 = Math.sin(this.legPhase + Math.PI) * amp;
    if (this.legs) {
      this.legs[0].rotation.x = airborne ? -.9 : swing;
      this.legs[3].rotation.x = airborne ? -.9 : swing;
      this.legs[1].rotation.x = airborne ? .9 : swing2;
      this.legs[2].rotation.x = airborne ? .9 : swing2;
    }
    /* one footstep per leg swing, only while actually on the ground */
    if (this.grounded && this.speedSmooth > 1.2) {
      const phase = Math.floor(this.legPhase / Math.PI);
      if (phase !== this.lastStepPhase) { this.lastStepPhase = phase; Snd.step_(this.speedSmooth > 11); }
    }

    /* idle → sit */
    if (spd < .6 && this.grounded) this.idleT += dt; else this.idleT = 0;
    const sitGoal = this.idleT > 5 ? 1 : 0;
    this.sitF += (sitGoal - this.sitF) * Math.min(1, dt * 3);
    this.catInner.rotation.x = -this.sitF * .55;
    this.catInner.position.y = -this.sitF * .12;
    /* bob while trotting */
    this.catInner.position.y += Math.abs(Math.sin(this.legPhase)) * this.speedSmooth * .012;
    /* squash & stretch recovery */
    this.squash += (1 - this.squash) * Math.min(1, dt * 8);
    this.catInner.scale.set(1 / Math.sqrt(this.squash), this.squash, 1 / Math.sqrt(this.squash));
    /* double-jump flip */
    if (this.flipT < 1) {
      this.flipT = Math.min(1, this.flipT + dt * 2.2);
      this.catInner.rotation.x = this.flipDir * this.flipT * Math.PI * 2;
    }
    /* tail wave (stronger curl when sitting) */
    for (let i = 0; i < this.tailSegs.length; i++) {
      const seg = this.tailSegs[i];
      seg.rotation.x = (i === 0 ? -.7 : 0) + Math.sin(t * 2.4 + i * .8) * .18 + this.sitF * .25;
      seg.rotation.y = Math.sin(t * 3 + i * .9 + this.speedSmooth) * (.25 + this.sitF * .2);
    }
    /* head idle motion + ear twitch */
    this.catHead.rotation.z = Math.sin(t * 2) * .05;
    this.catHead.rotation.x = Math.sin(t * 1.4) * .04 + this.sitF * .45;
    if (Math.sin(t * .7) > .995) this.earL.rotation.z = -.5 + Math.random() * .3;
    /* blink */
    this.blinkT += dt;
    let blink = 1;
    const bph = this.blinkT % 3.4;
    if (bph > 3.2) blink = Math.max(.1, 1 - (bph - 3.2) / .1 * 2);
    for (const e of this.eyes) e.scale.y = blink;
    /* blob shadow */
    const h = Math.max(0, pos.y - .8 - this.groundY);
    this.catShadow.position.set(pos.x, this.groundY + .045, pos.z);
    const shScale = 1 + h * .25;
    this.catShadow.scale.set(shScale, shScale, 1);
    this.catShadow.material.opacity = Math.max(.08, .5 - h * .09);

    /* dust pool */
    for (const d of this.dustPool) {
      if (d.life > 0) {
        d.life -= dt;
        const p = 1 - d.life / .5;
        const sc = (d.big ? .9 : .5) + p * (d.big ? 1.6 : .9);
        d.s.scale.set(sc, sc, 1);
        d.s.position.y += dt * .8;
        d.s.material.opacity = .35 * (1 - p);
      } else d.s.material.opacity = 0;
    }
    /* one-shot effects */
    this.effects = this.effects.filter(fn => fn(dt));

    /* world animations */
    this.elapsed = t;
    this.windU.value = t;          // every swaying material reads this one uniform
    for (const fn of this.anims) fn(t, dt);

    /* Keep the shadow frustum tight around the cat so shadows stay crisp
       instead of being smeared across the whole island. Snapping the centre to
       whole shadow-map texels stops the edges crawling as you walk. */
    const q = this.shadowTexel;
    const sx = Math.round(pos.x / q) * q, sz = Math.round(pos.z / q) * q;
    this.sun.target.position.set(sx, 0, sz);
    this.sun.target.updateMatrixWorld();
    this.sun.position.set(sx + this.sunDir.x * 110, this.sunDir.y * 110, sz + this.sunDir.z * 110);

    /* camera follow */
    const camA = this.heading + this.camYaw;
    const cs = Math.sin(camA), cc = Math.cos(camA);
    /* corridors are narrow, so pull the camera in and lower it down there */
    /* ---- camera occlusion ----
       March the ray from just above the cat out to where the camera would
       ideally sit and stop at the first thing that would hide it: a bounding
       sphere, the terrain, or the wall of a tunnel. Without this, every tree
       above ground and every crystal below it ends up in front of the lens. */
    const tight = state.inCave || (this._depthK ?? 0) > .06;
    const camHigh = tight ? 4.4 : 6.5;
    const wantDist = tight ? 8.5 : 12;
    const oy = pos.y + .9;
    const len = Math.hypot(wantDist, camHigh);
    const ux = -cs * wantDist / len, uy = camHigh / len, uz = -cc * wantDist / len;

    let hit = len;
    for (const o of this.occluders) {
      if (Math.abs(o.x - pos.x) > len + o.r || Math.abs(o.z - pos.z) > len + o.r) continue;
      const t = raySphere(pos.x, oy, pos.z, ux, uy, uz, o.x, o.y, o.z, o.r);
      if (t !== null && t < hit) hit = t;
    }
    /* Sample the ray against the ground and the tunnel envelope too. The step
       count sets how much distance a single blocked sample costs: at eight
       steps one hit near the cat collapsed the camera onto its minimum, which
       is why the caverns kept ending up filmed from inside the cat's ear. */
    const STEPS = 16;
    for (let i = 2; i <= STEPS; i++) {
      const t = hit * i / STEPS;
      const sx = pos.x + ux * t, sy = oy + uy * t, sz = pos.z + uz * t;
      const blocked = state.inCave
        ? !caveRoomy(sx, sz, 1.4) || sy < CAVE_Y + .4 || sy > CAVE_Y + caveHeadAt(sx, sz) - .8
        : sy < heightAt(sx, sz) + .5;
      if (blocked) { hit = hit * (i - 1) / STEPS; break; }
    }
    /* Snap in the instant something blocks the view, ease back out once it is
       clear. Smoothing both ways leaves the camera lagging behind an obstacle
       it has already decided to avoid, which is where most of the remaining
       blocked frames were coming from. */
    const want = Math.max(3.6, hit - .5);
    if (this.camDistSmooth == null || want < this.camDistSmooth) this.camDistSmooth = want;
    else this.camDistSmooth += (want - this.camDistSmooth) * Math.min(1, dt * 2.2);
    const camDist = this.camDistSmooth;
    this.camGoal.set(pos.x + ux * camDist, oy + uy * camDist, pos.z + uz * camDist);
    this.camera.position.lerp(this.camGoal, Math.min(1, dt * 4));
    /* the lerp can leave the camera further out than the solver allowed, so
       pull it back onto the permitted radius before anything else runs */
    {
      const cx = this.camera.position.x - pos.x, cy2 = this.camera.position.y - oy, cz = this.camera.position.z - pos.z;
      const dist = Math.hypot(cx, cy2, cz);
      if (dist > camDist) {
        const k = camDist / dist;
        this.camera.position.set(pos.x + cx * k, oy + cy2 * k, pos.z + cz * k);
      }
    }
    /* Final line-of-sight pass from where the camera actually ended up. The
       forward march works on the ideal position; this catches the cases where
       smoothing, yaw or the cat's own motion left something in the way. */
    for (let pass = 0; pass < 3; pass++) {
      const cp2 = this.camera.position;
      let dx2 = pos.x - cp2.x, dy2 = oy - cp2.y, dz2 = pos.z - cp2.z;
      const L2 = Math.hypot(dx2, dy2, dz2);
      if (L2 < 2.8) break;
      dx2 /= L2; dy2 /= L2; dz2 /= L2;
      let blocked = false;
      for (const o of this.occluders) {
        if (Math.abs(o.x - cp2.x) > L2 + o.r || Math.abs(o.z - cp2.z) > L2 + o.r) continue;
        const t = raySphere(cp2.x, cp2.y, cp2.z, dx2, dy2, dz2, o.x, o.y, o.z, o.r);
        if (t !== null && t < L2 - 1) { blocked = true; break; }
      }
      if (!blocked) break;
      this.camDistSmooth = Math.max(2.7, L2 * .68);
      cp2.set(pos.x - dx2 * this.camDistSmooth, oy - dy2 * this.camDistSmooth, pos.z - dz2 * this.camDistSmooth);
    }
    /* never let the follow camera sink into a hillside */
    /* a last safety net: never let the lerped position end up inside rock */
    const cp = this.camera.position;
    if (state.inCave) {
      const cf = caveFloorAt(cp.x, cp.z);
      if (cf === null) {
        const q = { x: cp.x, z: cp.z };
        confineToCave(q);
        cp.x = q.x; cp.z = q.z;
      }
      const cy = caveFloorAt(cp.x, cp.z) ?? 0;
      cp.y = Math.max(cy + 1.4, cp.y);
    } else {
      const camFloor = heightAt(cp.x, cp.z) + 1.8;
      if (cp.y < camFloor) cp.y = camFloor;
    }
    this.camLook.lerp(new V3(pos.x + cs * 3, pos.y + 1, pos.z + cc * 3), Math.min(1, dt * 6));
    this.camera.lookAt(this.camLook);
    /* Riding overrides the rig rather than replacing it: the occlusion solver
       above still runs and its answer is simply thrown away, which is a few
       microseconds against not threading a second camera mode through it. */
    if (state.riding) this.rideCamera();
    else if (this.camera.up.y !== 1) this.camera.up.set(0, 1, 0);
    this.fovGoal = (KEYS.shift && spd > 10) ? 68 : 60;
    if (Math.abs(this.camera.fov - this.fovGoal) > .1) {
      this.camera.fov += (this.fovGoal - this.camera.fov) * Math.min(1, dt * 4);
      this.camera.updateProjectionMatrix();
    }

    /* hand the pool's point lights to whatever is nearest the camera now */
    this.updateLights(dt);

    /* Eight temple names all shouting at once turns the horizon into a wall of
       text, so a label only fades in once its temple is worth walking to. */
    /* the cave entrance label is a hint, not a landmark: it only shows up
       when you are nearly at it */
    for (const lb of (this.nearLabels || [])) {
      const d = lb.position.distanceTo(this.camera.position);
      const a = state.inCave ? 0 : Math.min(1, Math.max(0, (42 - d) / 14)) * Math.min(1, Math.max(0, (d - 7) / 5));
      lb.material.opacity = a;
      lb.visible = a > .02;
    }
    for (const lb of this.labels) {
      if (state.inCave) { lb.visible = false; continue; }
      const d = lb.position.distanceTo(this.camera.position);
      /* fade far away to keep the horizon clean, and fade out again up close:
         standing inside a temple you can already see where you are, and the
         sprite would otherwise fill half the screen */
      const a = Math.min(1, Math.max(0, (128 - d) / 40)) * Math.min(1, Math.max(0, (d - 13) / 12));
      lb.material.opacity = a;
      lb.visible = a > .02;
    }

    /* zone proximity + discovery */
    let nearZone = null, best = 1e9;
    const spots = state.inCave ? this.caveSpots : this.zones;
    for (const z of spots) {
      const d = Math.hypot(pos.x - z.x, pos.z - z.z);
      if (d < z.r && d < best) { best = d; nearZone = z; }
      if (z.light) z.light.intensity += (((d < z.r) ? 16 : 7) - z.light.intensity) * .08;
      if (d < z.r && !z.discovered && !z.meta.portal) {
        z.discovered = true;
        state.zonesFound++;
        updateHud();
        Snd.chime();
        toast(`${TXT().discover} ${L(z.meta.name)}`, 2200);
        this.confetti(z.x, 4, z.z, 40);
        if (state.zonesFound === 8) setTimeout(() => { toast(TXT().allZones, 4000); Snd.fanfare(); }, 2400);
      }
    }
    setNear(nearZone);
    Snd.setZone(nearZone && nearZone.meta.key ? nearZone.meta.key : (state.inCave ? "gamedev" : "default"));

    /* fish pickup */
    for (const f of (state.inCave ? [] : this.fishes)) {
      if (f.taken) continue;
      if (Math.hypot(pos.x - f.x, pos.z - f.z) < 1.9 && Math.abs(pos.y - f.mesh.position.y) < 2.4) {
        f.taken = true;
        state.fish++;
        updateHud();
        Snd.pickup(state.fish);
        this.confetti(f.x, f.mesh.position.y, f.z, 24);
        this.scene.remove(f.mesh); this.scene.remove(f.glow);
        if (state.fish === state.fishTotal) setTimeout(() => { toast(TXT().allFish, 4200); Snd.fanfare(); }, 600);
        else toast(`🐟 ${state.fish}/${state.fishTotal}`, 900);
      }
    }

    $("#speedV").textContent = Math.round(spd * 3);
    this.composer.render();
  }
}

/* ---------- keyboard reset ---------- */
addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  /* bail out of the coaster: a ride you cannot get off is a trap, not a ride */
  if (state.riding && game && (k === "escape" || k === "e")) { game.leaveCoaster(); return; }
  if (k === "r" && game) game.reset();
});

/* ---------- boot ---------- */
applyLang();
let started = false;
function startGame() {
  if (started) return;
  started = true;
  $("#intro").classList.add("hide");
  Snd.begin();
  showLegend(true, 9000);
}
$("#startBtn").addEventListener("click", startGame);
addEventListener("keydown", () => {
  if ($("#startBtn").classList.contains("show")) startGame();
});

/* Every sign and floating label is baked into a canvas whose size comes from
   measureText. Measuring before JetBrains Mono has loaded gives fallback
   metrics while the canvas ends up rasterised with the real font, which clips
   the longer temple names — so wait for the font (but never hang on it). */
async function boot() {
  try {
    await Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(r => setTimeout(r, 2500))
    ]);
  } catch { }
  try {
    game = new Game($("#scene"));
    requestAnimationFrame(game.loop);
    $("#introRing").style.display = "none";
    $("#startBtn").classList.add("show");
    window.__game = game;
    window.__snd = Snd;
    window.__arc = Arc;
    window.__cave = { caveFloorAt, caveHeadAt, caveRoomy, confineToCave, heightAt, entryProgress, CAVE_NODES, CAVE_ORIGIN };
    window.__cat = () => ({
      p: [game.catBody.position.x, game.catBody.position.y, game.catBody.position.z],
      speed: game.catBody.velocity.length(),
      near: state.near ? L(state.near.meta.name) : null,
      fish: state.fish, zones: state.zonesFound
    });
  } catch (err) {
    console.error(err);
    $("#introRing").style.display = "none";
    const el = $("#introErr");
    el.style.display = "block";
    el.textContent = TXT().err;
  }
}
boot();
setTimeout(() => {
  if (!game) {
    const el = $("#introErr");
    el.style.display = "block";
    el.textContent = TXT().err;
  }
}, 1e4);
