import { ITodo } from "models/ITodo";

export enum todosActionTypes {
  SYNC_START = "SYNC_START",
  SYNC_STOP = "SYNC_STOP",
  SET_TODO_ITEMS = "SET_TODO_ITEMS",
}

export interface TodosSyncStart {
  type: todosActionTypes.SYNC_START;
}

export interface TodosSyncStop {
  type: todosActionTypes.SYNC_STOP;
}

export interface SetTodoItems {
  type: todosActionTypes.SET_TODO_ITEMS;
  payload: { items: ITodo[] };
}

export type TodosActions = TodosSyncStart | TodosSyncStop | SetTodoItems;
