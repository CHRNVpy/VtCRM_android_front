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
import { reducerName } from "@/store/installers/state/config";
import { defaultInstallersState } from "@/store/installers/state/defaultState";

const slice = createSlice({
  name: reducerName,
  initialState: {
    ver: { ...defaultState, data: 0 },
    installers: {
      ...defaultInstallersState,
    },
    createInstallerFields: {
      inputs: {
        lastname: {
          ...defaultInputState,
        },
        firstname: {
          ...defaultInputState,
        },
        middlename: {
          ...defaultInputState,
        },
        phone: {
          ...defaultInputState,
        },
        password: {
          ...defaultInputState,
        },
      },
    },
    editInstallerFields: {
      inputs: {
        lastname: {
          ...defaultInputState,
        },
        firstname: {
          ...defaultInputState,
        },
        middlename: {
          ...defaultInputState,
        },
        phone: {
          ...defaultInputState,
        },
        password: {
          ...defaultInputState,
        },
      },
    },
  },
  reducers: {
    setVer(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, ["ver"]);
    },
    setInstallers(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(
        state,
        action,
        ["installers"],
        defaultInstallersState
      );
    },
    setInputStateCreateLastnameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "lastname",
      ]);
    },
    setInputStateCreateFirstnameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "firstname",
      ]);
    },
    setInputStateCreateMiddlenameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "middlename",
      ]);
    },
    setInputStateCreatePhoneReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "phone",
      ]);
    },
    setInputStateCreatePasswordReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "password",
      ]);
    },
    setInputStateEditLastnameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editInstallerFields",
        "inputs",
        "lastname",
      ]);
    },
    setInputStateEditFirstnameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editInstallerFields",
        "inputs",
        "firstname",
      ]);
    },
    setInputStateEditMiddlenameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editInstallerFields",
        "inputs",
        "middlename",
      ]);
    },
    setInputStateEditPhoneReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editInstallerFields",
        "inputs",
        "phone",
      ]);
    },
    setInputStateEditPasswordReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "editInstallerFields",
        "inputs",
        "password",
      ]);
    },
  },
});

export const {
  setVer,
  setInstallers,
  setInputStateCreateLastnameReducer,
  setInputStateCreateFirstnameReducer,
  setInputStateCreateMiddlenameReducer,
  setInputStateCreatePhoneReducer,
  setInputStateCreatePasswordReducer,
  setInputStateEditLastnameReducer,
  setInputStateEditFirstnameReducer,
  setInputStateEditMiddlenameReducer,
  setInputStateEditPhoneReducer,
  setInputStateEditPasswordReducer,
} = slice.actions;

export default slice.reducer;
