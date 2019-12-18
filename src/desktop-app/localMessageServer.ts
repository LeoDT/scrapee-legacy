import * as fs from 'fs';
import * as net from 'net';

const server = net.createServer(stream => {
  stream.on('data', buffer => {
    const s = buffer.toString();

    console.log(`on data: ${s}`);

    const request = JSON.parse(s);

    if (request.type === 'request') {
      if (request.resource === 'init') {
        stream.write(JSON.stringify({ type: 'response', requestId: request.requestId, body: {} }));
      }

      if (request.resource === 'buckets') {
        stream.write(
          JSON.stringify({
            type: 'response',
            requestId: request.requestId,
            body: {
              buckets: [
                {
                  id: '1',
                  name: '1111'
                },
                {
                  id: '2',
                  name: '2222'
                }
              ]
            }
          })
        );
      }
    } else {
      stream.write(JSON.stringify({ response: 1 }));
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
