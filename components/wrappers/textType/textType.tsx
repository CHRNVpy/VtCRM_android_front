import { View, StyleSheet, Text } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";

interface TextTypeProps {
  children?: ReactNode;
  size?: "biggest" | "big" | "medium" | "small";
  align?: "right";
  marginBottom?: "small";
  color?: "gray" | "red";
  isDashed?: boolean;
  isBold?: boolean;
  numberOfLines?: number;
  minNumberOfLines?: number;
  ellipsizeMode?: "tail" | "clip";
}

export default function Component({
  children,
  size = "big",
  align,
  marginBottom,
  color,
  isDashed,
  isBold,
  numberOfLines,
  minNumberOfLines,
  ellipsizeMode,
}: TextTypeProps) {
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
          size == "big" &&
            minNumberOfLines == 2 &&
            styles.big_minNumberOfLines2,
          size == "biggest" && styles.sizeBiggest,
          size == "biggest" &&
            minNumberOfLines == 2 &&
            styles.biggest_minNumberOfLines2,
          size == "medium" && styles.sizeMedium,
          size == "medium" &&
            minNumberOfLines == 2 &&
            styles.medium_minNumberOfLines2,
          size == "small" && styles.sizeSmall,
          size == "small" &&
            minNumberOfLines == 2 &&
            styles.small_minNumberOfLines2,
          color == "gray" && styles.gray,
          color == "red" && styles.red,
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
  big_minNumberOfLines2: {
    minHeight: 2 * s(24),
  },
  sizeBiggest: {
    fontSize: s(30),
    lineHeight: s(36),
  },
  biggest_minNumberOfLines2: {
    minHeight: 2 * s(36),
  },
  sizeMedium: {
    fontSize: s(18),
    lineHeight: s(22),
  },
  medium_minNumberOfLines2: {
    minHeight: 2 * s(22),
  },
  sizeSmall: {
    fontSize: s(16),
    lineHeight: s(20),
  },
  small_minNumberOfLines2: {
    minHeight: 2 * s(20),
  },
  alignRightText: {
    textAlign: "right",
    alignSelf: "flex-end",
  },
  gray: {
    color: colors.gray,
  },
  red: {
    color: colors.red,
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
