import BJSON from 'buffer-json';
import { EventEmitter } from 'events';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _set from 'lodash/set';
import _unset from 'lodash/unset';

const adapters = {
  mongo: '@endb/mongo',
  mongodb: '@endb/mongo',
  mysql: '@endb/mysql',
  postgres: '@endb/postgres',
  postgresql: '@endb/postgres',
  redis: '@endb/redis',
  sqlite: '@endb/sqlite',
};

const load = <TVal>(
  options: Partial<Endb.EndbOptions<TVal>>
): Endb.EndbAdapter<TVal> => {
  const validAdapters = Object.keys(adapters);
  let adapter: undefined | keyof typeof adapters;
  if (options.adapter) {
    adapter = options.adapter;
  } else if (options.uri) {
    const matches = /^[^:]+/.exec(options.uri);
    if (matches === null) {
      throw new Error(`[endb]: could not infer adapter from "${options.uri}"`);
    }

    adapter = matches[0] as keyof typeof adapters;
  }

  if (!adapter) {
    return new Map() as Map<string, string> & { namespace: string };
  }

  if (validAdapters.includes(adapter)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Adapter = require(adapters[adapter]).default;
    return new Adapter(options);
  }

  throw new Error(`[endb]: invalid adapter "${adapter}"`);
};

class Endb<TVal> extends EventEmitter {
  protected readonly options: Endb.EndbOptions<TVal>;
  constructor(options: string | Partial<Endb.EndbOptions<TVal>> = {}) {
    super();
    const adapterOptions = {
      namespace: 'endb',
      serialize: BJSON.stringify,
      deserialize: BJSON.parse,
      ...(typeof options === 'string' ? { uri: options } : options),
    };

    this.options = {
      ...adapterOptions,
      store: adapterOptions.store || load(adapterOptions),
    };

    if (typeof this.options.store.on === 'function') {
      this.options.store.on('error', (error) => this.emit('error', error));
    }

    this.options.store.namespace = this.options.namespace;
  }

  public async all(): Promise<Endb.Element<TVal>[]> {
    const { store, deserialize } = this.options;
    const elements = [];
    if (store instanceof Map) {
      for (const [key, value] of store.entries()) {
        elements.push({
          key: this.removeKeyPrefix(key),
          value: typeof value === 'string' ? deserialize(value) : value,
        });
      }

      return elements;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = await store.all!();
    for (const { key, value } of data) {
      elements.push({
        key: this.removeKeyPrefix(key),
        value: typeof value === 'string' ? deserialize(value) : value,
      });
    }

    return elements;
  }

  public async clear(): Promise<void> {
    return this.options.store.clear();
  }

  public async delete(key: string, path?: string): Promise<boolean> {
    if (typeof path !== 'undefined') {
      const data = (await this.get(key)) || {};
      _unset(data, path);
      const result = await this.set(key, data);
      return result;
    }

    const keyPrefixed = this.addKeyPrefix(key);
    return this.options.store.delete(keyPrefixed);
  }

  public async entries(): Promise<[string, TVal][]> {
    const elements = await this.all();
    return elements.map((element) => [element.key, element.value]);
  }

  public async get(key: string, path?: string): Promise<void | any> {
    const keyPrefixed = this.addKeyPrefix(key);
    const { store, deserialize } = this.options;
    const serialized = await store.get(keyPrefixed);
    const deserialized =
      typeof serialized === 'string' ? deserialize(serialized) : serialized;
    if (deserialized === undefined) return undefined;
    if (typeof path !== 'undefined') return _get(deserialized, path);
    return deserialized;
  }

  public async has(key: string, path?: string): Promise<boolean> {
    if (typeof path !== 'undefined') {
      const data = (await this.get(key)) || {};
      return _has(data, path);
    }

    const { store } = this.options;
    const keyPrefixed = this.addKeyPrefix(key);
    const exists = await store.has(keyPrefixed);
    return exists;
  }

  public async keys(): Promise<string[]> {
    const elements = await this.all();
    return elements.map((element) => element.key);
  }

  public async set(key: string, value: any, path?: string): Promise<boolean> {
    const { store, serialize } = this.options;
    if (typeof path !== 'undefined') {
      const data = (await this.get(key)) || {};
      value = _set(data, path, value);
    }

    const keyPrefixed = this.addKeyPrefix(key);
    const serialized = serialize(value);
    await store.set(keyPrefixed, serialized);
    return true;
  }

  public async values(): Promise<TVal[]> {
    const elements = await this.all();
    return elements.map((element) => element.value);
  }

  private addKeyPrefix(key: string) {
    return `${this.options.namespace}:${key}`;
  }

  private removeKeyPrefix(key: string) {
    return key.replace(`${this.options.namespace}:`, '');
  }
}

namespace Endb {
  type MaybePromise<T> = T | Promise<T>;

  export interface EndbOptions<TVal, TSerialized = string> {
    namespace: string;
    store: EndbAdapter<TVal, TSerialized>;
    uri?: string;
    adapter?: keyof typeof adapters;
    serialize(data: TVal): TSerialized;
    deserialize(data: TSerialized): TVal;
  }

  export interface EndbAdapter<TVal, TSerialized = string> {
    namespace: string;
    on?(event: 'error', callback: (error: Error) => void | never): void;
    all?(): MaybePromise<Element<TSerialized>[]>;
    clear(): MaybePromise<void>;
    delete(key: string): MaybePromise<boolean>;
    get(key: string): MaybePromise<void | TVal | TSerialized>;
    has(key: string): MaybePromise<boolean>;
    set(key: string, value: TSerialized): MaybePromise<unknown>;
  }

  export interface Element<T> {
    key: string;
    value: T;
  }
}

export = Endb;
