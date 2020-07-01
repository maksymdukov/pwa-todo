import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Profile } from "pages/profile";
import Todos from "./pages/todos";
import Notifications from "pages/notifications";
import { useConnectionStatus } from "hooks/use-connection-status";
import { useInitTodos } from "hooks/use-init-todos";
import { useSocketIO } from "hooks/use-socketio";

export const AuthRoutes = () => {
  useConnectionStatus();
  const { initializeTodos } = useInitTodos();
  const { initSocket, socketRef } = useSocketIO();
  useEffect(() => {
    (async () => {
      await initializeTodos();
      await initSocket();
    })();
    return () => {
      console.log("Todos INIT useEffect return, before closing");

      // eslint-disable-next-line
      socketRef.current?.close();
    };
  }, [initializeTodos, initSocket, socketRef]);
  return (
    <Switch>
      <Route path="/todos" component={Todos} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Notifications} />
      <Redirect to="/todos" />
    </Switch>
  );
};
