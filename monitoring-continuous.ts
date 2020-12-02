import * as config from './config.ts';
import { runEvery } from './helper.ts';
import { logger } from './logger.ts';
import { monitor } from './monitor.ts';

runEvery(config.DELAY, async (index:number) => {
  logger.info(`${index} try...`);
  await monitor();
  logger.info(`${index} try success`);
});
