import { UserProfile } from './reducer';
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export enum userActionTypes {
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_ERROR = 'LOGIN_ERROR',
  LOGOUT = 'LOGOUT'
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

export type UserActions =
  | LoginSuccessAction
  | LoginStartAction
  | LoginErrorAction
  | LogoutAction;
