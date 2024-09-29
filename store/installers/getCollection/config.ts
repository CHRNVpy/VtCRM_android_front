import { createGetCollectionAsyncThunk } from "@/store/helpers/getCollection";

export const reducerName = "getCollectionInstallers";

export const getCollectionAsyncThunk = createGetCollectionAsyncThunk({
  reducer: reducerName,
});
