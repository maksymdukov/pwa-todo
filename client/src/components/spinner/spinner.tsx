import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

interface SpinnerProps {
  isActive: boolean;
}

const Spinner = ({ isActive }: SpinnerProps) => {
  return isActive ? (
    <Box textAlign="center">
      <CircularProgress />
    </Box>
  ) : null;
};

export default Spinner;
