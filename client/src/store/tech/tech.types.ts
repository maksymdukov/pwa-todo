export enum techActionTypes {
  SET_STATUS_ONLINE = "SET_STATUS_ONLINE",
  SET_STATUS_OFFLINE = "SET_STATUS_OFFLINE",
  BEFORE_INSTALL_PROMPT = "BEFORE_INSTALL_PROMPT",
  USER_INSTALL_CHOICE = "USER_INSTALL_CHOICE",
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

export type TechActions =
  | SetStatusOnline
  | SetStatusOffline
  | BeforeInstallPropmt
  | UserInstallChoice;
