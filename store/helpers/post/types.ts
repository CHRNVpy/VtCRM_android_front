export interface PostState {
  ajaxCancel: Function | null;
  isError: boolean;
  errorFields: Array<string> | null;
  errorText: string;
  isPostSending: boolean;
  isPostDone: boolean;
  responseData?: { [key: string]: string };
}
