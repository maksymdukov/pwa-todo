import { ITodo } from "models/ITodo";

export enum techActionTypes {
  SET_STATUS_ONLINE = "SET_STATUS_ONLINE",
  SET_STATUS_OFFLINE = "SET_STATUS_OFFLINE",
}

export interface SetStatusOnline {
  type: techActionTypes.SET_STATUS_ONLINE;
}

export interface SetStatusOffline {
  type: techActionTypes.SET_STATUS_OFFLINE;
}

export type TechActions = SetStatusOnline | SetStatusOffline;
