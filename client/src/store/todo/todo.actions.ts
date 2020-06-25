import { TodoActions, todoActionTypes } from "store/todo/todo.types";
import { INewTodo, ITodo } from "models/ITodo";
import { v4 as uuidv4 } from "uuid";
import { AppThunk } from "store/tools";
import { getUserState } from "store/user/selectors";
import { history } from "providers";
import { todosService } from "../../services/todos.service";
import { getTodoItems } from "store/todos/todos.selectors";

export const postTodoStart = (): TodoActions => ({
  type: todoActionTypes.POST_TODO_START,
});

export const postTodoSuccess = (): TodoActions => ({
  type: todoActionTypes.POST_TODO_SUCCESS,
});

export const postTodoFail = (error: string): TodoActions => ({
  type: todoActionTypes.POST_TODO_FAIL,
  payload: { error },
});

export const postTodoReset = (): TodoActions => ({
  type: todoActionTypes.POST_TODO_RESET,
});

export const postTodo = ({
  todo,
  isNew,
}: {
  todo: Partial<ITodo>;
  isNew: boolean;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(postTodoStart());
    let response;
    if (isNew) {
      response = await todosService.createTodo(todo);
    } else {
      response = await todosService.editTodo(todo);
    }
    dispatch(postTodoSuccess());
  } catch (e) {
    console.log(e);
    dispatch(postTodoFail(e));
  }
};

export const loadTodo = (todo: ITodo): TodoActions => ({
  type: todoActionTypes.LOAD_TODO,
  payload: { item: todo },
});

export const setSingleTodo = (todoId: string): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const items = getTodoItems(state);
    const chosenItem = items.find((todo) => todo.id === todoId);
    if (chosenItem) {
      console.log("chosenItem", chosenItem);
      dispatch(loadTodo(chosenItem));
    } else {
      // TODO
      // error
      // redirect to /todos
    }
  } catch (e) {
    console.error(e);
  }
};
