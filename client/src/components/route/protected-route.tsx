import React from "react";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface ProtectedRouteProps {
  isProtected?: Boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps & RouteProps> = ({
  isProtected = true,
  ...rest
}) => {
  const isAuth = useSelector(getIsAuthenticated);
  if (!isAuth && isProtected) return <Redirect to="/signin" />;
  return <Route {...rest} />;
};
