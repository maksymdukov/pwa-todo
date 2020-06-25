import { Base } from "./base";
import { INewTodo, ITodo } from "../models/ITodo";

interface AllTodosResponse {
  items: ITodo[];
  size: number;
  page: number;
  total: number;
}

class TodosService extends Base {
  createTodo(todo: Partial<ITodo>) {
    return this.request({ url: "/todo", method: "POST", data: todo });
  }
  getAllTodos() {
    return this.request<AllTodosResponse>({ url: "/all", method: "GET" });
  }
  getTodoById(todoId: string) {
    return this.request<ITodo>({ url: `/${todoId}`, method: "GET" });
  }
  editTodo(todo: Partial<ITodo>) {
    return this.request({ url: `/${todo.id}`, method: "PATCH", data: todo });
  }
}

export const todosService = new TodosService("/todos");
