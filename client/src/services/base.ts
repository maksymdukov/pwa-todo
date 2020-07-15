import { Method, AxiosRequestConfig, AxiosResponse } from "axios";
import { authPersistence, AuthPersistence } from "services/auth-persistence";
import { config } from "config/config";
import { AuthData } from "pages/auth/signin/types";
import { axios } from "libs/axios";
import { InvalidRefreshToken } from "errors/invalid-refresh-token";
import { store } from "store/store";
import { logout } from "store/user/actions";
import { AuthorizationError } from "errors/authorization-error";

interface RequestOptions {
  url?: string;
  method: Method;
  withAuth?: boolean;
  data?: any;
  [key: string]: any;
}

export class Base {
  baseUrl: string;
  _defaultHeaders: object;
  _authStorage: AuthPersistence;

  constructor(path: string) {
    this.baseUrl = config.BASE_API_URL + path;
    this._defaultHeaders = {};
    this._authStorage = authPersistence;
  }

  async request<T = any>({
    url,
    method,
    withAuth = true,
    data,
    ...other
  }: RequestOptions): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method,
      url,
      baseURL: this.baseUrl,
      data,
      headers: { ...this._defaultHeaders },
      ...other,
    };
    try {
      if (withAuth) {
        let auth = this._authStorage.getAndValidateTokens();
        if (!auth.refreshToken || !auth.accessToken) {
          throw new AuthorizationError();
        }
        let accessToken = auth.accessToken;
        if (auth.accessTokenExpired) {
          const authObject = await this.refreshToken();
          accessToken = authObject.accessToken;
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return axios(config);
    } catch (e) {
      if (
        e instanceof AuthorizationError ||
        e instanceof InvalidRefreshToken ||
        e.response?.status === 401
      ) {
        // Authorization failed. Logging out...
        store.dispatch(logout());
        throw e;
      }
      throw e;
    }
  }

  async refreshToken(): Promise<AuthData> {
    try {
      let { refreshToken } = this._authStorage.getAndValidateTokens();
      const decoded = this._authStorage.getDecodedAccessToken();
      const userId = decoded!.sub;
      const response = await axios.post<AuthData>(
        config.BASE_API_URL + "/auth/token",
        {
          refreshToken,
          userId,
        }
      );
      this._authStorage.storeAuthData(response.data);
      return response.data;
    } catch (e) {
      if (e.response?.status === 401) {
        throw new InvalidRefreshToken();
      }
      throw e;
    }
  }
}
