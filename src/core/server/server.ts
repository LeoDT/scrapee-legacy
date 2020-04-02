import { ipcMain } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { createSchemaLink, createIpcExecutor } from 'graphql-transport-electron';

import { GraphQLServerContext } from './types';
import { createResolvers } from './resolvers';

export async function loadSchema(): Promise<GraphQLSchema> {
  const defs = (await fs.readFile(path.resolve(__dirname, 'schema.graphql'))).toString();

  return makeExecutableSchema({
    typeDefs: defs,
    resolvers: createResolvers()
  });
}

export async function createServer(context: GraphQLServerContext): Promise<() => void> {
  const schema = await loadSchema();
  const link = createSchemaLink({ schema, context: () => context });

  return createIpcExecutor({ link, ipc: ipcMain });
}
