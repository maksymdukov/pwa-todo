import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  makeStyles,
  ListItemText,
  Typography,
  ListSubheader,
} from "@material-ui/core";
import { ITodo, ISharedUser } from "models/ITodo";
import { blue } from "@material-ui/core/colors";
import UserAvatar from "components/user-avatar";
import UserAutocomplete from "../user-autocomplete/user-autocomplete";
import { todosService } from "services/todos.service";
import { useDispatch } from "react-redux";
import { syncTodos } from "store/todos/todos.actions";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

interface ShareDialogProps {
  closeDialog: () => void;
  dialogOpened: boolean;
  todo: ITodo;
}

const useStyles = makeStyles({
  listItem: {
    "&:hover": {
      "& $removeIcon": {
        visibility: "visible",
      },
    },
  },
  removeIcon: {
    visibility: "hidden",
    color: "red",
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

const ShareDialog = ({ closeDialog, dialogOpened, todo }: ShareDialogProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [sharedUsers, setSharedUsers] = useState<ISharedUser[]>(todo.shared);
  const onDeleteClick = (userId: string) => async () => {
    await todosService.unshareTodo(todo.id, userId);
    setSharedUsers(sharedUsers.filter((usr) => usr.id !== userId));
    dispatch(syncTodos());
  };
  const onSuccessfulShare = (usr: ISharedUser) => {
    setSharedUsers([...sharedUsers, usr]);
  };
  return (
    <Dialog open={dialogOpened} onClose={closeDialog} keepMounted={false}>
      <DialogTitle>Share this todo</DialogTitle>
      <ListSubheader>Shared with:</ListSubheader>
      <List>
        {sharedUsers.map((person) => (
          <ListItem
            button
            onClick={onDeleteClick(person.id)}
            key={person.email}
            className={classes.listItem}
          >
            <ListItemAvatar>
              <UserAvatar src={person.profile.picture} />
            </ListItemAvatar>
            <ListItemText primary={person.email} />
            <RemoveCircleIcon className={classes.removeIcon} />
          </ListItem>
        ))}
        <ListSubheader>Share:</ListSubheader>
        <UserAutocomplete todo={todo} onSharedSuccess={onSuccessfulShare} />
      </List>
    </Dialog>
  );
};

export default ShareDialog;
