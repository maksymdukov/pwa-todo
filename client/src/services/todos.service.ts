import { Base } from "./base";
import { ITodo } from "../models/ITodo";
import { TodoHistoryChange } from "../models/ITodoHistoryChange";

interface AllTodosResponse {
  items: ITodo[];
  size: number;
  page: number;
  total: number;
  timestamp: number;
}

interface GetChangesAttrs {
  lastTimeUpdated: string;
}

type TodoChangesResponse = {
  items: TodoHistoryChange[];
  lastTimeUpdated: number;
};

export class TodosService extends Base {
  createTodo(todo: Partial<ITodo>) {
    return this.request<ITodo>({
      url: "/todo",
      method: "POST",
      data: todo,
      timeout: 10000,
    });
  }
  editTodo(todo: Partial<ITodo>) {
    return this.request<ITodo>({
      url: `/${todo.id}`,
      method: "PATCH",
      data: todo,
    });
  }
  deleteTodo(todoId: string) {
    return this.request({ url: `/${todoId}`, method: "DELETE" });
  }
  getAllTodos() {
    return this.request<AllTodosResponse>({ url: "/all", method: "GET" });
  }
  getTodoById(todoId: string) {
    return this.request<ITodo>({ url: `/${todoId}`, method: "GET" });
  }
  getChanges({ lastTimeUpdated }: GetChangesAttrs) {
    return this.request<TodoChangesResponse>({
      url: "/changes",
      method: "POST",
      data: { lastTimeUpdated },
    });
  }
  shareTodo(todoId: string, userId: string) {
    return this.request({
      url: `/${todoId}/share`,
      method: "POST",
      data: { userId },
    });
  }
  unshareTodo(todoId: string, userId: string) {
    return this.request({
      url: `/${todoId}/unshare`,
      method: "POST",
      data: { userId },
    });
  }
}

export const todosService = new TodosService("/todos");
