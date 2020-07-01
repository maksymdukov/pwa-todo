import React from "react";
import { Tabs, Tab, Paper } from "@material-ui/core";
import NotiList from "./components/noti-list/noti-list";
import { fetchUnreadNotifications } from "store/unread-notifications/notifications.actions";
import { getUnreadNotificationsItems } from "store/unread-notifications/notifications.slice";
import { fetchReadNotifications } from "store/read-notifications/read-notifications.actions";
import { getReadNotificationsItems } from "store/read-notifications/read-notifications.slice";
import MarkRead from "./components/mark-read/mark-read";

const Notifications = () => {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <>
      <Paper square>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Unread" />
          <Tab label="Old" />
        </Tabs>
      </Paper>
      {tab === 0 && (
        <>
          <MarkRead />
          <NotiList
            fetchAction={fetchUnreadNotifications}
            getItems={getUnreadNotificationsItems}
            unread={true}
          />
        </>
      )}
      {tab === 1 && (
        <NotiList
          fetchAction={fetchReadNotifications}
          getItems={getReadNotificationsItems}
          unread={false}
        />
      )}
    </>
  );
};

export default Notifications;
