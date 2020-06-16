declare module 'mysql2/promise' {
  interface Connection {
    execute(sql: string): Promise<string[]>;
  }

  export function createConnection(uri: string): Promise<Connection>;
}
