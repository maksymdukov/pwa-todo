import React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  makeStyles,
  ListItemText,
} from "@material-ui/core";
import { ITodo } from "models/ITodo";
import { blue } from "@material-ui/core/colors";
import UserAvatar from "components/user-avatar";
import UserAutocomplete from "../user-autocomplete/user-autocomplete";

interface ShareDialogProps {
  closeDialog: () => void;
  dialogOpened: boolean;
  todo: ITodo;
}

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

const ShareDialog = ({ closeDialog, dialogOpened, todo }: ShareDialogProps) => {
  const classes = useStyles();
  return (
    <Dialog open={dialogOpened} onClose={closeDialog} keepMounted={false}>
      <DialogTitle>Share this todo</DialogTitle>
      <List>
        {todo.shared.map((person) => (
          <ListItem
            button
            // onClick={() => handleListItemClick(email)}
            key={person.email}
          >
            <ListItemAvatar>
              <UserAvatar src={person.profile.picture} />
            </ListItemAvatar>
            <ListItemText primary={person.email} />
          </ListItem>
        ))}
        <UserAutocomplete todo={todo} />
        {/* <ListItem
          autoFocus
          button
          onClick={() => handleListItemClick("addAccount")}
        >
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem> */}
      </List>
    </Dialog>
  );
};

export default ShareDialog;
