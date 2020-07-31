import { ipcMain, IpcMainEvent } from 'electron';
import { serializeError } from 'serialize-error';
import { forAwaitEach, isAsyncIterable } from 'iterall';
import { ExecutionResult } from 'graphql';

import { SerializableGraphQLRequest } from 'core/types';
import { isASubscriptionOperation } from 'shared/utils/graphql';
import { Services } from './services';

export async function createServer(services: Services): Promise<() => void> {
  const subscriptions = new Map<
    string,
    AsyncIterableIterator<ExecutionResult>
  >();

  function endSubscribe(id: string): void {
    const sub = subscriptions.get(id);

    if (sub) {
      sub.return?.();
      subscriptions.delete(id);
    }
  }

  const listener = async (
    event: IpcMainEvent,
    id: string,
    request: SerializableGraphQLRequest
  ): Promise<void> => {
    function send(result: ExecutionResult): void {
      if (result.data) {
        event.sender.send('graphql', id, 'data', result.data);
      }

      if (result.errors) {
        event.sender.send(
          'graphql',
          id,
          'error',
          result.errors.map(serializeError)
        );
      }
    }

    if (isASubscriptionOperation(request.query)) {
      const result = await services.graphql.subscribe(request);

      if (isAsyncIterable(result)) {
        subscriptions.set(id, result);

        forAwaitEach(result, (r) => {
          send(r);
        }).catch((e: Error) => {
          event.sender.send('graphql', id, 'error', [e]);
          endSubscribe(id);
        });
      } else {
        send(result);
      }
    } else {
      const result = await services.graphql.execute(request);

      send(result);
    }
  };

  const extListener = (
    event: IpcMainEvent,
    id: string,
    request: { type: string; subId: string }
  ): void => {
    if (request.type === 'unsubscribe') {
      endSubscribe(request.subId);
      event.sender.send('graphql_extension', id, 'success', request);
    }
  };

  ipcMain.on('graphql', listener);
  ipcMain.on('graphql_extension', extListener);

  return () => {
    ipcMain.removeListener('graphql', listener);
  };
}
