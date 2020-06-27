import { Method, AxiosRequestConfig, AxiosResponse } from "axios";
import { authPersistence, AuthPersistence } from "services/auth-persistence";
import { config } from "config/config";
import { AuthData } from "pages/auth/signin/types";
import { axios } from "libs/axios";

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
    if (withAuth) {
      let auth = this._authStorage.getAndValidateTokens();
      if (!auth.refreshToken || !auth.accessToken) {
        // logout user
        // removeStorage
        return Promise.reject();
      }
      let accessToken = auth.accessToken;
      if (auth.accessTokenExpired) {
        const authObject = await this.refreshToken(auth.refreshToken);
        if (!authObject) {
          return Promise.reject();
        }
        accessToken = authObject.accessToken;
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return axios(config);
  }

  async refreshToken(refreshToken: string): Promise<AuthData | null> {
    try {
      const decoded = this._authStorage.getDecodedAccessToken();
      const userId = decoded!.sub;
      const response = await axios.post<AuthData>(
        config.BASE_API_URL + "/auth/token",
        {
          refreshToken,
          userId,
        }
      );
      if (response.data.accessToken && response.data.refreshToken) {
        this._authStorage.storeAuthData(response.data);
        return response.data;
      } else {
        return null;
      }
    } catch (e) {
      console.log("Error refreshing token");
      return null;
    }
  }
}
