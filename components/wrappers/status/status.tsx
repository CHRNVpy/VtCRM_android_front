import { View, StyleSheet } from "react-native";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";

interface StatusProps {
  isActive?: boolean;
  size?: "big";
}

export default function Status({ isActive, size }: StatusProps) {
  return (
    <View style={[styles.status, size == "big" && styles.statusBig]}>
      <View
        style={[
          styles.statusInnerBlock,
          size == "big" && styles.statusInnerBlockBig,
          !!isActive && styles.isActive,
        ]}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    height: s(22),
    alignItems: "center",
    justifyContent: "center",
  },
  statusBig: {
    height: s(36),
  },
  statusInnerBlock: {
    height: s(8),
    width: s(8),
    borderRadius: s(4),
    backgroundColor: colors.red,
  },
  statusInnerBlockBig: {
    height: s(14),
    width: s(14),
    borderRadius: s(7),
  },
  isActive: {
    backgroundColor: colors.green,
  },
});
