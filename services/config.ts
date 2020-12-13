import {
  readYaml,
  writeYaml,
} from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';
import type { Config, LogLevel,Request } from './models.ts';

config({ safe: false, export: true });
export const DEBUG = Deno.env.get('DEBUG');
export const DEBUG_EMAIL = Deno.env.get('DEBUG_EMAIL')
  ? true
  : false;

function getRequests(): Request[] {
  const output = [prompt('url?') ?? null];
  do {
    output.push(prompt('url?'));

  } while (confirm('another url?'));

  return output;
}
async function getOrCreateConfig(): Promise<Config> {
  let conf: Config;
  const confFile = `./monitor${DEBUG ? '.debug' : ''}.yaml`;
  try {
    conf = await readYaml(confFile);
  } catch (error) {
    // if (error instanceof Deno.errors.NotFound) {
    conf = {
      log_level: 'NOTSET', // DEFAULT
      run_every: 1000 * 60, // DEFAULT
      request_timeout: 1000 * 10, // DEFAULT
      requests: getRequests(),
      smtp: {
        host: prompt('smtp host?') || '${{SMTP_HOST}}',
        username:
          prompt('smtp username?') || '${{SMTP_USERNAME}}',
        password:
          prompt('smtp password?') || '${{SMTP_PASSWORD}}',
        port: prompt('smtp port?') || '${{SMTP_PORT}}',
        from: prompt('smtp from?') || '${{SMTP_FROM}}',
        to: prompt('smtp to?') || '${{SMTP_TO}}',
      },
    };

    await writeYaml('./monitor.yaml', conf);
  }

  if (!conf.requests?.length) {
    throw new Error(
      'No requests configured, add them to monitor.yaml',
    );
  }
  return conf;
}

const conf: Config = await getOrCreateConfig();

export const LOG_LEVEL: LogLevel = (() => {
  const X = conf?.log_level?.toUpperCase();
  const N = 'NOTSET';
  const D = 'DEBUG';
  const I = 'INFO';
  const W = 'WARNING';
  const E = 'ERROR';
  const C = 'CRITICAL';
  const level: LogLevel =
    X === N
      ? N
      : X === D
      ? D
      : X === I
      ? I
      : X === W
      ? W
      : X === E
      ? E
      : X === C
      ? C
      : 'NOTSET';

  return level;
})();

export const REQUESTS: any[] = conf.requests.map((req: any) =>
  typeof req === 'string' ? { method: 'GET', url: req } : req,
);

export const RUN_EVERY = conf.run_every || 1000 * 60 * 1; // 1 min
export const REQUEST_TIMEOUT = conf.request_timeout || 1000 * 10; // 10s
export const SMTP = conf.smtp;
export const PROCESS_TIMEOUT =
  1000 + REQUEST_TIMEOUT * conf.requests?.length;
export default conf;
