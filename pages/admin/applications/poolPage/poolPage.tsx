import { FlatList } from "react-native";
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
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
import Status from "@/components/wrappers/status/status";
import AddIcon from "@/assets/addIcon.svg";
import StartIcon from "@/assets/startIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import { s } from "react-native-size-matters";
import { DefaultApplicationStateType } from "@/store/applications/state/types";
import { setApplications } from "@/store/applications/state/state";
import { patchApplication } from "@/store/applications/patch/patch";
import { formatDateString } from "@/helpers/strings";
import TextType from "@/components/wrappers/textType/textType";
import { setPage } from "@/store/navigation/state/state";
import { useIsApplicationsSyncInProcess } from "@/components/hooks/isApplicationsSyncInProcess/isApplicationsSyncInProcess";
import { getApplicationsCollection } from "@/store/applications/getCollection/getCollection";
import { patchPool } from "@/store/pools/patch/patch";
import { setPools } from "@/store/pools/state/state";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

export default function Page() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isApplicationsSyncInProcess = useIsApplicationsSyncInProcess();

  const dispatch: AppDispatch = useDispatch();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  const poolsPatchs = useSelector(
    (state: RootState) => state.patchPool.patchPoolState
  );

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const poolId: number | undefined = pageParamsWhenFocused?.id;
  const poolDraftId: number | undefined = pageParamsWhenFocused?.draftId;

  const isPatchCurrentPoolInProcess = useMemo(() => {
    if (!poolId) return false;

    if (!poolsPatchs?.[poolId]) return false;

    if (poolsPatchs?.[poolId]?.isInProcess) return true;

    return false;
  }, [poolsPatchs, poolId]);

  const poolsList = useSelector(
    (state: RootState) => state.statePools.pools.data
  );

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const poolData = useMemo(() => {
    return poolsList.find((pool) => {
      if (!!pool?.id && !!poolId && pool.id == poolId) return true;
      if (!!pool?.draftId && !!poolDraftId && pool?.draftId == poolDraftId)
        return true;

      return false;
    });
  }, [poolsList, poolId, poolDraftId]);

  const isPoolStatusIsPending = useMemo(() => {
    return poolData?.status == "pending";
  }, [poolData]);

  const poolApplicationsList = useMemo(() => {
    return applicationsList.filter((application) => {
      if (!application?.poolId && !application?.poolDraftId) return false;
      if (!!application.poolId && application.poolId !== poolId) return false;
      if (!!application.poolDraftId && application.poolDraftId !== poolDraftId)
        return false;

      return true;
    });
  }, [applicationsList, poolId, poolDraftId]);

  const applicationsCount = useMemo(() => {
    return poolApplicationsList ? poolApplicationsList.length : 0;
  }, [poolApplicationsList]);

  useEffect(() => {
    if (applicationsCount) return;

    //  Navigate back if no application found
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminApplicationsPoolsPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {},
      })
    );
  }, [dispatch, applicationsCount, pageParamsWhenFocused]);

  const handleChangeStatusPress = useCallback(
    async (
      status: DefaultApplicationStateType["status"],
      applicationId?: number,
      applicationDraftId?: number
    ) => {
      const modifiedApplicationsList = [...applicationsList].map(
        (application) => {
          if (
            (!application?.id ||
              !applicationId ||
              application.id != applicationId) &&
            (!application?.draftId ||
              !applicationDraftId ||
              application?.draftId != applicationDraftId)
          )
            return application;

          const isModified = application?.isModified
            ? application.isModified
            : application?.id
            ? true
            : false;

          return {
            ...application,
            status: status,
            isModified,
          };
        }
      );

      //  Set applications to store
      dispatch(
        setApplications({ action: "setData", data: modifiedApplicationsList })
      );

      if (!applicationId) return;

      dispatch(patchApplication({ id: applicationId }));
    },
    [dispatch, applicationsList]
  );

  const handleChangePoolStatusToActivePress = useCallback(async () => {
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
  }, [dispatch, poolsList, poolId, poolDraftId]);

  //  When page opened
  useEffect(() => {
    if (!poolId) return;

    dispatch(getApplicationsCollection({ page: 1, poolId }));
  }, []);

  if (!applicationsCount) return;

  return (
    <Wrapper>
      <Header
        linkText={"Пулы заявок"}
        to={"AdminApplicationsPoolsPage"}
        isSyncInProcess={isApplicationsSyncInProcess}
      />
      <Title
        isWithSettings={true}
        isNoMargin={isSettingsOpen}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={async () => setIsSettingsOpen(!isSettingsOpen)}
      >
        Пул {poolId ? `#${poolId}` : `#(${poolDraftId})`}
      </Title>
      {!!isSettingsOpen && (
        <MarginBottom>
          <Inputs isWithPaddings={true}>
            <Input label="Поиск по заявкам" isHasClearButton={true}></Input>
          </Inputs>
        </MarginBottom>
      )}
      <Content>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={poolApplicationsList}
          keyExtractor={(item, index) =>
            item?.id
              ? `remote-${item?.id.toString()}`
              : item?.draftId
              ? `draft-${item?.draftId.toString()}`
              : `noid-${index}`
          }
          renderItem={({ item, index }) => {
            return (
              <ListItem
                key={item.id}
                isLastItem={index === applicationsCount - 1}
              >
                <MarginBottom size="small">
                  <PressableArea
                    to={"AdminApplicationPage"}
                    toParams={{ id: item.id }}
                  >
                    <TwoColumns
                      leftColumn={
                        <TextType isBold={true}>
                          {["connection", "repair"].includes(item.type)
                            ? item?.client?.fullName
                              ? item.client.fullName
                              : item.id
                              ? "Клиент не указан"
                              : `Клиент #${item?.client?.account}`
                            : item.address}
                        </TextType>
                      }
                      rightColumn={
                        <>
                          <TextType isBold={true} align="right">
                            {item.id
                              ? `#${item.id}`
                              : item.draftId
                              ? `#(${item.draftId})`
                              : ""}
                          </TextType>
                          {["active", "pending", "cancelled"].includes(
                            item.status
                          ) && (
                            <Status
                              isActive={["active", "pending"].includes(
                                item.status
                              )}
                            />
                          )}
                        </>
                      }
                    />
                  </PressableArea>
                </MarginBottom>
                {!!item?.installer?.id && (
                  <MarginBottom>
                    <PressableArea
                      to={"AdminInstallerPage"}
                      toParams={{
                        id: item.installer.id,
                        backLink: {
                          text: `Пул #${poolId}`,
                          to: "AdminApplicationsPoolPage",
                          params: { id: poolId },
                        },
                      }}
                    >
                      {!!item?.installer?.id && (
                        <TextType size="medium" isDashed={true}>
                          Монтажник #{item.installer.id}{" "}
                          {item.installer.lastname}{" "}
                          {item.installer.firstname.charAt(0)}.
                          {item.installer.middlename.charAt(0)}.
                        </TextType>
                      )}
                    </PressableArea>
                  </MarginBottom>
                )}
                <PressableArea
                  to={"AdminApplicationPage"}
                  toParams={{ id: item.id, draftId: item.draftId }}
                >
                  {!!item.comment && (
                    <MarginBottom>
                      <TextType size="small">{item.comment}</TextType>
                    </MarginBottom>
                  )}
                  {!!item?.equipments?.length && (
                    <MarginBottom>
                      {item.equipments.map((equipment, equipmentIndex) => {
                        const equipmentsCount = item?.equipments?.length
                          ? item.equipments.length
                          : 0;

                        const isLastItem =
                          equipmentIndex === equipmentsCount - 1;

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
                        dateString: item.installDate,
                      })}
                    </TextType>
                  </MarginBottom>
                  <MarginBottom>
                    <TextType isBold={true}>
                      {item.status == "active"
                        ? "В работе"
                        : item.status == "pending"
                        ? "Собирается"
                        : item.status == "finished"
                        ? "Завершена"
                        : "Отменена"}
                    </TextType>
                  </MarginBottom>
                </PressableArea>
                <Buttons isItemButtons={true}>
                  {!!isPoolStatusIsPending &&
                    !!item.status &&
                    ["active", "pending", "cancelled"].includes(
                      item.status
                    ) && (
                      <Button
                        icon={<EditIcon width={s(5)} height={s(16)} />}
                        size={"small"}
                        to={"AdminEditApplicationPage"}
                        toParams={{
                          id: item.id,
                          draftId: item.draftId,
                          backLink: {
                            text: `Пул #${poolId}`,
                            to: "AdminApplicationsPoolPage",
                            params: { id: poolId },
                          },
                        }}
                        isDisabled={isPatchCurrentPoolInProcess}
                      >
                        Редактировать
                      </Button>
                    )}
                  {!!isPoolStatusIsPending &&
                    !!item.status &&
                    ["pending", "cancelled"].includes(item.status) && (
                      <Button
                        icon={
                          ["pending"].includes(item.status) ? (
                            <TurnOffIcon width={s(10)} height={s(17)} />
                          ) : (
                            <TurnOnIcon width={s(10)} height={s(17)} />
                          )
                        }
                        size={"small"}
                        onPress={() =>
                          handleChangeStatusPress(
                            ["pending"].includes(item.status)
                              ? "cancelled"
                              : "pending",
                            item?.id,
                            item?.draftId
                          )
                        }
                        isDisabled={isPatchCurrentPoolInProcess}
                      >
                        {["pending"].includes(item.status)
                          ? "Отменить"
                          : "Возобновить"}
                      </Button>
                    )}
                </Buttons>
              </ListItem>
            );
          }}
        />
      </Content>
      <Buttons>
        {!!isPoolStatusIsPending && (
          <Button
            icon={<StartIcon width={s(15)} height={s(16)} />}
            onPress={handleChangePoolStatusToActivePress}
            isInProcess={isPatchCurrentPoolInProcess}
          >
            Отправить в работу
          </Button>
        )}
        {!!isPoolStatusIsPending && (
          <Button
            icon={<AddIcon width={s(16)} height={s(16)} />}
            to={"AdminCreateApplicationPage"}
            toParams={{
              id: poolId,
              draftId: poolDraftId,
              backLink: {
                text: `Пул ${poolId ? `#${poolId}` : `#(${poolDraftId})`}`,
                to: "AdminApplicationsPoolPage",
                params: { id: poolId, draftId: poolDraftId },
              },
            }}
            isDisabled={isPatchCurrentPoolInProcess}
          >
            Добавить заявку {poolId} D{poolDraftId}
          </Button>
        )}
      </Buttons>
    </Wrapper>
  );
}
