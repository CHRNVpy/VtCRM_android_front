import { PatchState } from "@/store/helpers/patch/types";

//  Default patch state
export const defaultPatchState: PatchState = {
  ajaxCancel: null,
  isError: false,
  errorFields: null,
  errorText: "",
  isInProcess: false,
  isDone: false,
  responseData: undefined,
};
