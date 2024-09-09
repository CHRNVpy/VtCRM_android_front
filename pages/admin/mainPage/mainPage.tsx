import { StyleSheet, View, Text } from "react-native";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import ApplicationsLinkIcon from "@/assets/applicationsLinkIcon.svg";
import EquipmentsLinkIcon from "@/assets/equipmentsLinkIcon.svg";
import InstallersLinkIcon from "@/assets/installersLinkIcon.svg";
import { s } from "react-native-size-matters";

export default function MainPage() {
  return (
    <View style={styles.wrapper}>
      <Header />
      <View style={styles.content}>
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
        <View style={styles.button}>
          <Button>
            <Text>Выйти</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingTop: s(50),
    paddingLeft: s(15),
    paddingRight: s(15),
    paddingBottom: s(15),
  },
  links: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
    marginLeft: s(12),
  },
  button: {},
});
