import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  addBtn: {
    position: "fixed",
    bottom: 20,
    right: 20
  }
});

interface SaveTodoBtnProps {
  onClick: () => void;
}

const SaveTodoBtn = ({ onClick }: SaveTodoBtnProps) => {
  const classes = useStyles();
  return (
    <Fab className={classes.addBtn} color="primary" onClick={onClick}>
      <SaveIcon />
    </Fab>
  );
};

export default SaveTodoBtn;
