import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { runOnlineActions, runOfflineActions } from "store/tech/tech.actions";

export const useConnectionEffect = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const updateOnlineStatus = () => {
      console.log("navigator.onLine changed", navigator.onLine);

      if (navigator.onLine) {
        dispatch(runOnlineActions());
      } else {
        dispatch(runOfflineActions());
      }
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [dispatch]);
};
