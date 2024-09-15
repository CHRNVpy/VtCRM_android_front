import { View, StyleSheet, Text } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface MarginBottomProps {
  children?: ReactNode;
  size?: "biggest" | "big" | "medium" | "small" | "smallest";
}

export default function MarginBottom({ children, size }: MarginBottomProps) {
  return (
    <View
      style={[
        styles.marginBottom,
        size == "smallest" && styles.marginBottomSmallest,
        size == "small" && styles.marginBottomSmall,
        size == "biggest" && styles.marginBottomBiggest,
        size == "big" && styles.marginBottomBig,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: s(10),
  },
  marginBottomSmallest: {
    marginBottom: s(4),
  },
  marginBottomSmall: {
    marginBottom: s(6),
  },
  marginBottomBig: {
    marginBottom: s(16),
  },
  marginBottomBiggest: {
    marginBottom: s(20),
  },
});
