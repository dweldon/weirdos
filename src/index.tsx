import { Hono } from 'hono';
import { Page } from './client/Page';

const app = new Hono();

app.get('/', (c) => {
  return c.html(
    <Page>
      <div>Hello World!</div>
    </Page>
  );
});

app.get('/ping', (c) => {
  return c.text('pong');
});

export default app;
