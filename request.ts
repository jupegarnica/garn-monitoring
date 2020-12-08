import { soxa } from 'https://deno.land/x/soxa@1.4/mod.ts';
// import { REQUEST_TIMEOUT } from './config.ts';
const REQUEST_TIMEOUT = 1000;

export async function get(url: string): Promise<any> {
  return new Promise((resolve, reject)=>{
    const id: number = setTimeout(() => {
      reject('TIMEOUT ' + REQUEST_TIMEOUT);
    }, REQUEST_TIMEOUT);

    const req: any = soxa
      .get(url, {
        timeout:REQUEST_TIMEOUT,
      })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(id));
    return req;
  })
}


try {
  console.time()
  const r = await get('http://localhost:8000/timeout');
  console.log({r});

} catch (error) {
  console.log({error});


} finally {
  console.timeEnd()

}