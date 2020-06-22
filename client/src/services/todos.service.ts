import { Base } from "./base";
import { INewTodo } from "../models/ITodo";

class TodosService extends Base {
  createTodo(todo: INewTodo) {
    return this.request({ url: "/todo", method: "POST", data: todo });
  }
}

export const todosService = new TodosService("/todos");
