import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { ITodoListItem } from "models/ITodoListItem";
import { useDispatch } from "react-redux";
import { deleteTodoAction } from "store/todo/todo.actions";

interface TodoMenuProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  todo: ITodoListItem;
}

const TodoMenu = ({ anchorEl, handleClose, todo }: TodoMenuProps) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteTodoAction(todo.id));
    handleClose();
  };
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>
  );
};

export default TodoMenu;
