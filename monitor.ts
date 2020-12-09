import * as config from './config.ts';
import { logger } from './services/logger.ts';
import { get } from './services/request.ts';
import {
  readYaml,
  writeYaml,
} from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';
import {
  ensureFile,
} from "https://deno.land/std@0.80.0/fs/mod.ts";

const historyFileName = './history.yaml';

async function setHistory(
  url: string,
  delay: number,
  failed = false,
) {

  await ensureFile(historyFileName);
  const history = (await readYaml(historyFileName)) ?? {};
  history.urls = history?.urls || {};
  const data = history.urls[url] || {};
  const allRequest = data.allRequest ? data.allRequest + 1 : 1;
  const allFailed = (failed ? (data.allFailed || 0) + 1 : data.allFailed || 0);
  const totalDelay = (data.totalDelay || 0) + delay;
  const downtimePercentage = allFailed / allRequest;
  const newData = {
    updateAt: Date.now(),
    createdAt: data.createdAt || Date.now(),
    allRequest,
    allFailed,
    downtimePercentage,
    totalDelay,
    averageDelay: totalDelay / allRequest,
    lastDelay: delay,
  };
  history.urls[url] = newData;
  await writeYaml(historyFileName, history);
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
      delay = Number(new Date()) - (now ?? 0);
      const stats = await setHistory(url, delay, false);

      logger.info(`${'⭐'} success from ${url}`,
      `took ${stats.lastDelay}ms`,
      `average delay ${stats.averageDelay}ms`,

      );
    } catch (error) {
      delay = Number(new Date()) - (now ?? 0);
      const stats = await setHistory(url, delay, true);

      logger.error(
        `${'❌'} fail from ${url} --  took ${ stats.lastDelay}ms`,
        `Downtime ${stats.downtimePercentage * 100 }%`,

         error,
      );

    }
  }
}
