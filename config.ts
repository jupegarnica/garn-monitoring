import { loadYaml } from 'https://deno.land/x/garn_yaml@v0.1.4/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';

config({ safe: false, export: true });

const conf: any = await loadYaml('./config.yaml');

if (!conf.urls?.length) {
  throw new Error("No Urls configured, add them to config.yaml");
}

export const URLS: string[] = conf.urls
export const DELAY = 1000 * 60 * 1; // 1 min

export const SMTP = conf.smtp