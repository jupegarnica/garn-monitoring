export type Request =
  | string
  | null
  | { url: string; method?: string };
export type LogLevel =
  | 'WARNING'
  | 'NOTSET'
  | 'DEBUG'
  | 'INFO'
  | 'ERROR'
  | 'CRITICAL';
//   | undefined;
export interface Config {
  requests: Request[];
  log_level: LogLevel;
  run_every: number;
  request_timeout: number;
  smtp: {
    host: string;
    port: string;
    username: string;
    from: string;
    to: string;
    password: string;
  };
}
