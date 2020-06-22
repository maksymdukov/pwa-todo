import { ITodo } from "models/ITodo";
import { TodoActions, todoActionTypes } from "store/todo/todo.types";
import { ActionStatus } from "constants/actionStatus";

export type TodoStateType = {
  item: ITodo;
  fetchStatus: ActionStatus;
  postStatus: ActionStatus;
  fetchError: string | null;
  postError: string | null;
};

const initialState: TodoStateType = {
  item: {
    id: "",
    title: "",
    records: [],
    created: new Date().toISOString(),
    ownerPicture: "",
    ownerFirstName: "",
    ownerId: "",
    ownerLastName: ""
  },
  fetchStatus: ActionStatus.NOT_STARTED,
  postStatus: ActionStatus.NOT_STARTED,
  fetchError: null,
  postError: null
};

export const todoReducer = (
  state = initialState,
  action: TodoActions
): TodoStateType => {
  switch (action.type) {
    case todoActionTypes.POST_TODO_START:
      return { ...state, postStatus: ActionStatus.LOADING, postError: null };
    case todoActionTypes.POST_TODO_FAIL:
      return {
        ...state,
        postStatus: ActionStatus.FAILED,
        postError: action.payload.error
      };
    case todoActionTypes.POST_TODO_SUCCESS:
      return {
        ...state,
        postStatus: ActionStatus.SUCCESS
      };
    case todoActionTypes.POST_TODO_RESET:
      return {
        ...state,
        postStatus: ActionStatus.NOT_STARTED,
        postError: null
      };
    case todoActionTypes.LOAD_TODO:
      return { ...state, item: action.payload };
    case todoActionTypes.SET_ID:
      return { ...state, item: { ...state.item, id: action.payload } };
    default:
      return state;
  }
};
