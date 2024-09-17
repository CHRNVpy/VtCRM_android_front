export interface PostState {
  ajaxCancel: Function | null;
  isError: boolean;
  errorFields: Array<string> | null;
  errorText: string;
  isInProcess: boolean;
  isDone: boolean;
  responseData?: { [key: string]: string };
}
