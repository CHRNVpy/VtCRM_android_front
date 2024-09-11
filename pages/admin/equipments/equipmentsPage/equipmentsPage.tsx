import { FlatList, StyleSheet, Text } from "react-native";
import { useMemo } from "react";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Title from "@/components/wrappers/title/title";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Content from "@/components/wrappers/content/content";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import ListItem from "@/components/wrappers/listItem/listItem";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import TextType from "@/components/wrappers/textType/textType";
import EditIcon from "@/assets/editIcon.svg";
import AddIcon from "@/assets/addIcon.svg";
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
    <Wrapper>
      <Header linkText={"На главную"} />
      <Title isWithSettings={true} isNoMargin={true}>
        Оборудование
      </Title>
      <MarginBottom>
        <Inputs>
          <Input label="Поиск по всем полям" isHasClearButton={true}></Input>
          <Input label="Статус" isHasClearButton={true}></Input>
          <Input label="Монтажник" isHasClearButton={true}></Input>
        </Inputs>
      </MarginBottom>
      {!!equipmentsList.length && (
        <Content>
          <FlatList
            data={equipmentsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <ListItem isLastItem={index === equipmentsList.length - 1}>
                  <MarginBottom>
                    <TwoColumns
                      ratio="85/15"
                      leftColumn={
                        <>
                          <MarginBottom size="small">
                            <TextType>{item.name}</TextType>
                          </MarginBottom>
                          <TextType>{item.serialNumber}</TextType>
                        </>
                      }
                      rightColumn={
                        <TextType align="right">#{item.id}</TextType>
                      }
                    />
                  </MarginBottom>
                  <MarginBottom>
                    <TextType size="small">{item.note}</TextType>
                  </MarginBottom>
                  <MarginBottom>
                    {!!item?.application?.id ? (
                      <>
                        <MarginBottom size="small">
                          <TwoColumns
                            leftColumn={<TextType>У монтажника</TextType>}
                            rightColumn={
                              <>
                                <TextType align="right" isDashed={true}>
                                  Заявка #{item.application.id}
                                </TextType>
                              </>
                            }
                          />
                        </MarginBottom>
                        <TextType isDashed={true} align="right">
                          #{item.application.installer.id}{" "}
                          {item.application.installer.lastName}{" "}
                          {item.application.installer.firstName.charAt(0)}.{" "}
                          {item.application.installer.patronym.charAt(0)}.
                        </TextType>
                      </>
                    ) : (
                      <TextType>На складе</TextType>
                    )}
                  </MarginBottom>
                  <Buttons isItemButtons={true}>
                    <Button
                      icon={<EditIcon width={s(5)} height={s(16)} />}
                      size={"small"}
                    >
                      Редактировать
                    </Button>
                  </Buttons>
                </ListItem>
              );
            }}
          />
        </Content>
      )}
      <Buttons>
        <Button icon={<AddIcon width={s(16)} height={s(16)} />}>
          Добавить оборудование
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
