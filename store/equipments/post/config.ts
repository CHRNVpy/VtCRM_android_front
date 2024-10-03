import { createPostAsyncThunk } from "@/store/helpers/post";

export const reducerName = "postEquipment";

export const postEquipmentAsyncThunk = createPostAsyncThunk({
  reducer: reducerName,
});
