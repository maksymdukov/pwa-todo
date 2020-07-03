import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  offline: {
    opacity: 0.5,
  },
});

const OfflineLabel = () => {
  const classes = useStyles();
  return (
    <Box className={classes.offline}>
      <Typography variant="h4">Not available when offline</Typography>
    </Box>
  );
};

export default OfflineLabel;
