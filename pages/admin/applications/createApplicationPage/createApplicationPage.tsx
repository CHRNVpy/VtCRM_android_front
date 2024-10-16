import { TextInput, FlatList } from "react-native";
import { useMemo, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import DateTime from "@/components/controls/dateTime/dateTime";
import Select from "@/components/controls/select/select";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import ListItem from "@/components/wrappers/listItem/listItem";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import EditIcon from "@/assets/editIcon.svg";
import {
  setInputStateCreateTypeReducer,
  setInputStateCreateClientNumberReducer,
  setInputStateCreateAddressReducer,
  setInputStateCreateInstallDateReducer,
  setInputStateCreateCommentReducer,
  setApplications,
} from "@/store/applications/state/state";
import { DefaultApplicationStateType } from "@/store/applications/state/types";
import { s } from "react-native-size-matters";
import { trimIgnoringNL } from "@/helpers/strings";
import { setPage } from "@/store/navigation/state/state";
import SaveIcon from "@/assets/saveIcon.svg";
import { postApplication } from "@/store/applications/post/post";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const addressInputRef = useRef<TextInput>(null);

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const poolId = pageParamsWhenMounted?.poolId;

  const type = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.type.text
  );

  console.log("TYPE", type);

  const clientNumber = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.clientNumber.text
  );

  const address = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.address.text
  );

  const installDate = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.installDate.text
  );

  const comment = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.comment.text
  );

  const equipmentsList = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.equipmentsList
  );

  const applicationsData = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const items = [
    {
      label: "Подключение",
      value: "connection",
      key: "connection",
    },
    { label: "Ремонт", value: "repair", key: "repair" },
    {
      label: "Монтаж ВОЛС",
      value: "line setup",
      key: "line setup",
    },
  ];

  const handleChangeTypeValue = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateTypeReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeClientNumberText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateClientNumberReducer({
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
        setInputStateCreateAddressReducer({
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
        setInputStateCreateInstallDateReducer({
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
        setInputStateCreateCommentReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleSubmitClientNumberEditing = useCallback(() => {
    if (!clientNumber) return;
    if (!addressInputRef.current) return;

    addressInputRef.current.focus();
  }, [addressInputRef, type, clientNumber, address, installDate, comment]);

  const isButtonDisabled = useMemo(() => {
    if (!type) return true;
    if (!clientNumber.trim() && !address.trim()) return true;
    if (!installDate) return true;

    return false;
  }, [type, clientNumber, address, installDate]);

  const handleCreateApplication = useCallback(async () => {
    if (isButtonDisabled) return;

    //  Make new draftId -> biggest id plus one
    const draftId = applicationsData.reduce((id, application) => {
      if (!application?.draftId && !application?.id) return id;

      const applicationId = application?.id
        ? application.id
        : application?.draftId
        ? application.draftId
        : 0;

      if (id >= applicationId + 1) return id;

      return applicationId + 1;
    }, 1);

    //  Random hash which sets in local application and then posts to remote application
    const hash = (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
    ).toUpperCase();

    const newApplication: DefaultApplicationStateType = {
      draftId,
      type: type,
      client: clientNumber.trim() ? { number: clientNumber.trim() } : undefined,
      address: address.trim(),
      comment: trimIgnoringNL({ text: comment }),
      status: "pending",
      installDate: installDate,
      poolId: poolId,
      hash,
    };

    const data = [...applicationsData, newApplication];

    //  Set new application to store
    dispatch(setApplications({ action: "setData", data }));

    //  Clear all inputs and states
    dispatch(
      setInputStateCreateTypeReducer({ action: "setText", text: "connection" })
    );
    dispatch(setInputStateCreateClientNumberReducer({ action: "reset" }));
    dispatch(setInputStateCreateAddressReducer({ action: "reset" }));
    dispatch(setInputStateCreateInstallDateReducer({ action: "reset" }));
    dispatch(setInputStateCreateCommentReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminApplicationPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : { draftId: draftId },
      })
    );

    dispatch(postApplication({ id: draftId }));
  }, [
    dispatch,
    isButtonDisabled,
    type,
    clientNumber,
    address,
    installDate,
    comment,
    applicationsData,
    pageParamsWhenMounted,
    poolId,
  ]);

  return (
    <Wrapper>
      <Header linkText={`Список пулов`} to={"AdminApplicationsPoolsPage"} />
      <Title>
        Добавление заявки {poolId ? <>в пул #{poolId}</> : <>и нового пула</>}
      </Title>
      <FlatList
        keyboardShouldPersistTaps="always"
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
            <MarginBottom size="biggest">
              <Inputs>
                <Select
                  label="Тип заявки"
                  itemKey={type}
                  items={items}
                  onValueChange={handleChangeTypeValue}
                ></Select>
                {!!["connection", "repair"].includes(type) && (
                  <Input
                    label="Номер клиента"
                    value={clientNumber}
                    onChangeText={handleChangeClientNumberText}
                    onSubmitEditing={handleSubmitClientNumberEditing}
                  ></Input>
                )}
                {!!["line setup"].includes(type) && (
                  <Input
                    label="Адрес"
                    value={address}
                    onChangeText={handleChangeAddressText}
                    inputRef={addressInputRef}
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
        >
          Изменить оборудование
        </Button>
        <Button
          icon={<SaveIcon width={s(20)} height={s(20)} />}
          isDisabled={isButtonDisabled}
          onPress={handleCreateApplication}
        >
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}
