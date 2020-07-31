/* eslint-disable @typescript-eslint/no-explicit-any */

import { SerializableGraphQLRequest } from '../types';
import { Cache } from './cache';

export interface ClientSuccessResult<T> {
  success: true;
  data: T;
}

export interface ClientFailResult {
  success: false;
  errors: Error[];
}

export type ClientResult<T> = ClientSuccessResult<T> | ClientFailResult;

export interface Client {
  send: <TResponse = any, TVariables = Record<string, any>>(
    r: SerializableGraphQLRequest<TVariables>
  ) => Promise<ClientResult<TResponse>>;
  subscribe: <TResponse = any, TVariables = Record<string, any>>(
    r: SerializableGraphQLRequest<TVariables>,
    onData?: (
      v?: ClientResult<TResponse> | PromiseLike<ClientResult<TResponse>>
    ) => void,
    onError?: (v?: ClientFailResult) => void
  ) => () => void;
  cache: Cache;
}

export interface GraphQLClientContext {
  client: Client;
}
