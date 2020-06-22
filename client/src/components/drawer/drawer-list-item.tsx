import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { NavLink, useRouteMatch } from "react-router-dom";
import { IMenuLink } from "./drawer-content";
import { makeStyles } from "@material-ui/core/styles";

const LINK_OFFSET: number = 10;

const useStyles = makeStyles(theme => ({
  listItem: {
    width: "auto"
  },
  listItemText: {
    fontSize: "0.8rem"
  }
}));

export const DrawerListItem = ({
  offset = 0,
  to,
  label,
  icon: Icon,
  onClick,
  sub,
  highlighted = true
}: IMenuLink) => {
  const classes = useStyles();
  const match = useRouteMatch({
    path: to
  });

  return (
    <div>
      <ListItem
        className={classes.listItem}
        onClick={onClick}
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
        </ListItemText>
      </ListItem>
      {sub &&
        sub.map(route => (
          <DrawerListItem
            key={route.label}
            icon={route.icon}
            label={route.label}
            offset={offset + LINK_OFFSET}
            to={to + route.to}
            sub={route.sub}
          />
        ))}
    </div>
  );
};
