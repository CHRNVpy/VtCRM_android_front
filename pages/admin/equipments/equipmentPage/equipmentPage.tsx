import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import { s } from "react-native-size-matters";
import EditIcon from "@/assets/editIcon.svg";
import ShareIcon from "@/assets/shareIcon.svg";
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
      <Header linkText={"Оборудование"} />
      <View style={styles.content}>
        <View style={styles.information}>
          <View style={styles.equipmentData}>
            <View style={styles.leftColumn}>
              <Text style={styles.name}>{equipmentData.name}</Text>
              <Text style={styles.serialNumber}>
                {equipmentData.serialNumber}
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.id}>#{equipmentData.id}</Text>
              <View style={styles.status}>
                <View
                  style={
                    equipmentData.isActive ? styles.active : styles.notActive
                  }
                ></View>
              </View>
            </View>
          </View>
          <View style={styles.note}>
            <Text style={styles.noteText}>{equipmentData.note}</Text>
          </View>
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
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button icon={<ShareIcon width={s(18)} height={s(20)} />}>
              Поделиться
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
  equipmentData: {
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
    color: colors.dark,
  },
  serialNumber: {
    fontSize: s(24),
    height: s(30),
    lineHeight: s(30),
    maxWidth: "100%",
    marginTop: s(10),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
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
    color: colors.dark,
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
    lineHeight: s(24),
    marginLeft: s(12),
  },
  note: {
    marginTop: s(20),
  },
  noteText: {
    fontSize: s(16),
    lineHeight: s(20),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
  application: {
    marginTop: s(20),
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
  buttons: {},
  button: {
    marginBottom: s(14),
  },
  lastButton: {
    marginBottom: s(0),
  },
});
