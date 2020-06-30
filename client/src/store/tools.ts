import { ThunkAction } from "redux-thunk";
import { AppState } from "./store";
import { Action } from "redux";

export type AppThunk<ReturnType = void | Promise<void>> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
