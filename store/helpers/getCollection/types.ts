export interface GetCollectionState {
  data: Array<any>;
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
