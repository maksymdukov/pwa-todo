import React, { useCallback, ReactEventHandler } from "react";
import { useSelector } from "react-redux";
import {
  getIsReadyForOffline,
  getIsNewVersionAvailable,
} from "store/tech/tech.selectors";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { getIsAuthenticated } from "store/user/selectors";
import { SWEventTypes } from "models/sw-event-types";

export const useServiceWorkerEvents = () => {
  const { enqueueSnackbar } = useSnackbar();
  const readyForOffline = useSelector(getIsReadyForOffline);
  const newVersionAvailable = useSelector(getIsNewVersionAvailable);
  const isAuth = useSelector(getIsAuthenticated);

  const handleAppUpdate: ReactEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      navigator.serviceWorker.controller?.postMessage({
        type: SWEventTypes.SKIP_WAITING,
      });
      // window.location.reload();
    },
    []
  );

  useEffect(() => {
    if (readyForOffline && isAuth) {
      enqueueSnackbar("Ready for offline use", { variant: "info" });
    }
  }, [readyForOffline, enqueueSnackbar, isAuth]);

  useEffect(() => {
    if (newVersionAvailable && isAuth) {
      enqueueSnackbar(
        <div>
          New app verison is available.{" "}
          <button onClick={handleAppUpdate}>Click</button> to update and reload
          page.
        </div>,
        { variant: "info", autoHideDuration: 8000 }
      );
    }
  }, [newVersionAvailable, enqueueSnackbar, isAuth, handleAppUpdate]);
};
