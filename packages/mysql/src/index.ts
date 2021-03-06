import EndbSql from '@endb/sql';
import { EndbAdapter } from 'endb';
import mysql2 from 'mysql2/promise';

export interface EndbMysqlOptions {
  uri?: string;
  table?: string;
  keySize?: number;
}

export default class EndbMysql<TVal> extends EndbSql<TVal>
  implements EndbAdapter<TVal> {
  constructor(options: EndbMysqlOptions = {}) {
    const { uri = 'mysql://localhost' } = options;
    super({
      dialect: 'mysql',
      async connect() {
        const connection = await mysql2.createConnection(uri);
        return async (sqlString: string) => {
          const [row] = await connection.execute(sqlString);
          return row;
        };
      },
      ...options,
    });
  }
}
