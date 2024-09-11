import { StyleSheet, View, Text } from "react-native";
import colors from "@/helpers/colors";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import ApplicationsLinkIcon from "@/assets/applicationsLinkIcon.svg";
import EquipmentsLinkIcon from "@/assets/equipmentsLinkIcon.svg";
import InstallersLinkIcon from "@/assets/installersLinkIcon.svg";
import { s } from "react-native-size-matters";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <Wrapper>
      <Header />
      <View style={styles.links}>
        <View style={styles.link}>
          <View style={styles.icon}>
            <InstallersLinkIcon height={s(32)} width={s(30)} />
          </View>
          <Text style={styles.text}>Монтажники</Text>
        </View>
        <View style={styles.link}>
          <View style={styles.icon}>
            <EquipmentsLinkIcon height={s(24)} width={s(32)} />
          </View>
          <Text style={styles.text}>Оборудование</Text>
        </View>
        <View style={[styles.link, styles.lastLink]}>
          <View style={styles.icon}>
            <ApplicationsLinkIcon height={s(30)} width={s(22)} />
          </View>
          <Text style={styles.text}>Пулы заявок</Text>
        </View>
      </View>
      <Buttons>
        <Button>Выйти</Button>
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
  link: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: s(28),
  },
  lastLink: {
    marginBottom: s(0),
  },
  icon: {
    width: s(30),
    height: s(32),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: s(20),
    lineHeight: s(24),
    marginLeft: s(12),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
});
