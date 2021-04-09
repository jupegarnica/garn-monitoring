import {
  readYaml,
  // existsSync,
  colors,
  parse,
  config,
  Path
} from '../deps.ts';
import type { Config, LogLevel } from './models.ts';

config({ safe: false, export: true });
export const DEBUG = Deno.env.get('DEBUG');
export const DEBUG_EMAIL = Deno.env.get('DEBUG_EMAIL')
  ? true
  : false;

const args = parse(Deno.args);

export const once = args.once;

async function getConfig(): Promise<Config> {

  if (!args.config) {
    console.log(
      colors.bold(colors.yellow(`--config flag is required.\nRun as: $ monitor --config monitor.config.yml`)),
    );
    return Deno.exit(1);

  }
  const path = new Path(Deno.cwd())
  path.push(args.config);
  const confFile = path.toString();

  if (!path.exists) {
    console.log(
      colors.bold(colors.yellow(`${confFile} not found`)),
    );

    return Deno.exit(1);
  }

  const conf: Config = await readYaml(confFile);

  if (!conf.requests?.length) {
    console.log(
      colors.red(
        'No requests configured, add them to monitor.config.yaml',
      ),
    );

   return Deno.exit(1);
  }
  return conf;
}

const conf: Config = await getConfig();

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
