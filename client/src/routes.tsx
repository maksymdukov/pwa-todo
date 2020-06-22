import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { SignIn } from "pages/auth/signin";
import { ProtectedRoute } from "components/route";
import { Profile } from "pages/profile";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import Todos from "./pages/todos";

export const Routes = () => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  return (
    <Switch>
      <Route path="/" exact>
        Main page
      </Route>
      <Route
        path="/signin"
        exact
        render={props =>
          isAuthenticated ? <Redirect to="/" /> : <SignIn {...props} />
        }
      />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/todos" component={Todos} />
      <Redirect to="/" />
    </Switch>
  );
};
