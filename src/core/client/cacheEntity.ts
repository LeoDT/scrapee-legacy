import { observable, ObservableMap } from 'mobx';

import { CacheEntityID, CacheEntity } from './cache';

export class StatesForCacheEntities<T extends CacheEntity, TState> {
  states: ObservableMap<CacheEntityID, TState>;
  defaults: (e: T) => TState;

  constructor(defaults: (e: T) => TState) {
    this.defaults = defaults;
    this.states = observable.map();
  }

  get(e: T): TState {
    let s = this.states.get(e.id);

    if (s) return s;

    s = observable.object(this.defaults(e));

    this.states.set(e.id, s);

    return s;
  }
}
