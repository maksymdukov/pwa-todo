import {
  fetchStart,
  fetchFail,
  fetchSuccess,
  setTotalUnreadNotifications,
} from "./notifications.slice";
import { AppThunk } from "store/tools";
import { notificationsService } from "services/notifications.service";

export const fetchUnreadNotifications = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const { data } = await notificationsService.getUnread();
    dispatch(fetchSuccess(data));
  } catch (error) {
    dispatch(fetchFail({ error: null }));
  }
};

export const fetchUnreadCount = (): AppThunk => async (dispatch) => {
  try {
    const { data } = await notificationsService.getUnreadCount();
    dispatch(setTotalUnreadNotifications(data.total));
  } catch (error) {
    console.error(error);
  }
};
