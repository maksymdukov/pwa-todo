import { TodoSyncRequest } from "./todo-sync-request";
import { TodoRequest, TodoRequestTypes } from "models/ITodoRequest";
import { DBNames } from "services/idb.service";
import { ITodo } from "models/ITodo";

export class CreateTodoSync extends TodoSyncRequest {
  async handleOutboundRequest(request: TodoRequest) {
    const response = await this.todosService.createTodo(request.data.data);
    await this.todosSyncService.deleteOutboundRequest(request.id);
    // delete local todo
    await this.db.deleteData(DBNames.syncTodos, request.id);
    await this.db.writeData(DBNames.syncTodos, response.data);
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
    await this.todosSyncService.addOutboundRequest(request);
    return this.db.writeData(DBNames.syncTodos, todo);
  }
}
