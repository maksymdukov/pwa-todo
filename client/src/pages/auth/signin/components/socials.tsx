import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Typography, makeStyles } from "@material-ui/core";
import { GoogleIcon } from "components/icons/google";
import { FacebookIcon } from "components/icons/facebook";
import { config } from "config/config";
import { useDispatch } from "react-redux";
import { doLogin } from "store/user/actions";
import { AuthData } from "../types";

enum LoginProviders {
  google = "google",
  facebook = "facebook",
}

interface SocialsProps {
  signup?: boolean;
}

const useStyles = makeStyles(({ spacing }) => ({
  social: {
    marginTop: spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  innerWrapper: {
    "& > *": {
      marginBottom: spacing(),
    },
  },
}));

const Socials = ({ signup = false }: SocialsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const popupRef = useRef<Window | null>();
  const [error, setError] = useState("");

  const loginSuccessHandler = useCallback(
    (event: MessageEvent) => {
      if (popupRef.current === event.source) {
        const authData: AuthData = JSON.parse(event.data);
        if (authData.error) {
          return setError(authData.error);
        }
        dispatch(doLogin(JSON.parse(event.data)));
        console.log(JSON.parse(event.data));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("message", loginSuccessHandler);
    return () => {
      window.removeEventListener("message", loginSuccessHandler);
    };
  }, [loginSuccessHandler]);

  const openPopup = (provider: LoginProviders) => {
    setError("");
    const width = 500;
    const height = 500;
    const left = window.screenX + window.outerWidth / 2 - width / 2;
    const top = window.outerHeight / 2 - height / 2;
    popupRef.current = window.open(
      `${config.BASE_API_URL}/auth/${provider}/start`,
      "Authorization",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, left=${left}, top=${top}`
    );
  };

  return (
    <>
      <section className={classes.social}>
        <div className={classes.innerWrapper}>
          <Button
            variant="outlined"
            onClick={() => openPopup(LoginProviders.google)}
          >
            <GoogleIcon />
            {signup ? "Signup" : "Login"} with Google
          </Button>
          <br />
          <Button
            variant="outlined"
            onClick={() => openPopup(LoginProviders.facebook)}
          >
            <FacebookIcon />
            {signup ? "Signup" : "Login"} with Facebook
          </Button>
        </div>
      </section>
      {error && (
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      )}
    </>
  );
};

export default Socials;
