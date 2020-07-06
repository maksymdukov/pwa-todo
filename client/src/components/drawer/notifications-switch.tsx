import React from "react";
import { Switch, FormControlLabel, Box } from "@material-ui/core";
import { useNotifications } from "hooks/use-notifications";
import { useSelector } from "react-redux";
import { getConnetionStatus } from "store/tech/tech.selectors";

const NotificationsSwitch = () => {
  const connectionStatus = useSelector(getConnetionStatus);
  const { getSwitchProps } = useNotifications({ connectionStatus });
  return (
    <Box pl={2}>
      <FormControlLabel
        control={<Switch {...getSwitchProps()} name="checkedA" />}
        label="Recieve notifications"
      />
    </Box>
  );
};

export default NotificationsSwitch;
