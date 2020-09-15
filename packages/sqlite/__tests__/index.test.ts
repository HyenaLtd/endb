import { adapterTest, apiTest, clearEach, valueTest } from '@endb/test';
import Endb from 'endb';
import EndbSqlite from '../src';

const uri = 'sqlite://test.sqlite';
const store = new EndbSqlite({
  uri,
  busyTimeout: 30000,
});

describe('@endb/sqlite', () => {
  beforeEach(() => clearEach(Endb, { store }));

  describe('API', () => {
    apiTest(test, Endb, { store });
  });

  describe('value', () => {
    valueTest(test, Endb, { store });
  });

  describe('adapter', () => {
    const badUri = 'sqlite://non/existent/database.sqlite';
    adapterTest(test, Endb, uri, badUri);
  });

  afterEach(() => clearEach(Endb, { store }));
});
