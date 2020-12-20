import {
  readYaml,
  writeYaml,
  config,
  colors,
} from "../deps.ts";
import type { Config, LogLevel, Request } from "./models.ts";

config({ safe: false, export: true });
export const DEBUG = Deno.env.get("DEBUG");
export const DEBUG_EMAIL = Deno.env.get("DEBUG_EMAIL") ? true : false;

const askFor = (input: string, o = "") => {
  console.log(colors.yellow(input));
  return prompt("", o) || o;
};

function getRequests(): Request[] {
  const output = [];

  do {
    let url = askFor("url?");
    url = url?.match(/^https?:\/\//) ? url : "http://" + url;
    output.push(url);
    console.log(colors.yellow("another url?"));
  } while (confirm());

  return output;
}
async function getOrCreateConfig(): Promise<Config> {
  let conf: Config;
  const confFile = `./monitor${DEBUG ? ".debug" : ""}.yaml`;
  try {
    conf = await readYaml(confFile);
    // throw new Error("");
  } catch (error) {
    // if (error instanceof Deno.errors.NotFound) {
    conf = {
      log_level: "NOTSET", // DEFAULT
      run_every: 1000 * 60, // DEFAULT
      request_timeout: 1000 * 10, // DEFAULT
      requests: getRequests(),
      smtp: {
        host: askFor("smtp host?", "${{SMTP_HOST}}"),
        username: askFor("smtp username?", "${{SMTP_USERNAME}}"),
        password: askFor("smtp password?", "${{SMTP_PASSWORD}}"),
        port: askFor("smtp port?", "${{SMTP_PORT}}"),
        from: askFor("smtp from?", "${{SMTP_FROM}}"),
        to: askFor("smtp to?", "${{SMTP_TO}}"),
      },
    };

    await writeYaml("./monitor.yaml", conf);
  }

  if (!conf.requests?.length) {
    console.log(
      colors.red(
        "No requests configured, add them to monitor.yaml",
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
