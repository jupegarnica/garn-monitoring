import * as config from './config.ts';
import { asString } from './helper.ts';
import { logger } from './logger.ts';
import { sendEmail } from './mailer.ts';
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
      logger.debug(`${'❌'} fail from ${url}`);
      logger.error(`fail from ${url}`, error);

      await sendEmail({
        subject: `Error fetching to ${url}`,
        content: asString(error.message),
      });
    }
  }
}
