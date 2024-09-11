import { FlatList, StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
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

  const poolsList = useMemo(() => {
    return [
      {
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
      },
      {
        id: 2,
        applicationsCount: 2,
        applications: [
          {
            id: 4,
            client: {
              name: "Сидоров А.П.",
            },
            type: "connection",
            datetime: "2024-08-19T09:15:00Z",
          },
          {
            id: 5,
            client: {
              name: "Кузнецова С.В.",
            },
            type: "repair",
            datetime: "2024-08-20T13:30:00Z",
          },
        ],
      },
      {
        id: 3,
        applicationsCount: 1,
        applications: [
          {
            id: 6,
            client: {
              name: "Никитин Д.А.",
            },
            type: "lineInstallation",
            datetime: "2024-08-21T16:00:00Z",
          },
        ],
      },
      {
        id: 4,
        applicationsCount: 3,
        applications: [
          {
            id: 7,
            client: {
              name: "Морозова О.С.",
            },
            type: "connection",
            datetime: "2024-08-22T08:00:00Z",
          },
          {
            id: 8,
            client: {
              name: "Лебедев В.Г.",
            },
            type: "repair",
            datetime: "2024-08-23T11:30:00Z",
          },
          {
            id: 9,
            client: {
              name: "Федоров К.М.",
            },
            type: "lineInstallation",
            datetime: "2024-08-24T15:00:00Z",
          },
        ],
      },
      {
        id: 5,
        applicationsCount: 2,
        applications: [
          {
            id: 10,
            client: {
              name: "Алексеева И.И.",
            },
            type: "repair",
            datetime: "2024-08-25T14:30:00Z",
          },
          {
            id: 11,
            client: {
              name: "Ковалев А.А.",
            },
            type: "connection",
            datetime: "2024-08-26T10:15:00Z",
          },
        ],
      },
      {
        id: 6,
        applicationsCount: 1,
        applications: [
          {
            id: 12,
            client: {
              name: "Емельянов С.П.",
            },
            type: "lineInstallation",
            datetime: "2024-08-27T17:45:00Z",
          },
        ],
      },
    ];
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={"На главную"} />
      <View style={styles.content}>
        <View style={styles.pools}>
          <Text style={styles.title}>Пулы заявок</Text>
          {!!poolsList.length && (
            <View style={styles.poolsListWrapper}>
              <FlatList
                data={poolsList}
                contentContainerStyle={styles.poolsList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => {
                  const isLastItem = index === poolsList.length - 1;

                  return (
                    <View
                      style={[styles.poolItem, isLastItem && styles.isLastItem]}
                    >
                      <View style={styles.poolInformation}>
                        <Text style={styles.poolId}>Пул #{item.id}</Text>
                        <Text style={styles.poolCount}>
                          {item.applicationsCount}{" "}
                          {ruApplicationsByCount({
                            count: item.applicationsCount,
                          })}
                        </Text>
                      </View>
                      <View style={styles.applicationsList}>
                        {item.applications.map(
                          (applicationItem, applicationIndex) => {
                            const isLastApplicationItem =
                              applicationIndex === item.applications.length - 1;

                            return (
                              <View
                                style={[
                                  styles.applicationItem,
                                  !!isLastApplicationItem &&
                                    styles.applicationIsLastItem,
                                ]}
                                key={applicationItem.id}
                              >
                                <View style={styles.applicationItemLeftColumn}>
                                  <Text style={styles.applicationClientName}>
                                    {applicationItem.client.name}
                                  </Text>
                                  <Text style={styles.applicationType}>
                                    {applicationItem.type == "connection"
                                      ? "Подключение"
                                      : applicationItem.type == "repair"
                                      ? "Ремонт"
                                      : "Монтаж ВОЛС"}
                                  </Text>
                                </View>
                                <View style={styles.applicationItemRightColumn}>
                                  <Text style={styles.applicationId}>
                                    #{applicationItem.id}
                                  </Text>
                                  <Text style={styles.applicationDate}>
                                    {formatDateString({
                                      dateString: applicationItem.datetime,
                                    })}
                                  </Text>
                                </View>
                              </View>
                            );
                          }
                        )}
                      </View>
                      <View style={styles.itemButtons}>
                        <Button
                          icon={<AddIcon width={s(13)} height={s(14)} />}
                          style={styles.itemButton}
                          size={"small"}
                        >
                          Добавить заявку
                        </Button>
                        <Button
                          icon={<StartIcon width={s(13)} height={s(13)} />}
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
        <View style={styles.button}>
          <Button icon={<AddIcon width={s(16)} height={s(16)} />}>
            Добавить пул
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
  pools: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  poolsListWrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  poolsList: {
    width: "100%",
  },
  poolItem: {
    marginBottom: s(24),
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  isLastItem: {
    marginBottom: s(0),
  },
  poolInformation: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  poolId: {
    fontSize: s(22),
    lineHeight: s(26),
    fontFamily: "Inter_500Medium",
    color: colors.dark,
    borderBottomColor: colors.dark,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
  },
  poolCount: {
    fontSize: s(22),
    lineHeight: s(26),
    fontFamily: "Inter_500Medium",
    color: colors.dark,
  },
  applicationsList: {
    marginTop: s(20),
  },
  applicationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: s(14),
  },
  applicationIsLastItem: {
    marginBottom: s(0),
  },
  applicationItemLeftColumn: {},
  applicationItemRightColumn: {},
  applicationClientName: {
    fontFamily: "Inter_400Regular",
    fontSize: s(22),
    lineHeight: s(26),
  },
  applicationType: {
    fontFamily: "Inter_400Regular",
    fontSize: s(18),
    lineHeight: s(22),
    marginTop: s(4),
  },
  applicationId: {
    fontFamily: "Inter_400Regular",
    fontSize: s(22),
    lineHeight: s(26),
    textAlign: "right",
  },
  applicationDate: {
    fontFamily: "Inter_400Regular",
    fontSize: s(18),
    lineHeight: s(22),
    marginTop: s(4),
    textAlign: "right",
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
  button: {
    paddingTop: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
    height: s(78),
  },
});
