import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  postDefaultReducer,
  createPostAsyncThunkWithArguments,
  postDefaultExtraReducer,
} from "@/store/helpers/post";
import {
  reducerName,
  postApplicationAsyncThunk,
} from "@/store/applications/post/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { DefaultApplicationStateType } from "@/store/applications/state/types";
import { setApplications } from "@/store/applications/state/state";
import { getApplicationsCollection } from "@/store/applications/getCollection/getCollection";
import { PostState } from "@/store/helpers/post/types";
import { setPools } from "@/store/pools/state/state";

const slice = createSlice({
  name: reducerName,
  initialState: {
    postApplicationState: {} as { [key: string]: PostState },
  },
  reducers: {
    setPostApplicationStateReducer(state, action) {
      postDefaultReducer(state, action, ["postApplicationState"]);
    },
  },
  extraReducers: (builder) => {
    postDefaultExtraReducer(builder, postApplicationAsyncThunk);
  },
});

export const { setPostApplicationStateReducer } = slice.actions;

export const postApplication = createPostAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["postApplicationState"],
  reducerAction: setPostApplicationStateReducer,
  url: "/admin-application",
  postAsyncThunk: postApplicationAsyncThunk,
  setAccessToken,
  setRefreshToken,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const draftId = payload?.id;

    const {
      applications: { data: applications },
      ver: { data: ver },
    } = (getState() as RootState)?.stateApplications;

    const application = applications.reduce(
      (
        result?: DefaultApplicationStateType,
        item?: DefaultApplicationStateType
      ) => {
        if (result) return result;

        if (item?.draftId == draftId) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.type = application?.type;
    data.client = application?.client?.account;
    data.address = application?.address;
    data.comment = application?.comment;
    data.status = application?.status;
    data.installDate = application?.installDate;
    data.poolId = application?.poolId;
    data.hash = application?.hash;
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
      applications: { data: applications },
    } = (getState() as RootState)?.stateApplications;

    const {
      pools: { data: localPools },
    } = (getState() as RootState)?.statePools;

    const entity = responseData.data.entity;
    const rowNum = entity.rowNum;
    const page = Math.ceil(rowNum / 10) > 0 ? Math.ceil(rowNum / 10) : 1;
    const ver = responseData.data.ver;

    const poolDraftIdtoPoolId: { [key: number]: number } = {};

    let modifiedApplications = [...applications].map((application) => {
      //  Saving draftId in the application to retain the ability to navigate by draftId
      if (application?.draftId == draftId) {
        if (application?.poolDraftId)
          poolDraftIdtoPoolId[application.poolDraftId] = entity.poolId;

        return { ...entity, draftId, page, ver };
      }

      return application;
    });

    modifiedApplications = modifiedApplications.reduce((result, element) => {
      const isExists = result.find((item: any) => item?.id === element?.id);

      if (!isExists) {
        result.push(element);

        return result;
      }

      if (!element?.draftId) return result;

      result = result.map((item: any) =>
        item?.id === element?.id ? element : item
      );

      return result;
    }, []);

    //  Set poolId for local applications without poolId, if we get some
    if (Object.keys(poolDraftIdtoPoolId).length)
      modifiedApplications = modifiedApplications.map((localApplication) => {
        //  Don't have poolId, but have poolDraftId, and we can compare them
        if (
          !localApplication?.poolId &&
          localApplication?.poolDraftId &&
          localApplication.poolDraftId in poolDraftIdtoPoolId
        )
          return {
            ...localApplication,
            poolId: poolDraftIdtoPoolId[localApplication.poolDraftId],
          };

        return localApplication;
      });

    dispatch(
      setApplications({ action: "setData", data: modifiedApplications })
    );

    if (Object.keys(poolDraftIdtoPoolId).length) {
      const modifiedLocalPools = [...localPools].map((localPool) => {
        if (!localPool?.draftId) return localPool;

        if (!poolDraftIdtoPoolId[localPool.draftId]) return localPool;

        localPool.id = poolDraftIdtoPoolId[localPool.draftId];

        return localPool;
      });

      dispatch(setPools({ action: "setData", data: modifiedLocalPools }));
    }

    dispatch(getApplicationsCollection({ page: page }));
  },
});

export default slice.reducer;
