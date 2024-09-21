import { StyleSheet, View, Text, Pressable } from "react-native";
import { ReactNode, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";
import { RootStackParamList } from "@/NavigationContext";
import { setPage } from "@/store/navigation/state/state";

interface ContentProps {
  children?: ReactNode;
  icon?: ReactNode;
  to?: keyof RootStackParamList;
}

export default function Component({ children, icon, to }: ContentProps) {
  const dispatch: AppDispatch = useDispatch();

  const handleOnPress = useCallback(() => {
    if (!to) return;

    dispatch(setPage({ action: "setData", data: to }));
  }, [to]);

  return (
    <Pressable onPress={handleOnPress}>
      <View style={styles.link}>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.text}>{children}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingBottom: s(14),
    paddingTop: s(14),
  },
  icon: {
    width: s(30),
    height: s(32),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: s(20),
    lineHeight: s(24),
    marginLeft: s(12),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
});
