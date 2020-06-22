import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";

export const DeleteAccount = () => {
  const [modalOpened, setModalState] = useState(false);
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);
  return (
    <>
      <Button variant="contained" color="secondary" onClick={openModal}>
        Delete Account
      </Button>
      <Dialog open={modalOpened} onClose={closeModal}>
        <DialogTitle>Do you really want to delete your account?</DialogTitle>
        <DialogContent>You data will be deleted.</DialogContent>
        <DialogActions>
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
