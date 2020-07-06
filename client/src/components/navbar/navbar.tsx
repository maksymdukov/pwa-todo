import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloudDoneOutlinedIcon from "@material-ui/icons/CloudDoneOutlined";
import CloudOffOutlinedIcon from "@material-ui/icons/CloudOffOutlined";

import { drawerWidth } from "components/layout/layout";
import { useSelector, useDispatch } from "react-redux";
import { getIsAuthenticated, getIsAuthenticating } from "store/user/selectors";
import { Link, useHistory } from "react-router-dom";
import { AccountMenu } from "./account-menu";
import { getSyncState } from "store/todos/todos.selectors";
import { syncTodos } from "store/todos/todos.actions";
import {
  getConnetionStatus,
  getInstallEvent,
  getUserInstallChoice,
} from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";
import { SyncStatus } from "store/todos/todos.reducer";
import { deferredPrompt } from "sw/window-events";
import { setUserInstallChoice } from "store/tech/tech.actions";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

interface NavbarProps {
  onDrawerOpen: () => void;
}

export const Navbar = ({ onDrawerOpen }: NavbarProps) => {
  const history = useHistory();
  const syncStatus = useSelector(getSyncState);
  const installEventFired = useSelector(getInstallEvent);
  const isAuth = useSelector(getIsAuthenticated);
  const isAuthenticating = useSelector(getIsAuthenticating);
  const status = useSelector(getConnetionStatus);
  const userInstallChoice = useSelector(getUserInstallChoice);
  const classes = useStyles();
  const dispatch = useDispatch();

  const syncing = syncStatus === SyncStatus.IN_PROGRESS;

  const doSync = () => {
    dispatch(syncTodos());
  };

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
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerOpen}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          color="inherit"
          className={classes.title}
          onClick={() => history.push("/")}
        >
          Todo
        </Typography>
        {installEventFired && !userInstallChoice && (
          <Button
            color="secondary"
            variant="contained"
            onClick={handleInstallClick}
          >
            Install this APP
          </Button>
        )}
        {!isAuth && !isAuthenticating && (
          <Button
            color="inherit"
            variant="outlined"
            component={Link}
            to="/signin"
          >
            Sign in
          </Button>
        )}
        {isAuth && (
          <>
            {status === ConnectionStatus.online ? (
              <IconButton onClick={doSync} color="inherit" disabled={syncing}>
                {!syncing && <CloudDoneOutlinedIcon />}
                {syncing && <CircularProgress color="secondary" size={20} />}
              </IconButton>
            ) : (
              <CloudOffOutlinedIcon color="inherit" />
            )}
          </>
        )}
        {isAuth && <AccountMenu />}
        {isAuthenticating && <CircularProgress color="inherit" />}
      </Toolbar>
    </AppBar>
  );
};
