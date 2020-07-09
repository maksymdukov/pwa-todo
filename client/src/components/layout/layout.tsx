import React, { FC, useCallback } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { NavDrawer } from "components/drawer";
import { Navbar } from "components/navbar";

export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  main: {
    flexGrow: 1,
  },
}));

export const Layout: FC = ({ children }) => {
  const classes = useStyles();
  const [mobileOpen, setDrawerOpen] = React.useState(false);
  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prevState) => !prevState);
  }, [setDrawerOpen]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar toggleDrawer={handleDrawerToggle} />
      <NavDrawer drawerOpened={mobileOpen} toggleDrawer={handleDrawerToggle} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.main}>{children}</div>
      </main>
    </div>
  );
};
