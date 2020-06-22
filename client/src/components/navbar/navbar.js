import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { drawerWidth } from "components/layout/layout";
import { useSelector } from "react-redux";
import { getIsAuthenticated, getIsAuthenticating } from "store/user/selectors";
import { Link, useHistory } from "react-router-dom";
import { AccountMenu } from "./account-menu";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  }
}));

export const Navbar = ({ onDrawerOpen }) => {
  const history = useHistory();
  const isAuth = useSelector(getIsAuthenticated);
  const isAuthenticating = useSelector(getIsAuthenticating);
  const classes = useStyles();
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
        {isAuth && <AccountMenu />}
        {isAuthenticating && <CircularProgress color="inherit" />}
      </Toolbar>
    </AppBar>
  );
};
