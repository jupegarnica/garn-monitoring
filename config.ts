import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';

import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';
import { fetchAndCopy } from './services/helper.ts';

config({ safe: false, export: true });
let conf:any;

export const DEBUG = Deno.env.get('DEBUG');
export const DEBUG_EMAIL = Deno.env.get('DEBUG_EMAIL') ? true: false;


const confFile = `./config${DEBUG ? '.debug': ''}.yaml`;
try {
  conf = await readYaml(confFile);

} catch  (error) {
  await fetchAndCopy('https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/config.debug.yaml', './config.yaml');
  await fetchAndCopy('https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/.env.example', './.env');
  throw new Error("No config.yaml. created. please fill it");
}
if (!conf.urls?.length) {
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
export const REQUEST_TIMEOUT = conf.request_timeout || 1000 * 10; // 5s
export const SMTP = conf.smtp;
export const PROCESS_TIMEOUT = 1000 + REQUEST_TIMEOUT * conf.urls?.length
export default conf;