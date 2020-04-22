import path from 'path';
import { promises as fs } from 'fs';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import { createResolvers } from './resolvers';

export async function loadSchema(): Promise<GraphQLSchema> {
  const defs = (await fs.readFile(path.resolve(__dirname, 'schema.graphql'))).toString();

  return makeExecutableSchema({
    typeDefs: defs,
    resolvers: createResolvers(),
  });
}
