import { adapterTest, apiTest, clearEach, valueTest } from '@endb/test';
import Endb from 'endb';
import EndbPostgres from '../src';

const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'endb',
  POSTGRES_DB = 'endb_test',
  POSTGRES_PORT = 5432,
} = process.env;
const uri = `postgresql://${POSTGRES_USER}${
  POSTGRES_PASSWORD ? `:${POSTGRES_PASSWORD}` : ''
}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
const store = new EndbPostgres({ uri });

describe('@endb/postgres', () => {
  beforeEach(() => clearEach(Endb, { store }));

  describe('API', () => {
    apiTest(test, Endb, { store });
  });

  describe('value', () => {
    valueTest(test, Endb, { store });
  });

  describe('adapter', () => {
    adapterTest(test, Endb, uri, 'postgresql://foo');
  });

  afterEach(() => clearEach(Endb, { store }));
});
