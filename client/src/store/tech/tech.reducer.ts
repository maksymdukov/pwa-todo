import { TechActions, techActionTypes } from "./tech.types";

export enum ConnectionStatus {
  online = "online",
  offline = "offline",
}

export type TechStateType = {
  status: ConnectionStatus;
  beforeInstallPrompt: boolean;
  userInstallChoice: boolean | null;
};

const initialState: TechStateType = {
  status: navigator.onLine ? ConnectionStatus.online : ConnectionStatus.offline,
  beforeInstallPrompt: false,
  userInstallChoice: null,
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
    default:
      return state;
  }
};
