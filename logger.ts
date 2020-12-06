import * as log from 'https://deno.land/std@0.79.0/log/mod.ts';
import { format } from 'https://deno.land/std@0.79.0/datetime/mod.ts';
import type { LogRecord } from 'https://deno.land/std@0.79.0/log/logger.ts';
import { asString } from './helper.ts';
import { sendEmail } from './mailer.ts';

export class EmailHandler extends log.handlers.BaseHandler {
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

const defaultFormatter = ({
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

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('DEBUG', {
      formatter: defaultFormatter,
    }),

    file: new log.handlers.FileHandler('DEBUG', {
      filename: `logs/${formatLogFileName()}.log`,
      mode: 'a', // 'a', 'w', 'x'
      formatter: defaultFormatter,
    }),
    email: new EmailHandler('NOTSET', {
      formatter: defaultFormatter,
    }),
    email2: new EmailHandler('NOTSET'),
  },

  loggers: {
    default: {
      level: 'WARNING',
      handlers: ['email', 'file', 'console'],
    },
    debug: {
      level: 'DEBUG',
      handlers: ['console', 'file'],
    },
    email: {
      level: 'DEBUG',
      handlers: ['email2'],
    },
  },
});

const mainLogger = Deno.env.get('DEBUG') ? 'debug' : 'default';
export const logger = log.getLogger(mainLogger);

// logger.debug('Hello world');
// logger.info(123456);
// logger.warning([true, 12, 12.12], {a:2}, [3]);
// logger.error({ foo: 'bar', fizz: 'bazz' });
// logger.critical(new Error('500 Internal server error'));
