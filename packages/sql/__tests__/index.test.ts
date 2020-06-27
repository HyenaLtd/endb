import { apiTest, clearEach, valueTest } from '@endb/test';
import Endb from 'endb';
import { Database } from 'sqlite3';
import { promisify } from 'util';
import EndbSql from '../src';

class TestSqlite<TVal> extends EndbSql<TVal> {
  constructor() {
    super({
      async connect() {
        return new Promise<Database>((resolve, reject) => {
          const db = new Database(':memory:', (error) => {
            if (error) {
              reject(error);
            } else {
              db.configure('busyTimeout', 30000);
              resolve(db);
            }
          });
        }).then((db) => promisify(db.all).bind(db));
      },
      dialect: 'sqlite',
    });
  }
}

const store = new TestSqlite();

describe('@endb/sql', () => {
  beforeEach(() => clearEach(Endb, { store }));

  describe('API', () => {
    apiTest(test, Endb, { store });
  });

  describe('value', () => {
    valueTest(test, Endb, { store });
  });

  afterEach(() => clearEach(Endb, { store }));
});
