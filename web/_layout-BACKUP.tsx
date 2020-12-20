import { React } from 'https://deno.land/x/pagic/mod.ts';
import type { PagicLayout } from 'https://deno.land/x/pagic/mod.ts';


const Layout: PagicLayout = ({ title, content }) => (
  <html>
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"></link> */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css"></link>
    </head>
    <body>
      {content}
    </body>
  </html>
);

export default Layout;