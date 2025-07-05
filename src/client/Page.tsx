import type { PropsWithChildren } from 'hono/jsx';

const TITLE = 'Weirdo Chat';

export const Page = (props: PropsWithChildren) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{TITLE}</title>
    </head>
    <body>{props.children}</body>
  </html>
);
