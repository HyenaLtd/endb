import { adapterTest, apiTest, clearEach, valueTest } from '@endb/test';
import Endb from 'endb';
import EndbMysql from '../src';

const {
  MYSQL_HOST = 'mysql',
  MYSQL_USER = 'mysql',
  MYSQL_PASSWORD = 'endb',
  MYSQL_DATABASE = 'endb_test',
} = process.env;
const uri = `mysql://${MYSQL_USER}${
  MYSQL_PASSWORD ? `:${MYSQL_PASSWORD}` : ''
}@${MYSQL_HOST}/${MYSQL_DATABASE}`;
const store = new EndbMysql({ uri });

describe('@endb/mysql', () => {
  beforeEach(() => clearEach(Endb, { store }));

  describe('API', () => {
    apiTest(test, Endb, { store });
  });

  describe('value', () => {
    valueTest(test, Endb, { store });
  });

  describe('adapter', () => {
    const badUri = 'mysql://foo';
    adapterTest(test, Endb, uri, badUri);
  });

  afterEach(() => clearEach(Endb, { store }));
});
