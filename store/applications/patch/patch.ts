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
import { getPoolsCollection } from "@/store/pools/getCollection/getCollection";
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

    data.client = application?.client?.account;
    data.address = application?.address;
    data.comment = application?.comment;
    data.status = application?.status;
    data.installDate = application?.installDate;
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
      applications: { data: applications },
    } = (getState() as RootState)?.stateApplications;

    const {
      pools: { data: pools },
    } = (getState() as RootState)?.statePools;

    const entity = responseData.data.entity;

    let currentPoolId: number | undefined;

    const modifiedApplications = [...applications].map((application) => {
      //  Saving draftId in the application to retain the ability to navigate by draftId
      if (application?.id == id) {
        currentPoolId = application?.poolId;

        return {
          ...entity,
          draftId: application?.draftId,
          poolDraftId: application?.poolDraftId,
          page: application?.page,
          ver: application?.ver,
        };
      }

      return application;
    });

    const currentPool = pools.find(
      (pool) => !!currentPoolId && pool.id == currentPoolId
    );

    dispatch(
      setApplications({ action: "setData", data: modifiedApplications })
    );

    if (currentPool?.page)
      dispatch(getPoolsCollection({ page: currentPool.page }));
  },
});

export default slice.reducer;
