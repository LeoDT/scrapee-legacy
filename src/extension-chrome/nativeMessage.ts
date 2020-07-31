import os from 'os';
import net from 'net';
import winston from 'winston';

const { stdin, stdout } = process;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: '/Users/Leodt/out.log',
      handleExceptions: true,
    }),
  ],
});

function sendToChrome(b: Buffer): void {
  const len = Buffer.alloc(4);

  if (os.endianness() === 'LE') {
    len.writeUInt32LE(b.length, 0);
  } else {
    len.writeUInt32BE(b.length, 0);
  }

  logger.info(`send to chrome: ${b.toString()}`);
  stdout.write(Buffer.concat([len, b]));
}

function sendToNative(s: string): net.Socket {
  const socket = net.connect('/tmp/scrapee.sock', () => {
    let input = Buffer.alloc(0);

    logger.info(`send to native: ${s}`);

    socket.write(s, () => {
      logger.info('send to native finished');
      socket.end();
    });

    socket.on('data', (b) => {
      input = Buffer.concat([input, Buffer.from(b)]);
    });

    socket.on('end', () => {
      logger.info('response');
      sendToChrome(input);
    });
  });

  return socket;
}

function receiveFromChrome(): void {
  let input = Buffer.alloc(0);
  let len = 0;

  logger.info('receiving');

  stdin.on('data', (b) => {
    input = Buffer.concat([input, b]);

    if (!len) {
      if (input.length >= 4) {
        logger.info(`${input[0]} ${input[1]} ${input[2]} ${input[3]}`);

        if (os.endianness() === 'LE') {
          len = input.readUInt32LE(0);
        } else {
          len = input.readUInt32BE(0);
        }
        input = input.slice(4);

        logger.info(`received length ${len}`);
      }
    }

    if (len) {
      if (input.length >= len) {
        const socket = sendToNative(input.toString());

        stdin.pause();
        input = input.slice(len);
        len = 0;

        socket.on('close', () => {
          logger.info(
            'last send to native finished, receiving new from chrome'
          );
          stdin.resume();
        });
      }
    }
  });
}

receiveFromChrome();
