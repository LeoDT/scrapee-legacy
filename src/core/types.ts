/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SerializableGraphQLRequest<TVariables = Record<string, any>> {
  query: string;
  variables?: TVariables;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
}
