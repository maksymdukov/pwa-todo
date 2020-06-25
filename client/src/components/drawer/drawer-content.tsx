import React from "react";
import ListAltIcon from "@material-ui/icons/ListAlt";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PermIdentityRoundedIcon from "@material-ui/icons/PermIdentityRounded";
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded";
import {
  List,
  Divider,
  makeStyles,
  Typography,
  Button,
  SvgIcon,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import { DrawerListItem } from "./drawer-list-item";
import { Link } from "react-router-dom";

export type IMenuLink = {
  label: string;
  icon: typeof SvgIcon;
  to: string;
  offset?: number;
  highlighted?: boolean;
  onClick?: () => void;
  sub?: IMenuLink[];
};

const links: IMenuLink[] = [
  {
    label: "Todos",
    icon: ListAltIcon,
    to: "/todos",
    highlighted: false,
    sub: [
      {
        label: "My",
        icon: PermIdentityRoundedIcon,
        to: "/my",
      },
      {
        label: "Shared with me",
        icon: PeopleOutlineRoundedIcon,
        to: "/shared",
      },
    ],
  },
  { label: "Notifications", icon: NotificationsIcon, to: "/notifications" },
];

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  logoutBtn: {
    margin: theme.spacing(),
    marginTop: "auto",
  },
  notAuthWrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export const DrawerContent = () => {
  const isAuth = useSelector(getIsAuthenticated);
  const classes = useStyles();
  return (
    <>
      <div className={classes.toolbar} />
      <Divider />
      {isAuth && (
        <>
          <List>
            {links.map((link, index) => (
              <DrawerListItem key={index} {...link} />
            ))}
          </List>
          <Divider />
          <Link to="/todos/new">Create new TODO</Link>
        </>
      )}
      {!isAuth && (
        <div className={classes.notAuthWrapper}>
          <Typography color="textSecondary">
            Please,
            <Button color="primary" component={Link} to="/signin">
              sign in
            </Button>
            first
          </Typography>
        </div>
      )}
    </>
  );
};
