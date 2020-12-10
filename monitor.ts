import * as config from './config.ts';
import { logger } from './services/logger.ts';
import { request } from './services/request.ts';
import {
  readYaml,
  writeYaml,
} from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';
import { ensureFile } from 'https://deno.land/std@0.80.0/fs/mod.ts';
import { difference } from 'https://deno.land/std@0.80.0/datetime/mod.ts';
import { parseNumberToString } from './services/helpers.ts';

const historyFileName = './history.yaml';

async function setHistory(
  id: string,
  delay: number,
  failed = false,
) {
  id = id.replace(/\/$/,''); // remove last /
  await ensureFile(historyFileName);
  const history = (await readYaml(historyFileName)) ?? {};
  history.requests = history.requests || {};
  const data = history.requests[id] || {};
  const totalRequests = data.totalRequests
    ? data.totalRequests + 1
    : 1;
  const totalFailed = failed
    ? (data.totalFailed || 0) + 1
    : data.totalFailed || 0;
  const totalDelay = (data.totalDelay || 0) + delay;
  const downtimePercentage = totalFailed / totalRequests;
  const newData = {
    updateAt: Date.now(),
    createdAt: data.createdAt || Date.now(),
    totalRequests,
    totalFailed,
    downtimePercentage,
    totalDelay,
    averageDelay: totalDelay / totalRequests,
    lastDelay: delay,
  };
  history.requests[id] = newData;
  await writeYaml(historyFileName, history);
  const { days: daysMonitored } = difference(
    new Date(newData.updateAt),
    new Date(newData.createdAt),
  );


  return { ...newData, daysMonitored };
}

export async function monitor() {
  const requests = config.REQUESTS;
  for (const req of requests) {
    let delay, now;
    const id = `${req.method} ${req.url}`;
    try {
      logger.info(`${'⏳'} fetching`, id);
      now = Number(new Date());
      const response = await request(req);
      delay = Number(new Date()) - (now ?? 0);
      const stats = await setHistory(id, delay, false);
      logger.info(
        `${'⭐'} success`,
        id,
        `\nDowntime ${parseNumberToString(
          stats.downtimePercentage * 100,
        )}%`,
        `Delay/average ${parseNumberToString(
          stats.lastDelay,
        )}/${parseNumberToString(stats.averageDelay)}ms`,
        `Monitored during ${stats.daysMonitored} days`,
      );
    } catch (error) {
      delay = Number(new Date()) - (now ?? 0);
      const stats = await setHistory(id, delay, true);

      logger.error(
        `${'❌'} fail from`,
        id,
        `\nDowntime ${parseNumberToString(
          stats.downtimePercentage * 100,
        )}%`,
        `Delay/av.: ${parseNumberToString(
          stats.lastDelay,
        )}ms / ${parseNumberToString(stats.averageDelay)}ms`,
        `Monitored during ${stats.daysMonitored} days`,
        error,
      );
    }
  }
}
