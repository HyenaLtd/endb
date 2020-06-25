declare module "endb" {
  import { EventEmitter } from "events";

  type MaybePromise<T> = T | Promise<T>;

  export default class Endb<TVal> extends EventEmitter {
    protected readonly options: EndbOptions<TVal>;
    constructor(options?: string | Partial<EndbOptions<TVal>>);
    public all(): Promise<Element<TVal>[] | undefined>;
    public clear(): Promise<undefined>;
    public delete(key: string): Promise<boolean>;
    public entries(): Promise<[string, TVal][]>;
    public get<V>(key: string, path?: string): Promise<V | undefined>;
    public has(key: string, path?: string): Promise<boolean>;
    public keys(): Promise<string[]>;
    public set<V>(key: string, value: V, path?: string): Promise<true>;
    public values(): Promise<TVal[]>;
  }

  export interface EndbAdapter<TVal, TSerialized = string> {
    on?(event: "error", callback: (error: Error) => void | never): void;
    namespace: string;
    all?(): MaybePromise<Element<TSerialized>[]>;
    clear(): MaybePromise<void>;
    delete(key: string): MaybePromise<boolean>;
    get(key: string): MaybePromise<void | TVal | TSerialized>;
    has(key: string): MaybePromise<boolean>;
    set(key: string, value: TSerialized): MaybePromise<unknown>;
  }

  export interface EndbOptions<TVal, TSerialized = string> {
    uri?: string;
    namespace: string;
    serialize: (data: TVal) => TSerialized;
    deserialize: (data: TSerialized) => TVal;
    adapter?:
      | "mongodb"
      | "mysql"
      | "postgres"
      | "postgresql"
      | "redis"
      | "sqlite"
      | "sqlite3";
    store: EndbAdapter<TVal, TSerialized>;
  }

  type Element<V> = {
    key: string;
    value: V;
  };
}
