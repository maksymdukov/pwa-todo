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
      <Route
        path="/signin"
        exact
        render={(props) =>
          isAuthenticated ? <Redirect to="/todos" /> : <SignIn {...props} />
        }
      />
      <ProtectedRoute path="/todos" component={Todos} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Redirect to="/todos" />
    </Switch>
  );
};
