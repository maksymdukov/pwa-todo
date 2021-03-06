import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Profile } from "pages/profile";
import Todos from "./pages/todos";
import Notifications from "pages/notifications";
import { useConnectionEffect } from "hooks/use-connection-status";
import { useInitTodos } from "hooks/use-init-todos";
import { useSocketIO } from "hooks/use-socketio";

export const AuthRoutes = () => {
  useConnectionEffect();
  const { initializeTodos } = useInitTodos();
  const { initSocket, socketRef } = useSocketIO();

  useEffect(() => {
    (async () => {
      await initializeTodos();
      await initSocket();
    })();
    return () => {
      // eslint-disable-next-line
      socketRef.current?.close();
    };
  }, [initializeTodos, initSocket, socketRef]);

  return (
    <Switch>
      <Route path="/notes" component={Todos} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Notifications} />
      <Redirect to="/notes" />
    </Switch>
  );
};
