import { ITodo } from "models/ITodo";
import { AppThunk } from "store/tools";
import { todosService } from "../../services/todos.service";
import { TodosActions, todosActionTypes } from "./todos.types";
import { getTodoItems } from "./todos.selectors";
import { idb, DBNames } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";
import { todosIDB } from "services/todos-idb.service";

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
    if (!getTodoItems(currentState).length) {
      // full fetch
      const {
        data: { items, timestamp },
      } = await todosService.getAllTodos();

      // persist todos and timestamp to IDB
      try {
        await todosIDB.persistAllTodos(items, timestamp);
      } catch (e) {
        console.error(e);
      }

      // Save to Redux
      dispatch(setTodoItems({ items }));
    } else {
      // fetch changes
      const lastTimeUpdated = await idb.keyval.get(KeyValKeys.lastTimeUpdated);
      if (!lastTimeUpdated) {
        throw new Error("lastTimeUpdated is missing in IDB");
      }
      const {
        data: { items, lastTimeUpdated: newLastTimeUpdated },
      } = await todosService.getChanges({ lastTimeUpdated });
      console.log("changes: response.data", items);

      // save/update to idb

      todosIDB.updateTodos(items, newLastTimeUpdated);

      // Retrieve from Idb

      const dbTodos = await todosIDB.getAllTodos();

      // save to redux
      dispatch(setTodoItems({ items: dbTodos }));
    }
    dispatch(syncStop());
  } catch (error) {
    console.error(error);
  }
};
