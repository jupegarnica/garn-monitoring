import { React } from 'https://deno.land/x/pagic/mod.ts';
import type { PagicLayout } from 'https://deno.land/x/pagic/mod.ts';


const Layout: PagicLayout = ({ title, content }) => (
  <html>
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
    </head>
    <body>
      {content}
      <p>Custom _layout.tsx</p>
    </body>
  </html>
);

export default Layout;