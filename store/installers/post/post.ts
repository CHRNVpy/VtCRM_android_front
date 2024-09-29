import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  postDefaultReducer,
  defaultPostState,
  createPostAsyncThunkWithArguments,
  postDefaultExtraReducer,
} from "@/store/helpers/post";
import {
  reducerName,
  postInstallerAsyncThunk,
} from "@/store/installers/post/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setVer, setInstallers } from "@/store/installers/state/state";
import CryptoJS from "crypto-js";

const slice = createSlice({
  name: reducerName,
  initialState: {
    postInstallerState: {},
  },
  reducers: {
    setPostInstallerStateReducer(state, action) {
      postDefaultReducer(state, action, ["postInstallerState"]);
    },
  },
});

export const { setPostInstallerStateReducer } = slice.actions;

export const postInstaller = createPostAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["postInstallerState"],
  reducerAction: setPostInstallerStateReducer,
  url: "/installer",
  postAsyncThunk: postInstallerAsyncThunk,
  setAccessToken,
  setRefreshToken,
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

        if (item?.draftId == id) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.lastname = installer?.lastname;
    data.firstname = installer?.firstname;
    data.middlename = installer?.middlename;
    data.phone = installer?.phone;
    data.password = installer?.password;

    const dataString = JSON.stringify(data);

    data.hash = CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Hex);
    data.ver = ver;

    return data;
  },
  callbackAfterPost: async (
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
      if (installer?.draftId == id) return entity;

      return installer;
    });

    dispatch(setVer({ action: "setData", data: ver }));
    //dispatch(setInstallers({ action: "setData", data: modifiedInstallers }));
  },
});

export default slice.reducer;
