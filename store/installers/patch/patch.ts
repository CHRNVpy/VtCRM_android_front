import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  createPatchAsyncThunkWithArguments,
  patchDefaultReducer,
  patchDefaultExtraReducer,
} from "@/store/helpers/patch";
import {
  reducerName,
  patchInstallerAsyncThunk,
} from "@/store/installers/patch/config";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setVer, setInstallers } from "@/store/installers/state/state";

const slice = createSlice({
  name: reducerName,
  initialState: {
    patchInstallerState: {},
  },
  reducers: {
    setPatchInstallerStateReducer(state, action) {
      patchDefaultReducer(state, action, ["patchInstallerState"]);
    },
  },
  extraReducers: (builder) => {
    patchDefaultExtraReducer(builder, patchInstallerAsyncThunk);
  },
});

export const { setPatchInstallerStateReducer } = slice.actions;

export const patchInstaller = createPatchAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["patchInstallerState"],
  reducerAction: setPatchInstallerStateReducer,
  url: "/installer",
  patchAsyncThunk: patchInstallerAsyncThunk,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const id = payload?.id;

    const {
      installers: { data: installers },
      ver: { data: ver },
    } = (getState() as RootState)?.stateInstallers;

    const installer = installers.reduce(
      (
        result?: DefaultInstallerStateType,
        item?: DefaultInstallerStateType
      ) => {
        if (result) return result;

        if (item?.id == id) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.id = installer?.id;
    data.lastname = installer?.lastname;
    data.firstname = installer?.firstname;
    data.middlename = installer?.middlename;
    data.phone = installer?.phone;
    data.password = installer?.password;
    data.status = installer?.status;
    data.hash = installer?.hash;

    data.ver = ver;

    return data;
  },
  callbackAfterPatch: async (
    dispatch,
    getState,
    responseData,
    responseStatus,
    payload
  ) => {
    if (responseStatus !== 200) return;
    if (responseData.status !== "ok") return;

    const id = payload?.id;

    const {
      installers: { data: installers },
    } = (getState() as RootState)?.stateInstallers;

    const ver = responseData.data.ver;
    const entity = responseData.data.entity;

    const modifiedInstallers = [...installers].map((installer) => {
      //  Saving draftId in the installer to retain the ability to navigate by draftId
      if (installer?.id == id)
        return { ...entity, draftId: installer?.draftId };

      return installer;
    });

    dispatch(setVer({ action: "setData", data: ver }));
    dispatch(setInstallers({ action: "setData", data: modifiedInstallers }));
  },
});

export default slice.reducer;
