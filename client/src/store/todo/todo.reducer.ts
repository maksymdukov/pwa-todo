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
    creator: {
      email: "",
      id: "",
      profile: {
        createdAt: "",
        firstName: "",
        lastName: "",
        picture: "",
        updatedAt: "",
      },
    },
    created: new Date().toISOString(),
    createdAt: 0,
    updatedAt: 0,
    shared: [],
  },
  fetchStatus: ActionStatus.NOT_STARTED,
  postStatus: ActionStatus.NOT_STARTED,
  fetchError: null,
  postError: null,
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
        postError: action.payload.error,
      };
    case todoActionTypes.POST_TODO_SUCCESS:
      return {
        ...state,
        postStatus: ActionStatus.SUCCESS,
      };
    case todoActionTypes.POST_TODO_RESET:
      return {
        ...state,
        postStatus: ActionStatus.NOT_STARTED,
        postError: null,
      };
    case todoActionTypes.LOAD_TODO:
      return { ...state, item: action.payload.item };
    case todoActionTypes.SET_ID:
      return { ...state, item: { ...state.item, id: action.payload } };
    case todoActionTypes.RESET_TODO:
      return initialState;
    default:
      return state;
  }
};
