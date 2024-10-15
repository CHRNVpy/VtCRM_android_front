import { ScrollView, Image, StyleSheet } from "react-native";
import React, { useMemo, useEffect } from "react";
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
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString } from "@/helpers/strings";
import TextType from "@/components/wrappers/textType/textType";
import { ApplicationImageType } from "@/store/applications/state/types";
import { setPage } from "@/store/navigation/state/state";
import { useIsApplicationsSyncInProcess } from "@/components/hooks/isApplicationsSyncInProcess/isApplicationsSyncInProcess";
import colors from "@/helpers/colors";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const isApplicationsSyncInProcess = useIsApplicationsSyncInProcess();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const applicationId = pageParamsWhenMounted?.id;
  const applicationDraftId = pageParamsWhenMounted?.draftId;

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
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

    //  Navigate back if no equipment found
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminEquipmentsPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {},
      })
    );
  }, [dispatch, applicationData]);

  const installerData = useMemo(() => {
    if (!applicationData) return;

    return installersList.find((installer) => {
      if (!installer?.id) return false;

      if (installer.id == applicationData.installerId) return true;

      return false;
    });
  }, [applicationData]);

  if (!applicationData) return;

  return (
    <Wrapper>
      <Header
        linkText={
          applicationData.poolId
            ? `Пул #${applicationData.poolId}`
            : `Пулы заявок`
        }
        to={
          applicationData.poolId
            ? "AdminApplicationsPoolPage"
            : "AdminApplicationsPoolsPage"
        }
        toParams={applicationData.poolId ? { id: applicationData.poolId } : {}}
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
                      : "Клиент не указан"
                    : applicationData.address}
                </Title>
              }
              rightColumn={
                <TextType size="biggest">
                  {applicationData.id
                    ? `#${applicationData.id}`
                    : applicationData.draftId
                    ? `#(${applicationData.draftId})`
                    : ""}
                </TextType>
              }
            />
          </MarginBottom>
          {!!applicationData.installerId && !!installerData && (
            <MarginBottom size="big">
              <TextType isDashed={true}>
                Монтажник #{applicationData.installerId}{" "}
                {installerData.lastname} {installerData.firstname.charAt(0)}.
                {installerData.middlename.charAt(0)}.
              </TextType>
            </MarginBottom>
          )}
          {!!applicationData.comment && (
            <MarginBottom size="big">
              <TextType size="small">{applicationData.comment}</TextType>
            </MarginBottom>
          )}
          {!!applicationData.equipment &&
            !!applicationData?.equipment?.length && (
              <MarginBottom>
                {applicationData.equipment.map((equipment, equipmentIndex) => {
                  if (!applicationData.equipment) return null;

                  const isLastItem =
                    equipmentIndex === applicationData.equipment.length - 1;

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
          ["active", "pending", "cancelled"].includes(
            applicationData.status
          ) && (
            <Button
              icon={
                ["active", "pending"].includes(applicationData.status) ? (
                  <TurnOffIcon width={s(13)} height={s(22)} />
                ) : (
                  <TurnOnIcon width={s(13)} height={s(22)} />
                )
              }
            >
              {["active", "pending"].includes(applicationData.status)
                ? "Отменить"
                : "Возобновить"}
            </Button>
          )}
        {!!applicationData.status &&
          ["finished"].includes(applicationData.status) && (
            <>
              <Button
                icon={<EditIcon width={s(7)} height={s(22)} />}
                to={"AdminEditApplicationPage"}
                toParams={{
                  id: applicationData.id,
                  draftId: applicationData.draftId,
                }}
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
