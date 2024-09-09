import { createAsyncThunk } from "@reduxjs/toolkit";
import ajaxRequest, {
  cancelTokenFunction,
} from "@/services/ajaxRequest/ajaxRequest";

export const createPostAsyncThunkWithArguments = ({
  reducer,
  path,
  reducerAction,
  url,
  urlFromStateFunction,
  getDataFromStateFunction,
  callbackAfterPost,
  postAsyncThunk,
  isAuthorization,
}: {
  reducer: string;
  path: Array<string>;
  reducerAction?: any;
  url?: string;
  urlFromStateFunction?: Function;
  getDataFromStateFunction: Function;
  callbackAfterPost?: (
    dispatch: any,
    getState?: Function,
    responseData?: any
  ) => Promise<void>;
  postAsyncThunk: any;
  isAuthorization?: boolean;
}) => {
  return createAsyncThunk(
    `Post ${reducer} with wrapper`,
    async (payload, { dispatch }) => {
      await dispatch(
        postAsyncThunk({
          reducer,
          path,
          reducerAction,
          url,
          urlFromStateFunction,
          getDataFromStateFunction,
          callbackAfterPost,
          isAuthorization,
        })
      );
    }
  );
};

export const createPostAsyncThunk = ({ reducer }: { reducer: string }) => {
  return createAsyncThunk(
    `Post ${reducer}`,
    async (
      payload: {
        path: Array<string>;
        reducerAction?: any;
        url?: string;
        urlFromStateFunction?: Function;
        getDataFromStateFunction: Function;
        callbackAfterPost?: (
          dispatch: any,
          getState?: Function,
          responseData?: any
        ) => Promise<void>;
        isAuthorization: boolean;
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
              ajaxCancel,
            })
          );

        const data: { [key: string]: any } = payload.getDataFromStateFunction
          ? payload.getDataFromStateFunction(getState)
          : undefined;

        const url: string = payload.urlFromStateFunction
          ? payload.urlFromStateFunction(getState)
          : payload.url;

        try {
          const response = await ajaxRequest(
            {
              method: "post",
              url,
              data,
              cancelToken,
              isAuthorization: !!payload?.isAuthorization,
            },
            !!payload?.isAuthorization
          );

          if (response.status == 200) {
            if (payload.callbackAfterPost)
              await payload.callbackAfterPost(
                dispatch,
                getState,
                response.data
              );

            return { data: response.data, status: response.status };
          }

          return { data: response.data, status: response.status };
        } catch (error: any) {
          return rejectWithValue("Probably not error just canceled");
        }
      } catch (error) {
        return rejectWithValue("Ajax request error");
      }
    }
  );
};
