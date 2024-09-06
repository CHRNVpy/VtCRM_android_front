import { useRef } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Input from "@/components/input/input";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import { RootState, AppDispatch } from "@/store/store";
import { setLogin, setPassword } from "@/store/auth";
import colors from "@/helpers/colors";
import { s } from "react-native-size-matters";

export default function MainPage() {
  return (
    <View style={styles.wrapper}>
      <Text>Test</Text>
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
    paddingLeft: s(15),
    paddingRight: s(15),
    paddingBottom: s(15),
  },
  inputs: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
  },
  lastChild: {
    marginBottom: 0,
  },
  button: {},
});
