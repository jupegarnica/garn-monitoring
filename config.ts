import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts";

config({ safe: false, export:true  })

export const URLS: string[] = [
  'http://jupegarnica.com',
  'http://fail.jupegarnica.com',
  'http://valencia.io',
];

export const DELAY = 1000 * 60 * 1; // 1 min
