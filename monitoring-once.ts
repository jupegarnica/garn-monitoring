import { logger } from './services/logger.ts';
import { monitor } from './monitor.ts';
import { PROCESS_TIMEOUT } from './config.ts';
import { sendInBulk } from './services/mailer.ts';

const id = setTimeout(() => {
  logger.critical('PROCESS KILL BY TIMEOUT ' + PROCESS_TIMEOUT);
  Deno.exit(0);
}, PROCESS_TIMEOUT);
await monitor();


logger.debug('monitor all urls finish');
clearTimeout(id);
await sendInBulk();
