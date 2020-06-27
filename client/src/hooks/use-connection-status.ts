import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStatusOnline, setStatusOffline } from "store/tech/tech.actions";
import { syncTodos } from "store/todos/todos.actions";

export const useConnectionStatus = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const updateOnlineStatus = () => {
      console.log("navigator.onLine changed", navigator.onLine);

      if (navigator.onLine) {
        dispatch(setStatusOnline());
        dispatch(syncTodos());
      } else {
        dispatch(setStatusOffline());
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
