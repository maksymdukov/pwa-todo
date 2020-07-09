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
  closeDrawer: () => void;
}

export const NavDrawer = ({ drawerOpened, closeDrawer }: NavDrawerProps) => {
  const classes = useStyles();

  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={drawerOpened}
          onClose={closeDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <DrawerContent closeDrawer={closeDrawer} />
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
          <DrawerContent closeDrawer={closeDrawer} />
        </Drawer>
      </Hidden>
    </nav>
  );
};
