import { createGetCollectionAsyncThunk } from "@/store/helpers/getCollection";

export const reducerName = "installersGetCollection";

export const getCollectionAsyncThunk = createGetCollectionAsyncThunk({
  reducer: reducerName,
});
