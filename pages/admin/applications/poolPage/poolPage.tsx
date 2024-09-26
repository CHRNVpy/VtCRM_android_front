import { FlatList, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Input from "@/components/controls/input/input";
import Title from "@/components/wrappers/title/title";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Inputs from "@/components/wrappers/inputs/inputs";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import ListItem from "@/components/wrappers/listItem/listItem";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString } from "@/helpers/strings";
import TextType from "@/components/wrappers/textType/textType";

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

  return (
    <Wrapper>
      <Header linkText={"Пулы заявок"} to={"AdminApplicationsPoolsPage"} />
      <Title isWithSettings={true} isNoMargin={true}>
        Пул #{poolItem.id}
      </Title>
      <MarginBottom>
        <Inputs isWithPaddings={true}>
          <Input label="Поиск по заявкам" isHasClearButton={true}></Input>
        </Inputs>
      </MarginBottom>
      <Content>
        {!!poolItem.applications.length && (
          <FlatList
            data={poolItem.applications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <ListItem
                  key={item.id}
                  isLastItem={index === poolItem.applications.length - 1}
                >
                  <MarginBottom size="small">
                    <PressableArea
                      to={"AdminApplicationPage"}
                      toParams={{ id: item.id }}
                    >
                      <TwoColumns
                        leftColumn={
                          <TextType isBold={true}>{item.client.name}</TextType>
                        }
                        rightColumn={
                          <TextType isBold={true} align="right">
                            #{item.id}
                          </TextType>
                        }
                      />
                    </PressableArea>
                  </MarginBottom>
                  <MarginBottom>
                    <PressableArea
                      to={"AdminInstallerPage"}
                      toParams={{
                        id: poolItem.installer.id,
                        backLink: {
                          text: `Пул #${poolItem.id}`,
                          to: "AdminApplicationsPoolPage",
                          params: { id: poolItem.id },
                        },
                      }}
                    >
                      {!!poolItem?.installer && (
                        <TextType size="medium" isDashed={true}>
                          Монтажник #{poolItem.installer.id}{" "}
                          {poolItem.installer.lastName}{" "}
                          {poolItem.installer.firstName.charAt(0)}.
                          {poolItem.installer.patronym.charAt(0)}.
                        </TextType>
                      )}
                    </PressableArea>
                  </MarginBottom>
                  <PressableArea
                    to={"AdminApplicationPage"}
                    toParams={{ id: item.id }}
                  >
                    <MarginBottom>
                      <TextType size="small">{item.note}</TextType>
                    </MarginBottom>
                    {item.equipments.length > 0 && (
                      <MarginBottom>
                        {item.equipments.map((equipment, equipmentIndex) => {
                          const isLastItem =
                            equipmentIndex === item.equipments.length - 1;

                          const equipmentItem = (
                            <>
                              <TextType isBold={true}>
                                #{equipment.id} {equipment.name}
                              </TextType>
                              <TextType>{equipment.serialNumber}</TextType>
                            </>
                          );

                          return (
                            <React.Fragment key={equipmentIndex}>
                              {isLastItem ? (
                                equipmentItem
                              ) : (
                                <MarginBottom>{equipmentItem}</MarginBottom>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </MarginBottom>
                    )}
                    <MarginBottom>
                      <TextType isBold={true}>
                        {item.type == "connection"
                          ? "Подключение"
                          : item.type == "repair"
                          ? "Ремонт"
                          : "Монтаж ВОЛС"}
                      </TextType>
                      <TextType>
                        {formatDateString({
                          dateString: item.datetime,
                        })}
                      </TextType>
                    </MarginBottom>
                    <MarginBottom>
                      <TextType isBold={true}>
                        {item.isActive ? "В работе" : "Отменена"}
                      </TextType>
                    </MarginBottom>
                  </PressableArea>
                  <Buttons isItemButtons={true}>
                    <Button
                      icon={<EditIcon width={s(5)} height={s(16)} />}
                      size={"small"}
                      to={"AdminEditApplicationPage"}
                      toParams={{
                        id: item.id,
                        backLink: {
                          text: `Пул #${poolItem.id}`,
                          to: "AdminApplicationsPoolPage",
                          params: { id: poolItem.id },
                        },
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      icon={
                        item.isActive ? (
                          <TurnOffIcon width={s(10)} height={s(17)} />
                        ) : (
                          <TurnOnIcon width={s(10)} height={s(17)} />
                        )
                      }
                      size={"small"}
                    >
                      {item.isActive ? "Отменить" : "Возобновить"}
                    </Button>
                  </Buttons>
                </ListItem>
              );
            }}
          />
        )}
      </Content>
      <Buttons>
        <Button icon={<StartIcon width={s(15)} height={s(16)} />}>
          Отправить в работу
        </Button>
        <Button
          icon={<AddIcon width={s(16)} height={s(16)} />}
          to={"AdminCreateApplicationPage"}
          toParams={{
            id: poolItem.id,
            backLink: {
              text: `Пул #${poolItem.id}`,
              to: "AdminApplicationsPoolPage",
              params: { id: poolItem.id },
            },
          }}
        >
          Добавить заявку
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
