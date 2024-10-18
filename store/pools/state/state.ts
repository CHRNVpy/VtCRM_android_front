import { createSlice } from "@reduxjs/toolkit";
import {
  defaultState,
  setStateDefaultReducer,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state";
import { reducerName } from "@/store/pools/state/config";
import { defaultPoolsState } from "@/store/pools/state/defaultState";

const slice = createSlice({
  name: reducerName,
  initialState: {
    pagesLoaded: { ...defaultState, data: 0 },
    totalPages: { ...defaultState, data: 0 },
    currentPage: { ...defaultState, data: 1 },
    pools: {
      ...defaultPoolsState,
    },
  },
  reducers: {
    setPagesLoaded(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["pagesLoaded"]);
    },
    setCurrentPage(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["currentPage"]);
    },
    setTotalPages(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["totalPages"]);
    },
    setPools(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["pools"], defaultPoolsState);
    },
  },
});

export const { setPagesLoaded, setTotalPages, setCurrentPage, setPools } =
  slice.actions;

export default slice.reducer;
