import { ITodo } from "models/ITodo";
import { AppThunk } from "store/tools";
import { todosService } from "../../services/todos.service";
import { TodosActions, todosActionTypes } from "./todos.types";
import { getTodoItems, getSyncState } from "./todos.selectors";
import { idb } from "services/idb.service";
import { KeyValKeys } from "models/KeyValStore";
import { todosIDB } from "services/todos-idb.service";
import { checkConnection, runOnlineActions } from "store/tech/tech.actions";
import { getConnetionStatus } from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";
import { ErrorCodes } from "errors/error-codes";
import { SyncStatus } from "./todos.reducer";

export const syncInProgress = (): TodosActions => ({
  type: todosActionTypes.SYNC_IN_PROGRESS,
});

export const syncSuccess = (): TodosActions => ({
  type: todosActionTypes.SYNC_SUCCESS,
});

export const syncFail = (): TodosActions => ({
  type: todosActionTypes.SYNC_FAIL,
});

export const syncReset = (): TodosActions => ({
  type: todosActionTypes.SYNC_RESET,
});

export const setTodoItems = ({ items }: { items: ITodo[] }) => ({
  type: todosActionTypes.SET_TODO_ITEMS,
  payload: { items },
});

export const syncOutboundRequests = (): AppThunk => async (
  dispatch,
  getState
) => {
  const connectionStatus = getConnetionStatus(getState());
  if (connectionStatus !== ConnectionStatus.online) {
    return;
  }
  return todosIDB.syncOutboundRequests();
};

export const updateTodosFromIDB = (): AppThunk => async (dispatch) => {
  // Retrieve from Idb
  const dbTodos = await todosIDB.getAllTodos();

  // save to redux
  dispatch(setTodoItems({ items: dbTodos }));
  return;
};

export const syncTodos = (): AppThunk => async (dispatch, getState) => {
  try {
    const currentState = getState();
    const connectionStatus = getConnetionStatus(currentState);
    const syncStatus = getSyncState(currentState);
    if (
      connectionStatus === ConnectionStatus.offline ||
      syncStatus === SyncStatus.IN_PROGRESS
    ) {
      return;
    }
    dispatch(syncInProgress());
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
      if (items.length) {
        await todosIDB.updateTodos(items, newLastTimeUpdated);
        await dispatch(updateTodosFromIDB());
      }
    }
    dispatch(syncSuccess());
    await dispatch(syncOutboundRequests());
  } catch (error) {
    dispatch(syncFail());
    console.error(error);

    if (error.code === ErrorCodes.ECONNABORTED) {
      // Set status to offline
      dispatch(checkConnection(runOnlineActions));
    }
  }
};
