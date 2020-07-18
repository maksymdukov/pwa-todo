import { makePaginatedReducer } from "utils/redux/paginatedSlice";
import { INotification } from "models/INotification";

const {
  reducer,
  fetchFail,
  fetchReset,
  fetchStart,
  fetchSuccess,
  getError,
  getItems,
  getPagination,
  getStatus,
} = makePaginatedReducer<INotification>(
  "readNotifications",
  (state) => state.readNotifications
);

export {
  reducer as readNotificationsReducer,
  fetchFail,
  fetchStart,
  fetchSuccess,
  fetchReset as fetchResetReadNotifications,
  getError as getReadNotificationsError,
  getItems as getReadNotificationsItems,
  getPagination as getReadNotificationsPagination,
  getStatus as getReadNotificationsStatus,
};
