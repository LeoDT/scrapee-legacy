/* eslint-disable @typescript-eslint/no-explicit-any */

import { each } from 'lodash';
import { ObservableMap, observable, action, decorate } from 'mobx';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { getActualType, isTypeImplementNode, parseValue } from 'shared/utils/graphql';
import { createContextNoNullCheck } from 'shared/utils/react';

export type CacheEntityID = string | number;

export interface CacheEntity {
  __typename: string;
  id: CacheEntityID;
}

export interface CacheReadOptions {
  filter?: <T>(d: T) => boolean;
}

export interface CacheEntityExtension<T extends CacheEntity, U> {
  name: string;
  extend: (e: T) => U;
}

export class Cache {
  data: ObservableMap<string, any>;
  extensions: Map<string, Array<CacheEntityExtension<any, any>>>;

  constructor() {
    this.data = observable.map();

    this.extensions = new Map();
  }

  identifyEntity(e: CacheEntity): string {
    return `${e.__typename}:${e.id}`;
  }

  set(e: CacheEntity | CacheEntity[]): void {
    const arr = Array.isArray(e) ? e : [e];

    arr.forEach((i) => {
      const id = this.identifyEntity(i);

      this.data.set(id, i);
    });
  }

  invalidate(e: CacheEntity): boolean {
    return this.data.delete(this.identifyEntity(e));
  }

  read<T>(__typename: string, id: CacheEntityID): T | undefined {
    return this.data.get(this.identifyEntity({ __typename, id }));
  }

  readAll<T>(__typename: string, options: CacheReadOptions = {}): T[] {
    const result: T[] = [];

    this.data.forEach((v, k) => {
      let hit = k.startsWith(__typename);

      if (options.filter) {
        hit = options.filter(v);
      }

      if (hit) {
        result.push(v);
      }
    });

    return result;
  }

  defineExtension<T extends CacheEntity, U>(
    __typename: string,
    ext: CacheEntityExtension<T, U>
  ): void {
    const exts = this.extensions.get(__typename) || [];

    if (exts.find((e) => e.name === ext.name)) {
      throw Error('can only define cache entity extension once.');
    }

    exts.push(ext);

    this.extensions.set(__typename, exts);
  }

  identifyExtension(e: CacheEntity, extName: string): string {
    return `${e.__typename}:${extName}:${e.id}`;
  }

  readExtension<T>(e: CacheEntity, extName: string): T {
    const extensionId = this.identifyExtension(e, extName);

    const ext = this.data.get(extensionId);

    return ext;
  }
}

decorate(Cache, {
  set: action,
  invalidate: action,
});

export const [useCache, CacheContext] = createContextNoNullCheck<Cache>();

export function writeCacheWithGraphQLSchema(
  cache: Cache,
  data: Record<string, any>,
  schema: GraphQLSchema
): void {
  each(data, (v, k) => {
    let field = schema.getQueryType()?.getFields()?.[k];

    if (!field) field = schema.getMutationType()?.getFields()?.[k];

    if (field) {
      const type = getActualType(field.type);

      if (type instanceof GraphQLObjectType && isTypeImplementNode(type)) {
        const value = Array.isArray(v) ? v : [v];

        cache.set(value.map((v) => parseValue(v, type)));
      }
    }
  });
}
