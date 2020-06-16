import { Pool } from 'pg';
import { EndbAdapter } from 'endb';
import EndbSql from '@endb/sql';

export interface EndbPostgresOptions {
  uri: string;
}

export default class EndbPostgres<TVal = void> extends EndbSql implements EndbAdapter<TVal> {
  constructor(options: Partial<EndbPostgresOptions> = {}) {
    const { uri = 'postgresql://localhost:5432' } = options;
    super({
      dialect: 'postgres',
      async connect() {
        const pool = new Pool({ connectionString: uri });
        return Promise.resolve(async (sqlString) => {
          const { rows } = await pool.query(sqlString);
          return rows;
        });
      },
      ...options,
    });
  }
}
