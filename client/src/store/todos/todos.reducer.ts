import { ITodo } from "models/ITodo";
import { todosActionTypes, TodosActions } from "./todos.types";

export type TodosStateType = {
  items: ITodo[];
  syncStatus: boolean;
};

// TODO
// load initial items from DB

const initialState: TodosStateType = {
  items: [],
  syncStatus: false,
};

export const todosReducer = (
  state = initialState,
  action: TodosActions
): TodosStateType => {
  switch (action.type) {
    case todosActionTypes.SYNC_START:
      return { ...state, syncStatus: true };
    case todosActionTypes.SYNC_STOP:
      return {
        ...state,
        syncStatus: false,
      };
    case todosActionTypes.SET_TODO_ITEMS:
      return {
        ...state,
        items: action.payload.items,
      };
    default:
      return state;
  }
};
