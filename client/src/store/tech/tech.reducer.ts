import { TechActions, techActionTypes } from "./tech.types";

export enum ConnectionStatus {
  online = "online",
  offline = "offline",
}

export type TechStateType = {
  status: ConnectionStatus;
};

const initialState = {
  status: navigator.onLine ? ConnectionStatus.online : ConnectionStatus.offline,
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
    default:
      return state;
  }
};
