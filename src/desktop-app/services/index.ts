import { createStorage } from 'core/storage';
import { GraphQLServerContext } from '../../core/server/types';

export async function initServices(): Promise<GraphQLServerContext> {
  const bucketStorage = await createStorage()();

  return {
    bucketStorage
  };
}
