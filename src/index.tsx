import { Hono } from 'hono';
import type { ServerWebSocket } from 'bun';
import { serveStatic, createBunWebSocket } from 'hono/bun';

import { Page } from './client/Page';
import { PORT, IS_DEVELOPMENT } from './lib/environment';

const app = new Hono();
app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }));

const { websocket, upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

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

app.get(
  '/ws',
  upgradeWebSocket(() => {
    return {
      onOpen: () => {
        console.log('Connection opened');
      },
      onMessage(event, ws) {
        const message =
          typeof event.data === 'string'
            ? event.data
            : JSON.stringify(event.data);
        console.log(`Message from client: ${message}`);
        ws.send('Hello from server!');
      },
      onClose: () => {
        console.log('Connection closed');
      },
    };
  })
);
let serverOptions: Bun.ServeFunctionOptions<unknown, object> = {
  port: PORT,
  fetch: app.fetch,
  websocket: websocket as Bun.WebSocketHandler<unknown>,
};

if (IS_DEVELOPMENT) {
  const [key, cert] = await Promise.all([
    Bun.file(import.meta.dir + '/certificates/localhost.key').text(),
    Bun.file(import.meta.dir + '/certificates/localhost.crt').text(),
  ]);

  serverOptions = {
    ...serverOptions,
    tls: { key, cert },
  };
}

const server = Bun.serve(serverOptions);
console.log(`🚀 Server running on ${server.url.href}`);
