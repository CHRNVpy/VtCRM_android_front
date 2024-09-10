import { FlatList, StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import ChangePasswordIcon from "@/assets/changePasswordIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import ShareIcon from "@/assets/shareIcon.svg";
import { s } from "react-native-size-matters";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const installersList = useMemo(() => {
    return [
      {
        id: "1",
        name: "Иванов Иван Иванович",
        phone: "+7 912 345-67-89",
        isActive: true,
      },
      {
        id: "2",
        name: "Петрова Мария Николаевна",
        phone: "+7 923 456-78-90",
        isActive: false,
      },
      {
        id: "3",
        name: "Сидоров Алексей Петрович",
        phone: "+7 934 567-89-01",
        isActive: false,
      },
      {
        id: "4",
        name: "Кузнецова Светлана Васильевна",
        phone: "+7 945 678-90-12",
        isActive: true,
      },
      {
        id: "5",
        name: "Никитин Дмитрий Александрович",
        phone: "+7 956 789-01-23",
        isActive: false,
      },
      {
        id: "6",
        name: "Морозова Ольга Сергеевна",
        phone: "+7 967 890-12-34",
        isActive: true,
      },
      {
        id: "7",
        name: "Кириллов Андрей Валерьевич",
        phone: "+7 978 901-23-45",
        isActive: true,
      },
      {
        id: "8",
        name: "Григорьева Наталья Дмитриевна",
        phone: "+7 989 012-34-56",
        isActive: false,
      },
      {
        id: "9",
        name: "Лебедев Игорь Юрьевич",
        phone: "+7 990 123-45-67",
        isActive: true,
      },
      {
        id: "10",
        name: "Белоусов Сергей Петрович",
        phone: "+7 991 234-56-78",
        isActive: true,
      },
      {
        id: "11",
        name: "Смирнова Екатерина Олеговна",
        phone: "+7 992 345-67-89",
        isActive: false,
      },
    ];
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={"На главную"} />
      <View style={styles.content}>
        <View style={styles.installers}>
          <Text style={styles.title}>Монтажники</Text>
          {!!installersList.length && (
            <View style={styles.installersListWrapper}>
              <FlatList
                data={installersList}
                contentContainerStyle={styles.installersList}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  const isLastItem = index === installersList.length - 1;

                  return (
                    <View
                      style={[
                        styles.installerItem,
                        isLastItem && styles.isLastItem,
                      ]}
                    >
                      <View style={styles.itemContent}>
                        <View style={styles.leftColumn}>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.phone}>{item.phone}</Text>
                        </View>
                        <View style={styles.rightColumn}>
                          <Text style={styles.id}>#{item.id}</Text>
                          <View style={styles.status}>
                            <View
                              style={
                                item.isActive ? styles.active : styles.notActive
                              }
                            ></View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.itemButtons}>
                        <View style={styles.itemButtonsLeftColumn}>
                          <Button
                            icon={
                              <ChangePasswordIcon
                                width={s(13)}
                                height={s(12)}
                              />
                            }
                            style={styles.itemButton}
                            size={"small"}
                          >
                            Сменить пароль
                          </Button>
                          <Button
                            icon={<EditIcon width={s(5)} height={s(16)} />}
                            style={[styles.itemButton, styles.itemButtonLast]}
                            size={"small"}
                          >
                            Редактировать
                          </Button>
                        </View>
                        <View style={styles.itemButtonsRightColumn}>
                          <Button
                            icon={
                              item.isActive ? (
                                <TurnOffIcon width={s(9)} height={s(17)} />
                              ) : (
                                <TurnOnIcon width={s(9)} height={s(17)} />
                              )
                            }
                            style={styles.itemButton}
                            size={"small"}
                          >
                            {item.isActive ? "Выключить" : "Включить"}
                          </Button>
                          <Button
                            icon={<ShareIcon width={s(13)} height={s(14)} />}
                            style={[styles.itemButton, styles.itemButtonLast]}
                            size={"small"}
                          >
                            Поделиться
                          </Button>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
        <View style={styles.button}>
          <Button>Добавить монтажника</Button>
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
  },
  installers: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  installersListWrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  installersList: {
    width: "100%",
  },
  title: {
    fontSize: s(30),
    lineHeight: s(36),
    width: "100%",
    paddingLeft: s(15),
    paddingRight: s(15),
    marginBottom: s(10),
    fontFamily: "Inter_400Regular",
  },
  installerItem: {
    marginBottom: s(24),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  isLastItem: {
    marginBottom: s(0),
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {
    width: "85%",
  },
  name: {
    fontSize: s(20),
    maxWidth: "100%",
    fontFamily: "Inter_400Regular",
  },
  phone: {
    fontSize: s(18),
    height: s(22),
    lineHeight: s(22),
    maxWidth: "100%",
    marginTop: s(2),
    fontFamily: "Inter_400Regular",
  },
  rightColumn: {
    width: "15%",
    alignItems: "flex-end",
  },
  id: {
    fontSize: s(20),
    maxWidth: "100%",
    fontFamily: "Inter_400Regular",
  },
  status: {
    height: s(22),
    alignItems: "center",
    justifyContent: "center",
    marginTop: s(2),
  },
  active: {
    height: s(8),
    width: s(8),
    backgroundColor: colors.green,
    borderRadius: s(4),
  },
  notActive: {
    height: s(8),
    width: s(8),
    backgroundColor: colors.red,
    borderRadius: s(4),
  },
  itemButtons: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: s(16),
  },
  itemButtonsLeftColumn: {
    flex: 1,
    marginRight: s(5),
  },
  itemButtonsRightColumn: {
    flex: 1,
    marginLeft: s(5),
  },
  itemButton: {
    marginBottom: s(8),
  },
  itemButtonLast: {
    marginBottom: s(0),
  },
  button: {
    paddingTop: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
    height: s(78),
  },
});
