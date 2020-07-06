import { Base } from "./base";
import { CancelToken } from "axios";
import { ISharedUser } from "models/ITodo";
import { IWebSubscription } from "models/IWebSubscription";

export type GetUserResponse = ISharedUser[];

export class UsersService extends Base {
  async getUsers(email: string, cancelToken: CancelToken) {
    return this.request<GetUserResponse>({
      method: "GET",
      url: email ? `?email=${email}` : "",
      cancelToken,
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
