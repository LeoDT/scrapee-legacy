import path from 'path';
import { promises as fs } from 'fs';
import { GraphQLSchema, execute, parse, ExecutionResult } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import { GraphQLServerContext } from './types';
import { createResolvers } from './resolvers';
import { SerializableGraphQLRequest } from '../types';

export async function loadSchema(): Promise<GraphQLSchema> {
  const defs = (await fs.readFile(path.resolve(__dirname, 'schema.graphql'))).toString();

  return makeExecutableSchema({
    typeDefs: defs,
    resolvers: createResolvers(),
  });
}

export async function graphqlExecutor(
  schema: GraphQLSchema,
  context: GraphQLServerContext,
  request: SerializableGraphQLRequest
): Promise<ExecutionResult> {
  return await execute({
    schema,
    contextValue: context,
    document: parse(request.query),
    variableValues: request.variables,
    operationName: request.operationName,
  });
}
