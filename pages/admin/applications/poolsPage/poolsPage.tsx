import { FlatList, ViewToken } from "react-native";
import React, { useEffect, useCallback, useState, useRef } from "react";
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
import Status from "@/components/wrappers/status/status";
import Loading from "@/components/controls/loading/loading";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString, ruApplicationsByCount } from "@/helpers/strings";
import { useIsApplicationsSyncInProcess } from "@/components/hooks/isApplicationsSyncInProcess/isApplicationsSyncInProcess";
import { debounce } from "lodash";
import { getPoolsCollection } from "@/store/pools/getCollection/getCollection";
import { patchPool } from "@/store/pools/patch/patch";
import { setPools } from "@/store/pools/state/state";

export default function Page() {
  const [pageByScrollData, setPageByScrollData] = useState<{
    firstIndex: number | null;
    page?: number;
  }>();

  const dispatch: AppDispatch = useDispatch();

  const isApplicationsSyncInProcess = useIsApplicationsSyncInProcess();

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const poolsList = useSelector(
    (state: RootState) => state.statePools.pools.data
  );

  const totalPages = useSelector(
    (state: RootState) => state.statePools.totalPages.data
  );

  const pagesLoaded = useSelector(
    (state: RootState) => state.statePools.pagesLoaded.data
  );

  const poolsPatchs = useSelector(
    (state: RootState) => state.patchPool.patchPoolState
  );

  const handleOnEndReached = useCallback(() => {
    if (totalPages <= pagesLoaded) return;

    //  Get current state of pools collection
    dispatch(getPoolsCollection({ page: pagesLoaded + 1 }));
  }, [totalPages, pagesLoaded]);

  const debouncedGetPoolsByPage = useCallback(
    debounce((updatePage) => {
      //  Get current state of pools collection
      dispatch(getPoolsCollection({ page: updatePage }));
    }, 300),
    [dispatch]
  );

  const handleOnViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems.length) return;
      if (!viewableItems?.[0]) return;

      setPageByScrollData((prevPageByScrollData) => {
        if (!viewableItems[0]?.item?.page) return prevPageByScrollData;

        //  Just to filter nulls
        if (prevPageByScrollData?.firstIndex === null)
          return prevPageByScrollData;
        if (viewableItems[0].index === null) return prevPageByScrollData;

        //  If not set, set first
        if (!prevPageByScrollData)
          return {
            firstIndex: viewableItems[0].index,
            page: viewableItems[0]?.item?.page,
          };

        //  If same first index
        if (prevPageByScrollData?.firstIndex == viewableItems[0].index)
          return prevPageByScrollData;

        if (prevPageByScrollData?.firstIndex > viewableItems[0].index) {
          return {
            firstIndex: viewableItems[0].index,
            page: viewableItems[0]?.item?.page,
          };
        }

        return {
          firstIndex: viewableItems[0].index,
          page: viewableItems[viewableItems?.length - 1]?.item?.page,
        };
      });
    }
  ).current;

  useEffect(() => {
    if (pageByScrollData?.page === undefined) return;

    debouncedGetPoolsByPage(pageByScrollData?.page);

    return () => {
      debouncedGetPoolsByPage.cancel();
    };
  }, [pageByScrollData?.page, debouncedGetPoolsByPage]);

  const handleChangePoolStatusToActivePress = useCallback(
    async (poolId?: number, poolDraftId?: number) => {
      const modifiedPoolsList = [...poolsList].map((pool) => {
        if (!poolId && !poolDraftId) return pool;

        if (!pool.id && !pool.draftId) return pool;

        if (!!poolId && !!pool.id && poolId !== pool.id) return pool;

        if (!!poolDraftId && !!pool.draftId && poolDraftId !== pool.draftId)
          return pool;

        return { ...pool, status: "active", isModified: true };
      });

      dispatch(setPools({ action: "setData", data: modifiedPoolsList }));

      if (!poolId) return;

      dispatch(patchPool({ id: poolId }));
    },
    [dispatch, poolsList]
  );

  //  When page opened
  useEffect(() => {
    if (poolsList?.length > 0) return;

    dispatch(getPoolsCollection({ page: 1 }));
  }, []);

  return (
    <Wrapper>
      <Header
        linkText={"На главную"}
        to={"AdminMainPage"}
        isSyncInProcess={isApplicationsSyncInProcess}
      />
      <Title>Пулы заявок</Title>
      <Content>
        {!poolsList?.length && (
          <Content isWithPaddings={true}>
            <TextType color="gray">Пулов нет</TextType>
          </Content>
        )}
        {!!poolsList.length && (
          <FlatList
            onEndReached={handleOnEndReached}
            onEndReachedThreshold={0.5}
            onViewableItemsChanged={handleOnViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 0 }}
            keyboardShouldPersistTaps="always"
            data={poolsList}
            ListFooterComponent={
              <Loading isInProcess={totalPages > pagesLoaded} />
            }
            keyExtractor={(item, index) =>
              item?.id
                ? `remote-${item?.id.toString()}`
                : item?.draftId
                ? `draft-${item?.draftId.toString()}`
                : `noid-${index}`
            }
            renderItem={({ item, index }) => {
              let applicationsCount = 0;

              const isInProcess =
                !!item?.id && !!poolsPatchs?.[item?.id]?.isInProcess;

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
                              draftId: applicationItem.draftId,
                              backLink: {
                                text: `Пулы заявок`,
                                to: "AdminApplicationsPoolsPage",
                              },
                            }}
                          >
                            <TwoColumns
                              ratio="50/50"
                              leftColumn={
                                <>
                                  <TextType>
                                    {["connection", "repair"].includes(
                                      applicationItem.type
                                    )
                                      ? applicationItem?.client?.fullName
                                        ? applicationItem.client.fullName
                                        : applicationItem.id
                                        ? "Клиент не указан"
                                        : `Клиент #${applicationItem?.client?.account}`
                                      : applicationItem.address}
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
                                    {applicationItem?.id
                                      ? `#${applicationItem.id}`
                                      : `#(${applicationItem.draftId})`}
                                  </TextType>
                                  {["active", "pending", "cancelled"].includes(
                                    applicationItem.status
                                  ) && (
                                    <Status
                                      isActive={["active", "pending"].includes(
                                        applicationItem.status
                                      )}
                                    />
                                  )}
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
                  {item.status == "pending" && (
                    <Buttons isItemButtons={true}>
                      <Button
                        icon={<AddIcon width={s(13)} height={s(14)} />}
                        size={"small"}
                        to={"AdminCreateApplicationPage"}
                        toParams={{
                          id: item.id,
                          draftId: item.draftId,
                          backLink: {
                            text: `Пулы заявок`,
                            to: "AdminApplicationsPoolsPage",
                          },
                        }}
                        isDisabled={isInProcess}
                      >
                        Добавить заявку
                      </Button>
                      <Button
                        icon={<StartIcon width={s(13)} height={s(13)} />}
                        size={"small"}
                        isInProcess={isInProcess}
                        onPress={async () =>
                          handleChangePoolStatusToActivePress(
                            item?.id,
                            item?.draftId
                          )
                        }
                      >
                        Отправить в работу
                      </Button>
                    </Buttons>
                  )}
                  {item.status == "active" && (
                    <TextType isBold={true}>В работе</TextType>
                  )}
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
