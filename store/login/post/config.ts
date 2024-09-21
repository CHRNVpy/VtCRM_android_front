import { createPostAsyncThunk } from "@/store/helpers/post";

export const reducerName = "loginPost";

export const postLoginAsyncThunk = createPostAsyncThunk({
  reducer: reducerName,
});
