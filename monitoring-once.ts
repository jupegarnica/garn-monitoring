console.clear();
import { logger } from './logger.ts';
import { monitor } from './monitor.ts';

await monitor();


// setTimeout(() => {
//     logger.warning('PROCESS KILL BY TIMEOUT')
//     Deno.exit(0)
// }, 1000 * 60 * 5); // 5 MIN