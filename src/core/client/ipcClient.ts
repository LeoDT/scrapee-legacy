/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniqueId, each } from 'lodash';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { buildClientSchema, GraphQLObjectType } from 'graphql';

import { createContextNoNullCheck } from 'shared/utils/react';
import { getActualType, isTypeImplementNode, parseValue } from 'shared/utils/graphql';

import { SerializableGraphQLRequest } from '../types';
import introspection from '../introspection.json';
import { Client, ClientResult, ClientFailResult } from './types';
import { Cache } from './cache';

export function createClient(): Client {
  const schema = buildClientSchema(introspection as any);

  const cache = new Cache();
  const responseListeners = new Map<
    string,
    {
      resolve: (v?: ClientResult<any> | PromiseLike<ClientResult<any>>) => void;
      reject: (v?: ClientFailResult) => void;
    }
  >();

  function send<T>(request: SerializableGraphQLRequest): Promise<ClientResult<T>> {
    return new Promise<ClientResult<T>>((resolve, reject) => {
      const id = uniqueId('graphql_request_');

      ipcRenderer.send('graphql', id, request);

      responseListeners.set(id, { resolve, reject });
    });
  }

  function writeCache(data: Record<string, any>): void {
    each(data, (v, k) => {
      let field = schema.getQueryType()?.getFields()?.[k];

      if (!field) field = schema.getMutationType()?.getFields()?.[k];

      if (field) {
        const type = getActualType(field.type);

        if (type instanceof GraphQLObjectType && isTypeImplementNode(type)) {
          const value = Array.isArray(v) ? v : [v];

          cache.set(value.map((v) => parseValue(v, type)));
        }
      }
    });
  }

  function responseListener(
    _event: IpcRendererEvent,
    id: string,
    type: 'data' | 'error',
    dataOrError: any
  ): void {
    const listener = responseListeners.get(id);

    if (listener) {
      const { resolve, reject } = listener;

      if (type === 'data') {
        writeCache(dataOrError);

        resolve({ success: true, data: dataOrError });
      }

      if (type === 'error') {
        reject({ success: false, errors: dataOrError });
      }

      responseListeners.delete(id);
    }
  }

  ipcRenderer.on('graphql', responseListener);

  return { send, cache };
}

export const [useClient, ClientContext] = createContextNoNullCheck<Client>();
