import { AppState } from "store/store";
import { createSelector } from "reselect";

export const getTodoState = (state: AppState) => state.todo;

export const getTodoItemState = createSelector(
  getTodoState,
  ({ item }) => item
);

export const getTodoRecords = createSelector(
  getTodoItemState,
  todoState => todoState.records
);
