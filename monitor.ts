import * as config from './config.ts';
import { logger } from './logger.ts';
import { get } from './request.ts';
import {
  readYaml,
  writeYaml,
} from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';

async function setHistory(url: string, delay: number) {
  const history = (await readYaml('./history.yaml')) ?? {};
  history.urls = history?.urls || {};
  const data = history.urls[url] || {};
  const allRequest = data.allRequest ? data.allRequest + 1 : 1;
  const totalDelay = (data.delay || 0) + delay;
  const newData = {
    updateAt: Date.now(),
    createdAt: data.createdAt || Date.now(),
    allRequest,
    totalDelay,
    averageDelay: totalDelay / allRequest,
    lastDelay: delay,
  };
  history.urls[url] = newData;
  await writeYaml('./history.yaml', history);
  return newData;
}

export async function monitor() {
  const urls = config.URLS;
  for (const url of urls) {
    let delay, now;
    try {
      now = Number(new Date());
      logger.info(`${'⏳'} fetching from ${url}`);
      await get(url);
      logger.info(
        `${'⭐'} success from ${url}`,
      );
    } catch (error) {
      logger.error(
        `${'❌'} fail from ${url} --  message: ${error.message}`,
        error,
      );
    } finally {
      delay = Number(new Date()) - (now ?? 0);

      await setHistory(url, delay);
    }
  }
}
