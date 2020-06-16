import Endb from 'endb';
import EndbMongo from '../src';
import { clearEach, apiTest, adapterTest, valueTest } from '@endb/test';

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
    adapterTest(test, Endb, uri, 'mongodb://127.0.0.1:1234');
  });

  afterEach(() => clearEach(Endb, { store }));
});
