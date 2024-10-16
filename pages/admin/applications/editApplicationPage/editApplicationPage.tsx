import { FlatList } from "react-native";
import { useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import DateTime from "@/components/controls/dateTime/dateTime";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import ListItem from "@/components/wrappers/listItem/listItem";
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import EditIcon from "@/assets/editIcon.svg";
import SaveIcon from "@/assets/saveIcon.svg";
import { setPage } from "@/store/navigation/state/state";
import { trimIgnoringNL } from "@/helpers/strings";
import {
  setInputStateEditClientNumberReducer,
  setInputStateEditInstallDateReducer,
  setInputStateEditAddressReducer,
  setInputStateEditCommentReducer,
  setApplications,
} from "@/store/applications/state/state";
import { patchApplication } from "@/store/applications/patch/patch";
import { s } from "react-native-size-matters";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const applicationId = pageParamsWhenMounted?.id;
  const applicationDraftId = pageParamsWhenMounted?.draftId;

  const clientNumber = useSelector(
    (state: RootState) =>
      state.stateApplications.editApplicationFields.inputs.clientNumber.text
  );

  const address = useSelector(
    (state: RootState) =>
      state.stateApplications.editApplicationFields.inputs.address.text
  );

  const installDate = useSelector(
    (state: RootState) =>
      state.stateApplications.editApplicationFields.inputs.installDate.text
  );

  const comment = useSelector(
    (state: RootState) =>
      state.stateApplications.editApplicationFields.inputs.comment.text
  );

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const applicationData = useMemo(() => {
    return applicationsList.find((application) => {
      if (application?.id && applicationId && application.id == applicationId)
        return true;

      if (
        application?.draftId &&
        applicationDraftId &&
        application?.draftId == applicationDraftId
      )
        return true;

      return false;
    });
  }, [applicationsList, applicationId, applicationDraftId]);

  useEffect(() => {
    if (applicationData) return;

    //  Navigate back if no application found
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminApplicationPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );
  }, [dispatch, applicationData]);

  useEffect(() => {
    //  Set fields on mount
    dispatch(
      setInputStateEditClientNumberReducer({
        action: "reset",
      })
    );
    dispatch(
      setInputStateEditInstallDateReducer({
        action: "setText",
        text: applicationData?.installDate ? applicationData.installDate : "",
      })
    );
    dispatch(
      setInputStateEditAddressReducer({
        action: "setText",
        text: applicationData?.address ? applicationData.address : "",
      })
    );
    dispatch(
      setInputStateEditCommentReducer({
        action: "setText",
        text: applicationData?.comment ? applicationData.comment : "",
      })
    );

    //  Clear fields on unmount
    return () => {
      dispatch(setInputStateEditClientNumberReducer({ action: "reset" }));
      dispatch(setInputStateEditInstallDateReducer({ action: "reset" }));
      dispatch(setInputStateEditAddressReducer({ action: "reset" }));
      dispatch(setInputStateEditCommentReducer({ action: "reset" }));
    };
  }, [applicationData]);

  const handleChangeClientNumberText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateEditClientNumberReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeAddressText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateEditAddressReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeInstallDateDate = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateEditInstallDateReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeCommentText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateEditCommentReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const isButtonDisabled = useMemo(() => {
    if (!applicationData?.type) return true;
    if (!!["line setup"].includes(applicationData.type) && !address.trim())
      return true;
    if (!installDate) return true;

    return false;
  }, [applicationData, clientNumber, address, installDate]);

  const handleEditApplication = useCallback(async () => {
    if (isButtonDisabled) return;

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
          client: clientNumber
            ? {
                number: clientNumber,
              }
            : application.client,
          address: address,
          installDate: installDate,
          comment: trimIgnoringNL({ text: comment }),
          isModified,
        };
      }
    );

    //  Set new application to store
    dispatch(
      setApplications({ action: "setData", data: modifiedApplicationsList })
    );

    //  Clear all inputs and states
    dispatch(setInputStateEditClientNumberReducer({ action: "reset" }));
    dispatch(setInputStateEditInstallDateReducer({ action: "reset" }));
    dispatch(setInputStateEditAddressReducer({ action: "reset" }));
    dispatch(setInputStateEditCommentReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminApplicationPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );

    if (!applicationId) return;

    dispatch(patchApplication({ id: applicationId }));
  }, [
    dispatch,
    isButtonDisabled,
    clientNumber,
    address,
    installDate,
    comment,
    applicationsList,
    pageParamsWhenMounted,
  ]);

  if (!applicationData) return null;

  return (
    <Wrapper>
      <Header
        linkText={`Заявка #${applicationData.id}`}
        to={"AdminApplicationPage"}
        toParams={{ id: applicationData.id }}
      />
      <Title>Редактирование заявки</Title>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={applicationData.equipments ? applicationData.equipments : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          return (
            <ListItem
              isLastItem={
                index ===
                (applicationData.equipments ? applicationData.equipments : [])
                  .length -
                  1
              }
            >
              <TextType isBold={true}>
                #{item.id} {item.name}
              </TextType>
              <TextType>{item.serialNumber}</TextType>
            </ListItem>
          );
        }}
        ListHeaderComponent={
          <Content isWithPaddings={true}>
            {applicationData.installer && (
              <MarginBottom>
                <PressableArea
                  to={"AdminInstallerPage"}
                  toParams={{
                    id: applicationData.installer.id,
                    draftId: applicationData.installer.draftId,
                  }}
                >
                  <TextType isDashed={true}>
                    Монтажник #{applicationData.installer.id}{" "}
                    {applicationData.installer.lastname}{" "}
                    {applicationData.installer.firstname.charAt(0)}.
                    {applicationData.installer.middlename.charAt(0)}.
                  </TextType>
                </PressableArea>
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
            </MarginBottom>
            {!!applicationData.client && (
              <>
                <MarginBottom size="smallest">
                  <TextType>Клиент: {applicationData.client.fullName}</TextType>
                </MarginBottom>
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
              </>
            )}
            <MarginBottom size="biggest">
              <Inputs>
                {!!["connection", "repair"].includes(applicationData.type) && (
                  <Input
                    label="Номер клиента"
                    value={clientNumber}
                    onChangeText={handleChangeClientNumberText}
                  ></Input>
                )}
                {!!["line setup"].includes(applicationData.type) && (
                  <Input
                    label="Адрес"
                    value={address}
                    onChangeText={handleChangeAddressText}
                  ></Input>
                )}
                <DateTime
                  label="Дата и время"
                  value={installDate}
                  onChangeDate={handleChangeInstallDateDate}
                ></DateTime>
                <Input
                  label="Примечание"
                  value={comment}
                  onChangeText={handleChangeCommentText}
                  isMultiline={true}
                ></Input>
              </Inputs>
            </MarginBottom>
          </Content>
        }
      />
      <Buttons>
        <Button
          icon={<EditIcon width={s(7)} height={s(22)} />}
          to={"AdminEditEquipmentsListInApplicationPage"}
          toParams={{ id: applicationData.id }}
        >
          Изменить оборудование
        </Button>
        <Button
          icon={<SaveIcon width={s(20)} height={s(20)} />}
          isDisabled={isButtonDisabled}
          onPress={handleEditApplication}
        >
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}
