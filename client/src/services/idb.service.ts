import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from "idb";
import { ITodo } from "models/ITodo";
import { TodoRequest } from "models/ITodoRequest";

export enum DBNames {
  syncTodos = "syncTodos",
  keyval = "keyval",
  outboundTodos = "outboundTodos",
}

export interface MyDB extends DBSchema {
  [DBNames.syncTodos]: {
    key: string;
    value: ITodo;
    indexes: { byUpdatedAt: string; byId: string };
  };
  [DBNames.outboundTodos]: {
    key: string;
    value: TodoRequest;
    indexes: { byCreatedAt: string; byId: string };
  };
  [DBNames.keyval]: {
    key: string;
    value: string;
    indexes: {};
  };
}

export class IDB {
  public db: Promise<IDBPDatabase<MyDB>>;
  public keyval: KeyValStore;
  constructor() {
    this.db = this.initializeDB();
    this.keyval = new KeyValStore(this.db);
  }

  initializeDB(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>("todo", 1, {
      upgrade(
        database: IDBPDatabase<MyDB>,
        oldVersion: number,
        newVersion: number | null,
        transaction: IDBPTransaction<MyDB>
      ): void {
        if (oldVersion === 0) {
          const syncTodosStore = database.createObjectStore(DBNames.syncTodos, {
            keyPath: "id",
            autoIncrement: true,
          });
          const outboutTodos = database.createObjectStore(
            DBNames.outboundTodos,
            {
              keyPath: "id",
              autoIncrement: true,
            }
          );
          database.createObjectStore(DBNames.keyval);
          syncTodosStore.createIndex("byUpdatedAt", "updatedAt");
          syncTodosStore.createIndex("byId", "id");
          outboutTodos.createIndex("byCreatedAt", "createdAt");
          outboutTodos.createIndex("byId", "id");
        }
      },
    });
  }

  writeData<D extends DBNames>(
    st: D,
    data: MyDB[D]["value"],
    key?: string
  ): Promise<void> {
    return this.db.then((db) => {
      const tx = db.transaction(st, "readwrite");
      const store = tx.store;
      store.put(data, key);
      return tx.done;
    });
  }

  async deleteData<D extends DBNames>(st: D, key: string) {
    const db = await this.db;
    return db.delete(st, key);
  }

  async writeInTransaction<D extends DBNames>(
    st: D,
    data: MyDB[D]["value"][]
  ): Promise<void> {
    const tx = (await this.db).transaction(st, "readwrite");
    const promises = data.map((item) => tx.store.put(item));
    await Promise.all(promises);
    return tx.done;
  }

  readAllData<D extends DBNames>(
    st: D,
    index?: keyof MyDB[D]["indexes"]
  ): Promise<MyDB[D]["value"][]> {
    return this.db.then((db) => {
      const tx = db.transaction(st, "readonly");
      const store = tx.objectStore(st);
      if (index) {
        const idx = store.index(index);
        return idx.getAll();
      }
      return store.getAll();
    });
  }

  clearAllData(st: DBNames): Promise<void> {
    return this.db.then((db) => {
      const tx = db.transaction(st, "readwrite");
      const store = tx.objectStore(st);
      store.clear();
      return tx.done;
    });
  }

  async clearAllDBs() {
    await this.clearAllData(DBNames.syncTodos);
    await this.clearAllData(DBNames.outboundTodos);
    await this.clearAllData(DBNames.keyval);
  }
}

class KeyValStore {
  constructor(private db: Promise<IDBPDatabase<MyDB>>) {}
  async get(key: string) {
    return (await this.db).get(DBNames.keyval, key);
  }
  async set(key: string, val: string) {
    return (await this.db).put(DBNames.keyval, val, key);
  }
  async delete(key: string) {
    return (await this.db).delete(DBNames.keyval, key);
  }
  async clear() {
    return (await this.db).clear(DBNames.keyval);
  }
  async keys() {
    return (await this.db).getAllKeys(DBNames.keyval);
  }
}

export const idb = new IDB();
