import { IDB, idb } from "./idb.service";
import { DBNames } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";
import { ITodo } from "models/ITodo";
import { TodoHistoryChange } from "models/ITodoHistoryChange";
import { TodoHistoryReason } from "models/TodoHistoryReason";
import { TodoRequest, TodoRequestTypes } from "models/ITodoRequest";
import { TodosService, todosService } from "./todos.service";

class TodosIDB {
  constructor(public db: IDB, public todosService: TodosService) {}

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

  async getOutboundRequest(id: string) {
    return (await this.db.db).get(DBNames.outboundTodos, id);
  }

  async getOutboundRequests() {
    return this.db.readAllData(DBNames.outboundTodos, "byCreatedAt");
  }

  async deleteOutboundRequest(id: string) {
    return this.db.deleteData(DBNames.outboundTodos, id);
  }

  async addOutboundRequest(request: TodoRequest) {
    return this.db.writeData(DBNames.outboundTodos, request);
  }

  async createTodo(todo: ITodo) {
    const request: TodoRequest = {
      id: String(todo.createdAt),
      type: TodoRequestTypes.create,
      createdAt: todo.updatedAt,
      data: {
        data: { title: todo.title, records: todo.records },
      },
      syncing: false,
    };
    await this.addOutboundRequest(request);
    return this.db.writeData(DBNames.syncTodos, todo);
  }

  async editTodo(todo: ITodo) {
    if (todo.id === String(todo.createdAt)) {
      // We're editing created but not synced todo.
      return this.createTodo(todo);
    }
    const request: TodoRequest = {
      id: todo.id,
      type: TodoRequestTypes.edit,
      createdAt: todo.updatedAt,
      data: {
        data: { title: todo.title, records: todo.records, id: todo.id },
      },
      syncing: false,
    };
    await this.addOutboundRequest(request);
    return this.db.writeData(DBNames.syncTodos, todo);
  }

  async deleteTodo(todoId: string, timestamp: number) {
    // if it's newly created TODO that isn't synced yet, then delete Request and return (do not create outbound request);
    // if there's already Edit request with this id, then delete request.
    const existingRequest = await this.getOutboundRequest(todoId);
    if (existingRequest && !existingRequest.syncing) {
      await this.deleteOutboundRequest(todoId);
      if (existingRequest?.type === TodoRequestTypes.create) {
        await this.deleteLocalTodo(todoId);
        return;
      }
    }
    const request: TodoRequest = {
      id: String(timestamp),
      type: TodoRequestTypes.delete,
      createdAt: timestamp,
      meta: { id: todoId },
      syncing: false,
    };
    await this.deleteLocalTodo(todoId);
    await this.addOutboundRequest(request);
  }

  async syncOutboundRequests() {
    const requests = await this.getOutboundRequests();
    for (const request of requests) {
      if ((await this.getOutboundRequest(request.id))?.syncing) {
        continue;
      }
      await this.markRequestSyncing(request);
      try {
        switch (request.type) {
          case TodoRequestTypes.create:
            await this.handleCreateTodoRequest(request);
            break;
          case TodoRequestTypes.edit:
            await this.handleEditedTodoRequest(request);
            break;
          case TodoRequestTypes.delete:
            await this.handleDeletedTodoRequest(request);
            break;
          default:
            break;
        }
      } catch (e) {
        await this.unmarkRequestSyncing(request);
        throw e;
      }
    }
  }

  async markRequestSyncing(request: TodoRequest) {
    request.syncing = true;
    return this.db.writeData(DBNames.outboundTodos, request);
  }

  async unmarkRequestSyncing(request: TodoRequest) {
    request.syncing = false;
    return this.db.writeData(DBNames.outboundTodos, request);
  }

  async handleCreateTodoRequest(request: TodoRequest) {
    const response = await this.todosService.createTodo(request.data.data);
    await this.deleteOutboundRequest(request.id);
    await this.deleteLocalTodo(request.id);
    await this.db.writeData(DBNames.syncTodos, response.data);
  }

  async handleEditedTodoRequest(request: TodoRequest) {
    const response = await this.todosService.editTodo(request.data.data);
    await this.deleteOutboundRequest(request.id);
    await this.db.writeData(DBNames.syncTodos, response.data);
  }
  async handleDeletedTodoRequest(request: TodoRequest) {
    await this.todosService.deleteTodo(request.meta.id);
    await this.deleteOutboundRequest(request.id);
  }
}

export const todosIDB = new TodosIDB(idb, todosService);
