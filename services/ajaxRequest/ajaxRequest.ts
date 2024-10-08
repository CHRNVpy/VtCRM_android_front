import axios, {
  CancelToken,
  CancelTokenSource,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
  AxiosProgressEvent,
} from "axios";
import { apiUrl } from "@/configs/paths/paths";

export type AjaxRequestResult = AxiosResponse<any>;

//  Retry request on network error
const delayedAjaxQuery = <T>(ajaxRequest: any, originalRequest: any) => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      ajaxRequest(originalRequest)
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    }, 3000);
  });
};

const ajaxRequest = async (
  {
    method,
    url,
    data,
    params,
    headers,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    cancelToken,
    timeout,
    onUploadProgress,
    isAuthorization,
  }: {
    method: string;
    url: string;
    data?: { [key: string]: any };
    params?: { [key: string]: any };
    headers?: { [key: string]: any };
    accessToken?: string;
    refreshToken?: string;
    setAccessToken?: ({
      action,
      data,
    }: {
      action: "setData" | "reset";
      data?: string;
    }) => void;
    setRefreshToken?: ({
      action,
      data,
    }: {
      action: "setData" | "reset";
      data?: string;
    }) => void;
    cancelToken?: CancelToken;
    timeout?: number;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    isAuthorization?: boolean;
  },
  preventRepeat: boolean = false
): Promise<AjaxRequestResult | { status: number; data?: any }> => {
  const mainHeaders: AxiosRequestHeaders["headers"] = {};

  mainHeaders["Content-Type"] = "application/json";

  if (accessToken) mainHeaders["Authorization"] = `Bearer ${accessToken}`;

  //  Original request with authorization token
  const originalRequest = {
    baseURL: apiUrl,
    timeout: timeout ? timeout : 60000,
    method,
    url,
    data,
    params,
    headers: {
      ...headers,
      ...mainHeaders,
    },
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    cancelToken,
    onUploadProgress,
  };

  try {
    //  Trying to make original request
    const resultQuery: AxiosResponse<any> = await axios(originalRequest);

    return resultQuery;
  } catch (error) {
    //  Not query error, logout
    if (!axios.isAxiosError(error)) {
      setAccessToken && setAccessToken({ action: "reset" });
      setRefreshToken && setRefreshToken({ action: "reset" });

      throw error;
    }

    const axiosError: AxiosError = error;

    //  Canceled
    if (error.code === "ERR_CANCELED") throw axiosError;

    //  Network error, repeat after 3 seconds
    if (error.code === "ERR_NETWORK")
      return delayedAjaxQuery<AjaxRequestResult>(ajaxRequest, originalRequest);

    //  Aborted, repeat request
    if (error.code === "ECONNABORTED") return ajaxRequest(originalRequest);

    //  Unknow error
    if (!axiosError.response) throw axiosError;

    const response: AxiosResponse = axiosError.response;

    //  If authorization error
    if (response.status == 401 || response.status == 403) {
      if (isAuthorization) return response;

      //  If repeat prevented, logout
      if (preventRepeat) {
        setAccessToken && setAccessToken({ action: "reset" });
        setRefreshToken && setRefreshToken({ action: "reset" });

        throw Error("Authorization error");
      }

      //  If not refresh token, logout
      if (!refreshToken) {
        setAccessToken && setAccessToken({ action: "reset" });

        throw Error("Authorization error");
      }

      //  Get another access token
      try {
        const refreshTokenResult = await ajaxRequest(
          {
            method: "post",
            url: `/refresh-token`,
            data: {
              refreshToken,
            },
            timeout: 1000,
            accessToken,
            refreshToken,
            setAccessToken,
            setRefreshToken,
          },
          true
        );

        //  Problem while getting new access token
        if (!refreshTokenResult || refreshTokenResult?.data?.status !== "ok") {
          setAccessToken && setAccessToken({ action: "reset" });
          setRefreshToken && setRefreshToken({ action: "reset" });

          throw Error("Authorization error");
        }

        //  Set new access token
        setAccessToken &&
          setAccessToken({
            action: "setData",
            data: refreshTokenResult.data.data.accessToken,
          });

        //  Set new refresh token
        setAccessToken &&
          setAccessToken({
            action: "setData",
            data: refreshTokenResult.data.data.refreshToken,
          });

        originalRequest.accessToken = refreshTokenResult.data.data.accessToken;
        originalRequest.refreshToken =
          refreshTokenResult.data.data.refreshToken;

        //  Repeat request
        return ajaxRequest(originalRequest, true);
      } catch (error) {
        //  Logout
        setAccessToken && setAccessToken({ action: "reset" });
        setRefreshToken && setRefreshToken({ action: "reset" });

        throw Error("Authorization error");
      }
    }

    return response;
  }
};

export const cancelTokenFunction = axios.CancelToken;
export type CancelTokenSourceType = CancelTokenSource;
export type AxiosProgressEventType = AxiosProgressEvent;

export default ajaxRequest;
