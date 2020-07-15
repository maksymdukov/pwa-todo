import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { usersService } from "services/users.service";
import { useDispatch } from "react-redux";
import { logout } from "store/user/actions";
import { getSubscription } from "hooks/use-notifications";

export const DeleteAccount = () => {
  const dispatch = useDispatch();
  const [modalOpened, setModalState] = useState(false);
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);
  const [deleteState, setDeleteState] = useState({
    loading: false,
    error: "",
  });

  const handleDeleteClick = async () => {
    try {
      setDeleteState((prevState) => ({ ...prevState, loading: true }));
      await usersService.deleteAccount();
      setDeleteState((prevState) => ({ ...prevState, loading: false }));
      dispatch(logout());
      const { subscription } = await getSubscription();
      subscription?.unsubscribe();
    } catch (error) {
      console.error(error);
      setDeleteState((prevState) => ({
        ...prevState,
        loading: false,
        error: "Error occured",
      }));
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={openModal}>
        Delete Account
      </Button>
      <Dialog
        open={modalOpened}
        onClose={deleteState.loading ? undefined : closeModal}
      >
        <DialogTitle>Do you really want to delete your account?</DialogTitle>
        <DialogContent>You data will be deleted.</DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            variant="outlined"
            color="primary"
            disabled={deleteState.loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteClick}
            disabled={deleteState.loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
