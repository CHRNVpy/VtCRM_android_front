import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import CopyIconSvg from "@/assets/copyIcon.svg";
import { s } from "react-native-size-matters";
import { maskString } from "@/helpers/strings";
import ChangePasswordIcon from "@/assets/changePasswordIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import ShareIcon from "@/assets/shareIcon.svg";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const installerData = useMemo(() => {
    return {
      id: "1",
      name: "Иванов Иван Иванович",
      phone: "+7 912 345-67-89",
      login: "iivanov",
      password: "adslfIYNGHlfIYNGH-454",
      isActive: true,
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={"Монтажники"} />
      <View style={styles.content}>
        <View style={styles.information}>
          <View style={styles.installerData}>
            <View style={styles.leftColumn}>
              <Text style={styles.name}>{installerData.name}</Text>
              <Text style={styles.phone}>{installerData.phone}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.id}>#{installerData.id}</Text>
              <View style={styles.status}>
                <View
                  style={
                    installerData.isActive ? styles.active : styles.notActive
                  }
                ></View>
              </View>
            </View>
          </View>
          <View style={styles.authData}>
            <View style={styles.loginAndPassword}>
              <View style={styles.loginAndPasswordLeftColumn}>
                <Text style={styles.login}>{installerData.login}</Text>
                <Text style={styles.password}>
                  {maskString({ string: installerData.password })}
                </Text>
              </View>
              <View style={styles.loginAndPasswordRightColumn}>
                <View style={styles.copy}>
                  <CopyIconSvg height={s(24)} width={s(21)} />
                </View>
              </View>
            </View>
            <View style={styles.showPassword}>
              <Text style={styles.showPasswordText}>Показать пароль</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button icon={<ShareIcon width={s(18)} height={s(20)} />}>
              Поделиться данными доступа
            </Button>
          </View>
          <View style={styles.button}>
            <Button
              icon={
                installerData.isActive ? (
                  <TurnOffIcon width={s(13)} height={s(22)} />
                ) : (
                  <TurnOnIcon width={s(13)} height={s(22)} />
                )
              }
            >
              {installerData.isActive ? "Выключить" : "Включить"}
            </Button>
          </View>
          <View style={styles.button}>
            <Button icon={<ChangePasswordIcon width={s(22)} height={s(20)} />}>
              Сменить пароль
            </Button>
          </View>
          <View style={[styles.button, styles.lastButton]}>
            <Button icon={<EditIcon width={s(7)} height={s(22)} />}>
              Редактировать
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingTop: s(5),
    paddingBottom: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  information: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  installerData: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {
    width: "85%",
  },
  name: {
    fontSize: s(30),
    lineHeight: s(36),
    width: "100%",
    fontFamily: "Inter_400Regular",
  },
  phone: {
    fontSize: s(24),
    height: s(30),
    lineHeight: s(30),
    maxWidth: "100%",
    marginTop: s(10),
    fontFamily: "Inter_400Regular",
  },
  rightColumn: {
    width: "15%",
    alignItems: "flex-end",
  },
  id: {
    fontSize: s(30),
    lineHeight: s(36),
    maxWidth: "100%",
    fontFamily: "Inter_400Regular",
  },
  status: {
    height: s(36),
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    height: s(14),
    width: s(14),
    backgroundColor: colors.green,
    borderRadius: s(7),
  },
  notActive: {
    height: s(14),
    width: s(14),
    backgroundColor: colors.red,
    borderRadius: s(7),
  },
  icon: {
    width: s(30),
    height: s(32),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: s(20),
    marginLeft: s(12),
  },
  authData: {
    marginTop: s(32),
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  loginAndPassword: {
    flexDirection: "row",
  },
  loginAndPasswordLeftColumn: {},
  login: {
    fontSize: s(24),
    lineHeight: s(28),
    fontFamily: "Inter_400Regular",
  },
  password: {
    fontSize: s(24),
    lineHeight: s(28),
    marginTop: s(8),
    fontFamily: "Inter_400Regular",
  },
  loginAndPasswordRightColumn: {},
  copy: {
    height: s(28),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: s(4),
  },
  showPassword: {
    marginTop: s(3),
  },
  showPasswordText: {
    fontSize: s(20),
    lineHeight: s(24),
    color: colors.gray,
    borderBottomColor: colors.gray,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
    fontFamily: "Inter_400Regular",
  },
  buttons: {},
  button: {
    marginBottom: s(14),
  },
  lastButton: {
    marginBottom: s(0),
  },
});
