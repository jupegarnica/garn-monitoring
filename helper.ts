const wait = (delay: number) =>
  new Promise((res) => setTimeout(res, delay));

export async function runEvery(delay: number, fn: Function, max = Infinity) {
  let i = 1;
  while (i < max) {
      await fn(i++);
      await wait(delay);
  }
}


export function asString(data: unknown): string {
  if (typeof data === "string") {
    return data;
  } else if (
    data === null ||
    typeof data === "number" ||
    typeof data === "bigint" ||
    typeof data === "boolean" ||
    typeof data === "undefined" ||
    typeof data === "symbol"
  ) {
    return String(data);
  } else if (typeof data === "object") {
    return JSON.stringify(data, null, 2);
  }
  return "undefined";
}