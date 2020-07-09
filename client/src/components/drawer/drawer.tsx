import React from "react";
import { Hidden, Drawer, makeStyles } from "@material-ui/core";
import { drawerWidth } from "components/layout/layout";
import { DrawerContent } from "./drawer-content";

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

interface NavDrawerProps {
  drawerOpened: boolean;
  toggleDrawer: () => void;
}

export const NavDrawer = ({ drawerOpened, toggleDrawer }: NavDrawerProps) => {
  const classes = useStyles();

  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={drawerOpened}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <DrawerContent toggleDrawer={toggleDrawer} />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <DrawerContent toggleDrawer={toggleDrawer} />
        </Drawer>
      </Hidden>
    </nav>
  );
};
