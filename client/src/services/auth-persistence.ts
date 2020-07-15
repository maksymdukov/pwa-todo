import jwtDecode from "jwt-decode";
import { AuthData } from "pages/auth/signin/types";

interface Storage {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, obj: string) => void;
}

// TODO persist auth data in IndexedDB

export class AuthPersistence {
  _storage: Storage;
  _authStorageKey: string;
  constructor(storage: Storage) {
    this._storage = storage;
    this._authStorageKey = "auth";
  }

  retrieveAuthData(): string | null {
    return this._storage.getItem(this._authStorageKey);
  }

  getAuthObject(): null | AuthData {
    const authData = this.retrieveAuthData();
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  }

  storeAuthData(authObject: AuthData): void {
    const authData = JSON.stringify(authObject);
    this._storage.setItem(this._authStorageKey, authData);
  }

  removeAuthData(): void {
    return this._storage.removeItem(this._authStorageKey);
  }

  getRefreshToken(): string | null {
    const authObject = this.getAuthObject();
    if (!authObject) return null;
    return authObject.refreshToken;
  }

  isAccessTokenExpired(accessToken: string): boolean {
    const now = Math.round(new Date().getTime() / 1000);
    const { exp } = jwtDecode(accessToken);
    return now + 60 > exp;
  }

  getAndValidateTokens(): { accessTokenExpired: boolean } & Partial<AuthData> {
    const result = {
      accessTokenExpired: true,
    };
    const authObject = this.getAuthObject();
    if (!authObject) return result;
    result.accessTokenExpired = this.isAccessTokenExpired(
      authObject.accessToken
    );
    return { ...authObject, ...result };
  }

  getDecodedAccessToken(): {
    sub: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  } | null {
    const authObj = this.getAuthObject();
    if (authObj) {
      return jwtDecode(authObj.accessToken);
    }
    return null;
  }
}

export const authPersistence = new AuthPersistence(localStorage);
