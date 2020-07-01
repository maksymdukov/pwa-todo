import {
  fetchStart,
  fetchFail,
  fetchSuccess,
} from "./read-notifications.slice";
import { AppThunk } from "store/tools";
import { notificationsService } from "services/notifications.service";

export const fetchReadNotifications = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const { data } = await notificationsService.getRead();
    dispatch(fetchSuccess(data));
  } catch (error) {
    dispatch(fetchFail({ error: null }));
  }
};
