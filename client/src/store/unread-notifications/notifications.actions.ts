import { fetchStart, fetchFail, fetchSuccess } from "./notifications.slice";
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
