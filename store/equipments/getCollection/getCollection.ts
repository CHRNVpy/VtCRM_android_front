import { createSlice } from "@reduxjs/toolkit";
import {
  defaultGetCollectionState,
  createGetCollectionAsyncThunkWithArguments,
  setGetCollectionStateDefaultReducer,
  getCollectionDefaultExtraReducer,
} from "@/store/helpers/getCollection";
import {
  reducerName,
  getCollectionAsyncThunk,
} from "@/store/equipments/getCollection/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import {
  setVer,
  setPagesLoaded,
  setTotalPages,
  setEquipments,
} from "@/store/equipments/state/state";
import { RootState } from "@/store/store";
import { DefaultEquipmentStateType } from "@/store/equipments/state/types";
import { GetCollectionState } from "@/store/helpers/getCollection/types";

const equipmentsGetCollectionSlice = createSlice({
  name: reducerName,
  initialState: {
    equipmentsGetCollectionState: {} as {
      [key: string]: GetCollectionState;
    },
  },
  reducers: {
    setEquipmentsGetCollectionStateReducer(state, action) {
      setGetCollectionStateDefaultReducer(state, action, [
        "equipmentsGetCollectionState",
      ]);
    },
  },
  extraReducers: (builder) => {
    getCollectionDefaultExtraReducer(builder, getCollectionAsyncThunk);
  },
});

export const { setEquipmentsGetCollectionStateReducer } =
  equipmentsGetCollectionSlice.actions;

export const getEquipmentsCollection =
  createGetCollectionAsyncThunkWithArguments({
    reducer: reducerName,
    path: ["equipmentsGetCollectionState"],
    reducerAction: setEquipmentsGetCollectionStateReducer,
    setAccessToken,
    setRefreshToken,
    url: "/equipment-collection",
    getParamsFromStateFunction: (
      getState: Function,
      payload: { [key: string]: any }
    ) => {
      const page = payload?.page ? payload.page : 1;

      const params: { [key: string]: any } = {};

      if (page) params.page = page;

      console.log("GET THIS PAGE FROM SERVER:", page);

      return params;
    },
    callbackAfterGet: async (dispatch, getState, payload) => {
      const {
        pagesLoaded: { data: pagesLoaded },
        equipments: { data: localEquipments },
      } = (getState() as RootState)?.stateEquipments;

      const pages = payload.pages;
      const page = payload.page;
      const ver = payload.ver;

      let isChanged = false;

      const modifiedLocalEquipments = [...localEquipments];
      const remoteEquipments = payload?.entities?.length
        ? payload?.entities
        : [];

      remoteEquipments.forEach((remoteEquipment: DefaultEquipmentStateType) => {
        const localEquipmentIndexWithSameId = localEquipments.findIndex(
          (localEquipment) => {
            return remoteEquipment?.id === localEquipment?.id;
          }
        );

        //  If local version is not found, add to local storage
        if (localEquipmentIndexWithSameId === -1) {
          modifiedLocalEquipments.push({ ...remoteEquipment, page, ver });

          isChanged = true;

          return;
        }

        //  If remote and local have same fields, do nothing
        if (
          localEquipments[localEquipmentIndexWithSameId].name ==
            remoteEquipment.name &&
          localEquipments[localEquipmentIndexWithSameId].serialNumber ==
            remoteEquipment.serialNumber &&
          localEquipments[localEquipmentIndexWithSameId].comment ==
            remoteEquipment.comment &&
          localEquipments[localEquipmentIndexWithSameId].page == page &&
          localEquipments[localEquipmentIndexWithSameId].ver == ver
        )
          return;

        //  If it was modified locally, do nothing, it will be updated in next sync step
        if (localEquipments[localEquipmentIndexWithSameId]?.isModified) return;

        //  If it was modified remotely, replace local equipment with remote copy
        modifiedLocalEquipments.splice(localEquipmentIndexWithSameId, 1, {
          ...remoteEquipment,
          page,
          ver,
        });

        isChanged = true;
      });

      modifiedLocalEquipments.map((localEquipment) => {
        //  If local have id, do nothing
        if (localEquipment?.id) return localEquipment;
        //  If local don't have draftId, do nothing
        if (!localEquipment?.draftId) return localEquipment;

        const remoteEquipmentIndexWithSameHash = remoteEquipments.findIndex(
          (remoteEquipment: DefaultEquipmentStateType) => {
            return remoteEquipment?.hash === localEquipment?.hash;
          }
        );

        //  If nothing with same hash found, do nothing
        if (remoteEquipmentIndexWithSameHash === -1) return localEquipment;

        isChanged = true;

        //  If found remote with same hash, set remote equipment data to local equipment
        //  Saving draftId in the equipment to retain the ability to navigate by draftId
        return {
          ...remoteEquipments[remoteEquipmentIndexWithSameHash],
          draftId: localEquipment.draftId,
          page,
          ver,
        };
      });

      // Set ver for POST and PATCH
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

      //  Set current equipments list
      dispatch(
        setEquipments({ action: "setData", data: modifiedLocalEquipments })
      );
    },
    getAsyncThunk: getCollectionAsyncThunk,
  });

export { reducerName } from "@/store/equipments/getCollection/config";
export default equipmentsGetCollectionSlice.reducer;
