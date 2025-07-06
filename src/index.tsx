import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { Page } from './client/Page';
import { PORT, IS_DEVELOPMENT } from './lib/environment';

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

if (IS_DEVELOPMENT) {
  const [key, cert] = await Promise.all([
    Bun.file(import.meta.dir + '/certificates/localhost.key').text(),
    Bun.file(import.meta.dir + '/certificates/localhost.crt').text(),
  ]);

  Bun.serve({ port: PORT, fetch: app.fetch, tls: { key, cert } });
  console.log(`🚀 Development server running on https://localhost:${PORT}`);
}
