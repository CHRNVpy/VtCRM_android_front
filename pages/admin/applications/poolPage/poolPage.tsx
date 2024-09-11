import { FlatList, StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import SettingsIcon from "@/assets/settingsIcon.svg";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString, ruApplicationsByCount } from "@/helpers/strings";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  const poolItem = useMemo(() => {
    return {
      id: 1,
      applicationsCount: 3,
      applications: [
        {
          id: 1,
          client: {
            name: "Арефьев Т.С.",
          },
          type: "connection",
          datetime: "2024-08-16T16:30:00Z",
        },
        {
          id: 2,
          client: {
            name: "Иванов И.И.",
          },
          type: "repair",
          datetime: "2024-08-17T10:00:00Z",
        },
        {
          id: 3,
          client: {
            name: "Петрова М.Н.",
          },
          type: "lineInstallation",
          datetime: "2024-08-18T14:45:00Z",
        },
      ],
      installer: {
        id: "1",
        lastName: "Иванов",
        firstName: "Иван",
        patronym: "Иванович",
        phone: "+7 912 345-67-89",
        login: "iivanov",
        password: "adslfIYNGHlfIYNGH-454",
        isActive: true,
      },
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={"Пулы заявок"} />
      <View style={styles.content}>
        <View style={styles.pools}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Пул #{poolItem.id}</Text>
            <View style={styles.settings}>
              <SettingsIcon height={s(24)} width={s(24)} />
            </View>
          </View>
          <View style={styles.filters}>
            <View style={styles.filter}>
              <Input label="Поиск по заявкам" isHasClearButton={true}></Input>
            </View>
          </View>
          {!!poolItem.applications.length && (
            <View style={styles.applicationsListWrapper}>
              <FlatList
                data={poolItem.applications}
                contentContainerStyle={styles.applicationsList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => {
                  const isLastItem = index === poolItem.applications.length - 1;

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.applicationItem,
                        isLastItem && styles.isLastItem,
                      ]}
                    >
                      <View style={[styles.applicationInformation]}>
                        <View style={[styles.applicationClientNameAndId]}>
                          <Text style={styles.applicationClientName}>
                            {item.client.name}
                          </Text>
                          <Text style={styles.applicationId}>#{item.id}</Text>
                        </View>
                      </View>
                      {!!poolItem?.installer && (
                        <View style={[styles.installer]}>
                          <Text style={styles.installerText}>
                            Монтажник #{poolItem.installer.id}{" "}
                            {poolItem.installer.lastName}{" "}
                            {poolItem.installer.firstName.charAt(0)}.
                            {poolItem.installer.patronym.charAt(0)}.
                          </Text>
                        </View>
                      )}
                      <View style={styles.itemButtons}>
                        <Button
                          icon={<EditIcon width={s(5)} height={s(16)} />}
                          style={styles.itemButton}
                          size={"small"}
                        >
                          Добавить заявку
                        </Button>
                        <Button
                          icon={<EditIcon width={s(5)} height={s(16)} />}
                          style={[styles.itemButton, styles.isLastItemButton]}
                          size={"small"}
                        >
                          Отправить в работу
                        </Button>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button icon={<StartIcon width={s(15)} height={s(16)} />}>
              Отправить в работу
            </Button>
          </View>
          <View style={[styles.button, styles.lastButton]}>
            <Button icon={<AddIcon width={s(16)} height={s(16)} />}>
              Добавить заявку
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
  },
  titleBlock: {
    flexDirection: "row",
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  title: {
    fontSize: s(30),
    lineHeight: s(36),
    width: "85%",
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
  settings: {
    width: "15%",
    height: s(36),
    alignItems: "flex-end",
    justifyContent: "center",
  },
  filters: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingLeft: s(15),
    paddingRight: s(15),
    marginBottom: s(10),
  },
  filter: {
    width: "100%",
  },
  pools: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  applicationsListWrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  applicationsList: {
    width: "100%",
  },
  applicationItem: {
    marginBottom: s(24),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  isLastItem: {
    marginBottom: s(0),
  },
  applicationInformation: {},
  applicationClientNameAndId: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  applicationClientName: {
    fontSize: s(22),
    lineHeight: s(26),
    fontFamily: "Inter_500Medium",
    color: colors.dark,
  },
  applicationId: {
    fontSize: s(22),
    lineHeight: s(26),
    fontFamily: "Inter_500Medium",
    color: colors.dark,
  },
  installer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  installerText: {
    fontSize: s(18),
    lineHeight: s(22),
    marginTop: s(4),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
    borderBottomColor: colors.dark,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
  },
  itemButtons: {
    marginTop: s(16),
  },
  itemButton: {
    marginBottom: s(8),
  },
  isLastItemButton: {
    marginBottom: s(0),
  },
  buttons: {
    paddingTop: s(15),
    paddingBottom: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  button: {
    marginBottom: s(14),
  },
  lastButton: {
    marginBottom: s(0),
  },
});
