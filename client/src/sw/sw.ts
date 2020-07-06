import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { INotification } from "models/INotification";
import { TodoHistoryReason } from "models/TodoHistoryReason";

/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: string[];
  }
}

declare var self: ServiceWorkerGlobalScope;
export default null;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST, {});

const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
});

registerRoute(navigationRoute);

self.addEventListener("push", (event) => {
  console.log("Push Notification received", event);
  const data = event.data?.json() as INotification;
  if (data.reason === TodoHistoryReason.shared) {
    event.waitUntil(
      self.registration.showNotification(`You've got new shared note`, {
        icon: "/logo192.png",
        badge: "/logo192.png",
        data: {
          url: `/notifications`,
        },
      })
    );
  }
});

self.addEventListener("notificationclose", function (event) {
  console.log("Notification was closed", event);
});

self.addEventListener("notificationclick", function (event) {
  var notification = event.notification;
  var action = event.action;

  console.log(action);

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function (clis) {
      const windowClients = clis as WindowClient[];
      if (windowClients.length) {
        windowClients[0].navigate(notification.data.url);
        windowClients[0].focus();
      } else {
        self.clients.openWindow(notification.data.url);
      }
      notification.close();
    })
  );
});
