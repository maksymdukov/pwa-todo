import { ITodo } from "models/ITodo";
import { todosActionTypes, TodosActions } from "./todos.types";

export enum SyncStatus {
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

export type TodosStateType = {
  items: ITodo[];
  syncStatus: SyncStatus;
  itemsInitialized: boolean;
};

const initialState: TodosStateType = {
  items: [],
  syncStatus: SyncStatus.NOT_STARTED,
  itemsInitialized: false,
};

export const todosReducer = (
  state = initialState,
  action: TodosActions
): TodosStateType => {
  switch (action.type) {
    case todosActionTypes.SYNC_IN_PROGRESS:
      return { ...state, syncStatus: SyncStatus.IN_PROGRESS };
    case todosActionTypes.SYNC_SUCCESS:
      return {
        ...state,
        syncStatus: SyncStatus.SUCCESS,
      };
    case todosActionTypes.SYNC_FAIL:
      return {
        ...state,
        syncStatus: SyncStatus.FAIL,
      };
    case todosActionTypes.SYNC_RESET:
      return {
        ...state,
        syncStatus: SyncStatus.NOT_STARTED,
      };
    case todosActionTypes.SET_TODO_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        itemsInitialized: true,
      };
    default:
      return state;
  }
};
