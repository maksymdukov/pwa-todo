import React from "react";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ITodoListItem } from "models/ITodoListItem";
import UserAvatar from "components/user-avatar/user-avatar";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  item: {
    color: "inherit",
    margin: `${theme.spacing()}px 0`,
    boxShadow: theme.shadows[1],
    textDecoration: "inherit",
    transition: theme.transitions.create("box-shadow", {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      boxShadow: theme.shadows[5],
    },
  },
  itemContent: {
    flexGrow: 1,
  },
  itemActions: {},
}));

const TodoListItem = ({ title, creator, id, created }: ITodoListItem) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.item} to={`/todos/${id}`} component={Link}>
      <ListItemAvatar>
        <UserAvatar src={creator.profile.picture} />
      </ListItemAvatar>
      <ListItemText>
        <div>
          <Typography variant="subtitle2">
            Created: {new Date(created).toDateString()}
          </Typography>
          {title}
        </div>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TodoListItem;
