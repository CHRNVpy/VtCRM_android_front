import { PostState } from "@/store/helpers/post/types";
import { defaultPostState } from "@/store/helpers/post/defaultState";

export const postDefaultExtraReducer = (
  builder: any,
  asyncThunk: any,
  additionalActions?: {
    fulfilled?: (stateByPath: any, status: any, data: any) => void;
  }
) => {
  builder
    .addCase(asyncThunk.pending, (state: any, action: any) => {
      const id: string = action.meta.arg?.id?.toString();
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: { [key: string]: PostState } = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      if (id && !stateByPath[id]) stateByPath[id] = { ...defaultPostState };

      const stateByPathWithId = id ? stateByPath[id] : stateByPath;

      stateByPathWithId.isDone = false;
      stateByPathWithId.isInProcess = true;
    })
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      const id: string = action.meta.arg?.id?.toString();
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: { [key: string]: PostState } = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      const stateByPathWithId = id ? stateByPath[id] : stateByPath;

      stateByPathWithId.isDone = false;
      stateByPathWithId.isInProcess = false;
    })
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      const id: string = action.meta.arg?.id?.toString();
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: { [key: string]: PostState } = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      const stateByPathWithId = id ? stateByPath[id] : stateByPath;

      stateByPathWithId.isDone = true;
      stateByPathWithId.isInProcess = false;

      const data = action.payload.data;

      if (additionalActions?.fulfilled)
        additionalActions.fulfilled(
          stateByPathWithId,
          data?.status,
          data?.data
        );

      if (data.status == "error") return;

      stateByPathWithId.responseData = data;
      stateByPathWithId.isError = false;
      stateByPathWithId.errorFields = null;
      stateByPathWithId.errorText = "";
    });
};
