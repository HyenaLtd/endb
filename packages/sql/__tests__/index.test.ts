import { promisify } from 'util';
import { Database } from 'sqlite3';
import Endb from 'endb';
import EndbSql from '../src';
import { clearEach, apiTest, valueTest } from '@endb/test';

class TestSqlite extends EndbSql {
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
