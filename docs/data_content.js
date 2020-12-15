import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.js';
const read = await readYaml('./monitor.data.yaml');
const Hello = (props) => {
    return (React.createElement("pre", { className: "language-json" },
        React.createElement("code", { className: 'language-json' }, JSON.stringify(read, null, 2))));
};
export default Hello;
export const frontMatter = {
// outputPath: '404.html',
};
