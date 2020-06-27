import React, { useEffect } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import { TodosScopes } from "./todo-scopes";
import TodosView from "pages/todos/components/todos-view";
import SingleTodo from "pages/single-todo";
import { useDispatch } from "react-redux";
import { syncTodos, setTodoItems } from "store/todos/todos.actions";
import { todosIDB } from "services/todos-idb.service";
import { useConnectionStatus } from "hooks/use-connection-status";

const Todos = ({ match }: RouteComponentProps) => {
  useConnectionStatus();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      // Get todos from db
      const dbTodos = await todosIDB.getAllTodos();
      dispatch(setTodoItems({ items: dbTodos }));
      // Then try syncing on mount
      dispatch(syncTodos());
    })();
  }, [dispatch]);

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
