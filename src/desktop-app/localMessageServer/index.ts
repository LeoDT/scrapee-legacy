import * as fs from 'fs';
import * as net from 'net';

import { startRouter } from './router';
import { routes } from './routes';

const server = net.createServer({ allowHalfOpen: true }, socket => {
  const buffers: Buffer[] = [];

  socket.on('data', async data => {
    buffers.push(data);
  });

  socket.on('end', async () => {
    console.log('on end');

    const s = buffers.map(b => b.toString()).join('');
    console.log(`on data: ${s}`);

    try {
      const request = JSON.parse(s);

      if (request.type === 'request') {
        await startRouter(socket, routes, request);
      }
    } catch (e) {
      console.log(e);
    }

    socket.end();
  });

  socket.on('error', error => {
    console.error('error', error);
  });

  socket.on('close', () => {
    console.log('close');
  });
});

const socketPath = '/tmp/scrapee.sock';

if (fs.existsSync(socketPath)) {
  fs.unlinkSync(socketPath);
}

server.listen('/tmp/scrapee.sock');

export { server };
