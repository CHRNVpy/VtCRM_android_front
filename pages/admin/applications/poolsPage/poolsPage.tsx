import { FlatList, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import ListItem from "@/components/wrappers/listItem/listItem";
import Title from "@/components/wrappers/title/title";
import Content from "@/components/wrappers/content/content";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import TextType from "@/components/wrappers/textType/textType";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString, ruApplicationsByCount } from "@/helpers/strings";

export default function Page() {
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

  return (
    <Wrapper>
      <Header linkText={"На главную"} to={"AdminMainPage"} />
      <Title>Пулы заявок</Title>
      <Content>
        {!!poolsList.length && (
          <FlatList
            data={poolsList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <ListItem isLastItem={index === poolsList.length - 1}>
                  <MarginBottom>
                    <TwoColumns
                      leftColumn={
                        <>
                          <TextType isBold={true} isDashed={true}>
                            Пул #{item.id}
                          </TextType>
                        </>
                      }
                      rightColumn={
                        <>
                          <TextType isBold={true} align="right">
                            {item.applicationsCount}{" "}
                            {ruApplicationsByCount({
                              count: item.applicationsCount,
                            })}
                          </TextType>
                        </>
                      }
                    />
                  </MarginBottom>
                  <MarginBottom>
                    {item.applications.map(
                      (applicationItem, applicationIndex) => {
                        const itemElement = (
                          <TwoColumns
                            leftColumn={
                              <>
                                <TextType>
                                  {applicationItem.client.name}
                                </TextType>
                                <TextType size="small">
                                  {applicationItem.type == "connection"
                                    ? "Подключение"
                                    : applicationItem.type == "repair"
                                    ? "Ремонт"
                                    : "Монтаж ВОЛС"}
                                </TextType>
                              </>
                            }
                            rightColumn={
                              <>
                                <TextType align="right">
                                  #{applicationItem.id}
                                </TextType>
                                <TextType align="right" size="small">
                                  {formatDateString({
                                    dateString: applicationItem.datetime,
                                  })}
                                </TextType>
                              </>
                            }
                          />
                        );

                        return (
                          <React.Fragment key={applicationItem.id}>
                            {applicationIndex ===
                            item.applications.length - 1 ? (
                              itemElement
                            ) : (
                              <MarginBottom size="small">
                                {itemElement}
                              </MarginBottom>
                            )}
                          </React.Fragment>
                        );
                      }
                    )}
                  </MarginBottom>
                  <Buttons isItemButtons={true}>
                    <Button
                      icon={<AddIcon width={s(13)} height={s(14)} />}
                      size={"small"}
                    >
                      Добавить заявку
                    </Button>
                    <Button
                      icon={<StartIcon width={s(13)} height={s(13)} />}
                      size={"small"}
                    >
                      Отправить в работу
                    </Button>
                  </Buttons>
                </ListItem>
              );
            }}
          />
        )}
      </Content>
      <Buttons>
        <Button icon={<AddIcon width={s(16)} height={s(16)} />}>
          Добавить пул
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
