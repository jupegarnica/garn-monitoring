import * as config from './config.ts';
import { logger } from './logger.ts';
import { get } from './request.ts';
// import { blue, green, red } from "https://deno.land/std@0.79.0/fmt/colors.ts";

export async function monitor() {
  const urls = config.URLS;
  for (const url of urls) {
    try {
      logger.debug(`${'🔻'} fetching from ${url}`);
      const now = Number(new Date());
      await get(url);
      const delay = Number(new Date()) - now;
      logger.debug(
        `${'✅'} success from ${url}, delay: ${delay} ms`,
      );
    } catch (error) {
      logger.error(`${'❌'} fail from ${url} ->  message: ${ error.message }`, error);
    }
  }
}
