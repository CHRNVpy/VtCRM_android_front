import { FlatList, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
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
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString, ruApplicationsByCount } from "@/helpers/strings";

export default function Page() {
  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const poolsList = useSelector(
    (state: RootState) => state.statePools.pools.data
  );

  console.log(poolsList);

  /*
  console.log(poolsListFromDb);
  console.log(applicationsList);

  const poolsList = useMemo(() => {
    const result: any[] = [];

    applicationsList.forEach((application) => {
      const pool = result.find((pool) => {
        if (pool.id == application.poolId) return true;

        return false;
      });

      if (!pool) {
        result.push({
          id: application.poolId,
          applicationsCount: 1,
          applications: [application],
        });
      } else {
        pool.applicationsCount = pool.applicationsCount + 1;
        pool.applications.push(application);
      }
    });

    return result;
  }, [applicationsList]);
  */

  return (
    <Wrapper>
      <Header linkText={"На главную"} to={"AdminMainPage"} />
      <Title>Пулы заявок</Title>
      <Content>
        {!poolsList?.length && (
          <Content isWithPaddings={true}>
            <TextType color="gray">Пулов нет</TextType>
          </Content>
        )}
        {!!poolsList.length && (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={poolsList}
            keyExtractor={(item, index) =>
              item?.id
                ? `remote-${item?.id.toString()}`
                : item?.draftId
                ? `draft-${item?.draftId.toString()}`
                : `noid-${index}`
            }
            renderItem={({ item, index }) => {
              let applicationsCount = 0;

              return (
                <ListItem isLastItem={index === poolsList.length - 1}>
                  <MarginBottom>
                    <PressableArea
                      to={"AdminApplicationsPoolPage"}
                      toParams={{
                        id: item?.id,
                        draftId: item?.draftId,
                      }}
                    >
                      <TwoColumns
                        leftColumn={
                          <>
                            <TextType isBold={true} isDashed={true}>
                              Пул{" "}
                              {item?.id ? `#${item.id}` : `#(${item.draftId})`}
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
                    </PressableArea>
                  </MarginBottom>
                  <MarginBottom>
                    {applicationsList.map(
                      (applicationItem, applicationIndex) => {
                        if (
                          !!applicationItem?.poolId &&
                          !!item?.id &&
                          applicationItem.poolId !== item.id
                        )
                          return null;

                        if (
                          !applicationItem?.poolId &&
                          applicationItem?.poolDraftId &&
                          !item?.id &&
                          !!item.draftId &&
                          applicationItem.poolDraftId !== item.draftId
                        )
                          return null;

                        applicationsCount++;

                        const itemElement = (
                          <PressableArea
                            to={"AdminApplicationPage"}
                            toParams={{
                              id: applicationItem.id,
                            }}
                          >
                            <TwoColumns
                              ratio="50/50"
                              leftColumn={
                                <>
                                  <TextType>
                                    {applicationItem?.client?.fullName}
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
                                      dateString: applicationItem.installDate,
                                    })}
                                  </TextType>
                                </>
                              }
                            />
                          </PressableArea>
                        );

                        return (
                          <React.Fragment
                            key={
                              applicationItem?.id
                                ? `remote-${applicationItem?.id.toString()}`
                                : applicationItem?.draftId
                                ? `draft-${applicationItem?.draftId.toString()}`
                                : `noid-${applicationIndex}`
                            }
                          >
                            {applicationsCount == item.applicationsCount ? (
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
                      to={"AdminCreateApplicationPage"}
                      toParams={{
                        id: item.id,
                      }}
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
        <Button
          icon={<AddIcon width={s(16)} height={s(16)} />}
          to={"AdminCreateApplicationPage"}
        >
          Добавить пул
        </Button>
      </Buttons>
    </Wrapper>
  );
}
