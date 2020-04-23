import { ipcMain, IpcMainEvent } from 'electron';
import { serializeError } from 'serialize-error';

import { SerializableGraphQLRequest } from 'core/types';
import { Services } from './services';

export async function createServer(services: Services): Promise<() => void> {
  const listener = async (
    event: IpcMainEvent,
    id: string,
    request: SerializableGraphQLRequest
  ): Promise<void> => {
    const result = await services.graphql.execute(request);

    if (result.data) {
      event.sender.send('graphql', id, 'data', result.data);
    }

    if (result.errors) {
      event.sender.send('graphql', id, 'error', result.errors.map(serializeError));
    }
  };

  ipcMain.on('graphql', listener);

  return () => {
    ipcMain.removeListener('graphql', listener);
  };
}
