/* Runs `next build` into its own directory.
 *
 * A plain `NEXT_DIST_DIR=... next build` in package.json works on a shell and
 * not on Windows, where npm hands the line to cmd.exe and the assignment is
 * read as a command name. This wrapper sets it the same way everywhere, which
 * is worth six lines to avoid a dependency whose only job is that. */
import { spawnSync } from "node:child_process";

const r = spawnSync("next", ["build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-build" }
});
process.exit(r.status ?? 1);
