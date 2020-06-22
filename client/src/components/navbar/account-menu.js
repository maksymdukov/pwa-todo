import React, { useState } from "react";
import {
  IconButton,
  Menu,
  Typography,
  Box,
  Divider
} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import PeopleIcon from "@material-ui/icons/People";
import { logout } from "store/user/actions";
import { useDispatch, useSelector } from "react-redux";
import { AccountMenuItem } from "./account-menu-item";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";
import { getUserState } from "store/user/selectors";
import { makeStyles } from "@material-ui/core/styles";
import UserAvatar from "components/user-avatar";

const menuLinks = [
  { label: "My profile", icon: FaceIcon, to: "/profile" },
  { label: "Friends", icon: PeopleIcon, to: "/friends" }
];

const useStyles = makeStyles({
  pic: {
    width: "1em",
    height: "1em",
    fontSize: "inherit"
  }
});

export const AccountMenu = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(getUserState);
  const [anchorEl, setAnchor] = useState(null);

  const onAccountClick = e => {
    setAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchor(null);
  };

  const onLogoutClick = () => {
    closeMenu();
    dispatch(logout());
    history.push("/");
  };
  return (
    <>
      <IconButton
        color="inherit"
        onClick={onAccountClick}
        aria-controls="account-menu"
        aria-haspopup="true"
      >
        <UserAvatar className={classes.pic} src={user.picture} />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        onClose={closeMenu}
        open={!!anchorEl}
      >
        <Box padding={1}>
          <Box display="flex" justifyContent="center" alignContent="center">
            <UserAvatar size={40} src={user.picture} />
          </Box>
          <Typography
            variant="subtitle1"
            display="block"
            align="center"
            gutterBottom
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="subtitle2" display="block">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        {menuLinks.map((menuItem, index) => (
          <AccountMenuItem key={index} onClick={closeMenu} {...menuItem} />
        ))}
        <AccountMenuItem
          onClick={onLogoutClick}
          icon={ExitToAppIcon}
          label="Logout"
        />
      </Menu>
    </>
  );
};
