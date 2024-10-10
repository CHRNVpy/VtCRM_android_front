import { GetCollectionState } from "@/store/helpers/getCollection/types";

//  Default get collection state
export const defaultGetCollectionState: GetCollectionState = {
  data: [],
  isInProcess: false,
  isLoaded: false,
  ajaxCancel: null,
};
