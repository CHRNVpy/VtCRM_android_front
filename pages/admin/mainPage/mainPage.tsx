import { StyleSheet, View } from "react-native";
import colors from "@/helpers/colors";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Link from "@/components/controls/link/link";
import ApplicationsLinkIcon from "@/assets/applicationsLinkIcon.svg";
import EquipmentsLinkIcon from "@/assets/equipmentsLinkIcon.svg";
import InstallersLinkIcon from "@/assets/installersLinkIcon.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { s } from "react-native-size-matters";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
import { useCallback } from "react";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(setAccessToken({ action: "reset" }));
    dispatch(setRefreshToken({ action: "reset" }));
  }, []);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <Wrapper>
      <Header />
      <Content isWithPaddings={true}>
        <Link
          icon={<InstallersLinkIcon height={s(32)} width={s(30)} />}
          to={"AdminInstallersPage"}
        >
          Монтажники
        </Link>
        <Link
          icon={<EquipmentsLinkIcon height={s(24)} width={s(32)} />}
          to={"AdminEquipmentsPage"}
        >
          Оборудование
        </Link>
        <Link
          icon={<ApplicationsLinkIcon height={s(30)} width={s(22)} />}
          to={"AdminApplicationsPoolsPage"}
        >
          Пулы заявок
        </Link>
      </Content>
      <Buttons>
        <Button onPress={handleLogout}>Выйти</Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  links: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: s(50),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
});
