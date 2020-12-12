import { parse } from 'https://deno.land/std@0.80.0/flags/mod.ts';
import { PROCESS_TIMEOUT, RUN_EVERY } from './config.ts';
import { runEvery } from './services/helpers.ts';
import { monitor } from './services/monitor.ts';
import { sendInBulk } from './services/mailer.ts';
import { logger } from './services/logger.ts';

const { once } = parse(Deno.args);

const run = async () => {
  const id = setTimeout(() => {
    logger.critical(
      'PROCESS KILL BY TIMEOUT ' + PROCESS_TIMEOUT,
    );
    Deno.exit(0);
  }, PROCESS_TIMEOUT);
  await monitor();

  logger.debug('All requests finished');
  clearTimeout(id);
  await sendInBulk();
};


if (once) {
  await run();
} else {

  await runEvery(RUN_EVERY, async () => {
    await run();
    await logger.debug(`Waiting until next round in ${RUN_EVERY}ms`);
  });
}
