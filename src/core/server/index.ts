import { ipcMain, IpcMainEvent } from 'electron';
import { execute, parse } from 'graphql';
import { serializeError } from 'serialize-error';

import { GraphQLServerContext } from './types';
import { loadSchema } from './schema';
import { SerializableGraphQLRequest } from '../types';

export async function createServer(context: GraphQLServerContext): Promise<() => void> {
  const schema = await loadSchema();

  const listener = async (
    event: IpcMainEvent,
    id: string,
    request: SerializableGraphQLRequest
  ): Promise<void> => {
    const result = await execute({
      schema,
      contextValue: context,
      document: parse(request.query),
      variableValues: request.variables,
      operationName: request.operationName
    });

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
