import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  createPatchAsyncThunkWithArguments,
  patchDefaultReducer,
  patchDefaultExtraReducer,
} from "@/store/helpers/patch";
import {
  reducerName,
  patchApplicationAsyncThunk,
} from "@/store/applications/patch/config";
import { DefaultApplicationStateType } from "@/store/applications/state/types";
import { setApplications } from "@/store/applications/state/state";
import { PatchState } from "@/store/helpers/patch/types";

const slice = createSlice({
  name: reducerName,
  initialState: {
    patchApplicationState: {} as { [key: string]: PatchState },
  },
  reducers: {
    setPatchApplicationStateReducer(state, action) {
      patchDefaultReducer(state, action, ["patchApplicationState"]);
    },
  },
  extraReducers: (builder) => {
    patchDefaultExtraReducer(builder, patchApplicationAsyncThunk);
  },
});

export const { setPatchApplicationStateReducer } = slice.actions;

export const patchApplication = createPatchAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["patchApplicationState"],
  reducerAction: setPatchApplicationStateReducer,
  urlFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const id = payload?.id;

    return `/admin-application/${id}`;
  },
  patchAsyncThunk: patchApplicationAsyncThunk,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const {
      applications: { data: applications },
      ver: { data: ver },
    } = (getState() as RootState)?.stateApplications;

    const id = payload?.id;

    const application = applications.reduce(
      (
        result?: DefaultApplicationStateType,
        item?: DefaultApplicationStateType
      ) => {
        if (result) return result;

        if (item?.id == id) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.id = application?.id;
    data.type = application?.type;
    data.client = application?.client?.number;
    data.address = application?.address;
    data.comment = application?.comment;
    data.installerId = application?.installerId;
    data.status = application?.status;
    data.installDate = application?.installDate;
    data.poolId = application?.poolId;
    data.hash = application?.hash;
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

    console.log(responseData);

    const id = payload?.id;

    const {
      applications: { data: applications },
    } = (getState() as RootState)?.stateApplications;

    const entity = responseData.data.entity;

    const modifiedApplications = [...applications].map((application) => {
      //  Saving draftId in the application to retain the ability to navigate by draftId
      if (application?.id == id)
        return { ...entity, draftId: application?.draftId };

      return application;
    });

    dispatch(
      setApplications({ action: "setData", data: modifiedApplications })
    );
  },
});

export default slice.reducer;
