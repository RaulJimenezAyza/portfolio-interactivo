"use client";

import { useEffect } from "react";
import { SHELL_HTML } from "@/game/shell";
import "./game.css";

/* The island, running under Next.
 *
 * The world module is imported for its side effects and only after the shell
 * is in the DOM: its boot() runs at module scope and reaches for about fifty
 * element ids on the way, so importing it any earlier finds nothing and dies
 * on the first null. dangerouslySetInnerHTML commits before useEffect runs,
 * which is exactly the ordering that needs.
 *
 * A dynamic import rather than a static one for the same reason — a static
 * import hoists above everything.
 */
export default function Page() {
  useEffect(() => {
    document.body.dataset.lang = "es";
    let disposed = false;
    /* Files first, then the world. primeModels() resolves whatever is in
       public/models into memory so the scene, which is built in one
       synchronous pass, can ask for a model and get an answer immediately. */
    import("@/models/load")
      .then(m => m.primeModels())
      .then(keys => {
        if (keys.length) console.info(`[models] from the folder: ${keys.join(", ")}`);
        return import("@/game/world.js");
      })
      .catch(err => {
        if (!disposed) console.error("[world] failed to boot", err);
      });
    return () => { disposed = true; };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: SHELL_HTML }} />;
}
