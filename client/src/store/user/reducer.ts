import { userActionTypes, UserActions } from "./types";
import { authPersistence } from "services/auth-persistence";
import { ProfileResponse } from "services/users.service";

export type UserProfile = Readonly<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}>;

export type UserState = Readonly<{
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  profileLoading: boolean;
  profileError: null | string;
}> &
  UserProfile &
  ProfileResponse;

const decoded = authPersistence.getDecodedAccessToken();

const initState: UserState = {
  isAuthenticated: !!decoded,
  isAuthenticating: false,
  id: decoded?.sub || "",
  email: decoded?.email || "",
  firstName: decoded?.firstName || "",
  lastName: decoded?.lastName || "",
  picture: decoded?.picture || "",
  facebookId: "",
  googleId: "",
  profile: {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    picture: "",
  },
  profileLoading: false,
  profileError: null,
  linked: {
    googleId: "",
    googleEmail: "",
    facebookEmail: "",
    facebookId: "",
  },
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
        picture: action.payload.picture,
        id: action.payload.id,
      };
    case userActionTypes.LOGOUT:
      return {
        ...initState,
        isAuthenticated: false,
        isAuthenticating: false,
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        picture: "",
      };
    case userActionTypes.FETCH_PROFILE_START:
      return {
        ...state,
        profileLoading: true,
      };
    case userActionTypes.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        firstName: action.payload.profile.firstName,
        lastName: action.payload.profile.lastName,
        profileLoading: false,
        ...action.payload,
      };
    case userActionTypes.FETCH_PROFILE_FAIL:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload.error ?? null,
      };
    default:
      return state;
  }
};
