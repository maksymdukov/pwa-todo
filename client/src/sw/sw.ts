import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

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

self.addEventListener("push", (ev) => {
  console.log("ev.data", ev.data?.json());
});

// workbox.routing.registerNavigationRoute(
//   workbox.precaching.getCacheKeyForURL("/index.html"),
//   {
//     blacklist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
//   }
// );
