import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import colors from "@/helpers/colors";

interface WrapperProps {
  children?: ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  return <View style={styles.wrapper}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
