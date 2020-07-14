import React, { useCallback } from "react";
import { Button, Typography, makeStyles } from "@material-ui/core";
import { GoogleIcon } from "components/icons/google";
import { FacebookIcon } from "components/icons/facebook";
import { config } from "config/config";
import { useDispatch } from "react-redux";
import { doLogin } from "store/user/actions";
import { AuthData } from "../types";
import { LoginProviders, useAuthPopup } from "hooks/use-auth-popup";

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

const getSocialLink = (provider: LoginProviders) =>
  `${config.BASE_API_URL}/auth/${provider}/start`;

const Socials = ({ signup = false }: SocialsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onAuthSuccess = useCallback(
    (data: AuthData) => {
      dispatch(doLogin(data));
    },
    [dispatch]
  );
  const { openPopup, error } = useAuthPopup({ onSuccess: onAuthSuccess });

  return (
    <>
      <section className={classes.social}>
        <div className={classes.innerWrapper}>
          <Button
            variant="outlined"
            onClick={() => openPopup(LoginProviders.google, getSocialLink)}
          >
            <GoogleIcon />
            {signup ? "Signup" : "Login"} with Google
          </Button>
          <br />
          <Button
            variant="outlined"
            onClick={() => openPopup(LoginProviders.facebook, getSocialLink)}
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
