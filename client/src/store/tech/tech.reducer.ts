import { TechActions, techActionTypes } from "./tech.types";

export enum ConnectionStatus {
  online = "online",
  offline = "offline",
}

export type TechStateType = {
  status: ConnectionStatus;
  beforeInstallPrompt: boolean;
  userInstallChoice: boolean | null;
  readyForOffline: boolean;
  newVersionAvailable: boolean;
};

const initialState: TechStateType = {
  status: navigator.onLine ? ConnectionStatus.online : ConnectionStatus.offline,
  beforeInstallPrompt: false,
  userInstallChoice: null,
  readyForOffline: false,
  newVersionAvailable: false,
};

export const techReducer = (
  state = initialState,
  action: TechActions
): TechStateType => {
  switch (action.type) {
    case techActionTypes.SET_STATUS_ONLINE:
      return { ...state, status: ConnectionStatus.online };
    case techActionTypes.SET_STATUS_OFFLINE:
      return { ...state, status: ConnectionStatus.offline };
    case techActionTypes.BEFORE_INSTALL_PROMPT:
      return { ...state, beforeInstallPrompt: true };
    case techActionTypes.USER_INSTALL_CHOICE:
      return { ...state, userInstallChoice: action.payload.choice };
    case techActionTypes.NEW_VERSION_AVAILABLE:
      return { ...state, newVersionAvailable: true };
    case techActionTypes.READY_FOR_OFFLINE:
      return { ...state, readyForOffline: true };
    default:
      return state;
  }
};
