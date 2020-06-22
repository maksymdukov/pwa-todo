import { ITodo } from "models/ITodo";

export enum todoActionTypes {
  POST_TODO_START = "POST_TODO_START",
  POST_TODO_SUCCESS = "POST_TODO_SUCCESS",
  POST_TODO_FAIL = "POST_TODO_FAIL",
  POST_TODO_RESET = "POST_TODO_RESET",
  LOAD_TODO = "LOAD_TODO",
  SET_ID = "SET_ID"
}

export interface PostTodoStart {
  type: todoActionTypes.POST_TODO_START;
}

export interface PostTodoSuccess {
  type: todoActionTypes.POST_TODO_SUCCESS;
}

export interface PostTodoFail {
  type: todoActionTypes.POST_TODO_FAIL;
  payload: { error: string };
}

export interface PostTodoReset {
  type: todoActionTypes.POST_TODO_RESET;
}

export interface LoadTodoAction {
  type: todoActionTypes.LOAD_TODO;
  payload: ITodo;
}

export interface SetTodoIdAction {
  type: todoActionTypes.SET_ID;
  payload: string;
}

export type TodoActions =
  | LoadTodoAction
  | SetTodoIdAction
  | PostTodoStart
  | PostTodoSuccess
  | PostTodoFail
  | PostTodoReset;
