import { createSelector } from 'reselect';
import { AppState } from 'store/store';

export const getUserState = (state: AppState) => state.user;

export const getIsAuthenticated = createSelector(
  getUserState,
  ({ isAuthenticated }) => isAuthenticated
);

export const getIsAuthenticating = createSelector(
  getUserState,
  ({ isAuthenticating }) => isAuthenticating
);
