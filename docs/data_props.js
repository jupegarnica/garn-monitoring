import projectConfig from 'pagic.config.js';
import Hello from './data_content.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'master' },
    'pagePath': "data.tsx",
    'layoutPath': "_layout.tsx",
    'outputPath': "data.html",
    'title': "",
    'content': React.createElement(Hello, { config: {
            branch: 'master',
            description: 'Use this template to create a Pagic site with the docs theme',
            exclude: [
                '**/.*',
                '**/package.json',
                '**/package-lock.json',
                '**/node_modules',
                'pagic.config.ts',
                'pagic.config.tsx',
                '**/config.gypi',
                '**/CVS',
                '**/npm-debug.log',
                'docs'
            ],
            github: 'https://github.com/jupegarnica/garn-monitoring',
            head: React.createElement(React.Fragment, null,
                React.createElement("link", { href: "/favicon.png", rel: "icon", type: "image/png" }),
                React.createElement("link", { href: "/assets/custom.css", rel: "stylesheet" }),
                React.createElement("script", { src: "/assets/custom.js" })),
            include: undefined,
            nav: [
                {
                    link: '/data.html',
                    text: 'Data'
                },
                {
                    align: 'right',
                    link: 'https://jupegarnica.com/',
                    text: 'About'
                },
                {
                    link: '/index.html',
                    text: 'Readme'
                }
            ],
            outDir: 'docs',
            plugins: [
                'clean',
                'init',
                'md',
                'tsx',
                'script',
                'layout',
                'out',
                'sidebar',
                'prev_next'
            ],
            port: 8888,
            root: '',
            serve: true,
            srcDir: 'web',
            theme: 'docs',
            title: 'Pagic template docs',
            tools: {
                backToTop: true,
                editOnGitHub: true
            },
            watch: true
        }, content: null, head: React.createElement(React.Fragment, null,
            React.createElement("link", { href: "/favicon.png", rel: "icon", type: "image/png" }),
            React.createElement("link", { href: "/assets/custom.css", rel: "stylesheet" }),
            React.createElement("script", { src: "/assets/custom.js" })), layoutPath: "_layout.tsx", outputPath: "data.html", pagePath: "data.tsx", script: null, theme: "dark", title: "" }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { href: "/favicon.png", rel: "icon", type: "image/png" }),
        React.createElement("link", { href: "/assets/custom.css", rel: "stylesheet" }),
        React.createElement("script", { src: "/assets/custom.js" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "index.js", type: "module" })),
    'theme': "dark"
};
