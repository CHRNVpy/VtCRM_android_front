import { GetCollectionState } from "@/store/helpers/getCollection/types";

//  Default get collection state
export const defaultGetCollectionState: GetCollectionState = {
  data: [],
  variables: {},
  ver: 0,
  filters: {},
  totalRows: 0,
  page: 0,
  perPage: 10,
  isInProcess: false,
  isLoaded: false,
  ajaxCancel: null,
};
