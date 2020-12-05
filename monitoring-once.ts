import { monitor } from './monitor.ts';

await monitor();


setTimeout(() => {
    Deno.exit(-1)
}, 1000 * 120);