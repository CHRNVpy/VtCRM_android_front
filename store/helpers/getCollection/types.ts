export interface GetCollectionState {
  data: Array<any>;
  variables: { [key: string]: any };
  ver: number;
  filters: { [key: string]: any };
  totalRows: number;
  page: number;
  perPage: number;
  isInProcess: boolean;
  isLoaded: boolean;
  ajaxCancel: Function | null;
}

export type GetCollectionDefaultReducerActionType = {
  payload: {
    action: "setAjaxCancel" | "setPage" | "setFilters" | "reset";
    data?: any;
  };
  type: string;
};
