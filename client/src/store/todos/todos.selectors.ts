import { AppState } from "store/store";
import { createSelector } from "reselect";
import { getUserState } from "store/user/selectors";

export const getTodosState = (state: AppState) => state.todos;

export const getTodoItems = createSelector(getTodosState, ({ items }) => items);
export const getTodoItemsInitialized = createSelector(
  getTodosState,
  ({ itemsInitialized }) => itemsInitialized
);

export const getSyncState = createSelector(
  getTodosState,
  ({ syncStatus }) => syncStatus
);

export const getMyTodoItems = createSelector(
  getTodoItems,
  getUserState,
  (todos, userState) =>
    todos.filter((todo) => todo.creator.email === userState.email)
);

export const getSharedWithMeTodos = createSelector(
  getTodoItems,
  getUserState,
  (todos, userState) =>
    todos.filter((todo) => todo.creator.email !== userState.email)
);
