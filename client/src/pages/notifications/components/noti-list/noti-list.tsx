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

interface NotiListProps {
  unread: boolean;
  getItems: (state: any) => INotification[];
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

const NotiList = ({ unread, getItems, fetchAction }: NotiListProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const items = useSelector(getItems);
  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch, fetchAction]);
  return (
    <List className={clsx(!unread && classes.readList)}>
      {items.map((noti) => (
        <ListItem key={noti.id} component={Paper} className={classes.listItem}>
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
