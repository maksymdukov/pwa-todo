import { userActionTypes, UserActions } from "./types";
import { authPersistence } from "services/auth-persistence";

export type UserProfile = Readonly<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}>;

type UserState = Readonly<{
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}> &
  UserProfile;

const decoded = authPersistence.getDecodedAccessToken();

const initState: UserState = {
  isAuthenticated: !!decoded,
  isAuthenticating: false,
  id: decoded?.sub || "",
  email: decoded?.email || "",
  firstName: decoded?.firstName || "",
  lastName: decoded?.lastName || "",
  picture: decoded?.picture || ""
};

export const userReducer = (
  state = initState,
  action: UserActions
): UserState => {
  switch (action.type) {
    case userActionTypes.LOGIN_START:
      return { ...state, isAuthenticating: true };
    case userActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        picture: action.payload.picture
      };
    case userActionTypes.LOGOUT:
      return {
        isAuthenticated: false,
        isAuthenticating: false,
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        picture: ""
      };
    default:
      return state;
  }
};
