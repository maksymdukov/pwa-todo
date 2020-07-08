import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { deferredPrompt } from "sw/window-events";
import { setUserInstallChoice } from "store/tech/tech.actions";
import { useDispatch, useSelector } from "react-redux";
import {
  getInstallEvent,
  getUserInstallChoice,
} from "store/tech/tech.selectors";

const useStyles = makeStyles((theme) => ({
  iconWrapper: {
    position: "relative",
  },
  iconBg: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: theme.palette.common.white,
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
  },
}));

const InstallAppBtn = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const installEventFired = useSelector(getInstallEvent);
  const userInstallChoice = useSelector(getUserInstallChoice);
  const handleInstallClick = () => {
    if (deferredPrompt.event) {
      deferredPrompt.event.prompt();
      deferredPrompt.event.userChoice.then(function (choiceResult: any) {
        if (choiceResult.outcome === "dismissed") {
          dispatch(setUserInstallChoice(false));
          console.log("User cancelled installation");
        } else {
          dispatch(setUserInstallChoice(true));
          console.log("User added to home screen");
        }
      });
    }
  };

  if (!installEventFired || userInstallChoice) {
    return null;
  }

  return (
    <div className={classes.iconWrapper}>
      <div className={classes.iconBg} />
      <IconButton
        color="secondary"
        onClick={handleInstallClick}
        title="Install this app"
      >
        <InfoIcon />
      </IconButton>
    </div>
  );
};

export default InstallAppBtn;
