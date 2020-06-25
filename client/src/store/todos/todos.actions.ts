import { ITodo } from "models/ITodo";
import { AppThunk } from "store/tools";
import { todosService } from "../../services/todos.service";
import { TodosActions, todosActionTypes } from "./todos.types";

export const syncStart = (): TodosActions => ({
  type: todosActionTypes.SYNC_START,
});

export const syncStop = (): TodosActions => ({
  type: todosActionTypes.SYNC_STOP,
});

export const setTodoItems = ({ items }: { items: ITodo[] }) => ({
  type: todosActionTypes.SET_TODO_ITEMS,
  payload: { items },
});

export const syncTodos = (): AppThunk => async (dispatch, getState) => {
  try {
    const currentState = getState();
    dispatch(syncStart());
    if (!currentState.todos.items.length) {
      // full fetch
      const response = await todosService.getAllTodos();
      // TODO
      // persist to IDB

      // Save to Redux
      dispatch(setTodoItems({ items: response.data.items }));
      dispatch(syncStop());
    }
  } catch (error) {
    console.error(error);
  }
};
