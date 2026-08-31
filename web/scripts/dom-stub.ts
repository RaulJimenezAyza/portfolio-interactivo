/* Just enough browser for world.js to be imported outside one.
 *
 * The scene wires about a dozen buttons at module scope — `$("#langBtn")
 * .addEventListener(...)` runs on the way in — so importing it in Node throws
 * before a single function is reachable. This is the smallest thing that
 * survives that: a Proxy element that answers every call with itself, and the
 * handful of globals the module touches while loading.
 *
 * Deliberately not jsdom. Nothing that uses this renders anything; the two
 * callers want the pure functions (scripts/verify.ts) and the content tables
 * (scripts/gen-cv.ts), and a real DOM implementation would be a dependency
 * bought to be ignored.
 */
export function installDomStub() {
  const el: any = new Proxy({}, {
    get(_t, k: string) {
      if (k === "classList") return { add() {}, remove() {}, contains: () => false, toggle() {} };
      if (k === "style" || k === "dataset") return {};
      if (k === "children") return [];
      if (k === "textContent" || k === "innerHTML" || k === "value" || k === "id") return "";
      return () => el;
    },
    set: () => true
  });

  const g = globalThis as any;
  g.document = {
    querySelector: () => el, querySelectorAll: () => [], getElementById: () => el,
    createElement: () => el, addEventListener() {}, documentElement: el, body: el,
    fonts: { ready: Promise.resolve() }, hidden: false
  };
  g.window = g;
  g.addEventListener = () => {};
  g.innerWidth = 1280; g.innerHeight = 720; g.devicePixelRatio = 1;
  g.matchMedia = () => ({ matches: false, addEventListener() {} });
  g.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  g.requestAnimationFrame = () => 0;
  /* The overlay focus trap sets one up at module scope. It never fires here —
     nothing mutates — so an object with the three methods is enough. */
  g.MutationObserver = class { observe() {} disconnect() {} takeRecords() { return []; } };
  /* `navigator` is a getter on the Node global and cannot be assigned to. */
  Object.defineProperty(g, "navigator", {
    value: { userAgent: "node", maxTouchPoints: 0 }, configurable: true
  });
}
