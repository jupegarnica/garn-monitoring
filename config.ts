import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';

import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';
import { copy } from "https://deno.land/std@0.80.0/fs/mod.ts";
// import { parse } from "https://deno.land/std@0.80.0/flags/mod.ts";

// console.dir(parse(Deno.args));
// Deno.exit(0)
config({ safe: false, export: true });
let conf:any;

export const DEBUG = Deno.env.get('DEBUG');


const confFile = `./config${DEBUG ? '.debug': ''}.yaml`;
try {
  conf = await readYaml(confFile);

} catch  (error) {
  await copy('https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/config.debug.yaml', './config.yaml', { overwrite: false });
  await copy('https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/.env.example', './.env', { overwrite: false });
  throw new Error("No config.yaml. created. please fill it");
}
if (!conf.urls?.lengt) {
  throw new Error("No Urls configured, add them to config.yaml");
}

export const LOG_LEVEL = (() => {
  const selected: any =  conf.log_level?.toUpperCase();
  const levels = [
    'WARNING',
    'NOTSET',
    'DEBUG',
    'INFO',
    'ERROR',
    'CRITICAL',
  ];
  return levels.includes(selected) ? selected : 'DEBUG';
})();

export const URLS: string[] = conf.urls
export const RUN_EVERY = conf.run_every || 1000 * 60 * 1; // 1 min
export const REQUEST_TIMEOUT = conf.run_every || 1000 * 10; // 5s
export const SMTP = conf.smtp;
export const PROCESS_TIMEOUT = 1000 + REQUEST_TIMEOUT * conf.urls?.length
export const BULK_WAIT = PROCESS_TIMEOUT - 500;
export default conf;