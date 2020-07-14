import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { SignIn } from "pages/auth/signin";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import { AuthRoutes } from "./auth-routes";
import SignUp from "pages/auth/signup";
import ActivateAccount from "pages/auth/activate-account";
import ResetPasswordStart from "pages/auth/reset-password-start";
import ResetPasswordFinished from "pages/auth/reset-password-finish";
import { useServiceWorkerEvents } from "hooks/use-service-worker-events";

const routes = [
  { path: "/signin", exact: true, component: SignIn },
  { path: "/signup", exact: true, component: SignUp },
  { path: "/activateaccount", exact: true, component: ActivateAccount },
  { path: "/resetpassword", exact: true, component: ResetPasswordStart },
  {
    path: "/resetpasswordfinish",
    exact: true,
    component: ResetPasswordFinished,
  },
];

export const Routes = () => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  useServiceWorkerEvents();
  return (
    <Switch>
      {isAuthenticated && <AuthRoutes />}
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
      <Redirect to="/signin" />
    </Switch>
  );
};
