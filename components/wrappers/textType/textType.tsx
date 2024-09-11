import { View, StyleSheet, Text } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

interface TextTypeProps {
  children?: ReactNode;
  size?: "biggest" | "big" | "medium" | "small";
  align?: "right";
  marginBottom?: "small";
  color?: "gray";
  isDashed?: boolean;
  isBold?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: "tail" | "clip";
}

export default function TextType({
  children,
  size,
  align,
  marginBottom,
  color,
  isDashed,
  isBold,
  numberOfLines,
  ellipsizeMode,
}: TextTypeProps) {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <View
      style={[
        styles.textType,
        marginBottom == "small" && styles.marginBottomSmall,
      ]}
    >
      <Text
        style={[
          styles.textTypeText,
          align == "right" && styles.alignRightText,
          size == "biggest" && styles.sizeBiggest,
          size == "medium" && styles.sizeMedium,
          size == "small" && styles.sizeSmall,
          color == "gray" && styles.gray,
          isDashed && styles.isDashed,
          isBold && styles.isBold,
        ]}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textType: {
    width: "100%",
  },
  marginBottomSmall: {
    marginBottom: s(4),
  },
  textTypeText: {
    fontSize: s(20),
    lineHeight: s(24),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
    alignSelf: "flex-start",
  },
  sizeBiggest: {
    fontSize: s(30),
    lineHeight: s(36),
  },
  sizeMedium: {
    fontSize: s(18),
    lineHeight: s(22),
  },
  sizeSmall: {
    fontSize: s(16),
    lineHeight: s(20),
  },
  alignRightText: {
    textAlign: "right",
    alignSelf: "flex-end",
  },
  gray: {
    color: colors.gray,
  },
  isDashed: {
    borderBottomColor: colors.gray,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
  },
  isBold: {
    fontFamily: "Inter_500Medium",
  },
});
