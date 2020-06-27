import { ITodo } from "models/ITodo";
import { AppThunk } from "store/tools";
import { todosService } from "../../services/todos.service";
import { TodosActions, todosActionTypes } from "./todos.types";
import { getTodoItems, getSyncState } from "./todos.selectors";
import { idb, DBNames } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";
import { todosIDB } from "services/todos-idb.service";
import { checkConnection, setStatusOffline } from "store/tech/tech.actions";
import { getConnetionStatus } from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";

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
    const connectionStatus = getConnetionStatus(currentState);
    const isSycning = getSyncState(currentState);
    if (connectionStatus === ConnectionStatus.offline || isSycning) {
      return;
    }
    dispatch(syncStart());
    await todosIDB.syncOutboundRequests();
    // If there're no items loaded during initialization then make full fetch
    if (!getTodoItems(currentState).length) {
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
      // Otherwise fetch changes
      const lastTimeUpdated = await idb.keyval.get(KeyValKeys.lastTimeUpdated);
      if (!lastTimeUpdated) {
        throw new Error("lastTimeUpdated is missing in IDB");
      }
      const {
        data: { items, lastTimeUpdated: newLastTimeUpdated },
      } = await todosService.getChanges({ lastTimeUpdated });
      console.log("changes: response.data", items);
      if (!items.length) {
        // no changes
        return;
      }
      // save/update to idb
      todosIDB.updateTodos(items, newLastTimeUpdated);

      // Retrieve from Idb
      const dbTodos = await todosIDB.getAllTodos();

      // save to redux
      dispatch(setTodoItems({ items: dbTodos }));
    }
  } catch (error) {
    console.dir(error);
    // Set status to offline
    // Try fetching some dummy endpoint every 1 second to find out when we become online
    dispatch(setStatusOffline());
    dispatch(checkConnection(syncTodos));
  } finally {
    dispatch(syncStop());
  }
};
