import { combineReducers } from "redux";
import { userReducer } from "./user/reducer";
import { todoReducer } from "store/todo/todo.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  todo: todoReducer
});
