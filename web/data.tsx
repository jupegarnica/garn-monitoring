import { React } from 'https://deno.land/x/pagic/mod.ts';
import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.ts';

const read = await readYaml('./monitor.data.yaml');

const Hello = (props: any) => {
  return (
    <pre className="language-json">
      <code className='language-json'>
      {JSON.stringify(read, null, 2)}
      </code>
    </pre>
  );
};

export default Hello;

export const frontMatter = {
  // outputPath: '404.html',
};
