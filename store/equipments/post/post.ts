import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  postDefaultReducer,
  createPostAsyncThunkWithArguments,
  postDefaultExtraReducer,
} from "@/store/helpers/post";
import {
  reducerName,
  postEquipmentAsyncThunk,
} from "@/store/equipments/post/config";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { DefaultEquipmentStateType } from "@/store/equipments/state/types";
import { setVer, setEquipments } from "@/store/equipments/state/state";

const slice = createSlice({
  name: reducerName,
  initialState: {
    postEquipmentState: {},
  },
  reducers: {
    setPostEquipmentStateReducer(state, action) {
      postDefaultReducer(state, action, ["postEquipmentState"]);
    },
  },
  extraReducers: (builder) => {
    postDefaultExtraReducer(builder, postEquipmentAsyncThunk);
  },
});

export const { setPostEquipmentStateReducer } = slice.actions;

export const postEquipment = createPostAsyncThunkWithArguments({
  reducer: reducerName,
  path: ["postEquipmentState"],
  reducerAction: setPostEquipmentStateReducer,
  url: "/equipment",
  postAsyncThunk: postEquipmentAsyncThunk,
  setAccessToken,
  setRefreshToken,
  getDataFromStateFunction: (
    getState: Function,
    payload: { [key: string]: any }
  ) => {
    const draftId = payload?.id;

    const {
      equipments: { data: equipments },
      ver: { data: ver },
    } = (getState() as RootState)?.stateEquipments;

    const equipment = equipments.reduce(
      (
        result?: DefaultEquipmentStateType,
        item?: DefaultEquipmentStateType
      ) => {
        if (result) return result;

        if (item?.draftId == draftId) return item;

        return result;
      },
      undefined
    );

    const data: { [key: string]: any } = {};

    data.name = equipment?.name;
    data.serialNumber = equipment?.serialNumber;
    data.comment = equipment?.comment;
    data.status = "active";
    data.hash = equipment?.hash;

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
      equipments: { data: equipments },
    } = (getState() as RootState)?.stateEquipments;

    const ver = responseData.data.ver;
    const entity = responseData.data.entity;

    const modifiedEquipments = [...equipments].map((equipment) => {
      //  Saving draftId in the equipment to retain the ability to navigate by draftId
      if (equipment?.draftId == draftId) return { ...entity, draftId };

      return equipment;
    });

    dispatch(setVer({ action: "setData", data: ver }));
    dispatch(setEquipments({ action: "setData", data: modifiedEquipments }));
  },
});

export default slice.reducer;
