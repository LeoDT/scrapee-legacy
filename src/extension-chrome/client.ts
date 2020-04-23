/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildClientSchema } from 'graphql';

import { SerializableGraphQLRequest } from 'core/types';
import { Client, ClientResult } from 'core/client/types';
import { Cache, writeCacheWithGraphQLSchema } from 'core/client/cache';
import introspection from 'core/introspection.json';

export function createClient(): Client {
  const schema = buildClientSchema(introspection as any);
  const cache = new Cache();

  function send<T>(request: SerializableGraphQLRequest): Promise<ClientResult<T>> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: 'nativeRequest',
          body: request,
        },
        (res: { errors?: any[]; data?: any }) => {
          if (res) {
            if (res.data) {
              writeCacheWithGraphQLSchema(cache, res.data, schema);

              resolve({ success: true, data: res.data });
            } else if (res.errors) {
              reject({ success: false, errors: res.errors });
            }
          }
        }
      );
    });
  }

  return {
    send,
    cache,
  };
}
