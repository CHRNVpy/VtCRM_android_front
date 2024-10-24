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
import { setEquipments } from "@/store/equipments/state/state";
import { getEquipmentsCollection } from "@/store/equipments/getCollection/getCollection";
import { PostState } from "@/store/helpers/post/types";

const slice = createSlice({
  name: reducerName,
  initialState: {
    postEquipmentState: {} as { [key: string]: PostState },
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
    data.hash = equipment?.hash;
    data.ver = ver ? ver : 0;

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

    const entity = responseData.data.entity;
    const rowNum = entity.rowNum;
    const page = Math.ceil(rowNum / 10);
    const ver = responseData.data.ver;

    const modifiedEquipments = [...equipments].map((equipment) => {
      //  Saving draftId in the equipment to retain the ability to navigate by draftId
      if (equipment?.draftId == draftId)
        return {
          ...entity,
          draftId,
          isModified: equipment.isModified,
          page,
          ver,
        };

      return equipment;
    });

    const modifiedUniqueEquipments = modifiedEquipments.reduce(
      (result, element) => {
        const isSameHash = result.find(
          (item: any) =>
            !!item?.hash && !!element?.hash && item?.hash === element?.hash
        );

        if (!isSameHash) {
          result.push(element);

          return result;
        }

        if (!element?.draftId) return result;

        result = result.map((item: any) =>
          item?.hash === element?.hash ? element : item
        );

        return result;
      },
      []
    );

    await dispatch(
      setEquipments({ action: "setData", data: modifiedUniqueEquipments })
    );
    await dispatch(getEquipmentsCollection({ page: page }));
  },
});

export default slice.reducer;
