import { PubSub } from 'graphql-subscriptions';

export function createPubSub(): PubSub {
  return new PubSub();
}
