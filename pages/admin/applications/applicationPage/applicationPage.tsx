import { ScrollView, Image, StyleSheet } from "react-native";
import React, { useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Title from "@/components/wrappers/title/title";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import Status from "@/components/wrappers/status/status";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString } from "@/helpers/strings";
import TextType from "@/components/wrappers/textType/textType";
import { setApplications } from "@/store/applications/state/state";
import { patchApplication } from "@/store/applications/patch/patch";
import {
  ApplicationImageType,
  DefaultApplicationStateType,
} from "@/store/applications/state/types";
import { setPage } from "@/store/navigation/state/state";
import { useIsApplicationsSyncInProcess } from "@/components/hooks/isApplicationsSyncInProcess/isApplicationsSyncInProcess";
import colors from "@/helpers/colors";
import { getApplicationsCollection } from "@/store/applications/getCollection/getCollection";
import usePageParams from "@/components/hooks/pageParams/pageParams";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const isApplicationsSyncInProcess = useIsApplicationsSyncInProcess();

  const pageParams = usePageParams();

  const applicationId = pageParams?.id;
  const applicationDraftId = pageParams?.draftId;

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const applicationData = useMemo(() => {
    return applicationsList.find((application) => {
      if (
        !!application?.id &&
        !!applicationId &&
        application.id == applicationId
      )
        return true;

      if (
        !!application?.draftId &&
        !!applicationDraftId &&
        application?.draftId == applicationDraftId
      )
        return true;

      return false;
    });
  }, [applicationsList, applicationId, applicationDraftId]);

  const leftColumnImages = useMemo(() => {
    if (!applicationData) return [];
    if (!applicationData.images) return [];

    if (!applicationData.images?.length) return [];

    const images = applicationData.images.reduce<ApplicationImageType[]>(
      (result, item, index) => {
        if (index % 2 == 0) result.push(item);

        return result;
      },
      []
    );

    return images;
  }, [applicationData]);

  const rightColumnImages = useMemo(() => {
    if (!applicationData) return [];
    if (!applicationData.images) return [];
    if (!applicationData.images?.length) return [];

    const images = applicationData.images.reduce<ApplicationImageType[]>(
      (result, item, index) => {
        if (index % 2 == 1) result.push(item);

        return result;
      },
      []
    );

    return images;
  }, [applicationData]);

  useEffect(() => {
    if (applicationData) return;

    //  Navigate back if no application found
    dispatch(
      setPage({
        action: "setData",
        data: pageParams?.backLink?.to
          ? pageParams?.backLink?.to
          : "AdminApplicationsPoolsPage",
        params: pageParams?.backLink?.to ? pageParams?.backLink?.params : {},
      })
    );
  }, [dispatch, applicationData, pageParams]);

  const handleChangeStatusPress = useCallback(
    async (status: DefaultApplicationStateType["status"]) => {
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
    [dispatch, applicationsList, applicationId, applicationDraftId]
  );

  //  When page opened
  useEffect(() => {
    if (!applicationData?.poolId) return;

    dispatch(
      getApplicationsCollection({ page: 1, poolId: applicationData.poolId })
    );
  }, []);

  if (!applicationData) return;

  return (
    <Wrapper>
      <Header
        linkText={
          applicationData.poolId
            ? `Пул #${applicationData.poolId}`
            : applicationData.poolDraftId
            ? `Пул #(${applicationData.poolDraftId})`
            : `Пулы заявок`
        }
        to={
          applicationData.poolId
            ? "AdminApplicationsPoolPage"
            : applicationData.poolDraftId
            ? "AdminApplicationsPoolPage"
            : "AdminApplicationsPoolsPage"
        }
        toParams={
          applicationData.poolId
            ? {
                id: applicationData.poolId,
                draftId: applicationData.poolDraftId,
              }
            : applicationData.poolDraftId
            ? {
                id: applicationData.poolId,
                draftId: applicationData.poolDraftId,
              }
            : {}
        }
        isSyncInProcess={isApplicationsSyncInProcess}
      />
      <ScrollView>
        <Content isWithPaddings={true}>
          <MarginBottom>
            <TwoColumns
              leftColumn={
                <Title isNoMargin={true} isNoPadding={true}>
                  {["connection", "repair"].includes(applicationData.type)
                    ? applicationData?.client?.fullName
                      ? applicationData.client.fullName
                      : applicationData.id
                      ? "Клиент не указан"
                      : `Клиент #${applicationData?.client?.account}`
                    : applicationData.address}
                </Title>
              }
              rightColumn={
                <>
                  <TextType size="biggest">
                    {applicationData.id
                      ? `#${applicationData.id}`
                      : applicationData.draftId
                      ? `#(${applicationData.draftId})`
                      : ""}
                  </TextType>
                  {["active", "pending", "cancelled"].includes(
                    applicationData.status
                  ) && (
                    <Status
                      size="big"
                      isActive={["active", "pending"].includes(
                        applicationData.status
                      )}
                    />
                  )}
                </>
              }
            />
          </MarginBottom>
          {!!applicationData.client && (
            <MarginBottom>
              {!!applicationData.client.phone && (
                <MarginBottom size="smallest">
                  <TextType>{applicationData.client.phone}</TextType>
                </MarginBottom>
              )}
              {!!applicationData.client.email && (
                <MarginBottom size="smallest">
                  <TextType>{applicationData.client.email}</TextType>
                </MarginBottom>
              )}
              {!!applicationData.client.address && (
                <MarginBottom size="smallest">
                  <TextType>{applicationData.client.address}</TextType>
                </MarginBottom>
              )}
            </MarginBottom>
          )}
          {!!applicationData?.installer?.id && (
            <MarginBottom size="big">
              <TextType isDashed={true}>
                Монтажник #{applicationData?.installer?.id}{" "}
                {applicationData?.installer?.lastname}{" "}
                {applicationData?.installer?.firstname?.charAt(0)}.
                {applicationData?.installer?.middlename?.charAt(0)}.
              </TextType>
            </MarginBottom>
          )}
          {!!applicationData.comment && (
            <MarginBottom size="big">
              <TextType size="small">{applicationData.comment}</TextType>
            </MarginBottom>
          )}
          {!!applicationData.equipments &&
            !!applicationData?.equipments?.length && (
              <MarginBottom>
                {applicationData.equipments.map((equipment, equipmentIndex) => {
                  if (!applicationData.equipments) return null;

                  const isLastItem =
                    equipmentIndex === applicationData.equipments.length - 1;

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
              {applicationData.type == "connection"
                ? "Подключение"
                : applicationData.type == "repair"
                ? "Ремонт"
                : "Монтаж ВОЛС"}
            </TextType>
            <TextType>
              {formatDateString({
                dateString: applicationData.installDate,
              })}
            </TextType>
          </MarginBottom>
          <MarginBottom>
            <TextType isBold={true}>
              {applicationData.status == "active"
                ? "В работе"
                : applicationData.status == "pending"
                ? "Собирается"
                : applicationData.status == "finished"
                ? "Завершена"
                : "Отменена"}
            </TextType>
          </MarginBottom>
          <TwoColumns
            gap="medium"
            ratio="50/50"
            leftColumn={
              <>
                <Content>
                  {!!leftColumnImages.length &&
                    leftColumnImages.map((imageObject, imageIndex) => {
                      const isLastImage =
                        imageIndex === leftColumnImages.length - 1;

                      const image = (
                        <Image
                          source={{
                            uri: imageObject.path,
                          }}
                          style={styles.images}
                          resizeMode={"contain"}
                        />
                      );

                      return (
                        <React.Fragment key={imageIndex}>
                          {isLastImage ? (
                            image
                          ) : (
                            <MarginBottom size="smallest">{image}</MarginBottom>
                          )}
                        </React.Fragment>
                      );
                    })}
                </Content>
              </>
            }
            rightColumn={
              <>
                <Content>
                  {!!rightColumnImages.length &&
                    rightColumnImages.map((imageObject, imageIndex) => {
                      const isLastImage =
                        imageIndex === rightColumnImages.length - 1;

                      const image = (
                        <Image
                          source={{
                            uri: imageObject.path,
                          }}
                          style={styles.images}
                          resizeMode={"contain"}
                        />
                      );

                      return (
                        <React.Fragment key={imageIndex}>
                          {isLastImage ? (
                            image
                          ) : (
                            <MarginBottom size="smallest">{image}</MarginBottom>
                          )}
                        </React.Fragment>
                      );
                    })}
                </Content>
              </>
            }
          />
        </Content>
      </ScrollView>
      <Buttons>
        {!!applicationData.status &&
          ["active", "pending", "cancelled"].includes(
            applicationData.status
          ) && (
            <Button
              icon={<EditIcon width={s(7)} height={s(22)} />}
              to={"AdminEditApplicationPage"}
              toParams={{
                id: applicationData.id,
                draftId: applicationData.draftId,
              }}
            >
              Редактировать
            </Button>
          )}
        {!!applicationData.status &&
          ["pending", "cancelled"].includes(applicationData.status) && (
            <Button
              icon={
                ["pending"].includes(applicationData.status) ? (
                  <TurnOffIcon width={s(13)} height={s(22)} />
                ) : (
                  <TurnOnIcon width={s(13)} height={s(22)} />
                )
              }
              onPress={() =>
                handleChangeStatusPress(
                  ["pending"].includes(applicationData.status)
                    ? "cancelled"
                    : "pending"
                )
              }
            >
              {["pending"].includes(applicationData.status)
                ? "Отменить"
                : "Возобновить"}
            </Button>
          )}
        {!!applicationData.status &&
          ["finished"].includes(applicationData.status) && (
            <>
              <Button
                icon={<EditIcon width={s(7)} height={s(22)} />}
                onPress={() => handleChangeStatusPress("approved")}
              >
                Завершить
              </Button>
            </>
          )}
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  images: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.gray,
  },
});
