import React, { useState } from "react";
import { Box, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { getUnreadNotificationsItems } from "store/unread-notifications/notifications.slice";
import { notificationsService } from "services/notifications.service";
import { fetchUnreadNotifications } from "store/unread-notifications/notifications.actions";

interface MarkBtnState {
  loading: boolean;
  error: null | object;
}

const MarkRead = () => {
  const dispatch = useDispatch();
  const items = useSelector(getUnreadNotificationsItems);
  const [state, setState] = useState<MarkBtnState>({
    loading: false,
    error: null,
  });
  const handleClick = async () => {
    try {
      setState({ loading: true, error: null });
      const ids = items.map((itm) => itm.id);
      await notificationsService.markRead(ids);
      setState({ error: null, loading: false });
      dispatch(fetchUnreadNotifications());
    } catch (error) {
      setState({ error: error, loading: false });
    }
  };
  return (
    <Box textAlign="right">
      <Button variant="text" color="primary" onClick={handleClick}>
        {state.loading ? "Loading..." : "Mark read"}
      </Button>
    </Box>
  );
};

export default MarkRead;
