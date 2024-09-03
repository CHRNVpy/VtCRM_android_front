import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { Dimensions } from "react-native";
import Input from "@/components/input/input";
import LogoSvg from "@/assets/logo.svg";

export default function Login() {
  console.log(Dimensions.get("window").width);
  console.log(Dimensions.get("window").height);

  return (
    <Input label="Логин">
      <Text />
    </Input>
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
