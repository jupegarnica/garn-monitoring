import { logger } from './services/logger.ts';
import { monitor } from './monitor.ts';

await monitor();


setTimeout(() => {
    logger.critical('PROCESS KILL BY TIMEOUT')
    Deno.exit(0)
}, 1000 *60 * 5); // 5 MIN