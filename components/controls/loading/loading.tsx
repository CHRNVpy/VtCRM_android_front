import { StyleSheet, View, ViewProps, ActivityIndicator } from "react-native";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";

interface Props extends ViewProps {
  isInProcess?: boolean;
}

export default function Component({ isInProcess = false }: Props) {
  if (!isInProcess) return null;

  return (
    <View style={[styles.loading]}>
      <ActivityIndicator size={s(26)} color={colors.dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    justifyContent: "center",
    height: s(48),
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 4,
    flexDirection: "row",
  },
});
