import { IDB, idb } from "./idb.service";
import { DBNames } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";
import { ITodo } from "models/ITodo";
import { TodoHistoryChange } from "models/ITodoHistoryChange";
import { TodosIDBSync, todosSync } from "./todos-idb/todos-idb-sync";
import { CreateTodoSync } from "./todos-idb/create-todo-sync";
import { todosService } from "./todos.service";
import { EditTodoSync } from "./todos-idb/edit-todo-sync";
import { DeleteTodoSync } from "./todos-idb/delete-todo-sync";

export class TodosIDB {
  constructor(public db: IDB, public todosSync: TodosIDBSync) {}

  async getAllTodos() {
    return (
      await this.db.readAllData(DBNames.syncTodos, "byUpdatedAt")
    ).reverse();
  }

  async getLocalTodo(id: string) {
    return (await this.db.db).get(DBNames.syncTodos, id);
  }

  async deleteLocalTodo(id: string) {
    return this.db.deleteData(DBNames.syncTodos, id);
  }

  async persistAllTodos(items: ITodo[], timestamp: number) {
    await this.db.writeInTransaction(DBNames.syncTodos, items);
    await this.db.keyval.set(KeyValKeys.lastTimeUpdated, String(timestamp));
  }

  async updateTodos(items: TodoHistoryChange[], timestamp: number) {
    return this.todosSync.handleInboundChanges(items, timestamp);
  }

  async createTodo(todo: ITodo) {
    return new CreateTodoSync(todosSync, this.db, todosService).createTodo(
      todo
    );
  }

  async editTodo(todo: ITodo) {
    return new EditTodoSync(todosSync, this.db, todosService).editTodo(todo);
  }

  async deleteTodo(todoId: string, timestamp: number) {
    return new DeleteTodoSync(todosSync, this.db, todosService).deleteTodo(
      todoId,
      timestamp,
      this
    );
  }

  async syncOutboundRequests() {
    return this.todosSync.syncOutboundRequests();
  }
}

export const todosIDB = new TodosIDB(idb, todosSync);
