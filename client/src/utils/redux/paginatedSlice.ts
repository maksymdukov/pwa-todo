import { AppState } from "store/store";
import { createSelector } from "reselect";

enum PaginatedStatus {
  FETCH_IN_PROGRESS = "FETCH_IN_PROGRESS",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",
  FETCH_NOT_STARTED = "FETCH_NOT_STARTED",
}

interface ErrorType {
  message: string;
  code: string;
}

interface PaginatedStateType<T> {
  items: T[];
  status: PaginatedStatus;
  error: null | ErrorType;
  size: number;
  page: number;
  total: number | null;
}

enum paginatedActionTypes {
  FETCH_START = "FETCH_START",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",
  FETCH_RESET = "FETCH_RESET",
}

export interface FetchStart {
  type: string;
}

export interface FetchSuccess<T> {
  type: string;
  payload: { items: T[]; total: number };
}

export interface FetchFail {
  type: string;
  payload: { error: ErrorType | null };
}

export interface FetchReset {
  type: string;
}

type PaginatedActions<T> =
  | FetchStart
  | FetchSuccess<T>
  | FetchFail
  | FetchReset;

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 20;

export const initState = {
  items: [],
  error: null,
  total: null,
  status: PaginatedStatus.FETCH_NOT_STARTED,
  size: DEFAULT_PAGE,
  page: DEFAULT_SIZE,
};

export const makePaginatedReducer = <D>(
  name: string,
  getSliceState: (state: any) => PaginatedStateType<D>
) => {
  const reducer = (
    state: PaginatedStateType<D> = initState,
    action: PaginatedActions<D>
  ): PaginatedStateType<D> => {
    switch (action.type) {
      case `${name}/${paginatedActionTypes.FETCH_START}`:
        return {
          ...state,
          status: PaginatedStatus.FETCH_IN_PROGRESS,
          error: null,
        };
      case `${name}/${paginatedActionTypes.FETCH_SUCCESS}`:
        return {
          ...state,
          status: PaginatedStatus.FETCH_SUCCESS,
          error: null,
          // @ts-expect-error
          items: action.payload.items,
          // @ts-expect-error
          total: action.payload.total,
        };
      case `${name}/${paginatedActionTypes.FETCH_FAIL}`:
        return {
          ...state,
          status: PaginatedStatus.FETCH_FAIL,
          // @ts-expect-error
          error: action.payload.error || null,
        };
      case `${name}/${paginatedActionTypes.FETCH_RESET}`:
        return {
          ...state,
          status: PaginatedStatus.FETCH_NOT_STARTED,
          error: null,
          items: [],
          total: 0,
          page: DEFAULT_PAGE,
          size: DEFAULT_SIZE,
        };
      default:
        return state;
    }
  };

  const fetchStart = (): PaginatedActions<D> => ({
    type: `${name}/${paginatedActionTypes.FETCH_START}`,
  });

  const fetchSuccess = ({
    items,
    total,
  }: {
    items: D[];
    total: number;
  }): PaginatedActions<D> => ({
    type: `${name}/${paginatedActionTypes.FETCH_SUCCESS}`,
    payload: { items, total },
  });

  const fetchFail = ({
    error,
  }: {
    error: ErrorType | null;
  }): PaginatedActions<D> => ({
    type: `${name}/${paginatedActionTypes.FETCH_FAIL}`,
    payload: { error: error || null },
  });

  const fetchReset = (): PaginatedActions<D> => ({
    type: `${name}/${paginatedActionTypes.FETCH_RESET}`,
  });

  const getItems = createSelector(getSliceState, ({ items }) => items);

  const getStatus = createSelector(getSliceState, ({ status }) => status);

  const getError = createSelector(getSliceState, ({ error }) => error);

  const getPagination = createSelector(
    getSliceState,
    ({ page, size, total }) => ({ page, size, total })
  );

  return {
    reducer,
    fetchStart,
    fetchFail,
    fetchSuccess,
    fetchReset,
    getItems,
    getStatus,
    getError,
    getPagination,
  };
};
