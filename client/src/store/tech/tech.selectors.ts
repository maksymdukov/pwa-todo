import { AppState } from "store/store";
import { createSelector } from "reselect";

export const getTechState = (state: AppState) => state.tech;

export const getConnetionStatus = createSelector(
  getTechState,
  ({ status }) => status
);

export const getInstallEvent = createSelector(
  getTechState,
  ({ beforeInstallPrompt }) => beforeInstallPrompt
);

export const getUserInstallChoice = createSelector(
  getTechState,
  ({ userInstallChoice }) => userInstallChoice
);

export const getIsReadyForOffline = createSelector(
  getTechState,
  ({ readyForOffline }) => readyForOffline
);

export const getIsNewVersionAvailable = createSelector(
  getTechState,
  ({ newVersionAvailable }) => newVersionAvailable
);

export const getTodoViewType = createSelector(
  getTechState,
  ({ todoView }) => todoView
);
