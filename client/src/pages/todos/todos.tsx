import React, { useEffect } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import { TodosScopes } from "./todo-scopes";
import TodosView from "pages/todos/components/todos-view";
import SingleTodo from "pages/single-todo";
import { useConnectionStatus } from "hooks/use-connection-status";
import { useSocketIO } from "hooks/use-socketio";
import { useInitTodos } from "hooks/use-init-todos";

const Todos = ({ match }: RouteComponentProps) => {
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
      <Route
        path={match.path}
        exact
        render={(props) => <TodosView scope={TodosScopes.all} {...props} />}
      />
      <Route
        path={match.path + "/my"}
        render={(props) => <TodosView scope={TodosScopes.my} {...props} />}
      />
      <Route
        path={match.path + "/shared"}
        render={(props) => <TodosView scope={TodosScopes.shared} {...props} />}
      />
      <Route
        path={match.path + "/new"}
        exact
        render={(props) => <SingleTodo isNew {...props} />}
      />
      <Route path={`${match.path}/:id`} component={SingleTodo} />
    </Switch>
  );
};

export default Todos;
