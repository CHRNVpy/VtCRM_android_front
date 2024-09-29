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
    setInputStateLastnameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "lastname",
      ]);
    },
    setInputStateFirstnameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "firstname",
      ]);
    },
    setInputStateMiddlenameReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "middlename",
      ]);
    },
    setInputStatePhoneReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "phone",
      ]);
    },
    setInputStatePasswordReducer(
      state,
      action: InputStateDefaultReducerActionType
    ) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "password",
      ]);
    },
  },
});

export const {
  setVer,
  setInstallers,
  setInputStateLastnameReducer,
  setInputStateFirstnameReducer,
  setInputStateMiddlenameReducer,
  setInputStatePhoneReducer,
  setInputStatePasswordReducer,
} = slice.actions;

export default slice.reducer;
