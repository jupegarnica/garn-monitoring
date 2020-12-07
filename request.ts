import { soxa } from 'https://deno.land/x/soxa@1.4/mod.ts';
import { CancelToken } from 'https://deno.land/x/soxa@1.4/src/cancel/CancelToken.ts';
import { REQUEST_TIMEOUT } from './config.ts';

export async function get(url: string): Promise<any> {
  let cancel: Function;
  const id: number = setTimeout(() => {
    cancel('TIMEOUT ' + REQUEST_TIMEOUT);
  }, REQUEST_TIMEOUT);

  const response: any = await soxa
    .get(url, {
      timeout:REQUEST_TIMEOUT,
      cancelToken: new CancelToken(
        (c: Function) => (cancel = c),
      ),
    })
    .finally(() => clearTimeout(id));
  return response;
}
