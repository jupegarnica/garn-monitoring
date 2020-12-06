import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';

import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';

config({ safe: false, export: true });

const conf: any = await readYaml('./config.yaml');

if (!conf.urls?.length) {
  throw new Error("No Urls configured, add them to config.yaml");
}

export const URLS: string[] = conf.urls
export const RUN_EVERY = 1000 * 60 * 1; // 1 min
export const REQUEST_TIMEOUT = 1000 * 5;
export const SMTP = conf.smtp;