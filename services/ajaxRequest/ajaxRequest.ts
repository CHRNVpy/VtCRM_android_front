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
    setAccessToken?: (accessToken: string) => void;
    setRefreshToken?: (refreshToken: string) => void;
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
    const resultQuery: AxiosResponse<any> = await axios(originalRequest);

    return resultQuery;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      setAccessToken && setAccessToken("");
      setRefreshToken && setRefreshToken("");

      throw error;
    }

    const axiosError: AxiosError = error;

    if (error.code === "ERR_CANCELED") throw axiosError;

    if (error.code === "ERR_NETWORK")
      return delayedAjaxQuery<AjaxRequestResult>(ajaxRequest, originalRequest);

    if (error.code === "ECONNABORTED") return ajaxRequest(originalRequest);

    if (!axiosError.response) throw axiosError;

    const response: AxiosResponse = axiosError.response;

    if (response.status == 401 || response.status == 403) {
      if (isAuthorization)
        return {
          status: 401,
        };

      if (preventRepeat) {
        setAccessToken && setAccessToken("");
        setRefreshToken && setRefreshToken("");

        throw Error("Authorization error");
      }

      if (!refreshToken) {
        setAccessToken && setAccessToken("");

        throw Error("Authorization error");
      }

      try {
        const refreshTokenResult = await ajaxRequest(
          {
            method: "post",
            url: `/refresh-token`,
            data: {
              refresh_token: refreshToken,
            },
            timeout: 1000,
            accessToken,
            refreshToken,
            setAccessToken,
            setRefreshToken,
          },
          true
        );

        if (!refreshTokenResult) {
          setAccessToken && setAccessToken("");
          setRefreshToken && setRefreshToken("");

          throw Error("Authorization error");
        }

        setAccessToken &&
          setAccessToken(refreshTokenResult.data["access_token"]);
        setRefreshToken &&
          setRefreshToken(refreshTokenResult.data["refresh_token"]);

        return ajaxRequest(originalRequest, true);
      } catch (error) {
        setAccessToken && setAccessToken("");
        setRefreshToken && setRefreshToken("");

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
