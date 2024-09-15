import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Input from "@/components/controls/input/input";
import Button from "@/components/controls/button/button";
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
      <Header linkText={`#${equipmentData.id} ${equipmentData.name}`} />
      <View style={styles.content}>
        <View style={styles.dataWrapper}>
          <Text style={styles.title}>Редактирование оборудования</Text>
          <View style={styles.application}>
            {!!equipmentData?.application?.id ? (
              <>
                <View style={styles.applicationLeftColumn}>
                  <Text style={styles.applicationStatus}>У монтажника</Text>
                </View>
                <View style={styles.applicationRightColumn}>
                  <Text
                    style={styles.applicationInstaller}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    #{equipmentData.application.installer.id}{" "}
                    {equipmentData.application.installer.lastName}{" "}
                    {equipmentData.application.installer.firstName.charAt(0)}.{" "}
                    {equipmentData.application.installer.patronym.charAt(0)}.
                  </Text>
                  <Text style={styles.applicationData}>
                    Заявка #{equipmentData.application.id}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.applicationStatus}>На складе</Text>
            )}
          </View>
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
            Сохранить
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
  application: {
    marginTop: s(16),
    flexDirection: "row",
  },
  applicationLeftColumn: {
    width: "50%",
  },
  applicationRightColumn: {
    width: "50%",
    alignItems: "flex-end",
  },
  applicationStatus: {
    fontSize: s(20),
    lineHeight: s(24),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
  applicationInstaller: {
    fontSize: s(20),
    lineHeight: s(24),
    textAlign: "right",
    borderBottomColor: colors.dark,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
  applicationData: {
    fontSize: s(20),
    lineHeight: s(24),
    marginTop: s(4),
    borderBottomColor: colors.dark,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
  inputs: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: s(16),
  },
  input: {
    width: "100%",
  },
  button: {
    marginBottom: s(14),
  },
});
