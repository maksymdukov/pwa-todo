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
  setTotal,
} = makePaginatedReducer<INotification>(
  "unreadNotifications",
  (state) => state.unreadNotifications
);

export {
  reducer as unreadNotificationsReducer,
  fetchFail,
  fetchStart,
  fetchSuccess,
  fetchReset,
  getError as getUnreadNotificationsError,
  getItems as getUnreadNotificationsItems,
  getPagination as getUnreadNotificationsPagination,
  getStatus as getUnreadNotificationsStatus,
  setTotal as setTotalUnreadNotifications,
};
