import path from 'path';
import { promises as fs } from 'fs';
import { GraphQLSchema, execute, subscribe, parse } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import { GraphQLServerContext } from './types';
import { createResolvers } from './resolvers';
import { SerializableGraphQLRequest } from '../types';

export async function loadSchema(): Promise<GraphQLSchema> {
  const defs = (
    await fs.readFile(path.resolve(__dirname, 'schema.graphql'))
  ).toString();

  return makeExecutableSchema({
    typeDefs: defs,
    resolvers: createResolvers(),
  });
}

export type GraphQLExecutorResult = ReturnType<typeof execute>;

export function graphqlExecutor(
  schema: GraphQLSchema,
  context: GraphQLServerContext,
  request: SerializableGraphQLRequest
): GraphQLExecutorResult {
  return execute({
    schema,
    contextValue: context,
    document: parse(request.query),
    variableValues: request.variables,
    operationName: request.operationName,
  });
}

export type GraphQLSubscribeExecutorResult = ReturnType<typeof subscribe>;

export function graphqlSubscribeExecutor(
  schema: GraphQLSchema,
  context: GraphQLServerContext,
  request: SerializableGraphQLRequest
): GraphQLSubscribeExecutorResult {
  return subscribe({
    schema,
    contextValue: context,
    document: parse(request.query),
    variableValues: request.variables,
    operationName: request.operationName,
  });
}
