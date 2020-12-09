import { format } from 'https://deno.land/std@0.79.0/datetime/mod.ts';

export function formatLogFileName(date: Date = new Date()): string {
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

export function textColor(text: string, color = 'inherit'): string {
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


 export const stringify = (val: unknown):string => {
  if (typeof val === 'string') return val;
  return Deno.inspect(val);
};


export const wait = (delay: number) =>
  new Promise((res) => setTimeout(res, delay));

export async function runEvery(
  delay: number = 1000 * 60,
  fn: Function,
  max = Infinity,
) {
  let i = 1;
  while (i < max) {
    await fn(i++);
    await wait(delay);
  }
}


export async function fetchAndCopy(url:string, path:string, options = undefined): Promise<void> {

  const fileText = await fetch(url).then(r => r.text());
  const encoder = new TextEncoder();
  const encoded = encoder.encode(fileText);
  await Deno.writeFile(path, encoded, options);
}
