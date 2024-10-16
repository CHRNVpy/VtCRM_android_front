import { createSlice } from "@reduxjs/toolkit";
import {
  defaultState,
  setStateDefaultReducer,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state";
import {
  InputStateDefaultReducerActionType,
  defaultInputState,
  setInputStateDefaultReducer,
} from "@/store/helpers/input";
import { reducerName } from "@/store/applications/state/config";
import { defaultApplicationsState } from "@/store/applications/state/defaultState";
import { Equipment } from "@/store/applications/state/types";

const slice = createSlice({
  name: reducerName,
  initialState: {
    ver: { ...defaultState, data: 0 },
    pagesLoaded: { ...defaultState, data: 0 },
    totalPages: { ...defaultState, data: 0 },
    currentPage: { ...defaultState, data: 1 },
    applications: {
      ...defaultApplicationsState,
    },
    createApplicationFields: {
      inputs: {
        type: {
          ...defaultInputState,
          text: "connection",
        } as { text: "connection" | "repair" | "line setup" },
        clientNumber: {
          ...defaultInputState,
        },
        address: {
          ...defaultInputState,
        },
        installDate: {
          ...defaultInputState,
        },
        comment: {
          ...defaultInputState,
        },
      },
      equipmentsList: [] as Equipment[],
    },
    editApplicationFields: {
      inputs: {
        clientNumber: {
          ...defaultInputState,
        },
        address: {
          ...defaultInputState,
        },
        installDate: {
          ...defaultInputState,
        },
        comment: {
          ...defaultInputState,
        },
      },
    },
  },
  reducers: {
    setVer(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["ver"]);
    },
    setPagesLoaded(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["pagesLoaded"]);
    },
    setCurrentPage(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["currentPage"]);
    },
    setTotalPages(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["totalPages"]);
    },
    setApplications(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(
        state,
        action,
        ["applications"],
        defaultApplicationsState
      );
    },
    setInputStateCreateTypeReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createApplicationFields",
        "inputs",
        "type",
      ]);
    },
    setInputStateCreateClientNumberReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createApplicationFields",
        "inputs",
        "clientNumber",
      ]);
    },
    setInputStateCreateAddressReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createApplicationFields",
        "inputs",
        "address",
      ]);
    },
    setInputStateCreateInstallDateReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createApplicationFields",
        "inputs",
        "installDate",
      ]);
    },
    setInputStateCreateCommentReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createApplicationFields",
        "inputs",
        "comment",
      ]);
    },
    setInputStateEditClientNumberReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editApplicationFields",
        "inputs",
        "clientNumber",
      ]);
    },
    setInputStateEditInstallDateReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editApplicationFields",
        "inputs",
        "installDate",
      ]);
    },
    setInputStateEditAddressReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editApplicationFields",
        "inputs",
        "address",
      ]);
    },
    setInputStateEditCommentReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editApplicationFields",
        "inputs",
        "comment",
      ]);
    },
  },
});

export const {
  setVer,
  setPagesLoaded,
  setTotalPages,
  setCurrentPage,
  setApplications,
  setInputStateCreateTypeReducer,
  setInputStateCreateClientNumberReducer,
  setInputStateCreateAddressReducer,
  setInputStateCreateInstallDateReducer,
  setInputStateCreateCommentReducer,
  setInputStateEditClientNumberReducer,
  setInputStateEditInstallDateReducer,
  setInputStateEditAddressReducer,
  setInputStateEditCommentReducer,
} = slice.actions;

export default slice.reducer;
