import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { INotification } from "models/INotification";
import UserAvatar from "components/user-avatar";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { AppThunk } from "store/tools";
import { AppState } from "store/store";
import { PaginatedStatus } from "utils/redux/paginatedSlice";
import Spinner from "components/spinner";
import { getConnetionStatus } from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";
import { getSyncState } from "store/todos/todos.selectors";
import { SyncStatus } from "store/todos/todos.reducer";
import { TodoHistoryReason } from "models/TodoHistoryReason";
import { Link } from "react-router-dom";
import { notificationsService } from "services/notifications.service";
import { fetchUnreadCount } from "store/unread-notifications/notifications.actions";
import OfflineLabel from "components/typography/offline";

interface NotiListProps {
  unread: boolean;
  getItems: (state: AppState) => INotification[];
  getStatus: (state: AppState) => PaginatedStatus;
  fetchAction: () => AppThunk;
}

const useStyles = makeStyles({
  readList: {
    opacity: 0.7,
  },
  listItem: {
    marginBottom: "1rem",
  },
  listItemOpaque: {
    opacity: 0.6,
  },
  link: {
    textDecoration: "none",
    display: "block",
  },
});

const NotiList = ({
  unread,
  getItems,
  getStatus,
  fetchAction,
}: NotiListProps) => {
  const classes = useStyles();
  const connectionStatus = useSelector(getConnetionStatus);
  const dispatch = useDispatch();
  const items = useSelector(getItems);
  const status = useSelector(getStatus);
  const syncStatus = useSelector(getSyncState);
  useEffect(() => {
    if (
      connectionStatus === ConnectionStatus.online &&
      syncStatus !== SyncStatus.IN_PROGRESS &&
      syncStatus !== SyncStatus.NOT_STARTED
    ) {
      dispatch(fetchAction());
    }
  }, [dispatch, fetchAction, connectionStatus, syncStatus]);

  if (status === PaginatedStatus.FETCH_IN_PROGRESS) {
    return <Spinner isActive={true} />;
  }

  const onNotiClick = (id: string) => async () => {
    if (unread) {
      await notificationsService.markRead([id]);
      dispatch(fetchUnreadCount());
    }
  };

  return connectionStatus === ConnectionStatus.online ? (
    <List className={clsx(!unread && classes.readList)}>
      {items.map((noti) => {
        const listItem = (
          <ListItem
            component={Paper}
            className={clsx(
              classes.listItem,
              noti.reason !== TodoHistoryReason.shared && classes.listItemOpaque
            )}
            elevation={3}
          >
            <ListItemAvatar>
              <UserAvatar src={noti.sender?.profile?.picture} />
            </ListItemAvatar>
            <ListItemText>
              <Typography>Email: {noti.sender?.email || 'Deleted'}</Typography>
              <Typography>Type: {noti.reason}</Typography>
              <Typography>Title: {noti.data.title}</Typography>
            </ListItemText>
          </ListItem>
        );

        if (noti.reason === TodoHistoryReason.shared) {
          return (
            <Link
              to={`/todos/${noti.data.id}`}
              key={noti.id}
              onClick={onNotiClick(noti.id)}
              className={classes.link}
            >
              {listItem}
            </Link>
          );
        }

        return <React.Fragment key={noti.id}>{listItem}</React.Fragment>;
      })}
    </List>
  ) : (
    <OfflineLabel />
  );
};

export default NotiList;
