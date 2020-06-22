import React from "react";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { NavLink, useRouteMatch } from "react-router-dom";

export const AccountMenuItem = React.forwardRef(
  ({ to, label, icon: Icon, onClick }, ref) => {
    const match = useRouteMatch({
      path: to
    });

    return (
      <MenuItem
        ref={ref}
        onClick={onClick}
        component={to ? NavLink : "li"}
        to={to}
        button
        selected={!!match}
      >
        <ListItemIcon>
          <Icon color="primary" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    );
  }
);
