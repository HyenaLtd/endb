import { EventEmitter } from 'events';
import { EndbAdapter, Element } from 'endb';
import { Sql } from 'sql-ts';
import { SQLDialects } from 'sql-ts/dist/configTypes';
import { TableWithColumns } from 'sql-ts/dist/table';

export interface EndbSqlOptions {
  dialect: SQLDialects;
  connect(): Promise<(sqlString: string) => Promise<unknown>>;
  table?: string;
  keySize?: number;
}

export default abstract class EndbSql<TVal = void> extends EventEmitter
  implements EndbAdapter<TVal> {
  public namespace!: string;
  public readonly dialect: SQLDialects;
  protected readonly db: TableWithColumns<Element<string>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly query: (sqlString: string) => Promise<any>;
  constructor(options: EndbSqlOptions) {
    super();
    const { table = 'endb', keySize = 255 } = options;
    const db = new Sql(options.dialect);
    this.dialect = options.dialect;
    this.db = db.define<Element<string>>({
      name: table,
      columns: [
        {
          name: 'key',
          primaryKey: true,
          dataType: `VARCHAR(${Number(keySize)})`,
        },
        {
          name: 'value',
          dataType: 'TEXT',
        },
      ],
    });
    const connected = options
      .connect()
      .then(async (query) => {
        const createTable = this.db.create().ifNotExists().toString();
        await query(createTable);
        return query;
      })
      .catch((error) => {
        this.emit('error', error);
      });
    this.query = async (sqlString: string) => {
      const query = await connected;
      if (query) return query(sqlString);
    };
  }

  public async all(): Promise<Element<string>[]> {
    const select = this.db
      .select('*')
      .where(this.db.key.like(`${this.namespace}:%`))
      .toString();
    const rows = await this.query(select);
    return rows;
  }

  async clear(): Promise<void> {
    const del = this.db
      .delete()
      .where(this.db.key.like(`${this.namespace}:%`))
      .toString();
    await this.query(del);
  }

  public async delete(key: string): Promise<boolean> {
    const select = this.db.select().where({ key }).toString();
    const del = this.db.delete().where({ key }).toString();
    const [row] = await this.query(select);
    if (row === undefined) return false;
    await this.query(del);
    return true;
  }

  public async get(key: string): Promise<void | string> {
    const select = this.db.select().where({ key }).toString();
    const [row] = await this.query(select);
    if (row === undefined) return undefined;
    return row.value;
  }

  public async has(key: string): Promise<boolean> {
    const select = this.db.select().where({ key }).toString();
    const [row] = await this.query(select);
    return Boolean(row);
  }

  public async set(key: string, value: string): Promise<unknown> {
    let upsert;
    if (this.dialect === 'mysql') {
      value = value.replace(/\\/g, '\\\\');
    }

    if (this.dialect === 'postgres') {
      upsert = this.db
        .insert({ key, value })
        .onConflict({
          columns: ['key'],
          update: ['value'],
        })
        .toString();
    } else {
      upsert = this.db.replace({ key, value }).toString();
    }

    return this.query(upsert);
  }
}
