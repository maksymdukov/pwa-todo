import { store } from "store/store";
import { beforeInstallEvent } from "store/tech/tech.actions";

let deferredPrompt: { event: any } = { event: null };

window.addEventListener("beforeinstallprompt", function (event: any) {
  console.log("beforeinstallprompt");

  event.preventDefault();
  deferredPrompt.event = event;
  store.dispatch(beforeInstallEvent());
  return false;
});

export { deferredPrompt };
