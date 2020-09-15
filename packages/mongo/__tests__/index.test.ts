import { adapterTest, apiTest, clearEach, valueTest } from '@endb/test';
import Endb from 'endb';
import EndbMongo from '../src';

const { MONGO_HOST = '127.0.0.1', MONGO_PORT = 27017 } = process.env;
const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}?useUnifiedTopology=true`;
const store = new EndbMongo({ uri });

describe('@endb/mongo', () => {
  beforeEach(() => clearEach(Endb, { store }));

  describe('API', () => {
    apiTest(test, Endb, { store });
  });

  describe('value', () => {
    valueTest(test, Endb, { store });
  });

  describe('adapter', () => {
    const badUri = 'mongodb://127.0.0.1:1234';
    adapterTest(test, Endb, uri, badUri);
  });

  afterEach(() => clearEach(Endb, { store }));
});
