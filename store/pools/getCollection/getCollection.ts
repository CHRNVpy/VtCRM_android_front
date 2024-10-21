import { createSlice } from "@reduxjs/toolkit";
import {
  createGetCollectionAsyncThunkWithArguments,
  setGetCollectionStateDefaultReducer,
  getCollectionDefaultExtraReducer,
} from "@/store/helpers/getCollection";
import {
  reducerName,
  getCollectionAsyncThunk,
} from "@/store/pools/getCollection/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import {
  setPagesLoaded,
  setTotalPages,
  setCurrentPage,
  setPools,
} from "@/store/pools/state/state";
import { setApplications, setVer } from "@/store/applications/state/state";
import { RootState } from "@/store/store";
import { DefaultPoolStateType } from "@/store/pools/state/types";
import {
  DefaultApplicationStateType,
  ApplicationImageType,
} from "@/store/applications/state/types";
import { GetCollectionState } from "@/store/helpers/getCollection/types";

const isImagesEqual = (
  localImages?: ApplicationImageType[],
  remoteImages?: ApplicationImageType[]
): boolean => {
  if (!localImages && !remoteImages) return true;

  if (!localImages) return false;

  if (!remoteImages) return false;

  // Compare length
  if (localImages.length !== remoteImages.length) return false;

  // Compare by ids
  return localImages.every((localImage) =>
    remoteImages.some((remoteImage) => remoteImage.id === localImage.id)
  );
};

const poolsGetCollectionSlice = createSlice({
  name: reducerName,
  initialState: {
    poolsGetCollectionState: {} as {
      [key: string]: GetCollectionState;
    },
  },
  reducers: {
    setPoolsGetCollectionStateReducer(state, action) {
      setGetCollectionStateDefaultReducer(state, action, [
        "poolsGetCollectionState",
      ]);
    },
  },
  extraReducers: (builder) => {
    getCollectionDefaultExtraReducer(builder, getCollectionAsyncThunk);
  },
});

export const { setPoolsGetCollectionStateReducer } =
  poolsGetCollectionSlice.actions;

export const getPoolsCollection = createGetCollectionAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["poolsGetCollectionState"],
  reducerAction: setPoolsGetCollectionStateReducer,
  setAccessToken,
  setRefreshToken,
  url: "/admin-pool-collection",
  getParamsFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const page = payload?.page ? payload.page : 1;

    const params: { [key: string]: any } = {};

    if (page) params.page = page;

    return params;
  },
  callbackAfterGet: async (dispatch, getState, payload) => {
    const {
      pagesLoaded: { data: pagesLoaded },
      pools: { data: localPools },
    } = (getState() as RootState)?.statePools;

    const {
      applications: { data: localApplications },
    } = (getState() as RootState)?.stateApplications;

    const pages = payload.pages;
    const page = payload.page;
    const ver = payload.appVer;

    console.log(page);

    let isChanged = false;
    let modifiedLocalApplications = [...localApplications];
    let remoteApplicationsList: DefaultApplicationStateType[] = [];

    const modifiedLocalPools = [...localPools];

    const remotePools = payload?.entities?.length ? payload?.entities : [];

    remotePools.forEach((remotePool: DefaultPoolStateType) => {
      remoteApplicationsList = [
        ...remoteApplicationsList,
        ...((remotePool.entities
          ? remotePool.entities
          : []) as DefaultApplicationStateType[]),
      ];

      //  Parse every remote pool
      const localPoolIndexWithSameId = localPools.findIndex((localPool) => {
        return remotePool?.id === localPool?.id;
      });

      //  If local version is not found, add to local storage
      if (localPoolIndexWithSameId === -1) {
        modifiedLocalPools.push({
          ...remotePool,
          applicationsCount: remotePool?.entities?.length ?? 0,
          entities: undefined,
          page,
          ver,
        });

        isChanged = true;

        return;
      }

      //  If remote and local have same fields, do nothing
      if (
        localPools[localPoolIndexWithSameId].installerId ==
          remotePool.installerId &&
        localPools[localPoolIndexWithSameId].status == remotePool.status &&
        localPools[localPoolIndexWithSameId].page == remotePool.page &&
        localPools[localPoolIndexWithSameId].ver == remotePool.ver
      )
        return;

      //  If it was modified remotely, replace local pool with remote copy
      modifiedLocalPools.splice(localPoolIndexWithSameId, 1, {
        ...remotePool,
        applicationsCount: remotePool?.entities?.length ?? 0,
        entities: undefined,
        page,
        ver,
        draftId: localPools[localPoolIndexWithSameId].draftId,
      });

      isChanged = true;
    });

    let isApplicationsChanged = false;

    console.log("length", remoteApplicationsList?.length);

    //  Parse every remote application
    remoteApplicationsList.forEach(
      (remoteApplication: DefaultApplicationStateType) => {
        const localApplicationIndexWithSameId = localApplications.findIndex(
          (localApplication) => {
            return remoteApplication?.id === localApplication?.id;
          }
        );

        //  If local version is not found, add to local storage
        if (localApplicationIndexWithSameId === -1) {
          modifiedLocalApplications.push({ ...remoteApplication, page, ver });

          isApplicationsChanged = true;

          return;
        }

        //  If remote and local have same fields, do nothing
        if (
          localApplications[localApplicationIndexWithSameId].type ==
            remoteApplication.type &&
          localApplications[localApplicationIndexWithSameId].installer?.id ==
            remoteApplication.installer?.id &&
          localApplications[localApplicationIndexWithSameId].comment ==
            remoteApplication.comment &&
          localApplications[localApplicationIndexWithSameId].status ==
            remoteApplication.status &&
          localApplications[localApplicationIndexWithSameId].installDate ==
            remoteApplication.installDate &&
          localApplications[localApplicationIndexWithSameId].poolId ==
            remoteApplication.poolId &&
          //  Compare clients
          ((!localApplications[localApplicationIndexWithSameId].client &&
            !remoteApplication.client) ||
            (localApplications[localApplicationIndexWithSameId].client &&
              remoteApplication.client &&
              localApplications[localApplicationIndexWithSameId].client
                .fullName === remoteApplication.client.fullName &&
              localApplications[localApplicationIndexWithSameId].client
                .phone === remoteApplication.client.phone &&
              localApplications[localApplicationIndexWithSameId].client
                .address === remoteApplication.client.address &&
              localApplications[localApplicationIndexWithSameId].client
                .email === remoteApplication.client.email)) &&
          // Compare images
          isImagesEqual(
            localApplications[localApplicationIndexWithSameId]?.images,
            remoteApplication.images
          ) &&
          localApplications[localApplicationIndexWithSameId].page ==
            remoteApplication.page &&
          localApplications[localApplicationIndexWithSameId].ver ==
            remoteApplication.ver
        )
          return;

        //  If it was modified locally, do nothing, it will be updated in next sync step
        if (localApplications[localApplicationIndexWithSameId]?.isModified)
          return;

        //  If it was modified remotely, replace local application with remote copy
        modifiedLocalApplications.splice(localApplicationIndexWithSameId, 1, {
          ...remoteApplication,
          page,
          ver,
          draftId: localApplications[localApplicationIndexWithSameId].draftId,
          poolDraftId:
            localApplications[localApplicationIndexWithSameId].poolDraftId,
        });

        isApplicationsChanged = true;
      }
    );

    const poolDraftIdtoPoolId: { [key: number]: number } = {};

    modifiedLocalApplications = modifiedLocalApplications.map(
      (localApplication) => {
        //  If local have id, do nothing
        if (localApplication?.id) return localApplication;
        //  If local don't have draftId, do nothing
        if (!localApplication?.draftId) return localApplication;

        const remoteApplicationIndexWithSameHash =
          remoteApplicationsList.findIndex(
            (remoteApplication: DefaultApplicationStateType) => {
              return remoteApplication?.hash === localApplication?.hash;
            }
          );

        //  If nothing with same hash found, do nothing
        if (remoteApplicationIndexWithSameHash === -1) return localApplication;

        isApplicationsChanged = true;

        if (
          localApplication?.poolDraftId &&
          remoteApplicationsList[remoteApplicationIndexWithSameHash].poolId
        )
          poolDraftIdtoPoolId[localApplication.poolDraftId] =
            remoteApplicationsList[remoteApplicationIndexWithSameHash].poolId;

        //  If found remote with same hash, set remote application data to local application
        //  Saving draftId in the application to retain the ability to navigate by draftId
        return {
          ...remoteApplicationsList[remoteApplicationIndexWithSameHash],
          draftId: localApplication.draftId,
          poolDraftId: localApplication.poolDraftId,
          page,
          ver,
        };
      }
    );

    //  Set poolId for local applications without poolId, if we get some
    if (Object.keys(poolDraftIdtoPoolId).length)
      modifiedLocalApplications = modifiedLocalApplications.map(
        (localApplication) => {
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
        }
      );

    //  Set current applications list
    if (isApplicationsChanged)
      dispatch(
        setApplications({ action: "setData", data: modifiedLocalApplications })
      );

    // Set applications ver for POST and PATCH
    dispatch(
      setVer({
        action: "setData",
        data: ver,
      })
    );

    if (!isChanged) return;

    //  Save max page that was loaded
    dispatch(
      setPagesLoaded({
        action: "setData",
        data: pagesLoaded >= page ? pagesLoaded : page,
      })
    );

    //  Set total page in db
    dispatch(setTotalPages({ action: "setData", data: pages }));

    //  Set current pools list
    dispatch(setPools({ action: "setData", data: modifiedLocalPools }));

    //  Set current page to update by sync
    dispatch(setCurrentPage({ action: "setData", data: page }));
  },
  getAsyncThunk: getCollectionAsyncThunk,
});

export { reducerName } from "@/store/pools/getCollection/config";
export default poolsGetCollectionSlice.reducer;
