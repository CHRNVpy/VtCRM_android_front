import { createPostAsyncThunk } from "@/store/helpers/post";

export const reducerName = "postApplication";

export const postApplicationAsyncThunk = createPostAsyncThunk({
  reducer: reducerName,
});
