import {  ky } from "../deps.ts";
import { REQUEST_TIMEOUT } from "./config.ts";
// import { Request } from './model.ts';

// type ky (req:any, options:any)=> Promise<any>
export function request(request: Request): unknown {

  const {url, ...options} = request

  return ky(url, {timeout:REQUEST_TIMEOUT || false, ...options})
}


// export function request(config: any): Promise<any> {
//   return new Promise((resolve, reject) => {
//     const id: number = setTimeout(() => {
//       reject("TIMEOUT " + REQUEST_TIMEOUT);
//     }, REQUEST_TIMEOUT);

//     const req: any = soxa
//       .request(
//         {
//           timeout: REQUEST_TIMEOUT,
//           ...config,
//         },
//       )
//       .then(resolve)
//       .catch(reject)
//       .finally(() => clearTimeout(id));
//     return req;
//   });
// }
