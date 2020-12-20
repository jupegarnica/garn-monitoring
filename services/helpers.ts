import { format ,colors} from '../deps.ts';

export function formatLogFileName(
  date: Date = new Date(),
): string {
  return format(date, 'yyyy-MM-dd');
}
export function formatDate(date: Date | string): string {
  date = new Date(date);
  return format(date, 'yyyy-MM-dd HH:mm');
}
export function formatLogLevel(str: string, length = 8): string {
  let response = '';
  for (let index = 0; index < length; index++) {
    response += str[index] ?? ' ';
  }
  return response;
}

export function textColor(
  text: string,
  color = 'inherit',
): string {
  //return text;
  return `<span style="color:${color};">${text}</span>`;
}
export function textBackground(
  text: string,
  color = 'inherit',
): string {
  // return text;
  return `<span style="background:${color}">${text}</span>`;
}

export const stringify = (val: unknown): string => {
  if (typeof val === 'string') return val;
  return Deno.inspect(val);
};

export const stringifyConsole = (val: unknown): string => {
  if (typeof val === 'string') return val;
  return Deno.inspect(val, {
    colors: true,
    depth: 10,
    compact: false,
  });
};

export async function ask(
  question = '',
  stdin = Deno.stdin,
  stdout = Deno.stdout,
) {
  const buf = new Uint8Array(1024);

  // Write question to console
  await stdout.write(
    new TextEncoder().encode(colors.blue(question)),
  );
  await stdout.write(
    new TextEncoder().encode(colors.bold(colors.green('\n -> '))),
  );

  // Read console's input into answer
  const n = <number>await stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));

  return answer.trim();
}

export const wait = (delay: number) =>
  new Promise((res) => setTimeout(res, delay));

export async function runEvery(
  // delay: number = 1000 * 60,
  fn: Function,
  max = Infinity,
) {
  let i = 1;
  while (i < max) {
    await fn();
    // await wait(delay);
    i++;
  }
}

export async function fetchAndCopy(
  url: string,
  path: string,
  options = { create: true },
): Promise<void> {
  try {
    const data = await Deno.readFile(path);
    await Deno.writeFile(path + '.backup', data);

    console.log(path, 'backup created');
  } catch (error) {
    console.log(path + ' not found', error.message);
  }
  const fileText = await fetch(url).then((r) => r.text());
  const encoder = new TextEncoder();
  const encoded = encoder.encode(fileText);
  await Deno.writeFile(path, encoded, options);
}

export function parseNumberToString(
  num: number,
  decimalLength = 1,
  decimalsChar = '.',
  milesChar = '',
) {
  if (typeof num !== 'number') return num;

  const fixed = num
    .toFixed(decimalLength)
    .replace('.', decimalsChar);

  let [intPart, decimalPart] = fixed.split(decimalsChar);
  intPart = intPart.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1' + milesChar,
  );
  return [intPart, decimalPart].join(decimalsChar);
}
