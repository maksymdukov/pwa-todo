import React from "react";
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useSelector } from "react-redux";
import { getIsAuthenticated } from "store/user/selectors";
import { useHistory } from "react-router";

const BackBtn = () => {
  const isAuth = useSelector(getIsAuthenticated);
  const history = useHistory();

  if (!isAuth) {
    return null;
  }

  const handleClick = () => {
    history.goBack();
  };

  return (
    <IconButton onClick={handleClick}>
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackBtn;
