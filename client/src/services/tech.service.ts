import { Base } from "./base";

export class TechService extends Base {
  checkStatus() {
    return this.request({
      method: "GET",
      url: "/status",
      timeout: 700,
      withAuth: false,
    });
  }
}

export const techService = new TechService("");
