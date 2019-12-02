import * as fs from 'fs';
import * as net from 'net';

const server = net.createServer(stream => {
  stream.on('data', c => {
    console.log(`on data: ${c.toString()}`);
    stream.write(JSON.stringify({ response: 1 }));
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
