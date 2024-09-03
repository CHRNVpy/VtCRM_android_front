import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, View } from "react-native";
import LogoSvg from "@/assets/logo.svg";
import Login from "@/pages/login/login";
import { s } from "react-native-size-matters";

export default function App() {
  return (
    <View style={styles.container}>
      <LogoSvg width={s(253)} height={s(31)} />
      <Login />
      <StatusBar style="dark" backgroundColor="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: s(20),
    paddingRight: s(20),
  },
});
