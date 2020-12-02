import * as config from './config.ts';
import { asString } from './helper.ts';
import { logger } from './logger.ts';
import { sendEmail } from './mailer.ts';
import { get } from './request.ts';

export async function monitor() {
  const urls = config.URLS;
  for (const url of urls) {
    try {
      logger.debug(`get to ${url}`);
      await get(url);
      logger.debug(`get success`);
    } catch (error) {
      logger.error(error);

      await sendEmail({
        subject: `Error fetching to ${url}`,
        content: asString(error.message),
      });
    }
  }
}
