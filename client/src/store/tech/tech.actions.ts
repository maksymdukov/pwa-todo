import { TechActions, techActionTypes } from "./tech.types";
import { AppThunk } from "store/tools";
import { techService } from "services/tech.service";
import { wait } from "utils/timeout";
import { getConnetionStatus } from "./tech.selectors";
import { ConnectionStatus } from "./tech.reducer";
import { syncTodos, syncReset } from "store/todos/todos.actions";
import { fetchUnreadCount } from "store/unread-notifications/notifications.actions";

export const setStatusOnline = (): TechActions => ({
  type: techActionTypes.SET_STATUS_ONLINE,
});

export const setStatusOffline = (): TechActions => ({
  type: techActionTypes.SET_STATUS_OFFLINE,
});

export const beforeInstallEvent = (): TechActions => ({
  type: techActionTypes.BEFORE_INSTALL_PROMPT,
});

export const setUserInstallChoice = (choice: boolean): TechActions => ({
  type: techActionTypes.USER_INSTALL_CHOICE,
  payload: { choice },
});

export const setReadyForOffline = (): TechActions => ({
  type: techActionTypes.READY_FOR_OFFLINE,
});

export const setNewVersionAvailable = (): TechActions => ({
  type: techActionTypes.NEW_VERSION_AVAILABLE,
});

export const checkConnection = (
  retryAction: () => AppThunk
): AppThunk => async (dispatch, getState) => {
  let offlineStatus = true;
  while (offlineStatus) {
    try {
      const response = await techService.checkStatus();
      if (response.status === 200) {
        offlineStatus = false;
        // wait 3 secs to settle
        await wait(3);
        dispatch(setStatusOnline());
        dispatch(retryAction());
      }
    } catch (error) {
      const status = getConnetionStatus(getState());
      if (status === ConnectionStatus.online) {
        dispatch(setStatusOffline());
      }
    } finally {
      await wait(1);
    }
  }
};

export const runOnlineActions = (): AppThunk => async (dispatch, getState) => {
  const connectionStatus = getConnetionStatus(getState());
  if (connectionStatus === ConnectionStatus.offline) {
    dispatch(setStatusOnline());
  }
  await dispatch(syncTodos());
  await dispatch(fetchUnreadCount());
};

export const runOfflineActions = (): AppThunk => async (dispatch, getState) => {
  const connectionStatus = getConnetionStatus(getState());
  if (connectionStatus === ConnectionStatus.online) {
    dispatch(setStatusOffline());
  }
  dispatch(syncReset());
};
