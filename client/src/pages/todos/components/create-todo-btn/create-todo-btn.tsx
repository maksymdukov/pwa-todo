import React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";

export const useStyles = makeStyles({
  addBtn: {
    position: "fixed",
    bottom: 20,
    right: 20,
  },
});

const CreateTodoBtn = () => {
  const classes = useStyles();
  const history = useHistory();
  const handleBtnClick = () => {
    history.push("/notes/new");
  };
  return (
    <Fab className={classes.addBtn} color="primary" onClick={handleBtnClick}>
      <CreateOutlinedIcon />
    </Fab>
  );
};

export default CreateTodoBtn;
