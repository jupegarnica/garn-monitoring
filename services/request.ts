import { soxa } from 'https://deno.land/x/soxa@1.4/mod.ts';
import { REQUEST_TIMEOUT } from '../config.ts';


export function request(config: any): Promise<any> {
  return new Promise((resolve, reject) => {


    const id: number = setTimeout(() => {
      reject('TIMEOUT ' + REQUEST_TIMEOUT);
    }, REQUEST_TIMEOUT);

    const req: any = soxa
      .request(
        {
          timeout: REQUEST_TIMEOUT,
          ...config
        },
      )
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(id));
    return req;
  });
}
