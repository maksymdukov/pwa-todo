import { Base } from "services/base";

export class AuthService extends Base {
  constructor() {
    super("/auth");
  }

  // login(data) {
  //   return this.request({
  //     url: "login",
  //     method: "post",
  //     withAuth: false,
  //     data
  //   });
  // }

  // loginGoogle(code) {
  //   return this.login({ code, provider: "google" });
  // }

  // loginFacebook(code) {
  //   return this.login({ code, provider: "facebook" });
  // }
}

export const authService = new AuthService();
