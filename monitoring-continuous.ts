import { RUN_EVERY } from "./config.ts";
import { runEvery } from "./services/helper.ts";
import { monitor } from "./monitor.ts";

runEvery(RUN_EVERY, async (index: number) => {
  await monitor();
});
