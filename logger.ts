import * as log from 'https://deno.land/std@0.79.0/log/mod.ts';
import { format } from 'https://deno.land/std@0.79.0/datetime/mod.ts';
import type { LogRecord } from 'https://deno.land/std@0.79.0/log/logger.ts';
import { LogLevels } from 'https://deno.land/std@0.79.0/log/levels.ts';
import { stringify } from './helper.ts';
import { sendEmail } from './mailer.ts';
import { DEBUG, LOG_LEVEL } from './config.ts';
import * as colors from 'https://deno.land/std@0.79.0/fmt/colors.ts';

console.clear();
function formatLogFileName(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}
function formatDate(date: Date | string): string {
  date = new Date(date);
  return format(date, 'yyyy-MM-dd HH:mm');
}
function formatLogLevel(str: string, length = 8): string {
  let response = '';
  for (let index = 0; index < length; index++) {
    response += str[index] ?? ' ';
  }
  return response;
}

function textColor(text: string, color = 'inherit'): string {
  //return text;
  return `<span style="color:${color};">${text}</span>`;
}
function textBackground(
  text: string,
  color = 'inherit',
): string {
  // return text;
  return `<span style="background:${color}">${text}</span>`;
}

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
    await sendEmail({
      subject: `garn-monitor logs`,
      content: msg,
    });
  }
}
// const consoleFormatter = (logRecord: LogRecord) => {
//   const {
//     datetime,
//     levelName,
//     msg,
//     args,
//   } = logRecord;

//   let text = `${colors.dim(formatDate(datetime))} ${colors.bold(
//     formatLogLevel(levelName),
//   )}__ARGS__${msg}`;

//   args.forEach((arg) => {
//     text += `__ARGS__${stringify(arg)}`;
//   });


//   return text;
// };

// class ConsoleHandler {
//   level: number;
//   levelName: LevelName;
//   formatter: string | FormatterFunction;

//   constructor(levelName: LevelName, options: HandlerOptions = {}) {
//     this.level = getLevelByName(levelName);
//     this.levelName = levelName;

//     this.formatter = options.formatter || DEFAULT_FORMATTER;
//   }

//   handle(logRecord: LogRecord): void {
//     if (this.level > logRecord.level) return;

//     const msg = this.format(logRecord);
//     return this.log(msg);
//   }

//   format(logRecord: LogRecord): string {
//     if (this.formatter instanceof Function) {
//       return this.formatter(logRecord);
//     }

//     return this.formatter.replace(/{(\S+)}/g, (match, p1): string => {
//       const value = logRecord[p1 as keyof LogRecord];

//       // do not interpolate missing values
//       if (value == null) {
//         return match;
//       }

//       return String(value);
//     });
//   }

//   log(_msg: string): void {}
//   async setup(): Promise<void> {}
//   async destroy(): Promise<void> {}
// }

function colorize(input:any, level:number):any {
  if ( typeof input !== 'string') return input;
  switch (level) {
    case LogLevels.DEBUG:
      return colors.dim(input);
    case LogLevels.INFO:
      return colors.green(input);
    case LogLevels.WARNING:
      return colors.yellow(input);
    case LogLevels.ERROR:
      return colors.red(input);
    case LogLevels.CRITICAL:
      return colors.bgBlack(colors.red(input));
    default:
      return input;
  }
}
export class ConsoleHandler extends log.handlers.BaseHandler {
  format(logRecord: LogRecord): any {
    let msg = `${colors.dim(
      formatDate(logRecord.datetime),
    )} ${colors.bold(formatLogLevel(logRecord.levelName))}`;

    msg = colorize(msg, logRecord.level);

    return {...logRecord, msg, args:logRecord.args}
  }

  log(logRecord: any): void {
    console.log(logRecord.msg);
    if (logRecord.args) {

      console.group();
      logRecord.args.forEach((v: any) => console.log(colorize(v, logRecord.level)));
      console.groupEnd();
    }
    console.log('\n');
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
await log.setup({
  handlers: {
    console: new ConsoleHandler('DEBUG', {
      // formatter: consoleFormatter,
    }),

    file: new log.handlers.FileHandler('DEBUG', {
      filename: `logs/${formatLogFileName()}${
        DEBUG ? '.debug' : ''
      }.log`,
      mode: 'a', // 'a', 'w', 'x'
      formatter: fileFormatter,
    }),
    email: new EmailHandler('INFO', {
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

const mainLogger = DEBUG ? 'debug' : 'default';
// const mainLogger = DEBUG ? 'email' : 'default';

export const logger = log.getLogger(mainLogger);

// logger.debug('logger.debug', logger);
logger.info(
  'logger.info',
  {
    x: 3,
    v: null,
    f: console.log,
    a: { b: { c: { d: [1, 3] } } },
  },
  3,
  undefined,
);
// logger.warning( {a:{b:{c:{d:[1,3]}}}});
// // logger.error('logger.error', new Error('ups'));
// // logger.critical('logger.critical', new Error('wow'));
