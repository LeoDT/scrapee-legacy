import * as fs from 'fs';
import * as net from 'net';

import { startRouter } from './router';
import { routes } from './routes';

const server = net.createServer(stream => {
  stream.on('data', async buffer => {
    const s = buffer.toString();
    console.log(`on data: ${s}`);

    try {
      const request = JSON.parse(s);

      if (request.type === 'request') {
        await startRouter(stream, routes, request);
      }
    } catch (e) {
      console.log(e);
    }

    stream.end();
  });

  stream.on('end', () => {
    console.log(`on end`);
  });
});

const socketPath = '/tmp/scrapee.sock';

if (fs.existsSync(socketPath)) {
  fs.unlinkSync(socketPath);
}

server.listen('/tmp/scrapee.sock');

export { server };
