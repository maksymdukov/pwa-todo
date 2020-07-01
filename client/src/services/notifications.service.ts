import { Base } from "./base";
import { PaginatedResponse } from "models/PaginatedResponse";
import { INotification } from "models/INotification";

export class NotificationsService extends Base {
  async getUnread() {
    return this.request<PaginatedResponse<INotification>>({
      url: "/unread",
      method: "GET",
    });
  }

  async getRead() {
    return this.request<PaginatedResponse<INotification>>({
      url: "/read",
      method: "GET",
    });
  }

  async markRead(ids: string[]) {
    return this.request({ url: "/markread", method: "PATCH", data: { ids } });
  }
}

export const notificationsService = new NotificationsService("/notifications");
