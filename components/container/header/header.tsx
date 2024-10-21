import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import LogoSvg from "@/assets/logo.svg";
import BackLinkIconSvg from "@/assets/backLinkIcon.svg";
import { RootStackParamList } from "@/NavigationContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPage } from "@/store/navigation/state/state";
import colors from "@/helpers/colors";
import { s } from "react-native-size-matters";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

interface ContentProps {
  linkText?: string;
  to?: keyof RootStackParamList;
  toParams?: { [key: string]: any };
  isSyncInProcess?: boolean;
}

export default function Header({
  linkText,
  to,
  toParams,
  isSyncInProcess,
}: ContentProps) {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const handleOnPress = useCallback(() => {
    if (!to) return;

    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : to,
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : toParams,
      })
    );
  }, [dispatch, to, toParams, pageParamsWhenFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type !== "GO_BACK") return;

      e.preventDefault();

      dispatch(
        setPage({
          action: "setData",
          data: pageParamsWhenFocused?.backLink?.to
            ? pageParamsWhenFocused?.backLink?.to
            : to,
          params: pageParamsWhenFocused?.backLink?.to
            ? pageParamsWhenFocused?.backLink?.params
            : toParams,
        })
      );
    });

    return unsubscribe;
  }, [dispatch, navigation, to, toParams, pageParamsWhenFocused]);

  return (
    <Pressable onPress={handleOnPress}>
      <View style={[styles.header, !!linkText && styles.isWithLink]}>
        <View style={styles.content}>
          {linkText || pageParamsWhenFocused?.backLink?.text ? (
            <View style={styles.backLink}>
              <BackLinkIconSvg width={s(31)} height={s(26)} />
              <Text
                style={styles.backLinkText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {pageParamsWhenFocused?.backLink?.text
                  ? pageParamsWhenFocused?.backLink?.text
                  : linkText}
              </Text>
            </View>
          ) : (
            <LogoSvg style={styles.logo} width={s(253)} height={s(31)} />
          )}
          <View style={styles.sync}>
            {!!isSyncInProcess && (
              <ActivityIndicator size={s(20)} color={colors.dark} />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    height: s(52),
    width: "100%",
    paddingTop: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
    marginBottom: s(15),
  },
  isWithLink: {
    marginBottom: s(0),
  },
  content: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    height: s(31),
    width: s(253),
  },
  backLink: {
    flexDirection: "row",
    width: Dimensions.get("window").width - s(15 + 15 + 26),
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
  sync: {
    width: s(26),
    height: s(26),
    alignItems: "center",
    justifyContent: "center",
  },
});
