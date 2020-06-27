import { AppState } from "store/store";
import { createSelector } from "reselect";

export const getTechState = (state: AppState) => state.tech;

export const getConnetionStatus = createSelector(
  getTechState,
  ({ status }) => status
);
