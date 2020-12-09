import * as log from 'https://deno.land/std@0.79.0/log/mod.ts';
import type { LogRecord } from 'https://deno.land/std@0.79.0/log/logger.ts';
import { LogLevels } from 'https://deno.land/std@0.79.0/log/levels.ts';
import {
  formatDate,
  formatLogFileName,
  formatLogLevel,
  stringify,
  textColor,
} from './helpers.ts';
import { addLogToQueue } from './mailer.ts';
import { DEBUG, DEBUG_EMAIL, LOG_LEVEL } from '../config.ts';
import * as colors from 'https://deno.land/std@0.79.0/fmt/colors.ts';
import { ensureDir } from 'https://deno.land/std@0.80.0/fs/mod.ts';

const emailFormatter = ({
  datetime,
  levelName,
  msg,
  args,
}: LogRecord) => {
  let text = `${formatDate(datetime)} ${formatLogLevel(
    levelName,
  )} ${msg}`;

  args.forEach((arg) => {
    text += textColor(`\n${stringify(arg)}`, '#555555');
  });

  return text;
};

class EmailHandler extends log.handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    const msg = super.format(logRecord);

    return msg.replaceAll('\n', '<br>');
  }

  async log(msg: string): Promise<void> {
    await addLogToQueue({
      subject: `garn-monitor logs`,
      content: msg,
    });
  }
}
interface CustomLogRecord {
  msg: string;
  args: unknown[];
  level: number;
}
function colorize(level: number) {
  switch (level) {
    case LogLevels.DEBUG:
      return (arg: unknown) => colors.dim(stringify(arg));
    case LogLevels.INFO:
      return (arg: unknown) => colors.green(stringify(arg));
    case LogLevels.WARNING:
      return (arg: unknown) => colors.rgb24(stringify(arg),0xffcc00);
    case LogLevels.ERROR:
      return (arg: unknown) => colors.red(stringify(arg));
    case LogLevels.CRITICAL:
      return (arg: unknown) =>
        colors.bgBlack(colors.red(stringify(arg)));
  }
  return (a: unknown) => a;
}
export class ConsoleHandler extends log.handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    const msg = `${colors.dim(
      formatDate(logRecord.datetime),
    )} ${colors.bold(formatLogLevel(logRecord.levelName))}`;

    const args = [logRecord.msg, ...logRecord.args];

    const newMsg = colorize(logRecord.level)(msg);
    const newArgs = args
      ?.map(colorize(logRecord.level))
      .map((v: unknown) => ((stringify(v))));

    console.log(newMsg);
    console.group();
    newArgs?.forEach((v: unknown) => console.log(v));
    console.groupEnd();
    console.log('\n');

    return `${msg} ${args.join('\n')}`;
  }

  log(msg: string): string {
    return msg;
  }
}
const fileFormatter = ({
  datetime,
  levelName,
  msg,
  args,
}: LogRecord) => {
  let text = `${formatDate(datetime)} ${formatLogLevel(
    levelName,
  )}  ${msg}`;
  args.forEach((arg) => {
    text += `\n${stringify(arg)}`;
  });

  return text;
};

await ensureDir('./logs');
await log.setup({
  handlers: {
    console: new ConsoleHandler('DEBUG'),

    file: new log.handlers.FileHandler('DEBUG', {
      filename: `logs/${formatLogFileName()}${
        DEBUG ? '.debug' : ''
      }.log`,
      mode: 'a', // 'a', 'w', 'x'
      formatter: fileFormatter,
    }),
    email: new EmailHandler('WARNING', {
      formatter: emailFormatter,
    }),
    email2: new EmailHandler('NOTSET'),
  },

  loggers: {
    default: {
      level: LOG_LEVEL,
      handlers: ['email', 'file', 'console'],
    },
    debug: {
      level: 'DEBUG',
      handlers: ['console', 'file'],
    },
    email: {
      level: 'DEBUG',
      handlers: ['email', 'console'],
    },
  },
});

const debugLogger = DEBUG_EMAIL ? 'email' : 'debug';
const mainLogger = DEBUG ? debugLogger : 'default';

export const logger = log.getLogger(mainLogger);

// logger.warning(
//   {
//     a: 1,
//     b: "hola",
//     c: [1, null, 'ye', undefined],
//     c2: [1, null, 'ye', undefined],
//     c3: [1, null, 'ye', undefined],
//     c5: [1, null, 'ye', undefined],
//   },
//   new Error('asd'),
//   [1,2, {a:2,b:'asd'}],
// );
