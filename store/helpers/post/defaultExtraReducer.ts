import { PostState } from "./types";

export const postDefaultExtraReducer = (
  builder: any,
  asyncThunk: any,
  additionalActions?: {
    fulfilled?: (stateByPath: any, status: any, data: any) => void;
  }
) => {
  builder
    .addCase(asyncThunk.pending, (state: any, action: any) => {
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: PostState = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      stateByPath.isDone = false;
      stateByPath.isInProcess = true;
    })
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: PostState = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      stateByPath.isDone = false;
      stateByPath.isInProcess = false;
    })
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: PostState = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      stateByPath.isDone = true;
      stateByPath.isInProcess = false;

      const data = action.payload.data;

      if (additionalActions?.fulfilled)
        additionalActions.fulfilled(stateByPath, status, data);

      if (data.status == "error") return;

      stateByPath.responseData = data;
      stateByPath.isError = false;
      stateByPath.errorFields = null;
      stateByPath.errorText = "";
    });
};
