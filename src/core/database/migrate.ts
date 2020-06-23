// modified https://github.com/kriasoft/node-sqlite/blob/master/src/utils/migrate.ts

import * as fs from 'fs';
import * as path from 'path';
import { Database } from 'better-sqlite3';

export interface MigrationFile {
  id: number;
  name: string;
  filename: string;
  up?: string;
  down?: string;
}

export async function migrate(db: Database): Promise<void> {
  const table = 'migrations';
  const migrationsPath = path.resolve(__dirname, 'migrations');

  const location = path.resolve(migrationsPath);

  // Get the list of migration files, for example:
  //   { id: 1, name: 'initial', filename: '001-initial.sql' }
  //   { id: 2, name: 'feature', filename: '002-feature.sql' }
  const migrations = await new Promise<MigrationFile[]>((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) {
        return reject(err);
      }

      resolve(
        files
          .map((x) => x.match(/^(\d+).(.*?)\.sql$/))
          .filter((x): x is RegExpMatchArray => x !== null)
          .map((x) => ({ id: Number(x[1]), name: x[2], filename: x[0] }))
          .sort((a, b) => Math.sign(a.id - b.id))
      );
    });
  });

  if (!migrations.length) {
    throw new Error(`No migration files found in '${location}'.`);
  }

  // Get the list of migrations, for example:
  //   { id: 1, name: 'initial', filename: '001-initial.sql', up: ..., down: ... }
  //   { id: 2, name: 'feature', filename: '002-feature.sql', up: ..., down: ... }
  await Promise.all(
    migrations.map(
      (migration) =>
        new Promise((resolve, reject) => {
          const filename = path.join(location, migration.filename);
          fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
              return reject(err);
            }

            const [up, down] = data.split(/^--\s+?down\b/im);
            if (!down) {
              const message = `The ${migration.filename} file does not contain '-- Down' separator.`;
              return reject(new Error(message));
            }

            /* eslint-disable no-param-reassign */
            migration.up = up.replace(/^-- .*?$/gm, '').trim(); // Remove comments
            migration.down = down.trim(); // and trim whitespaces
            /* eslint-enable no-param-reassign */
            resolve();
          });
        })
    )
  );

  // Create a database table for migrations meta data if it doesn't exist
  db.prepare(
    `CREATE TABLE IF NOT EXISTS "${table}" (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,
  up   TEXT    NOT NULL,
  down TEXT    NOT NULL
)`
  ).run();

  let dbMigrations = db.prepare(`SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`).all();

  for (const migration of dbMigrations.slice().sort((a, b) => Math.sign(b.id - a.id))) {
    if (!migrations.some((x) => x.id === migration.id)) {
      db.prepare('BEGIN').run();
      try {
        db.exec(migration.down);
        db.prepare(`DELETE FROM "${table}" WHERE id = ?`).run(migration.id);
        db.prepare('COMMIT').run();
        dbMigrations = dbMigrations.filter((x) => x.id !== migration.id);
      } catch (err) {
        db.prepare('ROLLBACK').run();
        throw err;
      }
    } else {
      break;
    }
  }

  // Apply pending migrations
  const lastMigrationId = dbMigrations.length ? dbMigrations[dbMigrations.length - 1].id : 0;
  for (const migration of migrations) {
    if (migration.id > lastMigrationId && migration.up) {
      db.prepare('BEGIN').run();
      try {
        db.exec(migration.up);
        db.prepare(`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`).run(
          migration.id,
          migration.name,
          migration.up,
          migration.down
        );
        db.prepare('COMMIT').run();
      } catch (err) {
        db.prepare('ROLLBACK').run();
        throw err;
      }
    }
  }
}
