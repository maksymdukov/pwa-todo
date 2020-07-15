import { Base } from "./base";
import { CancelToken } from "axios";
import { ISharedUser } from "models/ITodo";
import { IWebSubscription } from "models/IWebSubscription";
import { UserProfile } from "store/user/reducer";
import { LoginProviders } from "hooks/use-auth-popup";

export type GetUserResponse = ISharedUser[];

export type ProfileResponse = {
  linked?: {
    googleId?: string;
    googleEmail?: string;
    facebookId?: string;
    facebookEmail?: string;
  };
  googleId?: string;
  facebookId: string;
  profile: UserProfile;
};

export class UsersService extends Base {
  async getProfile() {
    return this.request<ProfileResponse>({
      method: "GET",
      url: "/profile",
    });
  }

  async saveProfile(data: { firstName: string; lastName: string }) {
    return this.request({
      method: "PATCH",
      url: "/profile",
      data,
    });
  }

  unlinkProvider(provider: LoginProviders) {
    return this.request({
      method: "PATCH",
      url: "/unlink-provider",
      data: { provider },
    });
  }

  async getUsers(email: string, cancelToken: CancelToken) {
    return this.request<GetUserResponse>({
      method: "GET",
      url: email ? `?email=${email}` : "",
      cancelToken,
    });
  }

  async changePassword(data: { newPassword: string }) {
    return this.request({
      method: "POST",
      url: "/changepassword",
      data,
    });
  }

  async getLinkToken() {
    return this.request<{ linkToken: string }>({
      method: "GET",
      url: "/getlinktoken",
    });
  }

  async deleteAccount() {
    return this.request({
      method: "POST",
      url: "/deleteaccount",
    });
  }

  async checkPushSubscription(endpoint: string) {
    return this.request({
      method: "GET",
      url: "/webpush",
      params: { endpoint },
    });
  }

  async addPushSubscription(sub: IWebSubscription) {
    return this.request({
      method: "POST",
      url: "/webpush",
      data: sub,
    });
  }

  async removePushSubscription(sub: IWebSubscription) {
    return this.request({
      method: "DELETE",
      url: "/webpush",
      data: sub,
    });
  }
}

export const usersService = new UsersService("/users");
