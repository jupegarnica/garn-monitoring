// import { soxa } from 'https://deno.land/x/soxa@1.4/mod.ts';
// import { CancelToken } from 'https://deno.land/x/soxa@1.4/src/cancel/CancelToken.ts';
// import { REQUEST_TIMEOUT } from './config.ts';
// // const REQUEST_TIMEOUT = 1000;

// export async function get(url: string): Promise<any> {
//   let cancel: Function;
//   const id: number = setTimeout(() => {
//     cancel('TIMEOUT ' + REQUEST_TIMEOUT);
//     console.log('cancel');

//   }, REQUEST_TIMEOUT);

//   const response: any = await soxa
//     .get(url, {
//       timeout:REQUEST_TIMEOUT,
//       cancelToken: new CancelToken(
//         (c: Function) => (cancel = c),
//       ),
//     })
//     .finally(() => clearTimeout(id));
//   return response;
// }


// @ts-ignore
function validateStatus(res) {
  if (res.status >= 200 && res.status < 300) return res;
  throw res;
}

// @ts-ignore
async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => {
    console.log('abort');
    controller.abort();

  }, timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  })
  ;
  clearTimeout(id);


  return validateStatus(response);
}


try {
  console.time()
  const r = await fetchWithTimeout('http://localhost:8000/timeout', {
    timeout: 500
  });
  console.log({r});

} catch (error) {
  console.log({error});


} finally {
  console.timeEnd()

}