import { GetCollectionState } from "@/store/helpers/getCollection/types";
import { defaultGetCollectionState } from "@/store/helpers/getCollection/defaultState";

export const getCollectionDefaultExtraReducer = (
  builder: any,
  asyncThunk: any
) => {
  builder
    .addCase(asyncThunk.pending, (state: any, action: any) => {
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: GetCollectionState = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      stateByPath.isLoaded = false;
      stateByPath.isInProcess = true;
    })
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: GetCollectionState = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      stateByPath.isLoaded = false;
      stateByPath.isInProcess = false;
    })
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: GetCollectionState = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      stateByPath.isLoaded = true;
      stateByPath.isInProcess = false;

      stateByPath.data = action.payload?.entities
        ? action.payload.entities
        : defaultGetCollectionState.data;
      stateByPath.variables = action.payload?.variables
        ? action.payload.variables
        : defaultGetCollectionState.variables;
      stateByPath.ver = action.payload?.ver
        ? action.payload.ver
        : defaultGetCollectionState.ver;
      stateByPath.totalRows = action.payload?.totalRows
        ? action.payload.totalRows
        : defaultGetCollectionState.totalRows;
    });
};
