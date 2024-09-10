import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const installerData = useMemo(() => {
    return {
      id: "1",
      name: "Иванов Иван Иванович",
      lastName: "Иванов",
      firstName: "Иван",
      patronym: "Иванович",
      phone: "+7 912 345-67-89",
      login: "iivanov",
      password: "adslfIYNGHlfIYNGH-454",
      isActive: true,
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={`Монтажники`} />
      <View style={styles.content}>
        <View style={styles.dataWrapper}>
          <Text style={styles.title}>Добавление монтажника</Text>
          <View style={styles.inputs}>
            <View style={styles.input}>
              <Input label="Фамилия" value={installerData.lastName}></Input>
            </View>
            <View style={styles.input}>
              <Input label="Имя" value={installerData.firstName}></Input>
            </View>
            <View style={styles.input}>
              <Input label="Отчество" value={installerData.patronym}></Input>
            </View>
            <View style={styles.input}>
              <Input
                label="Логин"
                value={installerData.login}
                isDisabled={true}
              ></Input>
            </View>
            <View style={styles.input}>
              <Input label="Телефон" value={installerData.phone}></Input>
            </View>
            <View style={styles.input}>
              <Input
                label="Новый пароль"
                value={installerData.password}
                type="newPassword"
              ></Input>
            </View>
          </View>
        </View>
        <View style={[styles.button]}>
          <Button icon={<SaveIcon width={s(20)} height={s(20)} />}>
            Добавить
          </Button>
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
  dataWrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: s(30),
    lineHeight: s(36),
    width: "100%",
    marginBottom: s(10),
    fontFamily: "Inter_400Regular",
  },
  inputs: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  input: {
    width: "100%",
  },
  button: {
    marginBottom: s(14),
  },
});
