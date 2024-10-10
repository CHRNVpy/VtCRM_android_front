import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  postDefaultReducer,
  createPostAsyncThunkWithArguments,
  postDefaultExtraReducer,
} from "@/store/helpers/post";
import {
  reducerName,
  postInstallerAsyncThunk,
} from "@/store/installers/post/config";
import { PostState } from "@/store/helpers/post/types";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setVer, setInstallers } from "@/store/installers/state/state";

const slice = createSlice({
  name: reducerName,
  initialState: {
    postInstallerState: {} as { [key: string]: PostState },
  },
  reducers: {
    setPostInstallerStateReducer(state, action) {
      postDefaultReducer(state, action, ["postInstallerState"]);
    },
  },
  extraReducers: (builder) => {
    postDefaultExtraReducer(builder, postInstallerAsyncThunk);
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
    const draftId = payload?.id;

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

        if (item?.draftId == draftId) return item;

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
    data.status = "active";
    data.hash = installer?.hash;

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

    const draftId = payload?.id;

    const {
      installers: { data: installers },
    } = (getState() as RootState)?.stateInstallers;

    const ver = responseData.data.ver;
    const entity = responseData.data.entity;

    const modifiedInstallers = [...installers].map((installer) => {
      //  Saving draftId in the installer to retain the ability to navigate by draftId
      if (installer?.draftId == draftId) return { ...entity, draftId };

      return installer;
    });

    dispatch(setVer({ action: "setData", data: ver }));
    dispatch(setInstallers({ action: "setData", data: modifiedInstallers }));
  },
});

export default slice.reducer;
