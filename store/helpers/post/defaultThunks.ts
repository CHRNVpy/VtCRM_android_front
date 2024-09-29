import { createAsyncThunk } from "@reduxjs/toolkit";
import ajaxRequest, {
  cancelTokenFunction,
} from "@/services/ajaxRequest/ajaxRequest";

//  Nested asyncThunks are needed to use templates for handling various scenarios with the same pattern
export const createPostAsyncThunkWithArguments = ({
  reducer,
  path,
  reducerAction,
  url,
  urlFromStateFunction,
  getDataFromStateFunction,
  setAccessToken,
  setRefreshToken,
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
  setAccessToken?: Function;
  setRefreshToken?: Function;
  callbackAfterPost?: (
    dispatch: any,
    getState: Function,
    responseData?: any,
    responseStatus?: any,
    payload?: any
  ) => Promise<void>;
  postAsyncThunk: any;
  isAuthorization?: boolean;
}) => {
  return createAsyncThunk(
    `Post ${reducer} with wrapper`,
    async (payload: { id: number }, { dispatch }) => {
      await dispatch(
        postAsyncThunk({
          reducer,
          path,
          reducerAction,
          url,
          urlFromStateFunction,
          getDataFromStateFunction,
          setAccessToken,
          setRefreshToken,
          callbackAfterPost,
          isAuthorization,
          id: payload?.id,
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
        setAccessToken?: Function;
        setRefreshToken?: Function;
        callbackAfterPost?: (
          dispatch: any,
          getState?: Function,
          responseData?: any,
          responseStatus?: any,
          payload?: any
        ) => Promise<void>;
        isAuthorization: boolean;
        id?: number;
      },
      { dispatch, getState, rejectWithValue }
    ) => {
      try {
        const accessToken = (getState() as { [name: string]: any })
          ?.stateNavigation?.accessToken?.data;
        const refreshToken = (getState() as { [name: string]: any })
          ?.stateNavigation?.refreshToken?.data;

        const path = payload.id
          ? [...payload.path, payload.id.toString()]
          : payload.path;

        const reducerAction = payload.reducerAction;

        const stateByPath = path.reduce((result, item) => {
          if (!result) return undefined;
          if (!result?.[item]) return undefined;

          return result[item];
        }, (getState() as { [name: string]: any })?.[reducer]);

        //  Cancel previous ajax query
        if (stateByPath?.ajaxCancel) stateByPath.ajaxCancel();

        let ajaxCancel;

        //  Make new cancel token
        const cancelToken = new cancelTokenFunction(function executor(
          cancelFunction
        ) {
          ajaxCancel = cancelFunction;
        });

        //  Set cancel token to store
        if (reducerAction)
          dispatch(
            reducerAction({
              action: "setAjaxCancel",
              ajaxCancel,
              id: payload.id,
            })
          );

        //  Get query data by function
        const data: { [key: string]: any } = payload.getDataFromStateFunction
          ? payload.getDataFromStateFunction(getState, payload)
          : undefined;

        //  Get url by settings or function
        const url: string = payload.urlFromStateFunction
          ? payload.urlFromStateFunction(getState, payload)
          : payload.url;

        //  Make a request
        try {
          const response = await ajaxRequest(
            {
              method: "post",
              url,
              data,
              accessToken,
              refreshToken,
              setAccessToken: (data) =>
                !!payload.setAccessToken &&
                dispatch(payload.setAccessToken(data)),
              setRefreshToken: (data) =>
                !!payload.setRefreshToken &&
                dispatch(payload.setRefreshToken(data)),
              cancelToken,
              isAuthorization: !!payload?.isAuthorization,
            },
            !!payload?.isAuthorization
          );

          console.log(response.data, response.status);

          if (payload.callbackAfterPost)
            await payload.callbackAfterPost(
              dispatch,
              getState,
              response.data,
              response.status,
              payload
            );

          return { data: response.data, status: response.status };
        } catch (error: any) {
          return rejectWithValue("Cancelled");
        }
      } catch (error) {
        return rejectWithValue("Request error");
      }
    }
  );
};
