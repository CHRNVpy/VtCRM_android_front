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
import SaveIcon from "@/assets/saveIcon.svg";
import { s } from "react-native-size-matters";

export default function Page() {
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
        type: "connection",
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

  return (
    <Wrapper>
      <Header
        linkText={`Заявка #${equipmentData.application.id}`}
        to={"AdminApplicationPage"}
        toParams={{ id: equipmentData.application.id }}
      />
      <Title>Редактирование заявки</Title>
      <FlatList
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
            <MarginBottom>
              <TextType isDashed={true}>
                Монтажник #{equipmentData.application.installer.id}{" "}
                {equipmentData.application.installer.lastName}{" "}
                {equipmentData.application.installer.firstName.charAt(0)}.
                {equipmentData.application.installer.patronym.charAt(0)}.
              </TextType>
            </MarginBottom>
            <MarginBottom>
              <TextType isBold={true}>
                {equipmentData.application.type == "connection"
                  ? "Подключение"
                  : equipmentData.application.type == "repair"
                  ? "Ремонт"
                  : "Монтаж ВОЛС"}
              </TextType>
            </MarginBottom>
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
        <Button
          icon={<EditIcon width={s(7)} height={s(22)} />}
          to={"AdminEditEquipmentsListInApplicationPage"}
          toParams={{ id: equipmentData.application.id }}
        >
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
