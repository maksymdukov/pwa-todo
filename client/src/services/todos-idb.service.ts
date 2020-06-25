import { IDB, idb } from "./idb.service";
import { DBNames } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";
import { ITodo } from "models/ITodo";
import { TodoHistoryChange } from "models/ITodoHistoryChange";
import { TodoHistoryReason } from "models/TodoHistoryReason";

class TodosIDB {
  constructor(public db: IDB) {}

  async getAllTodos() {
    return (
      await this.db.readAllData(DBNames.syncTodos, "byUpdatedAt")
    ).reverse();
  }

  async persistAllTodos(items: ITodo[], timestamp: number) {
    await this.db.writeInTransaction(DBNames.syncTodos, items);
    await this.db.keyval.set(KeyValKeys.lastTimeUpdated, String(timestamp));
  }

  async updateTodos(items: TodoHistoryChange[], timestamp: number) {
    const tx = (await this.db.db).transaction(DBNames.syncTodos, "readwrite");

    const promises = items.map((item) => {
      if (item.reason === TodoHistoryReason.deleted) {
        return tx.store.delete(item.todo.id);
      }
      return tx.store.put(item.todo);
    });

    // @ts-ignore
    await Promise.all(promises);
    await tx.done;
    await this.db.keyval.set(KeyValKeys.lastTimeUpdated, String(timestamp));
  }
}

export const todosIDB = new TodosIDB(idb);
