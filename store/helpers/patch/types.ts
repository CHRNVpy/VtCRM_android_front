export interface PatchState {
  ajaxCancel: Function | null;
  isError: boolean;
  errorFields: string[] | null;
  errorText: string;
  isInProcess: boolean;
  isDone: boolean;
  responseData?: { [key: string]: string };
}
