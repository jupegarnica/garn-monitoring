import { monitor } from './monitor.ts';

await monitor();


setTimeout(() => {
    Deno.exit(0)
}, 1000 * 120);