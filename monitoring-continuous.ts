import * as config from './config.ts';
import { runEvery } from './helper.ts';
import { monitor } from './monitor.ts';

runEvery(config.DELAY, async (index:number) => {
  await monitor();
});
