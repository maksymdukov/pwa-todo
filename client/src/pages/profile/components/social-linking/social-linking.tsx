import React, { useCallback } from "react";
import { Button, Typography, makeStyles } from "@material-ui/core";
import { GoogleIcon } from "components/icons/google";
import { FacebookIcon } from "components/icons/facebook";
import { config } from "config/config";
import { LoginProviders, useAuthPopup } from "hooks/use-auth-popup";
import { AuthData } from "pages/auth/signin/types";
import { usersService } from "services/users.service";
import { useSelector, useDispatch } from "react-redux";
import { getUserState } from "store/user/selectors";
import { fetchProfile } from "store/user/actions";

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
  btnEmail: {
    margin: "0 1rem",
  },
  innerWrapper: {
    "& > *": {
      marginBottom: spacing(),
    },
  },
}));

const SocialLinking = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userState = useSelector(getUserState);
  const onAuthSuccess = useCallback(
    (data: AuthData) => {
      dispatch(fetchProfile());
    },
    [dispatch]
  );
  const { openPopup, error } = useAuthPopup({ onSuccess: onAuthSuccess });

  const handleLinkClick = (provider: LoginProviders) => async () => {
    try {
      const {
        data: { linkToken },
      } = await usersService.getLinkToken();
      openPopup(
        provider,
        (provider) =>
          `${config.BASE_API_URL}/users/${provider}-link/start?id=${userState.id}&linkToken=${linkToken}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlinkClick = (provider: LoginProviders) => async () => {
    try {
      await usersService.unlinkProvider(provider);
      dispatch(fetchProfile());
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <section className={classes.social}>
        <div className={classes.innerWrapper}>
          {/* if registered not via google initially */}
          {!userState.googleId && (
            <Button
              variant="outlined"
              onClick={
                userState.linked?.googleId
                  ? handleUnlinkClick(LoginProviders.google)
                  : handleLinkClick(LoginProviders.google)
              }
            >
              <GoogleIcon />
              {!userState.linked?.googleId && "Link with Google"}
              {userState.linked?.googleId && (
                <div style={{ display: "inline-block" }}>
                  <Typography className={classes.btnEmail} variant="caption">
                    Email: {userState.linked.googleEmail}
                  </Typography>
                  Unlink
                </div>
              )}
            </Button>
          )}
          <br />
          <Button
            variant="outlined"
            onClick={
              userState.linked?.facebookId
                ? handleUnlinkClick(LoginProviders.facebook)
                : handleLinkClick(LoginProviders.facebook)
            }
          >
            <FacebookIcon />
            {!userState.linked?.facebookId && "Link with Facebook"}
            {userState.linked?.facebookId && (
              <div style={{ display: "inline-block" }}>
                <Typography className={classes.btnEmail} variant="caption">
                  Email: {userState.linked.facebookEmail}
                </Typography>
                Unlink
              </div>
            )}
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

export default SocialLinking;
