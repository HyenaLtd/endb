import { EventEmitter } from 'events';
import { promisify } from 'util';
import { createClient, ClientOpts } from 'redis';
import { EndbAdapter, Element } from 'endb';

export interface EndbRedisOptions extends ClientOpts {
  uri: string;
}

interface Client {
  del: (...keys: string[]) => Promise<number>;
  get: (key: string) => Promise<string>;
  sadd: (namespace: string, key: string) => Promise<number>;
  srem: (namespace: string, key: string) => Promise<unknown>;
  smembers: (namespace: string) => Promise<string[]>;
  set: (key: string, value: string) => Promise<unknown>;
  exists: (key: string) => Promise<boolean>;
  keys: (pattern: string) => Promise<string[]>;
}

export default class EndbRedis<TVal = void> extends EventEmitter
  implements EndbAdapter<TVal> {
  public namespace!: string;
  private readonly db: Client;
  constructor(options: Partial<EndbRedisOptions> = {}) {
    super();
    if (options.uri && typeof options.url === 'undefined') {
      options.url = options.uri;
    }

    const client = createClient(options);
    const methods: (keyof Client)[] = [
      'get',
      'set',
      'sadd',
      'del',
      'exists',
      'srem',
      'keys',
      'smembers',
    ];
    this.db = methods.reduce((object, method) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn: any = client[method];
      object[method] = promisify(fn.bind(client));
      return object;
    }, {} as Client);
    client.on('error', (error) => this.emit('error', error));
  }

  public async all(): Promise<Element<string>[]> {
    const keys = await this.db.keys(`${this.namespace}*`);
    const elements = [];
    for (const key of keys) {
      const value = await this.db.get(key);
      elements.push({ key, value });
    }

    return elements;
  }

  public async clear(): Promise<void> {
    const namespace = this.prefixNamespace();
    const keys = await this.db.smembers(namespace);
    await this.db.del(...keys.concat(namespace));
  }

  public async delete(key: string): Promise<boolean> {
    const items = await this.db.del(key);
    await this.db.srem(this.prefixNamespace(), key);
    return items > 0;
  }

  public async get(key: string): Promise<void | string> {
    const value = await this.db.get(key);
    if (value === null) return undefined;
    return value;
  }

  public async has(key: string): Promise<boolean> {
    const exists = await this.db.exists(key);
    return Boolean(exists);
  }

  public async set(key: string, value: string): Promise<unknown> {
    await this.db.set(key, value);
    return this.db.sadd(this.prefixNamespace(), key);
  }

  private prefixNamespace(): string {
    return `namespace:${this.namespace}`;
  }
}
