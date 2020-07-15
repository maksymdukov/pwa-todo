import React, { useCallback } from "react";
import { Button, Typography, makeStyles } from "@material-ui/core";
import { GoogleIcon } from "components/icons/google";
import { FacebookIcon } from "components/icons/facebook";
import { config } from "config/config";
import { LoginProviders, useAuthPopup } from "hooks/use-auth-popup";
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
    marginBottom: spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btnEmail: {
    margin: "0 1rem",
  },
  socialbtn: {
    textTransform: "none",
  },
  icon: {
    marginRight: spacing(),
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
  const onAuthSuccess = useCallback(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
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
      {error && (
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      )}
      <section className={classes.social}>
        <div className={classes.innerWrapper}>
          {/* if registered not via google initially */}
          {!userState.googleId && (
            <Button
              className={classes.socialbtn}
              variant="outlined"
              onClick={
                userState.linked?.googleId
                  ? handleUnlinkClick(LoginProviders.google)
                  : handleLinkClick(LoginProviders.google)
              }
            >
              <GoogleIcon className={classes.icon} />
              {!userState.linked?.googleId && "Link with Google"}
              {userState.linked?.googleId && (
                <div style={{ display: "inline-block" }}>
                  <Typography className={classes.btnEmail} variant="caption">
                    Email: {userState.linked.googleEmail}
                  </Typography>
                  UNLINK
                </div>
              )}
            </Button>
          )}
          <br />
          {!userState.facebookId && (
            <Button
              variant="outlined"
              className={classes.socialbtn}
              onClick={
                userState.linked?.facebookId
                  ? handleUnlinkClick(LoginProviders.facebook)
                  : handleLinkClick(LoginProviders.facebook)
              }
            >
              <FacebookIcon className={classes.icon} />
              {!userState.linked?.facebookId && "Link with Facebook"}
              {userState.linked?.facebookId && (
                <div style={{ display: "inline-block" }}>
                  <Typography className={classes.btnEmail} variant="caption">
                    Email: {userState.linked.facebookEmail}
                  </Typography>
                  UNLINK
                </div>
              )}
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

export default SocialLinking;
