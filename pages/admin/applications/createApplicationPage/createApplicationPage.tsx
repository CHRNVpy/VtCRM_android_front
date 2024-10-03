import { FlatList, StyleSheet } from "react-native";
import { useMemo } from "react";
import Header from "@/components/container/header/header";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import ListItem from "@/components/wrappers/listItem/listItem";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import EditIcon from "@/assets/editIcon.svg";
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";

export default function Page() {
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
          note: "Подключение нового абонента",
          equipments: [
            {
              id: "1",
              name: "Fluke Networks DTX-1800",
              serialNumber: "DTX2-342462",
              note: "Не предназначено для работы с бетоном или каменными материалами",
            },
            {
              id: "2",
              name: "Megger MIT485",
              serialNumber: "MIT4-584390",
              note: "Требуется калибровка каждые 6 месяцев",
            },
          ],
          isActive: true,
        },
        {
          id: 2,
          client: {
            name: "Иванов И.И.",
          },
          type: "repair",
          datetime: "2024-08-17T10:00:00Z",
          note: "Ремонт повреждённого кабеля",
          equipments: [
            {
              id: "3",
              name: "FLIR E8 Infrared Camera",
              serialNumber: "E8-983452",
              note: "Хранить в сухом месте, избегать ударов",
            },
            {
              id: "4",
              name: "Extech EX330 Multimeter",
              serialNumber: "EX33-745230",
              note: "Использовать только для измерения переменного тока",
            },
          ],
          isActive: false,
        },
        {
          id: 3,
          client: {
            name: "Петрова М.Н.",
          },
          type: "lineInstallation",
          datetime: "2024-08-18T14:45:00Z",
          note: "Монтаж новой линии для офиса",
          equipments: [
            {
              id: "5",
              name: "Bosch GLM 50 C Laser Measure",
              serialNumber: "GLM5-672901",
              note: "Не допускать попадания воды внутрь устройства",
            },
            {
              id: "6",
              name: "Klein Tools CL800 Clamp Meter",
              serialNumber: "CL80-293874",
              note: "Не использовать при температуре ниже -10°C",
            },
          ],
          isActive: false,
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

  const equipmentsList = useMemo(() => {
    return [
      {
        id: "1",
        name: "Fluke Networks DTX-1800",
        serialNumber: "DTX2-342462",
        note: "Не предназначено для работы с бетоном или каменными материалами",
      },
      {
        id: "2",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
      },
      {
        id: "3",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
      },
      {
        id: "4",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
      },
      {
        id: "5",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
      },
    ];
  }, []);

  /*
"connection"
? "Подключение"
: "repair"
? "Ремонт"
: "Монтаж ВОЛС"
  */

  return (
    <Wrapper>
      <Header linkText={`Список пулов`} to={"AdminApplicationsPoolsPage"} />
      <Title>
        Добавление заявки{" "}
        {poolItem.id ? <>в пул #{poolItem.id}</> : <>и нового пула</>}
      </Title>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={equipmentsList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          return (
            <ListItem isLastItem={index === equipmentsList.length - 1}>
              <TextType isBold={true}>
                #{item.id} {item.name}
              </TextType>
              <TextType>{item.serialNumber}</TextType>
            </ListItem>
          );
        }}
        ListHeaderComponent={
          <Content isWithPaddings={true}>
            <MarginBottom size="biggest">
              <Inputs>
                <Input label="Тип заявки" value={"Подключение"}></Input>
                <Input label="Адрес" value={""}></Input>
                <Input label="Дата и время" value={""}></Input>
                <Input label="Примечание" value={""}></Input>
              </Inputs>
            </MarginBottom>
          </Content>
        }
      />
      <Buttons>
        <Button icon={<EditIcon width={s(7)} height={s(22)} />}>
          Изменить оборудование
        </Button>
        <Button icon={<SaveIcon width={s(20)} height={s(20)} />}>
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
