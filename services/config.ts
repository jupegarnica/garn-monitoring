import {
  readYaml,
  existsSync,
  config,
  colors,
} from "../deps.ts";
import { fetchAndCopy } from "./helpers.ts";
import type { Config, LogLevel, Request } from "./models.ts";

config({ safe: false, export: true });
export const DEBUG = Deno.env.get("DEBUG");
export const DEBUG_EMAIL = Deno.env.get("DEBUG_EMAIL") ? true : false;

// const askFor = (input: string, o = "") => {
//   console.log(colors.yellow(input));
//   return prompt("", o) || o;
// };

// function getRequests(): Request[] {
//   const output = [];

//   do {
//     let url = askFor("url?");
//     url = url?.match(/^https?:\/\//) ? url : "http://" + url;
//     output.push(url);
//     console.log(colors.yellow("another url?"));
//   } while (confirm());

//   return output;
// }
async function getOrCreateConfig(): Promise<Config> {
  const confFile = `./monitor.config${DEBUG ? ".debug" : ""}.yaml`;

  if (!existsSync(confFile)) {
    await fetchAndCopy('https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/example.config.yaml',confFile);
    console.log(
     colors.bold( colors.yellow(
        `${confFile}  created. Please fill it`.toUpperCase(),
      )),
    );

    // Deno.exit(1);

  }

  const conf: Config = await readYaml(confFile);

  if (!conf.requests?.length) {
    console.log(
      colors.red(
        "No requests configured, add them to monitor.config.yaml",
      ),
    );

    Deno.exit(1);
  }
  return conf;
}

const conf: Config = await getOrCreateConfig();

export const LOG_LEVEL: LogLevel = (() => {
  const X = conf?.log_level?.toUpperCase();
  const N = "NOTSET";
  const D = "DEBUG";
  const I = "INFO";
  const W = "WARNING";
  const E = "ERROR";
  const C = "CRITICAL";
  const level: LogLevel = X === N
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
    : "NOTSET";

  return level;
})();

export const REQUESTS: any[] = conf.requests.map((req: any) =>
  typeof req === "string" ? { method: "GET", url: req } : req
);

export const RUN_EVERY = conf.run_every || 1000 * 60 * 1; // 1 min
export const REQUEST_TIMEOUT = conf.request_timeout || 1000 * 10; // 10s
export const SMTP = conf.smtp;
export const PROCESS_TIMEOUT = 1000 + REQUEST_TIMEOUT * conf.requests?.length;
export default conf;
