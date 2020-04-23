/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniqueId } from 'lodash';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { buildClientSchema } from 'graphql';

import { createContextNoNullCheck } from 'shared/utils/react';

import { SerializableGraphQLRequest } from 'core/types';
import introspection from 'core/introspection.json';
import { Client, ClientResult, ClientFailResult } from 'core/client/types';
import { Cache, writeCacheWithGraphQLSchema } from 'core/client/cache';

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
        writeCacheWithGraphQLSchema(cache, dataOrError, schema);

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
