import { React } from 'https://deno.land/x/pagic/mod.ts';
import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';

const { requests } = await readYaml('./monitor.data.yaml');

const sites: any[] = [];
for (const id in requests) {
  const element = requests[id];
  element.id = id;
  sites.push(element);
}

const Hello = (props: any) => {
  return (
    <section className='sites'>
      {sites.map((site) => (
        <ul className='site'>
          {/* <pre className='language-json'>
            <code className='language-json'>
              {JSON.stringify(site, null, 2)}
            </code>
          </pre> */}
          {Object.keys(site).map((a: any) => (
            <li>
              <i>{a}</i> <b>{site[a]}</b>
            </li>
          ))}
          <hr/>
        </ul>
      ))}
    </section>
  );
};

export default Hello;

export const frontMatter = {
  // outputPath: '404.html',
  theme: 'dark',
};
