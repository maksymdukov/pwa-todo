import { UserProfile } from "./reducer";
import { ProfileResponse } from "services/users.service";
export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT = "LOGOUT";

export enum userActionTypes {
  LOGIN_START = "LOGIN_START",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_ERROR = "LOGIN_ERROR",
  LOGOUT = "LOGOUT",
  FETCH_PROFILE_START = "FETCH_PROFILE_START",
  FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS",
  FETCH_PROFILE_FAIL = "FETCH_PROFILE_FAIL",
}

export interface LoginSuccessAction {
  type: userActionTypes.LOGIN_SUCCESS;
  payload: UserProfile;
}

export interface LoginStartAction {
  type: userActionTypes.LOGIN_START;
}

export interface LoginErrorAction {
  type: userActionTypes.LOGIN_ERROR;
}

export interface LogoutAction {
  type: userActionTypes.LOGOUT;
}

export interface FetchProfileStart {
  type: userActionTypes.FETCH_PROFILE_START;
}

export interface FetchProfileSuccess {
  type: userActionTypes.FETCH_PROFILE_SUCCESS;
  payload: ProfileResponse;
}

export interface FetchProfileFail {
  type: userActionTypes.FETCH_PROFILE_FAIL;
  payload: { error?: string };
}

export type UserActions =
  | LoginSuccessAction
  | LoginStartAction
  | LoginErrorAction
  | LogoutAction
  | FetchProfileStart
  | FetchProfileSuccess
  | FetchProfileFail;
