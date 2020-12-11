import { readYaml } from "https://deno.land/x/garn_yaml@0.2.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts";
import { fetchAndCopy } from "./services/helpers.ts";
import * as colors from 'https://deno.land/std@0.79.0/fmt/colors.ts';

config({ safe: false, export: true });
let conf: any;

export const DEBUG = Deno.env.get("DEBUG");
export const DEBUG_EMAIL = Deno.env.get("DEBUG_EMAIL") ? true : false;

const confFile = `./monitor${DEBUG ? ".debug" : ""}.yaml`;
try {
  conf = await readYaml(confFile);
  if (!conf.smtp?.password) {
    throw 'no smtp';
  }
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    await fetchAndCopy(
      "https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/monitor.yaml",
      "./monitor.yaml",
    );
    await fetchAndCopy(
      "https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/.env.example",
      "./.env",
    );

  }
  console.error(colors.red("Please fill monitor.yaml"));
  Deno.exit(1);
}
if (!conf.requests?.length) {
  throw new Error("No requests configured, add them to monitor.yaml");
}

export const LOG_LEVEL = (() => {
  const selected: any = conf.log_level?.toUpperCase();
  const levels = [
    "WARNING",
    "NOTSET",
    "DEBUG",
    "INFO",
    "ERROR",
    "CRITICAL",
  ];
  return levels.includes(selected) ? selected : "DEBUG";
})();

export const REQUESTS: any[] = conf.requests.map((req: any) =>
  typeof req === "string" ? ({ method: "GET", url: req }) : req
);
export const RUN_EVERY = conf.run_every || 1000 * 60 * 1; // 1 min
export const REQUEST_TIMEOUT = conf.request_timeout || 1000 * 10; // 10s
export const SMTP = conf.smtp;
export const PROCESS_TIMEOUT = 1000 + REQUEST_TIMEOUT * conf.requests?.length;
export default conf;
