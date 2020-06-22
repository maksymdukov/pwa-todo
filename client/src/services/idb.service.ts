import { DBSchema, IDBPDatabase, IDBPTransaction, openDB } from "idb";
import { ITodo, ITodoRecord } from "models/ITodo";

export enum SyncType {
  GENERAL_INFO,
  RECORD,
  ALL
}

export enum DBNames {
  syncTodos = "syncTodos"
}

export interface SyncTodoEvent {
  todoId: string;
  records: { [idx: string]: true };
  type: {
    [SyncType.GENERAL_INFO]: boolean;
    [SyncType.RECORD]: boolean;
    [SyncType.ALL]: boolean;
  };
}

export interface MyDB extends DBSchema {
  [DBNames.syncTodos]: {
    key: string;
    value: SyncTodoEvent;
    indexes: { byParentId: string; byId: string };
  };
}

export class IDB {
  public todoDB: Promise<IDBPDatabase<MyDB>>;
  constructor() {
    this.todoDB = this.initializeDB();
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
            autoIncrement: true
          });
          syncTodosStore.createIndex("byParentId", "parentId");
          syncTodosStore.createIndex("byId", "id");
        }
      }
    });
  }

  writeData(st: DBNames, data: any): Promise<void> {
    return this.todoDB.then(db => {
      const tx = db.transaction(st, "readwrite");
      const store = tx.objectStore(st);
      store.put(data);
      return tx.done;
    });
  }

  readAllData<D extends DBNames>(st: D): Promise<MyDB[D]["value"][]> {
    return this.todoDB.then(db => {
      const tx = db.transaction(st, "readonly");
      const store = tx.objectStore(st);
      return store.getAll();
    });
  }

  clearAllData(st: DBNames): Promise<void> {
    return this.todoDB.then(db => {
      const tx = db.transaction(st, "readwrite");
      const store = tx.objectStore(st);
      store.clear();
      return tx.done;
    });
  }
}

export const db = new IDB();
