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

type TodoChangesResponse = TodoHistoryChange[];

class TodosService extends Base {
  createTodo(todo: Partial<ITodo>) {
    return this.request({ url: "/todo", method: "POST", data: todo });
  }
  editTodo(todo: Partial<ITodo>) {
    return this.request({ url: `/${todo.id}`, method: "PATCH", data: todo });
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
}

export const todosService = new TodosService("/todos");
