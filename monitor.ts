import * as config from './config.ts';
import { logger } from './logger.ts';
import { get } from './request.ts';

export async function monitor() {
  const urls = config.URLS;
  for (const url of urls) {
    try {
      logger.info(`${'⏳'} fetching from ${url}`);
      const now = Number(new Date());
      await get(url);
      const delay = Number(new Date()) - now;
      logger.info(
        `${'⭐'} success from ${url} -- ⏳ ${delay} ms`,
      );
    } catch (error) {
      logger.error(`${'❌'} fail from ${url} --  message: ${ error.message }`, error);
    }
  }
}
