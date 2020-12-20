export default {
    srcDir: 'web',
    outDir: 'docs',
    exclude: [],
    root: '',
    theme: 'docs',
    plugins: ['sidebar', 'prev_next'],
    title: 'Pagic template docs',
    description: 'Use this template to create a Pagic site with the docs theme',
    // To use jsx syntax, please rename this file to pagic.config.tsx
    head: React.createElement(React.Fragment, null,
        React.createElement("link", { rel: "icon", type: "image/png", href: "/favicon.png" }),
        React.createElement("link", { rel: "stylesheet", href: "/assets/custom.css" }),
        React.createElement("script", { src: "/assets/custom.js" })),
    nav: [
        {
            text: 'Data',
            link: '/data.html',
        },
        {
            text: 'About',
            align: 'right',
            link: 'https://jupegarnica.com/',
        },
        {
            text: 'Readme',
            link: '/index.html',
        },
    ],
    github: 'https://github.com/jupegarnica/garn-monitoring',
    // sidebar: {
    //   '/': [
    //     'introduction/README.md',
    //     {
    //       link: 'test_pages/README.md',
    //       children: [
    //         'test_pages/markdown.md',
    //         'test_pages/markdown_test.md',
    //         'test_pages/front_matter.md',
    //         'test_pages/react_hooks_test.tsx',
    //       ],
    //     },
    //     {
    //       text: 'Folder',
    //       children: [
    //         'folder/foo.md',
    //         {
    //           text: 'Custom sidebar text',
    //           link: 'folder/bar.md',
    //         },
    //       ],
    //     },
    //   ],
    // },
    tools: {
        editOnGitHub: true,
        backToTop: true,
    },
    port: 8000,
};
