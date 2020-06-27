import { UserActions, userActionTypes } from "./types";
import { authPersistence } from "services/auth-persistence";
import jwtDecode from "jwt-decode";
import { AuthData } from "pages/auth/signin/types";
import { AppThunk } from "store/tools";
import { UserProfile } from "./reducer";

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

const timeout = (timeout: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(loginStart());
  await timeout(1000);
  dispatch(
    loginSuccess({
      email: "test@test.com",
      firstName: "Max",
      lastName: "Dukov",
      picture: "",
      id: "someId",
    })
  );
  return;
};

export const socialLogin = (authData: AuthData): AppThunk => (dispatch) => {
  authPersistence.storeAuthData(authData);
  const { email, firstName, lastName, picture, sub: id } = jwtDecode(
    authData.accessToken
  );
  dispatch(loginSuccess({ email, firstName, lastName, picture, id }));
};

export const logout = (): UserActions => {
  authPersistence.removeAuthData();
  // TODO remove todos from indexedDB
  return {
    type: userActionTypes.LOGOUT,
  };
};
