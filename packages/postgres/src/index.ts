import EndbSql from '@endb/sql';
import { EndbAdapter } from 'endb';
import { Pool } from 'pg';

export interface EndbPostgresOptions {
  uri: string;
}

export default class EndbPostgres<TVal> extends EndbSql
  implements EndbAdapter<TVal> {
  public namespace!: string;
  constructor(options: Partial<EndbPostgresOptions> = {}) {
    const { uri = 'postgresql://localhost:5432' } = options;
    super({
      dialect: 'postgres',
      async connect() {
        const pool = new Pool({ connectionString: uri });
        return Promise.resolve(async (sqlString: string) => {
          const { rows } = await pool.query(sqlString);
          return rows;
        });
      },
      ...options,
    });
  }
}
