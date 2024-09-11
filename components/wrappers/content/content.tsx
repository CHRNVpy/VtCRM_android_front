import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface ContentProps {
  children?: ReactNode;
  isWithPaddings?: boolean;
}

export default function Content({
  children,
  isWithPaddings = false,
}: ContentProps) {
  return (
    <View style={[styles.content, !!isWithPaddings && styles.isWithPaddings]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  isWithPaddings: {
    paddingLeft: s(15),
    paddingRight: s(15),
  },
});
