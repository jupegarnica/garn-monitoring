import { once, RUN_EVERY } from "./services/config.ts";
import { ask, runEvery, wait } from "./services/helpers.ts";
import { monitor } from "./services/monitor.ts";
import { sendInBulk } from "./services/mailer.ts";
import { flushLogs, logger } from "./services/logger.ts";

const run = async () => {
  await monitor();
  logger.debug("All requests finished");
  await sendInBulk();
};

if (once) {
  await run();
} else {
  await runEvery(async () => {
    await run();
    logger.debug(
      `Waiting until next round in ${RUN_EVERY}ms`,
      `ENTER to run request`,
    );
    flushLogs();
    await Promise.race([
      wait(RUN_EVERY),
      ask("..."),
    ]);
  });
}
