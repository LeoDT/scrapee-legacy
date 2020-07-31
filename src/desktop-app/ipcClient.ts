/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniqueId } from 'lodash';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { buildClientSchema } from 'graphql';

import { createContextNoNullCheck } from 'shared/utils/react';

import { SerializableGraphQLRequest } from 'core/types';
import introspection from 'core/introspection.json';
import { Client, ClientResult, ClientFailResult } from 'core/client/types';
import { Cache, writeCacheWithGraphQLSchema } from 'core/client/cache';

const requestIdPrefix = 'graphql_request_';
const subscriptionIdPrefix = 'graphql_subscription_';

export function createClient(): Client {
  const schema = buildClientSchema(introspection as any);

  const cache = new Cache();
  const responseListeners = new Map<
    string,
    {
      onData?: (v?: ClientResult<any> | PromiseLike<ClientResult<any>>) => void;
      onError?: (v?: ClientFailResult) => void;
    }
  >();

  function send<T>(
    request: SerializableGraphQLRequest
  ): Promise<ClientResult<T>> {
    return new Promise<ClientResult<T>>((resolve, reject) => {
      const id = uniqueId(requestIdPrefix);

      ipcRenderer.send('graphql', id, request);

      console.log('graphql ipc send', id, request);

      responseListeners.set(id, { onData: resolve, onError: reject });
    });
  }

  function subscribe<T = any>(
    request: SerializableGraphQLRequest,
    onData?: (v?: ClientResult<T> | PromiseLike<ClientResult<T>>) => void,
    onError?: (v?: ClientFailResult) => void
  ): () => void {
    const id = uniqueId(subscriptionIdPrefix);

    ipcRenderer.send('graphql', id, request);

    console.log('graphql ipc subscribe', id, request);

    responseListeners.set(id, { onData, onError });

    return () => {
      ipcRenderer.send('graphql_extension', id, {
        type: 'unsubscribe',
        subId: id,
      });

      responseListeners.delete(id);
    };
  }

  function responseListener(
    _event: IpcRendererEvent,
    id: string,
    type: 'data' | 'error',
    dataOrError: any
  ): void {
    const isSubscriptionResponse = id.startsWith(subscriptionIdPrefix);
    const listener = responseListeners.get(id);

    console.log(`graphql ipc received`, id, dataOrError);

    if (type === 'data') {
      writeCacheWithGraphQLSchema(cache, dataOrError, schema);

      listener?.onData?.({ success: true, data: dataOrError });
    }

    if (type === 'error') {
      listener?.onError?.({ success: false, errors: dataOrError });
    }

    if (!isSubscriptionResponse) {
      responseListeners.delete(id);
    }
  }

  ipcRenderer.on('graphql', responseListener);

  return { send, cache, subscribe };
}

export const [useClient, ClientContext] = createContextNoNullCheck<Client>();
