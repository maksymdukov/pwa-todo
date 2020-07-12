import { Base } from "services/base";
import { AuthData } from "pages/auth/signin/types";

export interface IRegistrationUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IEmailActivation {
  email: string;
  activationToken: string;
}

export interface IResetPasswordFinish {
  email: string;
  resetToken: string;
  newPassword: string;
}

export class AuthService extends Base {
  constructor() {
    super("/auth");
  }

  async register(newUser: IRegistrationUser) {
    return this.request({
      url: "/register",
      method: "POST",
      withAuth: false,
      data: newUser,
    });
  }

  async login(user: ILoginUser) {
    return this.request<AuthData>({
      url: "/login",
      method: "POST",
      withAuth: false,
      data: user,
    });
  }

  async activateEmail(data: IEmailActivation) {
    return this.request<AuthData>({
      url: "/activateemail",
      method: "POST",
      withAuth: false,
      data,
    });
  }

  async resetPasswordStart(data: { email: string }) {
    return this.request({
      url: "/resetpasswordstart",
      method: "POST",
      withAuth: false,
      data,
    });
  }

  async resetPasswordFinish(data: IResetPasswordFinish) {
    return this.request<AuthData>({
      url: "/resetpasswordfinish",
      method: "POST",
      withAuth: false,
      data,
    });
  }
}

export const authService = new AuthService();
