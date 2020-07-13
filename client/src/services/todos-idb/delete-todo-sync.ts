import { TodoSyncRequest } from "./todo-sync-request";
import { TodoRequest, TodoRequestTypes } from "models/ITodoRequest";
import { TodosIDB } from "../todos-idb.service";

export class DeleteTodoSync extends TodoSyncRequest {
  async handleOutboundRequest(request: TodoRequest) {
    await this.todosService.deleteTodo(request.meta.id);
    await this.todosSyncService.deleteOutboundRequest(request.id);
  }

  async deleteTodo(todoId: string, timestamp: number, todosIDB: TodosIDB) {
    // if it's newly created TODO that isn't synced yet, then delete Request and return (do not create outbound request);
    // if there's already Edit request with this id, then delete request.
    const existingRequest = await this.todosSyncService.getOutboundRequest(
      todoId
    );
    if (existingRequest && !existingRequest.syncing) {
      await this.todosSyncService.deleteOutboundRequest(todoId);
      if (existingRequest?.type === TodoRequestTypes.create) {
        await todosIDB.deleteLocalTodo(todoId);
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
    await todosIDB.deleteLocalTodo(todoId);
    await this.todosSyncService.addOutboundRequest(request);
  }
}
