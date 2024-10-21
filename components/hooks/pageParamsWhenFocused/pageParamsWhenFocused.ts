import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const usePageParamsWhenFocused = () => {
  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  return pageParams;
};

export default usePageParamsWhenFocused;
