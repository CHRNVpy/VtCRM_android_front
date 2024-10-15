import { createAsyncThunk, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import ajaxRequest, {
  cancelTokenFunction,
} from "@/services/ajaxRequest/ajaxRequest";
import { GetCollectionDefaultReducerActionType } from "@/store/helpers/getCollection/types";

export const createGetCollectionAsyncThunkWithArguments = ({
  reducer,
  path,
  reducerAction,
  setAccessToken,
  setRefreshToken,
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
  setAccessToken?: Function;
  setRefreshToken?: Function;
  url?: string;
  urlFromStateFunction?: Function;
  getParamsFromStateFunction: Function;
  callbackAfterGet: (
    dispatch: any,
    getState: Function,
    payload: any
  ) => Promise<void>;
  getAsyncThunk: any;
}) => {
  return createAsyncThunk(
    `Get ${reducer} collection with wrapper`,
    async (
      payload:
        | {
            page?: number;
          }
        | undefined,
      { dispatch }
    ) => {
      await dispatch(
        getAsyncThunk({
          reducer,
          path,
          reducerAction,
          setAccessToken,
          setRefreshToken,
          url,
          urlFromStateFunction,
          getParamsFromStateFunction,
          callbackAfterGet,
          page: payload?.page,
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
        setAccessToken?: Function;
        setRefreshToken?: Function;
        url?: string;
        urlFromStateFunction?: Function;
        getParamsFromStateFunction: Function;
        callbackAfterGet: (
          dispatch: any,
          getState: Function,
          payload: any
        ) => Promise<void>;
        page: number;
      },
      { dispatch, getState, rejectWithValue }
    ) => {
      try {
        const accessToken = (getState() as { [name: string]: any })
          ?.stateNavigation?.accessToken?.data;
        const refreshToken = (getState() as { [name: string]: any })
          ?.stateNavigation?.refreshToken?.data;

        const path = payload.page
          ? [...payload.path, payload.page.toString()]
          : payload.path;

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
            ? payload.getParamsFromStateFunction(getState, payload)
            : {};

        const url: string = payload.urlFromStateFunction
          ? payload.urlFromStateFunction(getState)
          : payload.url;

        try {
          const response = await ajaxRequest({
            method: "get",
            accessToken,
            refreshToken,
            setAccessToken: (data) =>
              !!payload.setAccessToken &&
              dispatch(payload.setAccessToken(data)),
            setRefreshToken: (data) =>
              !!payload.setRefreshToken &&
              dispatch(payload.setRefreshToken(data)),
            url,
            params,
            cancelToken,
          });

          console.log(response.data);

          if (response.status == 200 && response.data.status == "ok") {
            const entities: Array<any> = response.data.data.entities;
            const totalRows: number = response.data.data.totalRows;
            const page: number = response.data.data.page;
            const pages: number = response.data.data.pages;
            const ver: { [key: string]: any } = response.data.data?.ver
              ? response.data.data.ver
              : undefined;
            const appVer: { [key: string]: any } = response.data.data?.appVer
              ? response.data.data.appVer
              : undefined;
            const imageVer: { [key: string]: any } = response.data.data
              ?.imageVer
              ? response.data.data.imageVer
              : undefined;

            if (payload.callbackAfterGet)
              await payload.callbackAfterGet(dispatch, getState, {
                entities,
                totalRows,
                page,
                pages,
                ver,
                appVer,
                imageVer,
              });

            return {
              entities,
              totalRows,
              page,
              pages,
              ver,
              appVer,
              imageVer,
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
