import React, { useState, useCallback } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { ITodoListItem } from "models/ITodoListItem";
import { useDispatch } from "react-redux";
import { deleteTodoAction } from "store/todo/todo.actions";
import ShareDialog from "../share-dialog/share-dialog";
import { ConnectionStatus } from "store/tech/tech.reducer";

interface TodoMenuProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  todo: ITodoListItem;
  connetionStatus: ConnectionStatus;
}

const TodoMenu = ({
  anchorEl,
  handleClose,
  todo,
  connetionStatus,
}: TodoMenuProps) => {
  const dispatch = useDispatch();

  const wrapInMenuClose = (fn: Function) => () => {
    fn();
    handleClose();
  };
  const handleDeleteClick = wrapInMenuClose(() => {
    dispatch(deleteTodoAction(todo.id));
  });

  // Dialog
  const [dialogOpened, setDialogOpened] = useState(false);

  const closeDialog = useCallback(() => {
    setDialogOpened(false);
  }, [setDialogOpened]);
  const openDialog = useCallback(() => {
    setDialogOpened(true);
  }, [setDialogOpened]);
  const handleShareClick = wrapInMenuClose(() => {
    openDialog();
  });

  return (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={handleShareClick}
          disabled={connetionStatus === ConnectionStatus.offline}
        >
          Share
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
      <ShareDialog
        dialogOpened={dialogOpened}
        closeDialog={closeDialog}
        todo={todo}
      />
    </>
  );
};

export default TodoMenu;
