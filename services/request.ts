import {  ky } from "../deps.ts";
import { REQUEST_TIMEOUT } from "./config.ts";
// import { Request } from './model.ts';

// type ky (req:any, options:any)=> Promise<any>
export function request(request: Request): unknown {

  const {url, ...options} = request

  return ky(url, {timeout:REQUEST_TIMEOUT || false, ...options})
}
