import * as fs from 'fs';
import * as net from 'net';
import { Services } from './services';
import { serializeError } from 'serialize-error';

export function createLocalMessageServer(services: Services): net.Server {
  const server = net.createServer({ allowHalfOpen: true }, (socket) => {
    const buffers: Buffer[] = [];

    socket.on('data', async (data) => {
      buffers.push(data);
    });

    socket.on('end', async () => {
      console.log('on end');

      const s = buffers.map((b) => b.toString()).join('');
      console.log(`on data: ${s}`);

      try {
        const request = JSON.parse(s);

        if (request.type === 'graphql') {
          const result = await services.graphql.execute(request.body);

          if (result.data) {
            const res = JSON.stringify({
              type: 'response',
              requestId: request.requestId,
              body: { data: result.data },
            });
            socket.write(res);

            console.log(`on send: ${res}`);
          }

          if (result.errors) {
            socket.write(
              JSON.stringify({
                type: 'response',
                requestId: request.requestId,
                body: {
                  errors: result.errors.map(serializeError),
                },
              })
            );
          }
        }
      } catch (e) {
        console.log(e);
      }

      socket.end();
    });

    socket.on('error', (error) => {
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

  server.listen(socketPath);

  return server;
}
