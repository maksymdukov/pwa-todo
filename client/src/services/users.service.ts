import { Base } from "./base";
import { CancelToken } from "axios";

export interface UserType {
  email: string;
  id: string;
}

export type GetUserResponse = UserType[];

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
