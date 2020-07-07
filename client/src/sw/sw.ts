/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { INotification } from "models/INotification";
import { TodoHistoryReason } from "models/TodoHistoryReason";

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

// Precache App shell
precacheAndRoute(self.__WB_MANIFEST, {});

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Chache images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Respond to any navigation route with app shell
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
});

registerRoute(navigationRoute);

// Handle web push notification
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
