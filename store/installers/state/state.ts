import { createSlice } from "@reduxjs/toolkit";
import {
  defaultState,
  setStateDefaultReducer,
  SetStateDefaultReducerActionType,
} from "@/store/helpers/state";
import {
  defaultInputState,
  setInputStateDefaultReducer,
} from "@/store/helpers/input";
import { reducerName } from "@/store/installers/state/config";
import { defaultInstallersState } from "@/store/installers/state/defaultState";

/*
  data: [
    {
      id: "1",
      login: "test",
      password: "test",
      firstname: "Иван", V
      middlename: "Иванович", V
      lastname: "Иванов", V
      phone: "+7 912 345-67-89",
      status: "active", //inactive
      role: "",
    },
  ],
*/

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
    setInputStateLastnameReducer(state, action) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "lastname",
      ]);
    },
    setInputStateFirstnameReducer(state, action) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "firstname",
      ]);
    },
    setInputStateMiddlenameReducer(state, action) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "middlename",
      ]);
    },
    setInputStatePhoneReducer(state, action) {
      setInputStateDefaultReducer(state, action, [
        "createInstallerFields",
        "inputs",
        "phone",
      ]);
    },
    setInputStatePasswordReducer(state, action) {
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
    /*
    createInstaller(state, action) {
      const lastname = state.createInstallerFields.inputs.lastname.text;
      const firstname = state.createInstallerFields.inputs.firstname.text;
      const middlename = state.createInstallerFields.inputs.middlename.text;
      const phone = state.createInstallerFields.inputs.phone.text;
      const password = state.createInstallerFields.inputs.password.text;
      const login = state.createInstallerFields.states.login.data;

      state.installers.data.push({
        lastname,
        firstname,
        middlename,
        login,
        phone,
        password,
        status: "active",
      });

      state.createInstallerFields.inputs.lastname.text = defaultInputState.text;
      state.createInstallerFields.inputs.firstname.text = defaultInputState.text;
      state.createInstallerFields.inputs.middlename.text = defaultInputState.text;
      state.createInstallerFields.inputs.phone.text = defaultInputState.text;
      state.createInstallerFields.inputs.password.text = defaultInputState.text;
    },
    */
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
