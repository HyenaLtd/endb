'use strict';

const apiTest = (test, Endb, options = {}) => {
  describe('Methods', () => {
    beforeEach(async () => {
      jest.setTimeout(30000);
      const endb = new Endb(options);
      await endb.clear();
    });

    test('All methods return a Promise.', () => {
      const endb = new Endb(options);
      expect(endb.all()).toBeInstanceOf(Promise);
      expect(endb.clear()).toBeInstanceOf(Promise);
      expect(endb.delete('foo')).toBeInstanceOf(Promise);
      expect(endb.ensure('foo', 'bar')).toBeInstanceOf(Promise);
      expect(endb.entries()).toBeInstanceOf(Promise);
      expect(endb.find((v) => v === 'foo')).toBeInstanceOf(Promise);
      expect(endb.get('foo')).toBeInstanceOf(Promise);
      expect(endb.has('foo')).toBeInstanceOf(Promise);
      expect(endb.keys()).toBeInstanceOf(Promise);
      expect(endb.set('foo', 'bar')).toBeInstanceOf(Promise);
      expect(endb.values() instanceof Promise);
    });

    test('endb.set() resolves to true', async () => {
      const endb = new Endb(options);
      expect(await endb.set('foo', 'bar')).toBeTruthy();
    });

    test('endb.get() resolves to value', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.get('foo')).toBe('bar');
    });

    test('endb.get() with non-existent key resolves to undefined', async () => {
      const endb = new Endb(options);
      expect(await endb.get('foo')).toBeUndefined();
    });

    test('endb.delete() resolves to boolean', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.delete('foo')).toBeTruthy();
    });

    test('endb.clear() resolves to undefined', async () => {
      const endb = new Endb(options);
      expect(await endb.clear()).toBeUndefined();
      await endb.set('foo', 'bar');
      expect(await endb.clear()).toBeUndefined();
    });

    afterEach(async () => {
      const endb = new Endb(options);
      await endb.clear();
    });
  });
};

const adapterTest = (test, Endb, options) => {
  describe('Adapters', () => {
    test('URI automatically loads the storage adapters', async () => {
      const endb = new Endb(options);
      await endb.clear();
      expect(await endb.get('foo')).toBeUndefined();
      await endb.set('foo', 'bar');
      expect(await endb.get('foo')).toBe('bar');
      await endb.clear();
    });
  });
};

const endbTest = (test, Endb, options = {}) => {
  apiTest(test, Endb, options);
};

module.exports = { endbTest, apiTest, adapterTest };
