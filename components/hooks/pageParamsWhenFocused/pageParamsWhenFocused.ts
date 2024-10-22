import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const usePageParams = (pageData: string) => {
  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  return pageParams?.[pageData];
};

export default usePageParams;
