import express, { Express } from 'express';
import graphqlHTTP from 'express-graphql';

import { loadSchema } from './schema';
import { createStorage } from '../storage';

export async function initPlayground(): Promise<Express> {
  const bucketStorage = await createStorage()();
  const schema = await loadSchema();
  const app = express();

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      context: {
        bucketStorage,
      },
      graphiql: true,
    })
  );

  return app;
}
