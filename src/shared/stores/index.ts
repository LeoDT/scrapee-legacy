import { createContextNoNullCheck } from '../utils/react';

import UI from './ui';

interface CommonStores {
  ui: UI;
}

export function createCommonStores(): CommonStores {
  return {
    ui: new UI()
  };
}

export const [useCommonStores, CommonStoresContext] = createContextNoNullCheck<CommonStores>();
