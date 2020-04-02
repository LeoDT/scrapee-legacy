require('./BabelRegister');
const { initPlayground } = require('../src/core/server/playground');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function start() {
  const server = await initPlayground();

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

start();
