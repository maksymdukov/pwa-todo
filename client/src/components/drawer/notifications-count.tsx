import React from "react";
import { useSelector } from "react-redux";
import { getUnreadNotificationsPagination } from "store/unread-notifications/notifications.slice";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(({ palette }) => ({
  badge: {
    height: 20,
    minWidth: 20,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.error.main,
    color: palette.error.contrastText,
    padding: 4,
    borderRadius: 10,
    marginLeft: ".5rem",
    fontWeight: "bold",
  },
}));

const NotificationsCount = () => {
  const classes = useStyles();
  const { total } = useSelector(getUnreadNotificationsPagination);
  return !!total ? <span className={classes.badge}>{total}</span> : null;
};

export default NotificationsCount;
