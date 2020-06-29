import EndbSql from '@endb/sql';
import { EndbAdapter } from 'endb';
import { Pool } from 'pg';

export interface EndbPostgresOptions {
  uri?: string;
  table?: string;
  keySize?: number;
}

export default class EndbPostgres<TVal> extends EndbSql<TVal>
  implements EndbAdapter<TVal> {
  constructor(options: EndbPostgresOptions = {}) {
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
