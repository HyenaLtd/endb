import Endb from 'endb';
import EndbSqlite from '../src';
import { clearEach, apiTest, adapterTest, valueTest } from '@endb/test';

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
    adapterTest(test, Endb, uri, 'sqlite://non/existent/database.sqlite');
  });

  afterEach(() => clearEach(Endb, { store }));
});
