import { FlatList, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import ListItem from "@/components/wrappers/listItem/listItem";
import Title from "@/components/wrappers/title/title";
import Content from "@/components/wrappers/content/content";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import TextType from "@/components/wrappers/textType/textType";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import SelectIcon from "@/assets/selectIcon.svg";
import DeleteIcon from "@/assets/deleteIcon.svg";
import AddIcon from "@/assets/addIcon.svg";
import SaveIcon from "@/assets/saveIcon.svg";
import { s } from "react-native-size-matters";

export default function Page() {
  const applicationItem = useMemo(() => {
    return {
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
      pool: {
        id: 1,
      },
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
      images: [
        {
          url: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
        },
        {
          url: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
        },
        {
          url: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
        },
        {
          url: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
        },
      ],
    };
  }, []);

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
          type: "connection",
        },
      },
      {
        id: "2",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
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
      },
      {
        id: "3",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
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
      },
      {
        id: "4",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
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
      },
      {
        id: "5",
        name: "Megger MIT485",
        serialNumber: "MIT4-584390",
        note: "Требуется калибровка каждые 6 месяцев",
        isSelected: true,
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
      },
    ];
  }, []);

  return (
    <Wrapper>
      <Header
        linkText={`К заявке #${applicationItem.id}`}
        to={"AdminApplicationPage"}
      />
      <Title isWithSettings={true} isNoMargin={true}>
        Изменение оборудования в заявке
      </Title>
      <MarginBottom size="biggest">
        <Inputs isWithPaddings={true}>
          <Input label="Поиск по всем полям" isHasClearButton={true}></Input>
        </Inputs>
      </MarginBottom>
      <Content>
        {!!equipmentsList.length && (
          <FlatList
            data={equipmentsList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <ListItem isLastItem={index === equipmentsList.length - 1}>
                  <MarginBottom size="small">
                    <TwoColumns
                      ratio="85/15"
                      leftColumn={
                        <>
                          <TextType
                            isBold={true}
                            isDashed={true}
                            numberOfLines={1}
                          >
                            {item.name}
                          </TextType>
                        </>
                      }
                      rightColumn={
                        <>
                          <TextType isBold={true} align="right">
                            #{item.id}
                          </TextType>
                        </>
                      }
                    />
                  </MarginBottom>
                  <MarginBottom size="small">
                    <TextType>{item.serialNumber}</TextType>
                  </MarginBottom>
                  <MarginBottom size="small">
                    <TextType size="small">{item.note}</TextType>
                  </MarginBottom>
                  <MarginBottom>
                    <TextType>
                      {!!item?.application?.id ? "У монтажника" : "На складе"}
                    </TextType>
                  </MarginBottom>
                  <Buttons isItemButtons={true}>
                    <Button
                      icon={
                        item?.isSelected ? (
                          <DeleteIcon width={s(13)} height={s(14)} />
                        ) : (
                          <SelectIcon width={s(13)} height={s(14)} />
                        )
                      }
                      size={"small"}
                      to={"AdminCreateApplicationPage"}
                      toParams={{
                        id: item.id,
                      }}
                    >
                      {item?.isSelected ? "Выбрать" : "Отменить выбор"}
                    </Button>
                  </Buttons>
                </ListItem>
              );
            }}
          />
        )}
      </Content>
      <Buttons>
        <Button
          icon={<AddIcon width={s(16)} height={s(16)} />}
          to={"AdminCreateApplicationPage"}
        >
          Добавить новое оборудование
        </Button>
        <Button icon={<SaveIcon width={s(20)} height={s(20)} />}>
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
