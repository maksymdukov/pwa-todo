import React, { useRef, useEffect } from "react";
import {
  Card,
  makeStyles,
  CardHeader,
  Box,
  Typography,
  CardContent,
  IconButton,
} from "@material-ui/core";
import { ITodoListItem } from "models/ITodoListItem";
import { UserState } from "store/user/reducer";
import { ConnectionStatus } from "store/tech/tech.reducer";
import UserAvatar from "components/user-avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TodoMenu from "../todo-menu/todo-menu";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { Link } from "react-router-dom";

interface MansoryGridItemProps {
  todo: ITodoListItem;
  userState: UserState;
  connetionStatus: ConnectionStatus;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(({ shadows }) => ({
  link: {
    textDecoration: "none",
  },
  card: {
    "$link &:hover": {
      boxShadow: shadows[7],
    },
  },
  cardContent: {
    position: "relative",
    maxHeight: 300,
    overflow: "hidden",
    paddingTop: 5,
    "&:last-child": {
      paddingBottom: 5,
    },
  },
  cardContentOverflow: {
    "&:after": {
      content: "''",
      display: "block",
      position: "absolute",
      background: "linear-gradient(to bottom, transparent, #ffffff 60%)",
      bottom: 0,
      left: 0,
      right: 0,
      height: 40,
    },
  },
  cardHeader: {
    paddingBottom: 5,
  },
  ownerIcon: {
    width: "2rem",
    height: "2rem",
  },
  sharedAvatar: {
    width: "1.2em",
    height: "1.2em",
  },
}));

const MansoryGridItem = React.forwardRef<
  HTMLAnchorElement,
  MansoryGridItemProps
>(({ connetionStatus, todo, userState, style }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { creator } = todo;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 300) {
        contentRef.current.classList.add(classes.cardContentOverflow);
      }
    }
  }, [todo, classes.cardContentOverflow]);
  const isMyTodo = creator.id === userState.id;
  return (
    <>
      <Link
        to={`/notes/${todo.id}`}
        className={classes.link}
        ref={ref}
        style={style}
      >
        <Card className={classes.card} elevation={3}>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <UserAvatar
                className={classes.ownerIcon}
                alt={`${creator.profile.firstName} ${creator.profile.lastName}`}
                imgProps={{
                  title: `${creator.profile.firstName} ${creator.profile.lastName}`,
                }}
                src={creator.profile.picture}
              />
            }
            titleTypographyProps={{ variant: "h6" }}
            title={todo.title}
            action={
              isMyTodo && (
                <>
                  <IconButton onClick={openMenu}>
                    <MoreVertIcon />
                  </IconButton>
                </>
              )
            }
          />
          <CardContent className={classes.cardContent} ref={contentRef}>
            {todo.records.map((rec) => (
              <Typography key={rec.id}>{rec.content}</Typography>
            ))}
          </CardContent>
          {isMyTodo && !!todo.shared.length && (
            <Box px={2} py={1}>
              <AvatarGroup max={5}>
                {todo.shared.map((sharedUser) => (
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
        </Card>
      </Link>
      <TodoMenu
        anchorEl={anchorEl}
        handleClose={closeMenu}
        todo={todo}
        connetionStatus={connetionStatus}
      />
    </>
  );
});

export default MansoryGridItem;
