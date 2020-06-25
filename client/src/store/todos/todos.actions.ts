import { ITodo } from "models/ITodo";
import { AppThunk } from "store/tools";
import { todosService } from "../../services/todos.service";
import { TodosActions, todosActionTypes } from "./todos.types";
import { getTodoItems } from "./todos.selectors";
import { idb, DBNames } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";

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
        await idb.writeInTransaction(DBNames.syncTodos, items);
        await idb.keyval.set(KeyValKeys.lastTimeUpdated, String(timestamp));
      } catch (e) {
        console.error(e);
      }

      // Save to Redux
      dispatch(setTodoItems({ items }));
      dispatch(syncStop());
    } else {
      // fetch changes
      const lastTimeUpdated = await idb.keyval.get(KeyValKeys.lastTimeUpdated);
      if (!lastTimeUpdated) {
        throw new Error("lastTimeUpdated is missing in IDB");
      }
      const response = await todosService.getChanges({ lastTimeUpdated });
      console.log("changes: response.data", response.data);

      // save/update to idb
      // save to redux
    }
  } catch (error) {
    console.error(error);
  }
};
