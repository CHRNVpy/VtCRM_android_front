import { Text, StyleSheet, View, ViewProps } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

interface ButtonProps extends ViewProps {
  children?: ReactNode;
}

export default function Button({ children }: ButtonProps) {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.button}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: s(48),
    width: "100%",
    backgroundColor: "#EAEDEF",
    borderRadius: 4,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: s(18),
  },
});
