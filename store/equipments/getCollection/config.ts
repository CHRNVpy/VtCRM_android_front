import { createGetCollectionAsyncThunk } from "@/store/helpers/getCollection";

export const reducerName = "getCollectionEquipments";

export const getCollectionAsyncThunk = createGetCollectionAsyncThunk({
  reducer: reducerName,
});
