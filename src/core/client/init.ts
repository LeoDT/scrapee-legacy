import { InMemoryCache } from 'apollo-cache-inmemory';

import { initState as initLibraryState } from './library';

export function initState(cache: InMemoryCache): void {
  initLibraryState(cache);
}
