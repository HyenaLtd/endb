import EndbSql from '@endb/sql';
import { EndbAdapter } from 'endb';
import { Database } from 'sqlite3';
import { promisify } from 'util';

export interface EndbSqliteOptions {
  uri: string;
  table: string;
  keySize: number;
  busyTimeout: number;
}

export default class EndbSqlite<TVal> extends EndbSql<TVal>
  implements EndbAdapter<TVal> {
  public namespace!: string;
  constructor(options: Partial<EndbSqliteOptions> = {}) {
    const { uri = 'sqlite://:memory:' } = options;
    super({
      dialect: 'sqlite',
      async connect() {
        return new Promise((resolve, reject) => {
          const path = uri.replace(/^sqlite:\/\//, '');
          const db = new Database(path, (error) => {
            if (error) {
              reject(error);
            } else {
              if (options.busyTimeout) {
                db.configure('busyTimeout', options.busyTimeout);
              }

              resolve(promisify(db.all.bind(db)));
            }
          });
        });
      },
      ...options,
    });
  }
}
