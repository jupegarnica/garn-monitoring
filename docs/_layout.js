const Layout = ({ title, content }) => (React.createElement("html", null,
    React.createElement("head", null,
        React.createElement("title", null, title),
        React.createElement("meta", { charSet: "utf-8" }),
        React.createElement("link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css" })),
    React.createElement("body", null, content)));
export default Layout;
