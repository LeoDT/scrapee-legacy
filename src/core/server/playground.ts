import path from 'path';
import { promises as fs } from 'fs';
import gql from 'graphql-tag';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server';

import { createResolvers } from './resolvers';
import { createStorage } from '../storage';

class ClientDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(): void {
    return;
  }
}

export async function initPlayground(): Promise<ApolloServer> {
  const defs = (await fs.readFile(path.resolve(__dirname, 'schema.graphql'))).toString();
  const clientDefs = (
    await fs.readFile(path.resolve(__dirname, 'clientSchema.graphql'))
  ).toString();
  const bucketStorage = await createStorage()();

  return new ApolloServer({
    typeDefs: gql(`directive @client on FIELD_DEFINITION
${defs}
${clientDefs}`),
    resolvers: createResolvers(),
    schemaDirectives: {
      client: ClientDirective
    },
    context: { bucketStorage }
  });
}
