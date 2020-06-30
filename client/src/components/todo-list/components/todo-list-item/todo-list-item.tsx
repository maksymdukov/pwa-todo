import React from "react";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Avatar,
  Box,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import UserAvatar from "components/user-avatar/user-avatar";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TodoMenu from "../todo-menu/todo-menu";
import { ITodoListItem } from "models/ITodoListItem";
import { UserState } from "store/user/reducer";
import { ConnectionStatus } from "store/tech/tech.reducer";

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
  sharedContainer: {
    "& > :not(:first-child)": {
      marginLeft: -10,
    },
    opacity: 0.8
  },
  sharedAvatar: {
    width: "1em",
    height: "1em",
  },
  fallbackSharedAvatar: {
    color: theme.palette.grey[500],
  },
}));

interface TodoListItemProps {
  todo: ITodoListItem;
  userState: UserState;
  connetionStatus: ConnectionStatus;
}

const TodoListItem = (props: TodoListItemProps) => {
  const {
    todo: { title, creator, id, updatedAt, pending, shared },
    userState,
    connetionStatus,
  } = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const isMyTodo = creator.id === userState.id;

  return (
    <ListItem className={classes.item} to={`/todos/${id}`} component={Link}>
      <ListItemAvatar>
        <UserAvatar src={creator.profile.picture} />
      </ListItemAvatar>
      <ListItemText>
        <div>
          <Typography variant="subtitle2">
            Updated: {new Date(updatedAt).toLocaleString()}
          </Typography>
          <div>{title}</div>
          {isMyTodo && (
            <Box
              display="flex"
              alignItems="center"
              className={classes.sharedContainer}
            >
              {shared.map((sharedUser) => (
                <UserAvatar
                  key={sharedUser.id}
                  src={sharedUser.profile.picture}
                  className={classes.sharedAvatar}
                  fallbackClassname={classes.fallbackSharedAvatar}
                />
              ))}
            </Box>
          )}
          {pending && <div style={{ color: "red" }}>pending</div>}
        </div>
      </ListItemText>
      {isMyTodo && (
        <ListItemSecondaryAction>
          <IconButton onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
          <TodoMenu
            anchorEl={anchorEl}
            handleClose={closeMenu}
            todo={props.todo}
            connetionStatus={connetionStatus}
          />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default TodoListItem;
