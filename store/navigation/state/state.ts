import { createSlice } from "@reduxjs/toolkit";
import { defaultState, setStateDefaultReducer } from "@/store/helpers/state";
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
  },
  reducers: {
    setRefreshToken(state, action) {
      setStateDefaultReducer(state, action, ["refreshToken"]);
    },
    setAccessToken(state, action) {
      setStateDefaultReducer(state, action, ["accessToken"]);
    },
  },
});

export const { setRefreshToken, setAccessToken } = slice.actions;

export default slice.reducer;
