import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import TodosView from "pages/todos/components/todos-view";
import SingleTodo from "pages/single-todo";

const Todos = ({ match }: RouteComponentProps) => {
  return (
    <Switch>
      <Route
        path={match.path + "/"}
        exact
        render={props => <TodosView scope="all" {...props} />}
      />
      <Route
        path={match.path + "/my"}
        render={props => <TodosView scope="my" {...props} />}
      />
      <Route
        path={match.path + "/shared"}
        render={props => <TodosView scope="shared" {...props} />}
      />
      <Route
        path={match.path + "/new"}
        exact
        render={props => <SingleTodo isNew {...props} />}
      />
      <Route path={`${match.path}/:id`} component={SingleTodo} />
    </Switch>
  );
};

export default Todos;
