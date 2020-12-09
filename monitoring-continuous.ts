import { RUN_EVERY } from "./config.ts";
import { runEvery } from "./services/helpers.ts";

runEvery(RUN_EVERY, async () => {
  await import('./monitoring-once.ts')
});
