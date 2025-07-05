import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { Page } from './client/Page';

const app = new Hono();
app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }));

app.get('/', (c) => {
  return c.html(
    <Page>
      <div className="text-3xl font-bold underline">Hello World!</div>
    </Page>
  );
});

app.get('/ping', (c) => {
  return c.text('pong');
});

export default app;
