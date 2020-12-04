import { YamlLoader } from 'https://deno.land/x/yaml_loader@v0.1.0/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v1.0.1/mod.ts';

config({ safe: false, export: true });

const yamlLoader = new YamlLoader();
const conf: any = await yamlLoader.parseFile('./config.yaml');

if (!conf.urls?.length) {
  throw new Error("No Urls configured, add them to config.yaml");
}

export const URLS: string[] = conf.urls
export const DELAY = 1000 * 60 * 1; // 1 min
