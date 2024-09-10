import { FlatList, StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import SettingsIcon from "@/assets/settingsIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import { s } from "react-native-size-matters";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const equipmentsList = useMemo(() => {
    return [
      {
        id: "1",
        name: "Fluke Networks DTX-1800",
        serialNumber: "DTX2-342462",
        note: "Не предназначено для работы с бетоном или каменными материалами",
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
      },
      {
        id: "2",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
        application: {
          id: "2",
          installer: {
            id: "2",
            lastName: "Петрова",
            firstName: "Мария",
            patronym: "Николаевна",
          },
          status: "inProcess",
        },
      },
      {
        id: "3",
        name: "FLIR E8 Infrared Camera",
        serialNumber: "E8-983452",
        note: "Хранить в сухом месте, избегать ударов",
        application: {
          id: "3",
          installer: {
            id: "3",
            lastName: "Сидоров",
            firstName: "Алексей",
            patronym: "Петрович",
          },
          status: "inProcess",
        },
      },
      {
        id: "4",
        name: "Extech EX330 Multimeter",
        serialNumber: "EX33-745230",
        note: "Использовать только для измерения переменного тока",
        application: {
          id: "4",
          installer: {
            id: "4",
            lastName: "Кузнецова",
            firstName: "Светлана",
            patronym: "Васильевна",
          },
          status: "done",
        },
      },
      {
        id: "5",
        name: "Bosch GLM 50 C Laser Measure",
        serialNumber: "GLM5-672901",
        note: "Не допускать попадания воды внутрь устройства",
        application: {
          id: "5",
          installer: {
            id: "5",
            lastName: "Никитин",
            firstName: "Дмитрий",
            patronym: "Александрович",
          },
          status: "inProcess",
        },
      },
      {
        id: "6",
        name: "Klein Tools CL800 Clamp Meter",
        serialNumber: "CL80-293874",
        note: "Не использовать при температуре ниже -10°C",
        application: {
          id: "6",
          installer: {
            id: "6",
            lastName: "Морозова",
            firstName: "Ольга",
            patronym: "Сергеевна",
          },
          status: "inProcess",
        },
      },
      {
        id: "7",
        name: "Greenlee GT-65 Electrical Tester",
        serialNumber: "GT65-445688",
        note: "Проверять батареи перед каждым использованием",
        application: {
          id: "7",
          installer: {
            id: "7",
            lastName: "Кириллов",
            firstName: "Александр",
            patronym: "Иванович",
          },
          status: "inProcess",
        },
      },
      {
        id: "8",
        name: "Amprobe AT-6020 Advanced Wire Tracer",
        serialNumber: "AT60-198732",
        note: "Для использования в промышленных условиях",
        application: {
          id: "8",
          installer: {
            id: "8",
            lastName: "Романов",
            firstName: "Павел",
            patronym: "Андреевич",
          },
          status: "inProcess",
        },
      },
      {
        id: "9",
        name: "DeWalt DW088K Laser Level",
        serialNumber: "DW08-102938",
        note: "Не подвергать воздействию прямых солнечных лучей",
        application: {
          id: "9",
          installer: {
            id: "9",
            lastName: "Воробьева",
            firstName: "Елена",
            patronym: "Федоровна",
          },
          status: "inProcess",
        },
      },
      {
        id: "10",
        name: "Fluke 117 Electrician's Multimeter",
        serialNumber: "FL117-567890",
        note: "Держать в вертикальном положении при хранении",
        application: {
          id: "10",
          installer: {
            id: "10",
            lastName: "Михайлов",
            firstName: "Игорь",
            patronym: "Викторович",
          },
          status: "inProcess",
        },
      },
    ];
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Header linkText={"На главную"} />
      <View style={styles.content}>
        <View style={styles.equipments}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Оборудование</Text>
            <View style={styles.settings}>
              <SettingsIcon height={s(24)} width={s(24)} />
            </View>
          </View>
          <View style={styles.filters}>
            <View style={styles.filter}>
              <Input
                label="Поиск по всем полям"
                isHasClearButton={true}
              ></Input>
            </View>
            <View style={styles.filter}>
              <Input label="Статус" isHasClearButton={true}></Input>
            </View>
            <View style={[styles.filter, styles.lastChild]}>
              <Input label="Монтажник" isHasClearButton={true}></Input>
            </View>
          </View>
          {!!equipmentsList.length && (
            <View style={styles.equipmentsListWrapper}>
              <FlatList
                data={equipmentsList}
                contentContainerStyle={styles.equipmentsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  const isLastItem = index === equipmentsList.length - 1;

                  return (
                    <View
                      style={[
                        styles.equipmentItem,
                        isLastItem && styles.isLastItem,
                      ]}
                    >
                      <View style={styles.itemContent}>
                        <View style={styles.leftColumn}>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.serialNumber}>
                            {item.serialNumber}
                          </Text>
                        </View>
                        <View style={styles.rightColumn}>
                          <Text style={styles.id}>#{item.id}</Text>
                        </View>
                      </View>
                      <View style={styles.note}>
                        <Text style={styles.noteText}>{item.note}</Text>
                      </View>
                      <View style={styles.application}>
                        {!!item?.application?.id ? (
                          <>
                            <View style={styles.applicationLeftColumn}>
                              <Text style={styles.applicationStatus}>
                                У монтажника
                              </Text>
                            </View>
                            <View style={styles.applicationRightColumn}>
                              <Text
                                style={styles.applicationInstaller}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                #{item.application.installer.id}{" "}
                                {item.application.installer.lastName}{" "}
                                {item.application.installer.firstName.charAt(0)}
                                .{" "}
                                {item.application.installer.patronym.charAt(0)}.
                              </Text>
                              <Text style={styles.applicationData}>
                                Заявка #{item.application.id}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <Text style={styles.applicationStatus}>
                            На складе
                          </Text>
                        )}
                      </View>
                      <View style={styles.itemButtonBlock}>
                        <Button
                          icon={<EditIcon width={s(5)} height={s(16)} />}
                          style={styles.itemButton}
                          size={"small"}
                        >
                          Редактировать
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
          <Button>Добавить оборудование</Button>
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
  lastChild: {
    marginBottom: 0,
  },
  equipments: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  equipmentsListWrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  equipmentsList: {
    width: "100%",
  },
  equipmentItem: {
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
  rightColumn: {
    width: "15%",
    alignItems: "flex-end",
  },
  name: {
    fontSize: s(20),
    maxWidth: "100%",
    fontFamily: "Inter_400Regular",
  },
  serialNumber: {
    fontSize: s(18),
    lineHeight: s(24),
    fontFamily: "Inter_400Regular",
  },
  id: {
    fontSize: s(20),
    maxWidth: "100%",
    fontFamily: "Inter_400Regular",
  },
  note: {
    marginTop: s(5),
  },
  noteText: {
    fontSize: s(14),
    lineHeight: s(16),
    fontFamily: "Inter_400Regular",
  },
  application: {
    marginTop: s(5),
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
    fontSize: s(18),
    lineHeight: s(20),
    fontFamily: "Inter_400Regular",
  },
  applicationInstaller: {
    fontSize: s(18),
    lineHeight: s(20),
    textAlign: "right",
    borderBottomColor: colors.dark,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
    fontFamily: "Inter_400Regular",
  },
  applicationData: {
    fontSize: s(18),
    lineHeight: s(20),
    marginTop: s(4),
    borderBottomColor: colors.dark,
    borderBottomWidth: s(1),
    borderStyle: "dashed",
    fontFamily: "Inter_400Regular",
  },
  itemButtonBlock: {
    marginTop: s(16),
  },
  itemButton: {},
  button: {
    paddingTop: s(15),
    paddingLeft: s(15),
    paddingRight: s(15),
    height: s(78),
  },
});
