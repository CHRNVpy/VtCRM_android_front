import { GetCollectionState } from "@/store/helpers/getCollection/types";
import { defaultGetCollectionState } from "@/store/helpers/getCollection/defaultState";

export const getCollectionDefaultExtraReducer = (
  builder: any,
  asyncThunk: any
) => {
  builder
    .addCase(asyncThunk.pending, (state: any, action: any) => {
      const page: string = action.meta.arg?.page
        ? action.meta.arg?.page?.toString()
        : "0";
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: { [key: string]: GetCollectionState } = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      if (!stateByPath[page])
        stateByPath[page] = { ...defaultGetCollectionState };

      const stateByPathWithId = stateByPath[page];

      stateByPathWithId.isLoaded = false;
      stateByPathWithId.isInProcess = true;
    })
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      const page: string = action.meta.arg?.page
        ? action.meta.arg?.page?.toString()
        : "0";
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: { [key: string]: GetCollectionState } = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      if (!stateByPath[page])
        stateByPath[page] = { ...defaultGetCollectionState };

      const stateByPathWithId = stateByPath[page];

      stateByPathWithId.isLoaded = false;
      stateByPathWithId.isInProcess = false;
    })
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      const page: string = action.meta.arg?.page
        ? action.meta.arg?.page?.toString()
        : "0";
      const path: Array<string> = action.meta.arg.path;

      const stateByPath: { [key: string]: GetCollectionState } = path
        ? path.reduce((result, item) => {
            if (!result) return undefined;

            if (!result?.[item]) return undefined;

            return result[item];
          }, state)
        : undefined;

      if (!stateByPath) return;

      if (!stateByPath[page])
        stateByPath[page] = { ...defaultGetCollectionState };

      const stateByPathWithId = stateByPath[page];

      stateByPathWithId.isLoaded = true;
      stateByPathWithId.isInProcess = false;

      stateByPathWithId.data = action.payload?.entities
        ? action.payload.entities
        : defaultGetCollectionState.data;
    });
};
