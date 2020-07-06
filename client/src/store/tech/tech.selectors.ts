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
