import projectConfig from '/pagic.config.js';
import Hello from './data_content.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'master' },
    'pagePath': "data.tsx",
    'layoutPath': "_layout.tsx",
    'outputPath': "data.html",
    'title': "",
    'content': React.createElement(Hello, { config: {
            branch: 'master',
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
            include: undefined,
            outDir: 'docs',
            plugins: [
                'clean',
                'init',
                'md',
                'tsx',
                'script',
                'layout',
                'out'
            ],
            port: 8000,
            root: '/',
            serve: true,
            srcDir: 'web',
            theme: 'default',
            watch: true
        }, content: null, head: null, layoutPath: "_layout.tsx", outputPath: "data.html", pagePath: "data.tsx", script: null, title: "" }),
    'head': null,
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" }))
};
