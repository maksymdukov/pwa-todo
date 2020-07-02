import { ITodo } from "models/ITodo";

export enum todosActionTypes {
  SYNC_IN_PROGRESS = "SYNC_IN_PROGRESS",
  SYNC_RESET = "SYNC_RESET",
  SET_TODO_ITEMS = "SET_TODO_ITEMS",
  SYNC_SUCCESS = "SYNC_SUCCESS",
  SYNC_FAIL = "SYNC_FAIL",
}

export interface TodosSyncInProgress {
  type: todosActionTypes.SYNC_IN_PROGRESS;
}

export interface TodosSyncReset {
  type: todosActionTypes.SYNC_RESET;
}

export interface TodosSyncSuccess {
  type: todosActionTypes.SYNC_SUCCESS;
}

export interface TodosSyncFail {
  type: todosActionTypes.SYNC_FAIL;
}

export interface SetTodoItems {
  type: todosActionTypes.SET_TODO_ITEMS;
  payload: { items: ITodo[] };
}

export type TodosActions =
  | TodosSyncInProgress
  | TodosSyncReset
  | TodosSyncSuccess
  | TodosSyncFail
  | SetTodoItems;
