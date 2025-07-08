import { Hono } from 'hono';
import { etag } from 'hono/etag';
import type { ServerWebSocket } from 'bun';
import { serveStatic, createBunWebSocket } from 'hono/bun';

import { PORT, IS_DEVELOPMENT } from './lib/environment';

const app = new Hono();
app.use(etag());
app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }));

const { websocket, upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

app.get('/', serveStatic({ path: './src/client/index.html' }));

app.get('/ping', (c) => {
  return c.text('pong');
});

type OfferMessage = {
  type: 'OFFER';
  offer: RTCSessionDescriptionInit;
};

type IceCandidateMessage = {
  type: 'ICE_CANDIDATE';
  candidate: RTCIceCandidate;
};

type Message = OfferMessage | IceCandidateMessage;

const offers: RTCSessionDescriptionInit[] = [];
const iceCandidates: RTCIceCandidate[] = [];

app.get(
  '/ws',
  upgradeWebSocket(() => {
    return {
      onOpen: () => {
        console.log('Connection opened');
      },
      onMessage(event) {
        if (typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data) as Message;
            if (data.type === 'OFFER') {
              offers.push(data.offer);
              console.log('Received offer', data.offer);
            } else {
              iceCandidates.push(data.candidate);
              console.log('Received ice candidate', data.candidate);
            }
          } catch (error) {
            console.log('Unknown message:', event.data);
          }
        }
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
