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
import { Link } from "react-router-dom";
import { AccountMenu } from "./account-menu";
import { getSyncState } from "store/todos/todos.selectors";
import { syncTodos } from "store/todos/todos.actions";
import { getConnetionStatus } from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";
import { SyncStatus } from "store/todos/todos.reducer";
import InstallAppBtn from "./install-app-btn";

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  logo: {
    display: "flex",
    alignItems: "center",
    marginRight: "auto",
    color: "inherit",
    textDecoration: "none",
  },
  logoIcon: {
    width: "2rem",
    height: "2rem",
    marginRight: ".5rem",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  installIcon: {
    backgroundColor: theme.palette.common.white,
  },
}));

interface NavbarProps {
  openDrawer: () => void;
}

export const Navbar = ({ openDrawer }: NavbarProps) => {
  const syncStatus = useSelector(getSyncState);
  const isAuth = useSelector(getIsAuthenticated);
  const isAuthenticating = useSelector(getIsAuthenticating);
  const status = useSelector(getConnetionStatus);
  const classes = useStyles();
  const dispatch = useDispatch();

  const syncing = syncStatus === SyncStatus.IN_PROGRESS;

  const doSync = () => {
    dispatch(syncTodos());
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={openDrawer}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Link to="/" className={classes.logo}>
          <img
            className={classes.logoIcon}
            src="/android-icon-48x48.png"
            alt="notes"
          />
          <Typography variant="h6" noWrap color="inherit">
            Notes
          </Typography>
        </Link>
        <InstallAppBtn />
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
