import React, { useEffect, useState, useCallback } from "react";
import { authService } from "services/auth.service";
import { useDispatch } from "react-redux";
import { doLogin } from "store/user/actions";
import { Button, Typography } from "@material-ui/core";
import { RouteComponentProps } from "react-router";

const ActivateAccount = (props: RouteComponentProps) => {
  const dispatch = useDispatch();
  const [authdata, setAuthdata] = useState({
    accessToken: "",
    refreshToken: "",
  });
  const [error, setError] = useState(false);
  const login = useCallback(() => {
    dispatch(doLogin(authdata));
  }, [dispatch, authdata]);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const email = params.get("email");
    const token = params.get("token");
    if (email && token) {
      (async () => {
        try {
          const {
            data: { accessToken, refreshToken },
          } = await authService.activateEmail({
            email,
            activationToken: token,
          });
          setAuthdata({ accessToken, refreshToken });
        } catch (error) {
          setError(true);
        }
      })();
    } else {
      setError(true);
    }
  }, [dispatch, setAuthdata, setError]);

  useEffect(() => {
    let timeout: any;
    if (authdata.accessToken && authdata.refreshToken) {
      timeout = setTimeout(() => {
        login();
      }, 3000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  }, [authdata, dispatch, login]);

  return (
    <div>
      {error && <Typography>Error occured</Typography>}
      {authdata.accessToken && authdata.refreshToken && (
        <>
          <Typography>Your account is activated.</Typography>
          <Button variant="text" onClick={login}>
            Autologin
          </Button>
          <Typography>in 3 seconds.</Typography>
        </>
      )}
    </div>
  );
};

export default ActivateAccount;
