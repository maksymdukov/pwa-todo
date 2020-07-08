import React from "react";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
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
import AvatarGroup from "@material-ui/lab/AvatarGroup";

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
  sharedAvatar: {
    width: "1.5em",
    height: "1.5em",
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
        <UserAvatar
          alt={`${creator.profile.firstName} ${creator.profile.lastName}`}
          imgProps={{
            title: `${creator.profile.firstName} ${creator.profile.lastName}`,
          }}
          src={creator.profile.picture}
        />
      </ListItemAvatar>
      <ListItemText>
        <div>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="subtitle2">
            Updated: {new Date(updatedAt).toLocaleString()}
          </Typography>
          {isMyTodo && (
            <Box>
              <AvatarGroup max={5}>
                {shared.map((sharedUser) => (
                  <UserAvatar
                    key={sharedUser.id}
                    src={sharedUser.profile.picture}
                    alt={`${sharedUser.profile.firstName} ${sharedUser.profile.lastName}`}
                    className={classes.sharedAvatar}
                    imgProps={{
                      title: `${sharedUser.profile.firstName} ${sharedUser.profile.lastName}`,
                    }}
                  />
                ))}
              </AvatarGroup>
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
