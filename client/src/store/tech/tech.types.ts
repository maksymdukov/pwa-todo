import { TodoViewType } from "./tech.reducer";

export enum techActionTypes {
  SET_STATUS_ONLINE = "SET_STATUS_ONLINE",
  SET_STATUS_OFFLINE = "SET_STATUS_OFFLINE",
  BEFORE_INSTALL_PROMPT = "BEFORE_INSTALL_PROMPT",
  USER_INSTALL_CHOICE = "USER_INSTALL_CHOICE",
  READY_FOR_OFFLINE = "READY_FOR_OFFLINE",
  NEW_VERSION_AVAILABLE = "NEW_VERSION_AVAILABLE",
  CHANGE_TODO_VIEW_TYPE = "CHANGE_TODO_VIEW_TYPE",
}

export interface SetStatusOnline {
  type: techActionTypes.SET_STATUS_ONLINE;
}

export interface SetStatusOffline {
  type: techActionTypes.SET_STATUS_OFFLINE;
}

export interface BeforeInstallPropmt {
  type: techActionTypes.BEFORE_INSTALL_PROMPT;
}

export interface UserInstallChoice {
  type: techActionTypes.USER_INSTALL_CHOICE;
  payload: { choice: boolean };
}

export interface ReadyForOffline {
  type: techActionTypes.READY_FOR_OFFLINE;
}

export interface NewVersionAvailable {
  type: techActionTypes.NEW_VERSION_AVAILABLE;
}

export interface ChangeTodoViewType {
  type: techActionTypes.CHANGE_TODO_VIEW_TYPE;
  payload: TodoViewType;
}

export type TechActions =
  | SetStatusOnline
  | SetStatusOffline
  | BeforeInstallPropmt
  | UserInstallChoice
  | ReadyForOffline
  | NewVersionAvailable
  | ChangeTodoViewType;
