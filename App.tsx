import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import LogoSvg from "@/assets/logo.svg";

export default function App() {
  return (
    <View style={styles.container}>
      <LogoSvg width={100} height={100} />
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
  },
});
