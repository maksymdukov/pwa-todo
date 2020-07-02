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
});

const NotiList = ({
  unread,
  getItems,
  getStatus,
  fetchAction,
}: NotiListProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const items = useSelector(getItems);
  const status = useSelector(getStatus);
  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch, fetchAction]);

  if (status === PaginatedStatus.FETCH_IN_PROGRESS) {
    return <Spinner isActive={true} />;
  }

  return (
    <List className={clsx(!unread && classes.readList)}>
      {items.map((noti) => (
        <ListItem key={noti.id} component={Paper} className={classes.listItem} elevation={3}>
          <ListItemAvatar>
            <UserAvatar src={noti.sender.profile.picture} />
          </ListItemAvatar>
          <ListItemText>
            <Typography>Email: {noti.sender.email}</Typography>
            <Typography>Type: {noti.reason}</Typography>
            <Typography>Title: {noti.data.title}</Typography>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default NotiList;
