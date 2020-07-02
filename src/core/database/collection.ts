import { omit, mapValues } from 'lodash';
import { Database } from 'better-sqlite3';

import { Node } from '../server-types';

export class Collection<TValue extends Node> {
  db: Database;
  table: string;

  constructor(db: Database, table: string) {
    this.db = db;
    this.table = table;
  }

  serialize(v: Partial<TValue>): { [P in keyof Partial<TValue>]: string | number | null } {
    return mapValues(v, (value) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return value;
      }

      if (value === null) return null;

      return JSON.stringify(value);
    });
  }

  deserialize(v: { [P in keyof TValue]: string | number | null }): TValue {
    return mapValues(v, (value) => {
      if (typeof value === 'string' && value.startsWith('{')) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }

      return value;
    });
  }

  create(v: Omit<TValue, 'id'>): TValue {
    const stmt = this.db.prepare(
      `insert into ${this.table} (${Object.keys(v)
        .map((k) => `${k}`)
        .join(',')}) values (${Object.keys(v)
        .map((k) => `@${k}`)
        .join(',')})`
    );

    const { lastInsertRowid } = stmt.run(this.serialize(v as Partial<TValue>));

    return {
      ...v,
      id: lastInsertRowid.toString(),
    } as TValue;
  }

  list(): TValue[] {
    return this.db.prepare(`select * from ${this.table};`).all();
  }

  get(id: string): TValue {
    return this.deserialize(this.db.prepare(`select * from ${this.table} where id = ?;`).get(id));
  }

  update(src: string | TValue, update: Partial<TValue>): TValue {
    const stmt = this.db.prepare(
      `update ${this.table}
      set ${Object.keys(update)
        .map((k) => `${k} = @${k}`)
        .join(',')}
      where id = @id`
    );

    const id = typeof src === 'string' ? src : src.id;

    stmt.run({
      ...omit(update, ['id']),
      id,
    });

    return this.get(id);
  }

  delete(src: string | TValue): void {
    const stmt = this.db.prepare(
      `delete from ${this.table}
      where id = ?`
    );

    const id = typeof src === 'string' ? src : src.id;

    stmt.run(id);
  }
}
