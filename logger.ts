import * as log from 'https://deno.land/std@0.79.0/log/mod.ts';
import { format } from 'https://deno.land/std@0.79.0/datetime/mod.ts';
import type { LogRecord } from 'https://deno.land/std@0.79.0/log/logger.ts';
import { LogLevels } from 'https://deno.land/std@0.79.0/log/levels.ts';
import { asString } from './helper.ts';
import { sendEmail } from './mailer.ts';
import * as colors from 'https://deno.land/std@0.79.0/fmt/colors.ts';

const LOG_LEVEL = (() => {
  const selected: any = Deno.env.get('LOG_LEVEL')?.toUpperCase();
  const levels = [
    'WARNING',
    'NOTSET',
    'DEBUG',
    'INFO',
    'ERROR',
    'CRITICAL',
  ];
  return levels.includes(selected) ? selected : 'INFO';
})();

function formatLogFileName(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}
function formatDate(date: Date | string): string {
  date = new Date(date);
  return format(date, 'yyyy-MM-dd HH:mm');
}
function formatLogLevel(str: string, length = 9): string {
  let response = '';
  for (let index = 0; index < length; index++) {
    response += str[index] ?? ' ';
  }
  return response;
}
function textColor(text: string, color = 'inherit'): string {
  // return text;
  return `<div style="color:${color}">${text}</div>`;
}
function textBackground(
  text: string,
  color = 'inherit',
): string {
  return text;
  return `<div style="background:${color}">${text}</div>`;
}

const consoleFormatter = ({
  datetime,
  levelName,
  msg,
  args,
}: LogRecord) => {
  let text = `${formatDate(datetime)} ${formatLogLevel(
    levelName,
  )}:  ${msg}`;

  args.forEach((arg) => {
    text += `\n${asString(arg)}`;
  });

  return text;
};

const emailFormatter = ({
  datetime,
  levelName,
  msg,
  args,
}: LogRecord) => {
  let text = textColor(
    `${formatDate(datetime)} ${formatLogLevel(
      levelName,
    )}:  ${msg}`,
    'blue',
  );

  args.forEach((arg) => {
    text += textColor(`\n${asString(arg)}`, '#555555');
  });

  return text;
};
class EmailHandler extends log.handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    let msg = super.format(logRecord);

    return msg.replaceAll('\n', '<br>');
  }

  async log(msg: string): Promise<void> {
    await sendEmail({
      subject: `garn-monitor logs`,
      content: msg,
    });
  }
}

export class ConsoleHandler extends log.handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    let msg = super.format(logRecord);

    switch (logRecord.level) {
      case LogLevels.DEBUG:
        msg = colors.dim(msg);
        break;

      case LogLevels.INFO:
        msg = colors.brightWhite(msg);
        break;
      case LogLevels.WARNING:
        msg = colors.yellow(msg);
        break;
      case LogLevels.ERROR:
        msg = colors.red(msg);
        break;
      case LogLevels.CRITICAL:
        msg = colors.bgBlack(colors.red(msg));
        break;
      default:
        break;
    }

    return msg;
  }

  log(msg: string): void {
    console.log(msg);
  }
}

await log.setup({
  handlers: {
    console: new ConsoleHandler('DEBUG', {
      formatter: consoleFormatter,
    }),

    file: new log.handlers.FileHandler('DEBUG', {
      filename: `logs/${formatLogFileName()}.log`,
      mode: 'a', // 'a', 'w', 'x'
      formatter: consoleFormatter,
    }),
    email: new EmailHandler('NOTSET', {
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

const mainLogger =
  Deno.env.get('LOG_LEVEL') === 'DEBUG' ? 'email' : 'default';

export const logger = log.getLogger(mainLogger);

logger.debug({ mainLogger, LOG_LEVEL });
logger.info({ mainLogger, LOG_LEVEL });
logger.warning({ mainLogger, LOG_LEVEL });
logger.error({ mainLogger, LOG_LEVEL });
logger.critical({ mainLogger, LOG_LEVEL });
