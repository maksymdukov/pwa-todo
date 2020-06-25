import { combineReducers } from "redux";
import { userReducer } from "./user/reducer";
import { todoReducer } from "store/todo/todo.reducer";
import { todosReducer } from "./todos/todos.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  todo: todoReducer,
  todos: todosReducer,
});
