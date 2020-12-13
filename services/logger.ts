import {
  LogLevels,
  getLogger,
  setup,
  handlers,
} from 'https://deno.land/std@0.80.0/log/mod.ts';

import type { LogRecord } from 'https://deno.land/std@0.80.0/log/logger.ts';
import {
  formatDate,
  formatLogFileName,
  formatLogLevel,
  stringify,
  stringifyConsole,
  // textColor,
} from './helpers.ts';
import { addLogToQueue } from './mailer.ts';
import { DEBUG, DEBUG_EMAIL, LOG_LEVEL } from './config.ts';
import * as colors from 'https://deno.land/std@0.80.0/fmt/colors.ts';
import { ensureDir } from 'https://deno.land/std@0.80.0/fs/mod.ts';

const emailFormatter = ({
  datetime,
  levelName,
  args,
}: LogRecord) => {
  let text = `<div class="record ${levelName}"> <i>${formatDate(
    datetime,
  )}</i> <b>${formatLogLevel(levelName)}</b>`;

  text += '<div class="args">'
  args.forEach((arg,i) => {
    text += `<div class="arg${i}">${stringify(arg)}</div>`;
  });
  text += '</div>'

  return text + '</div><hr>';
};

class EmailHandler extends handlers.BaseHandler {
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
function colorize(level: number) {
  switch (level) {
    case LogLevels.DEBUG:
      return (arg: unknown) => colors.dim(stringify(arg));
    case LogLevels.INFO:
      return (arg: unknown) => colors.green(stringify(arg));
    case LogLevels.WARNING:
      return (arg: unknown) =>
        colors.rgb24(stringify(arg), 0xffcc00);
    case LogLevels.ERROR:
      return (arg: unknown) => colors.red(stringify(arg));
    case LogLevels.CRITICAL:
      return (arg: unknown) =>
        colors.bgBlack(colors.red(stringify(arg)));
  }
  return (a: unknown) => a;
}
export class ConsoleHandler extends handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    const msg = `${colors.dim(
      formatDate(logRecord.datetime),
    )} ${colors.bold(formatLogLevel(logRecord.levelName))}`;

    const args = [...logRecord.args];
    // console.log(logRecord);

    const newMsg = colorize(logRecord.level)(msg);
    const newArgs = args
      ?.map((v: unknown, i) =>
        i === 0
          ? colors.bold(stringifyConsole(v))
          : stringifyConsole(v),
      )
      ?.map(colorize(logRecord.level));

    console.log(newMsg);
    console.group();
    newArgs?.forEach((v: unknown) => {
      console.log(v);
    });
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
  args,
  msg,
}: LogRecord) => {
  let text = `${formatDate(datetime)} ${formatLogLevel(
    levelName,
  )}`;
  args.forEach((arg) => {
    text += `\n${stringify(arg)}`;
  });
  return text + '\n';
};

await ensureDir('./monitor-logs');
await setup({
  handlers: {
    console: new ConsoleHandler('DEBUG'),
    file: new handlers.FileHandler('INFO', {
      filename: `monitor-logs/${formatLogFileName()}${
        DEBUG ? '.debug' : ''
      }.log`,
      mode: 'a', // 'a', 'w', 'x'
      formatter: fileFormatter,
    }),
    fileRotating: new handlers.RotatingFileHandler('INFO', {
      maxBytes: 1024 * 10,
      maxBackupCount: 10,
      filename: `monitor-logs/${formatLogFileName()}${
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
      handlers: ['file', 'console', 'email'],
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

const _logger = getLogger(mainLogger);

export const logger = {
  debug: (...args: unknown[]) => _logger.debug('', ...args),
  info: (...args: unknown[]) => _logger.info('', ...args),
  warning: (...args: unknown[]) => _logger.warning('', ...args),
  error: (...args: unknown[]) => _logger.error('', ...args),
  critical: (...args: unknown[]) =>
    _logger.critical('', ...args),
};
