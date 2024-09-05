import { StyleSheet, View } from "react-native";
import LogoSvg from "@/assets/logo.svg";
import { s } from "react-native-size-matters";

export default function Header() {
  return (
    <View style={styles.header}>
      <LogoSvg style={styles.logo} width={s(253)} height={s(31)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: s(52),
    width: "100%",
    paddingTop: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  logo: {
    height: s(31),
    width: s(253),
  },
});