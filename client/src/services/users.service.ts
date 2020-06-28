import { Base } from "./base";
import { CancelToken } from "axios";
import { ISharedUser } from "models/ITodo";

export type GetUserResponse = ISharedUser[];

export class UsersService extends Base {
  async getUsers(email: string, cancelToken: CancelToken) {
    return this.request<GetUserResponse>({
      method: "GET",
      url: email ? `?email=${email}` : "",
      cancelToken,
    });
  }
}

export const usersService = new UsersService("/users");
