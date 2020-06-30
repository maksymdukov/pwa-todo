import { TodoActions, todoActionTypes } from "store/todo/todo.types";
import { ITodo, ITodoRecord } from "models/ITodo";
import { AppThunk } from "store/tools";
import { getUserState } from "store/user/selectors";
import { history } from "providers";
import { getTodoItems } from "store/todos/todos.selectors";
import { todosIDB } from "services/todos-idb.service";
import {
  setTodoItems,
  syncTodos,
  syncOutboundRequests,
  updateTodosFromIDB,
} from "store/todos/todos.actions";

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

export const resetTodo = (): TodoActions => ({
  type: todoActionTypes.RESET_TODO,
});

export const postTodo = ({
  todo,
  isNew,
}: {
  todo: { title: string; records: ITodoRecord[]; id?: string };
  isNew: boolean;
}): AppThunk => async (dispatch, getState) => {
  try {
    const timestamp = Date.now();
    if (isNew) {
      const userState = getUserState(getState());
      const newTodo: ITodo = {
        id: String(timestamp),
        createdAt: timestamp,
        updatedAt: timestamp,
        creator: {
          email: userState.email,
          id: userState.id,
          profile: {
            firstName: userState.firstName,
            lastName: userState.lastName,
            picture: userState.picture,
          },
        },
        records: todo.records,
        shared: [],
        title: todo.title,
        pending: true,
      };

      // Add request to IDB store outboundTodos
      await todosIDB.createTodo(newTodo);
    } else {
      const editedTodo = await todosIDB.getLocalTodo(todo.id!);
      if (!editedTodo) {
        throw new Error("Todo is not found in IDB when trying to edit it");
      }

      editedTodo.records = todo.records;
      editedTodo.title = todo.title;
      editedTodo.updatedAt = timestamp;
      editedTodo.pending = true;

      // Add request to IDB store outboutTodos
      // Edit todo in IDB store syncTodos
      // Try to send requests from outboundTodos
      await todosIDB.editTodo(editedTodo);
    }

    await dispatch(updateTodosFromIDB());
    history.push("/todos");

    await dispatch(syncOutboundRequests());
  } catch (e) {
    console.log(e);
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

export const deleteTodoAction = (todoId: string): AppThunk => async (
  dispatch
) => {
  await todosIDB.deleteTodo(todoId, Date.now());
  await dispatch(updateTodosFromIDB());
  // // start syncing
  // dispatch(syncTodos());
  await dispatch(syncOutboundRequests());
};
