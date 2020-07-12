import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { SignIn } from "pages/auth/signin";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import { AuthRoutes } from "./auth-routes";
import { ProtectedRoute } from "components/route";
import SignUp from "pages/auth/signup";
import ActivateAccount from "pages/auth/activate-account";

export const Routes = () => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  // TODO refactor to avoid code duplications
  return (
    <Switch>
      <Route
        path="/signin"
        exact
        render={(props) =>
          isAuthenticated ? <Redirect to="/todos" /> : <SignIn {...props} />
        }
      />
      <Route
        path="/signup"
        exact
        render={(props) =>
          isAuthenticated ? <Redirect to="/todos" /> : <SignUp {...props} />
        }
      />
      <Route
        path="/activateaccount"
        exact
        render={(props) =>
          isAuthenticated ? (
            <Redirect to="/todos" />
          ) : (
            <ActivateAccount {...props} />
          )
        }
      />
      <ProtectedRoute component={AuthRoutes} />
    </Switch>
  );
};
