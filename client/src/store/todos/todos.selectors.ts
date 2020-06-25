import { AppState } from "store/store";
import { createSelector } from "reselect";

export const getTodosState = (state: AppState) => state.todos;

export const getTodoItems = createSelector(getTodosState, ({ items }) => items);

export const getSyncState = createSelector(
  getTodosState,
  ({ syncStatus }) => syncStatus
);
