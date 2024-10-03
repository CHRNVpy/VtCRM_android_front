import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";
import SettingsIcon from "@/assets/settingsIcon.svg";
import colors from "@/helpers/colors";

interface TitleProps {
  children?: ReactNode;
  isNoPadding?: boolean;
  isWithSettings?: boolean;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: () => Promise<void>;
  isNoMargin?: boolean;
}

export default function Component({
  children,
  isNoPadding,
  isWithSettings,
  isSettingsOpen,
  setIsSettingsOpen,
  isNoMargin,
}: TitleProps) {
  return isWithSettings ? (
    <View
      style={[
        styles.titleBlock,
        !!isNoPadding && styles.isNoPadding,
        !!isNoMargin && styles.isNoMargin,
      ]}
    >
      <View style={[styles.title, styles.isWithSettings]}>
        <Text style={styles.titleText}>{children}</Text>
      </View>
      <View style={styles.settings}>
        <TouchableOpacity onPress={setIsSettingsOpen}>
          <SettingsIcon
            height={s(24)}
            width={s(24)}
            style={
              isSettingsOpen ? styles.settingsIconOpen : styles.settingsIcon
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={[
        styles.title,
        !!isNoPadding && styles.isNoPadding,
        !!isNoMargin && styles.isNoMargin,
      ]}
    >
      <Text style={styles.titleText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    flexDirection: "row",
    paddingLeft: s(15),
    paddingRight: s(15),
    marginBottom: s(10),
  },
  isNoMargin: {
    marginBottom: s(0),
  },
  title: {
    width: "100%",
    paddingLeft: s(15),
    paddingRight: s(15),
    marginBottom: s(10),
  },
  isWithSettings: {
    width: "85%",
    paddingLeft: s(0),
    paddingRight: s(0),
    marginBottom: s(0),
  },
  settings: {
    width: "15%",
    height: s(36),
    alignItems: "flex-end",
    justifyContent: "center",
  },
  settingsIcon: {
    color: colors.dark,
  },
  settingsIconOpen: {
    color: colors.gray,
  },
  isNoPadding: {
    paddingLeft: s(0),
    paddingRight: s(0),
  },
  titleText: {
    fontSize: s(30),
    lineHeight: s(36),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
});
