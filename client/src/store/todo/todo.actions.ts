import { TodoActions, todoActionTypes } from "store/todo/todo.types";
import {INewTodo, ITodo} from "models/ITodo";
import { v4 as uuidv4 } from "uuid";
import { AppThunk } from "store/tools";
import { getUserState } from "store/user/selectors";
import { history } from "providers";
import { todosService } from "../../services/todos.service";

export const postTodoStart = (): TodoActions => ({
  type: todoActionTypes.POST_TODO_START
});

export const postTodoSuccess = (): TodoActions => ({
  type: todoActionTypes.POST_TODO_SUCCESS
});

export const postTodoFail = (error: string): TodoActions => ({
  type: todoActionTypes.POST_TODO_FAIL,
  payload: { error }
});

export const postTodoReset = (): TodoActions => ({
  type: todoActionTypes.POST_TODO_RESET
});

export const postTodo = (todo: INewTodo): AppThunk => async dispatch => {
  try {
    dispatch(postTodoStart());
    const response = await todosService.createTodo(todo);
    dispatch(postTodoSuccess());
  } catch (e) {
    console.log(e);
    dispatch(postTodoFail(e));
  }
};

export const loadTodo = (todo: ITodo): TodoActions => ({
  type: todoActionTypes.LOAD_TODO,
  payload: todo
});