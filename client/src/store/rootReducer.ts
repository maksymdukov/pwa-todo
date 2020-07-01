import { combineReducers } from "redux";
import { userReducer } from "./user/reducer";
import { todoReducer } from "store/todo/todo.reducer";
import { todosReducer } from "./todos/todos.reducer";
import { techReducer } from "./tech/tech.reducer";
import { unreadNotificationsReducer } from "./unread-notifications/notifications.slice";
import { readNotificationsReducer } from "./read-notifications/read-notifications.slice";

export const rootReducer = combineReducers({
  user: userReducer,
  todo: todoReducer,
  todos: todosReducer,
  tech: techReducer,
  unreadNotifications: unreadNotificationsReducer,
  readNotifications: readNotificationsReducer,
});
