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

  const equipmentData = useMemo(() => {
    return {
      id: "1",
      name: "Fluke Networks DTX-1800",
      serialNumber: "DTX2-342462",
      note: "Не предназначено для работы с бетоном или каменными материалами",
      isActive: true,
      application: {
        id: "1",
        installer: {
          id: "1",
          lastName: "Иванов",
          firstName: "Иван",
          patronym: "Иванович",
        },
        status: "done",
      },
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={`Оборудование`} />
      <View style={styles.content}>
        <View style={styles.dataWrapper}>
          <Text style={styles.title}>Добавление оборудования</Text>
          <View style={styles.inputs}>
            <View style={styles.input}>
              <Input label="Название" value={equipmentData.name}></Input>
            </View>
            <View style={styles.input}>
              <Input
                label="Серийный номер"
                value={equipmentData.serialNumber}
              ></Input>
            </View>
            <View style={styles.input}>
              <Input label="Примечание" value={equipmentData.note}></Input>
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
    color: colors.dark,
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
