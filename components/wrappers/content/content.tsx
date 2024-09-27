import { ScrollView, View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface ContentProps {
  children?: ReactNode;
  isWithPaddings?: boolean;
  isWithScrollView?: boolean;
}

export default function Component({
  children,
  isWithPaddings = false,
  isWithScrollView = false,
}: ContentProps) {
  const Tag = isWithScrollView ? ScrollView : View;

  return (
    <Tag
      keyboardShouldPersistTaps="always"
      style={[styles.content, !!isWithPaddings && styles.isWithPaddings]}
    >
      {children}
    </Tag>
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
