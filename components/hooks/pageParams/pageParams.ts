import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRoute } from "@react-navigation/native";

const usePageParams = () => {
  const route = useRoute();

  const screenName = route.name;

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  return pageParams?.[screenName];
};

export default usePageParams;
