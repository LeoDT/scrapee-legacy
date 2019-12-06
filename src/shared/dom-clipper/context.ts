import { createContextNoNullCheck } from 'shared/utils/react';
import { Store } from './store';

export const [useStore, StoreContext] = createContextNoNullCheck<Store>();
