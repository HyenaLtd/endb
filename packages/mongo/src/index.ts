import { Element, EndbAdapter } from 'endb';
import { EventEmitter } from 'events';
import { Collection, MongoClient } from 'mongodb';

export interface EndbMongoOptions {
  uri: string;
  collection: string;
}

export default class EndbMongo<TVal> extends EventEmitter
  implements EndbAdapter<TVal> {
  public namespace!: string;
  protected readonly db: Promise<Collection<Element<string>>>;
  constructor(options: Partial<EndbMongoOptions> = {}) {
    super();
    const { uri = 'mongodb://127.0.0.1:27017', collection = 'endb' } = options;
    this.db = new Promise((resolve) => {
      MongoClient.connect(uri, (error, client) => {
        if (error !== null) {
          return this.emit('error', error);
        }

        const db = client.db();
        const coll = db.collection(collection);
        db.on('error', (error) => this.emit('error', error));
        coll.createIndex(
          { key: 1 },
          {
            unique: true,
            background: true,
          }
        );
        resolve(coll);
      });
    });
  }

  public async all(): Promise<Element<string>[]> {
    const collection = await this.db;
    return collection
      .find({ key: new RegExp(`^${this.namespace}:`) })
      .toArray();
  }

  public async clear(): Promise<void> {
    const collection = await this.db;
    await collection.deleteMany({ key: new RegExp(`^${this.namespace}:`) });
  }

  public async delete(key: string): Promise<boolean> {
    const collection = await this.db;
    const { deletedCount } = await collection.deleteOne({ key });
    return deletedCount !== undefined && deletedCount > 0;
  }

  public async get(key: string): Promise<void | string> {
    const collection = await this.db;
    const doc = await collection.findOne({ key });
    return doc === null ? undefined : doc.value;
  }

  public async has(key: string): Promise<boolean> {
    const collection = await this.db;
    const doc = await collection.findOne({ key });
    return Boolean(doc);
  }

  public async set(key: string, value: string): Promise<unknown> {
    const collection = await this.db;
    return collection.replaceOne({ key }, { key, value }, { upsert: true });
  }
}
