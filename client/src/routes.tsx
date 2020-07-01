import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { SignIn } from "pages/auth/signin";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import { AuthRoutes } from "./auth-routes";
import { ProtectedRoute } from "components/route";

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
      <ProtectedRoute component={AuthRoutes} />
    </Switch>
  );
};
