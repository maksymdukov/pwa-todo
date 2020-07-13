import { TodoSyncRequest } from "./todo-sync-request";
import { TodoRequest, TodoRequestTypes } from "models/ITodoRequest";
import { DBNames } from "services/idb.service";
import { ITodo } from "models/ITodo";
import { CreateTodoSync } from "./create-todo-sync";

export class EditTodoSync extends TodoSyncRequest {
  async handleOutboundRequest(request: TodoRequest) {
    const response = await this.todosService.editTodo(request.data.data);
    await this.todosSyncService.deleteOutboundRequest(request.id);
    await this.db.writeData(DBNames.syncTodos, response.data);
  }

  async editTodo(todo: ITodo) {
    if (todo.id === String(todo.createdAt)) {
      // We're editing created but not synced todo.
      const createTodosync = new CreateTodoSync(
        this.todosSyncService,
        this.db,
        this.todosService
      );
      return createTodosync.createTodo(todo);
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
    await this.todosSyncService.addOutboundRequest(request);
    return this.db.writeData(DBNames.syncTodos, todo);
  }
}
