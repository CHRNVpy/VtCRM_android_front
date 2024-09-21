import { createSlice } from "@reduxjs/toolkit";
import {
  defaultState,
  setStateDefaultReducer,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state";
import { reducerName } from "@/store/navigation/state/config";

const slice = createSlice({
  name: reducerName,
  initialState: {
    refreshToken: {
      ...defaultState,
    },
    accessToken: {
      ...defaultState,
    },
    page: {
      ...defaultState,
    },
    initialNavigationState: {
      ...defaultState,
    },
  },
  reducers: {
    setRefreshToken(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["refreshToken"]);
    },
    setAccessToken(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["accessToken"]);
    },
    setPage(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["page"]);
    },
    setInitialNavigationState(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["initialNavigationState"]);
    },
  },
});

export const {
  setRefreshToken,
  setAccessToken,
  setPage,
  setInitialNavigationState,
} = slice.actions;

export default slice.reducer;
