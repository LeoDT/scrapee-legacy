import { createContextNoNullCheck } from 'shared/utils/react';
import { DOMInspector } from 'shared/dom-inspector';
import { Store } from './store';

export const [useStore, StoreContext] = createContextNoNullCheck<Store>();

export const [useDOMInspector, DOMInspectorContext] = createContextNoNullCheck<DOMInspector>();
