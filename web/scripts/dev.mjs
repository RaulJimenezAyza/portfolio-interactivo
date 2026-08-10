/* Runs `next dev` in its own directory.
 *
 * next build and next dev both default to .next, so building while the dev
 * server is up leaves it serving a tree that was rebuilt underneath it — the
 * CSS links 404 and the page renders as unstyled text, which looks like a
 * broken app and is not one.
 *
 * The split is on dev rather than on build deliberately. `output: "export"`
 * puts the static site in .next-build when distDir is moved and in out/ when
 * it is not, so moving the build directory quietly relocates the thing CI
 * publishes. Production stays vanilla; the odd directory is the local one.
 *
 * Set here rather than as a NEXT_DIST_DIR= prefix in package.json because on
 * Windows npm hands that line to cmd.exe, which reads the assignment as a
 * command name.
 */
import { spawnSync } from "node:child_process";

const r = spawnSync("next", ["dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-dev" }
});
process.exit(r.status ?? 1);
