import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import LogoSvg from "@/assets/logo.svg";
import Login from "@/pages/login/login";
import { dp } from "@/helpers/pixelRatio";

export default function App() {
  return (
    <View style={styles.container}>
      <LogoSvg width={dp(197)} height={dp(24)} />
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
    paddingLeft: dp(15),
    paddingRight: dp(15),
  },
});
