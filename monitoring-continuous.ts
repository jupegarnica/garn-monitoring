import { RUN_EVERY } from "./config.ts";
import { runEvery } from "./services/helpers.ts";
import { monitor } from "./monitor.ts";

runEvery(RUN_EVERY, async (index: number) => {
  await monitor();
});
