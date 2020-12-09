import * as config from "./config.ts";
import { logger } from "./services/logger.ts";
import { request } from "./services/request.ts";
import {
  readYaml,
  writeYaml,
} from "https://deno.land/x/garn_yaml@0.2.1/mod.ts";
import { ensureFile } from "https://deno.land/std@0.80.0/fs/mod.ts";

const historyFileName = "./history.yaml";

async function setHistory(
  id: string,
  delay: number,
  failed = false,
) {
  await ensureFile(historyFileName);
  const history = (await readYaml(historyFileName)) ?? {};
  history.requests = history?.requests || {};
  const data = history.requests[id] || {};
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
  history.requests[id] = newData;
  await writeYaml(historyFileName, history);
  return newData;
}

export async function monitor() {
  const requests = config.REQUESTS;
  for (const req of requests) {
    let delay, now;
    const id = `${req.method} ${req.url}`;
    try {
      logger.info(`${"⏳"} fetching`, id);
      now = Number(new Date());
      const response = await request(req);
      delay = Number(new Date()) - (now ?? 0);
      const stats = await setHistory(id, delay, false);
      logger.info(
        `${"⭐"} success`,
        id,
        `Took ${stats.lastDelay}ms`,
        `Average delay ${stats.averageDelay}ms`,
        // response.data,
      );
    } catch (error) {
      delay = Number(new Date()) - (now ?? 0);
      const stats = await setHistory(id, delay, true);

      logger.error(
        `${"❌"} fail from`,
        id,
        `Downtime ${stats.downtimePercentage * 100}%`,
        `Took ${stats.lastDelay}ms`,
        error,
      );
    }
  }
}
