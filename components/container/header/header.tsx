import { StyleSheet, View, Text } from "react-native";
import LogoSvg from "@/assets/logo.svg";
import BackLinkIconSvg from "@/assets/backLinkIcon.svg";
import { useFonts, Inter_500Medium } from "@expo-google-fonts/inter";
import { s } from "react-native-size-matters";

export default function Header({ linkText }: { linkText?: string }) {
  let [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.header}>
      {linkText ? (
        <View style={styles.backLink}>
          <BackLinkIconSvg width={s(31)} height={s(26)} />
          <Text
            style={styles.backLinkText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {linkText}
          </Text>
        </View>
      ) : (
        <LogoSvg style={styles.logo} width={s(253)} height={s(31)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: s(52),
    width: "100%",
    paddingTop: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  logo: {
    height: s(31),
    width: s(253),
  },
  backLink: {
    flexDirection: "row",
    width: "100%",
  },
  backLinkText: {
    fontSize: s(18),
    lineHeight: s(26),
    height: s(26),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: s(18),
    fontFamily: "Inter_500Medium",
    overflow: "hidden",
    textAlign: "left",
    flexGrow: 1,
  },
});
