declare module '*.wasm' {
  const content: any;
  export default content;
}

declare module '@jlongster/sql.js' {
  interface SqlJsStatic {
    Database: any;
    FS: any;
    register_for_idb: (fs: any) => void;
  }
  
  interface InitSqlJsOptions {
    locateFile?: (file: string) => string;
    wasmBinary?: ArrayBuffer;
  }

  function initSqlJs(options?: InitSqlJsOptions): Promise<SqlJsStatic>;
  export default initSqlJs;
}

declare module 'absurd-sql' {
  export class SQLiteFS {
    constructor(FS: any, backend: any);
  }
}

declare module 'absurd-sql/dist/indexeddb-backend' {
  export default class IndexedDBBackend {
    constructor();
  }
} 