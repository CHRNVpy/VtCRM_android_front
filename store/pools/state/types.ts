import { DefaultStateType } from "@/store/helpers/state";

export interface DefaultPoolStateType {
  id?: number;
  draftId?: number;
  status: "active" | "pending" | "finished" | "approved" | "cancelled";
  applicationsCount: number;
  installerId?: number;
  entities?: [];
  page?: number;
  ver?: number;
}

export interface DefaultPoolsStateType extends DefaultStateType {
  data: DefaultPoolStateType[];
}
