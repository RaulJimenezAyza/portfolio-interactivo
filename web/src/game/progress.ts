/* What the intro spinner is waiting for.
 *
 * There are two waits behind that ring and they fail differently. The model
 * folder is fetched — half a megabyte over whatever connection the visitor
 * has, and on a bad one it is the slow part by a distance. Building the world
 * is local, takes about the same time on every machine, and cannot stall. A
 * single spinner over both says nothing about which one you are in, and a
 * spinner that never changes is indistinguishable from a hang.
 *
 * Two strings and a count, then. Not a percentage bar: the models arrive one
 * file at a time and the world is built in one pass, so a count is the only
 * number here that is actually true.
 */

const COPY = {
  es: { models: (d: number, t: number) => `modelos ${d}/${t}`, building: "levantando la isla…" },
  en: { models: (d: number, t: number) => `models ${d}/${t}`, building: "raising the island…" }
};

/* The page sets body.dataset.lang before anything mounts; the world's own
   i18n sweep runs at boot, which is after everything below has stopped
   having anything to say. */
const copy = () => (document.body.dataset.lang === "en" ? COPY.en : COPY.es);

function write(text: string) {
  const el = document.getElementById("introProg");
  if (el) el.textContent = text;
}

/** Progress callback shaped for primeModels(). Once every file has landed it
 *  switches to the second phase on its own, so the caller does not have to
 *  remember to. */
export function modelProgress(done: number, total: number) {
  if (total === 0 || done >= total) write(copy().building);
  else write(copy().models(done, total));
}

/** The world is up. world.js hides the ring; this clears the line under it. */
export function progressDone() {
  write("");
}
