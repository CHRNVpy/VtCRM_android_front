import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  createPatchAsyncThunkWithArguments,
  patchDefaultReducer,
  patchDefaultExtraReducer,
} from "@/store/helpers/patch";
import { reducerName, patchPoolAsyncThunk } from "@/store/pools/patch/config";
import { DefaultPoolStateType } from "@/store/pools/state/types";
import { setPools } from "@/store/pools/state/state";
import { getApplicationsCollection } from "@/store/applications/getCollection/getCollection";
import { PatchState } from "@/store/helpers/patch/types";

const slice = createSlice({
  name: reducerName,
  initialState: {
    patchPoolState: {} as { [key: string]: PatchState },
  },
  reducers: {
    setPatchPoolStateReducer(state, action) {
      patchDefaultReducer(state, action, ["patchPoolState"]);
    },
  },
  extraReducers: (builder) => {
    patchDefaultExtraReducer(builder, patchPoolAsyncThunk);
  },
});

export const { setPatchPoolStateReducer } = slice.actions;

export const patchPool = createPatchAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["patchPoolState"],
  reducerAction: setPatchPoolStateReducer,
  urlFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const id = payload?.id;

    return `/admin-pool/${id}`;
  },
  patchAsyncThunk: patchPoolAsyncThunk,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const {
      pools: { data: pools },
    } = (getState() as RootState)?.statePools;

    const {
      ver: { data: ver },
    } = (getState() as RootState)?.stateApplications;

    const id = payload?.id;

    const pool = pools.reduce(
      (result?: DefaultPoolStateType, item?: DefaultPoolStateType) => {
        if (result) return result;

        if (item?.id == id) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.status = pool?.status;
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
      pools: { data: pools },
    } = (getState() as RootState)?.statePools;

    const entity = responseData.data.entity;

    const modifiedPoolsList = [...pools].map((pool) => {
      //  Saving draftId in the pool to retain the ability to navigate by draftId
      if (pool?.id == id) {
        return {
          ...entity,
          applicationsCount: entity?.entities?.length,
          draftId: pool?.draftId,
          page: pool?.page,
          ver: pool?.ver,
        };
      }

      return pool;
    });

    dispatch(setPools({ action: "setData", data: modifiedPoolsList }));

    if (entity?.id) dispatch(getApplicationsCollection({ poolId: entity?.id }));
  },
});

export default slice.reducer;
