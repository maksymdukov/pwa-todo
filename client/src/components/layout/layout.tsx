import React, { FC } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { NavDrawer } from "components/drawer";
import { Navbar } from "components/navbar";
import { Box } from "@material-ui/core";
import BackBtn from "components/buttons/back-btn";

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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar onDrawerOpen={handleDrawerToggle} />
      <NavDrawer drawerOpened={mobileOpen} onDrawerOpen={handleDrawerToggle} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.main}>
          <Box>
            <BackBtn />
          </Box>
          {children}
        </div>
      </main>
    </div>
  );
};
