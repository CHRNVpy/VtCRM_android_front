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

      if (stateByPath) {
        stateByPath.isPostDone = false;
        stateByPath.isPostSending = true;
      }
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

      if (stateByPath) {
        stateByPath.isPostDone = false;
        stateByPath.isPostSending = false;
      }

      if (action.payload == "Probably not error just canceled") {
        console.log("Probably not error just canceled");
      }

      if (action.payload != "Probably not error just canceled") {
        console.log("DISPATCH ERROR");
      }
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

      if (stateByPath) {
        stateByPath.isPostDone = true;
        stateByPath.isPostSending = false;
      }

      const status = action.payload.status;
      const data = action.payload.data;

      if (status == 200) {
        stateByPath.responseData = data;
        stateByPath.isError = false;
        stateByPath.errorFields = null;
        stateByPath.errorText = "";
      }

      if (additionalActions?.fulfilled)
        additionalActions.fulfilled(stateByPath, status, data);
    });
};
