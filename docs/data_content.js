import { readYaml } from 'https://deno.land/x/garn_yaml@0.2.1/mod.js';
const { requests } = await readYaml('./monitor.data.yaml');
const sites = [];
for (const id in requests) {
    const element = requests[id];
    element.id = id;
    sites.push(element);
}
const Hello = (props) => {
    return (React.createElement("section", { className: 'sites' }, sites.map((site) => (React.createElement("ul", { className: 'site' },
        Object.keys(site).map((a) => (React.createElement("li", null,
            React.createElement("i", null, a),
            " ",
            React.createElement("b", null, site[a])))),
        React.createElement("hr", null))))));
};
export default Hello;
export const frontMatter = {
    // outputPath: '404.html',
    theme: 'dark',
};
