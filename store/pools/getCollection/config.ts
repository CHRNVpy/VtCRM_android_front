import { createGetCollectionAsyncThunk } from "@/store/helpers/getCollection";

export const reducerName = "getCollectionPools";

export const getCollectionAsyncThunk = createGetCollectionAsyncThunk({
  reducer: reducerName,
});
