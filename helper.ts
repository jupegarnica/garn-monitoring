
const addStripMark = (str:string):string => `__strip__${str}__strip__`;

const parser:any = (() => {
  const seen = new WeakMap();
  return (key: string, value: any):any => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        const oldKey = seen.get(value);
        return `[circular reference] -> ${oldKey || "rootObject"}`;
      }
      seen.set(value, key);
    }
    if (value && value.displayName) {
      return addStripMark(value.displayName);
    }
    if (Number.isNaN(value)) {
      return addStripMark(value);
    }
    if (value === Infinity || value === -Infinity) {
      return addStripMark(value);
    }

    if (typeof value === "bigint") {
      return addStripMark(Number(value) + "n");
    }

    if (typeof value === "function") {
      return addStripMark(value.name || value.toString());
    }
    if (typeof value === "string") {
      return addStripMark(value);
    }


    return value;
  };
});
 export const stringify = (val: any):string => {
  const str:string = JSON.stringify(val, parser(), 2);
  return str && str.replace(/("__strip__)|(__strip__")/g, "");
};

export function asString(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  } else if (
    data === null ||
    typeof data === 'number' ||
    typeof data === 'bigint' ||
    typeof data === 'boolean' ||
    typeof data === 'undefined' ||
    typeof data === 'symbol'
  ) {
    return String(data);
  } else if (typeof data === 'object') {
    return JSON.stringify(data, null, 2);
  }
  return 'undefined';
}

export const wait = (delay: number) =>
  new Promise((res) => setTimeout(res, delay));

export async function runEvery(
  delay: number,
  fn: Function,
  max = Infinity,
) {
  let i = 1;
  while (i < max) {
    await fn(i++);
    await wait(delay);
  }
}


export const debounce = (fn:Function, delay = 0) => {
  let id: number;
  return (...args: any[]) => {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout((...a) => fn(...a), delay, ...args);
    return id;
  };
};
