import { createAsyncThunk, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import ajaxRequest, {
  cancelTokenFunction,
} from "@/services/ajaxRequest/ajaxRequest";
import { GetCollectionDefaultReducerActionType } from "@/store/helpers/getCollection/types";

export const createGetCollectionAsyncThunkWithArguments = ({
  reducer,
  path,
  reducerAction,
  url,
  urlFromStateFunction,
  getParamsFromStateFunction,
  callbackAfterGet,
  getAsyncThunk,
}: {
  reducer: string;
  path: Array<string>;
  reducerAction?: ActionCreatorWithPayload<
    GetCollectionDefaultReducerActionType["payload"],
    any
  >;
  url?: string;
  urlFromStateFunction?: Function;
  getParamsFromStateFunction: Function;
  callbackAfterGet: (dispatch: any, payload: any) => Promise<void>;
  getAsyncThunk: any;
}) => {
  return createAsyncThunk(
    `Get ${reducer} collection with wrapper`,
    async (payload, { dispatch }) => {
      await dispatch(
        getAsyncThunk({
          reducer,
          path,
          reducerAction,
          url,
          urlFromStateFunction,
          getParamsFromStateFunction,
          callbackAfterGet,
        })
      );
    }
  );
};

export const createGetCollectionAsyncThunk = ({
  reducer,
}: {
  reducer: string;
}) => {
  return createAsyncThunk(
    `Get ${reducer} collection`,
    async (
      payload: {
        reducer: string;
        path: Array<string>;
        reducerAction?: ActionCreatorWithPayload<
          GetCollectionDefaultReducerActionType["payload"],
          any
        >;
        url?: string;
        urlFromStateFunction?: Function;
        getParamsFromStateFunction: Function;
        callbackAfterGet: (dispatch: any, payload: any) => Promise<void>;
      },
      { dispatch, getState, rejectWithValue }
    ) => {
      try {
        const path = payload.path;
        const reducerAction = payload.reducerAction;

        const stateByPath = path.reduce((result, item) => {
          if (!result) return undefined;
          if (!result?.[item]) return undefined;

          return result[item];
        }, (getState() as { [name: string]: any })?.[reducer]);

        //  Cancel previous ajax query
        if (stateByPath.ajaxCancel) stateByPath.ajaxCancel();

        let ajaxCancel;

        const cancelToken = new cancelTokenFunction(function executor(
          cancelFunction
        ) {
          ajaxCancel = cancelFunction;
        });

        if (reducerAction)
          dispatch(
            reducerAction({
              action: "setAjaxCancel",
              data: ajaxCancel,
            })
          );

        const params: { [key: string]: any } =
          payload.getParamsFromStateFunction
            ? payload.getParamsFromStateFunction(getState)
            : {};

        const url: string = payload.urlFromStateFunction
          ? payload.urlFromStateFunction(getState)
          : payload.url;

        try {
          const response = await ajaxRequest({
            method: "get",
            url,
            params,
            cancelToken,
          });

          if (response.status == 200 && response.data.status == "ok") {
            const entities: Array<any> = response.data.data.entities;
            const totalRows: number = response.data.data.totalRows;
            const variables: { [key: string]: any } = response.data.data
              ?.variables
              ? response.data.data.variables
              : undefined;

            if (payload.callbackAfterGet)
              await payload.callbackAfterGet(dispatch, {
                entities,
                totalRows,
                variables,
              });

            return {
              entities,
              variables,
              totalRows,
            };
          }

          return rejectWithValue(response);
        } catch (error: any) {
          return rejectWithValue(error);
        }
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
};
