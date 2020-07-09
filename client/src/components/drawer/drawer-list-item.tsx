import React, { useCallback } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { NavLink, useRouteMatch } from "react-router-dom";
import { IMenuLink } from "./drawer-content";
import { makeStyles } from "@material-ui/core/styles";

const LINK_OFFSET: number = 10;

const useStyles = makeStyles((theme) => ({
  listItem: {
    width: "auto",
  },
  listItemText: {
    fontSize: "0.8rem",
  },
}));

interface DrawerListItemProps extends IMenuLink {
  closeDrawer: () => void;
}

export const DrawerListItem = ({
  offset = 0,
  to,
  label,
  icon: Icon,
  onClick,
  sub,
  afterLabel: AfterLabel,
  closeDrawer,
  highlighted = true,
}: DrawerListItemProps) => {
  const classes = useStyles();
  const match = useRouteMatch({
    path: to,
    exact: true,
  });

  const handleLinkClick = useCallback(() => {
    closeDrawer();
    onClick && onClick();
  }, [closeDrawer, onClick]);

  return (
    <div>
      <ListItem
        className={classes.listItem}
        onClick={handleLinkClick}
        component={NavLink}
        to={to}
        button
        selected={!!match && highlighted}
        style={{ marginLeft: offset }}
      >
        <ListItemIcon>
          <Icon fontSize="small" color={match ? "primary" : "action"} />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ className: classes.listItemText }}
        >
          {label}
          {AfterLabel && <AfterLabel />}
        </ListItemText>
      </ListItem>
      {sub &&
        sub.map((route) => (
          <DrawerListItem
            key={route.label}
            icon={route.icon}
            label={route.label}
            offset={offset + LINK_OFFSET}
            to={to + route.to}
            sub={route.sub}
            closeDrawer={closeDrawer}
          />
        ))}
    </div>
  );
};
