import { UserActions, userActionTypes } from "./types";
import { authPersistence } from "services/auth-persistence";
import jwtDecode from "jwt-decode";
import { AuthData } from "pages/auth/signin/types";
import { AppThunk } from "store/tools";
import { UserProfile } from "./reducer";
import { idb } from "services/idb.service";
import { ProfileResponse, usersService } from "services/users.service";

export const loginStart = (): UserActions => ({
  type: userActionTypes.LOGIN_START,
});

export const loginSuccess = ({
  id,
  email,
  firstName,
  lastName,
  picture,
}: UserProfile): UserActions => ({
  type: userActionTypes.LOGIN_SUCCESS,
  payload: { email, firstName, lastName, picture, id },
});

export const loginError = (): UserActions => ({
  type: userActionTypes.LOGIN_ERROR,
});

export const logoutAction = (): UserActions => ({
  type: userActionTypes.LOGOUT,
});

export const fetchProfileStart = (): UserActions => ({
  type: userActionTypes.FETCH_PROFILE_START,
});

export const fetchProfileSuccess = (data: ProfileResponse): UserActions => ({
  type: userActionTypes.FETCH_PROFILE_SUCCESS,
  payload: data,
});
export const fetchProfileFail = (error?: string): UserActions => ({
  type: userActionTypes.FETCH_PROFILE_FAIL,
  payload: { error },
});

export const fetchProfile = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(fetchProfileStart());
    const { data } = await usersService.getProfile();
    dispatch(fetchProfileSuccess(data));
  } catch (error) {
    console.error(error);
    dispatch(fetchProfileFail("Error occured"));
  }
};

export const doLogin = (authData: AuthData): AppThunk => (dispatch) => {
  authPersistence.storeAuthData(authData);
  const { email, firstName, lastName, picture, sub: id } = jwtDecode(
    authData.accessToken
  );
  dispatch(loginSuccess({ email, firstName, lastName, picture, id }));
};

export const logout = (): AppThunk => async (dispatch) => {
  dispatch(logoutAction());
  await authPersistence.removeAuthData();
  // remove todos from indexedDB
  await idb.clearAllDBs();
};
