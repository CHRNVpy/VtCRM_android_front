import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface ListProps {
  children?: ReactNode;
  isLastItem?: boolean;
}

export default function List({ children, isLastItem }: ListProps) {
  return (
    <View style={[styles.item, !!isLastItem && styles.isLastItem]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: s(24),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  isLastItem: {
    marginBottom: s(0),
  },
});
