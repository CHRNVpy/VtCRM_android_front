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
      states: {
        login: defaultState,
      },
    },
  },
  reducers: {
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
    setLogin(state, action: SetStateDefaultReducerActionType) {
      setStateDefaultReducer(state, action, [
        "createInstallerFields",
        "states",
        "login",
      ]);
    },
  },
});

export const {
  setInstallers,
  setInputStateLastnameReducer,
  setInputStateFirstnameReducer,
  setInputStateMiddlenameReducer,
  setInputStatePhoneReducer,
  setInputStatePasswordReducer,
  setLogin,
} = slice.actions;

export default slice.reducer;
