import {
  Text,
  StyleSheet,
  View,
  ViewProps,
  ActivityIndicator,
} from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
import colors from "@/helpers/colors";

interface ButtonProps extends ViewProps {
  children?: ReactNode;
  isInProcess?: boolean;
  isDisabled?: boolean;
  size?: "small";
}

export default function Button({
  children,
  isInProcess = false,
  isDisabled = false,
  size,
  style,
}: ButtonProps) {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <View
      style={[
        styles.button,
        !!isDisabled && styles.isDisabled,
        size == "small" && styles.buttonSmall,
        style,
      ]}
    >
      <Text style={[styles.text, size == "small" && styles.smallText]}>
        {isInProcess ? (
          <ActivityIndicator
            size={size == "small" ? 12 : 26}
            color={colors.dark}
          />
        ) : (
          children
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: s(48),
    width: "100%",
    backgroundColor: colors.button,
    borderRadius: 4,
  },
  buttonSmall: {
    height: s(26),
  },
  isDisabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: s(18),
    color: colors.dark,
  },
  smallText: {
    fontSize: s(14),
  },
});
