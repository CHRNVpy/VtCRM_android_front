import { createGetCollectionAsyncThunk } from "@/store/helpers/getCollection";

export const reducerName = "getCollectionApplications";

export const getCollectionAsyncThunk = createGetCollectionAsyncThunk({
  reducer: reducerName,
});
