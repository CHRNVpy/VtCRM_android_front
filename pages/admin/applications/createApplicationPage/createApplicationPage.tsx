import { FlatList } from "react-native";
import { useMemo, useCallback } from "react";
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
  setInputStateCreateClientAccountReducer,
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
import { setPools } from "@/store/pools/state/state";
import { DefaultPoolStateType } from "@/store/pools/state/types";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const poolId: number | undefined = pageParamsWhenMounted?.id;
  const poolDraftId: number | undefined = pageParamsWhenMounted?.draftId;

  const type = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.type.text
  );

  const clientAccount = useSelector(
    (state: RootState) =>
      state.stateApplications.createApplicationFields.inputs.clientAccount.text
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

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const poolsList = useSelector(
    (state: RootState) => state.statePools.pools.data
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

  const handleChangeClientAccountText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateClientAccountReducer({
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

  const isButtonDisabled = useMemo(() => {
    if (!type) return true;
    if (!!["connection", "repair"].includes(type) && !clientAccount.trim())
      return true;
    if (!!["line setup"].includes(type) && !address.trim()) return true;
    if (!installDate) return true;

    return false;
  }, [type, clientAccount, address, installDate]);

  const handleCreateApplication = useCallback(async () => {
    if (isButtonDisabled) return;

    //  Make new draftId -> biggest id plus one
    const draftId = applicationsList.reduce((id, application) => {
      if (!application?.draftId && !application?.id) return id;

      const applicationId = (() => {
        if (!application?.id && !application?.draftId) return 0;

        if (!application?.id && application?.draftId)
          return application.draftId;

        if (application?.id && !application?.draftId) return application.id;

        if (application?.id && application?.draftId) {
          return application.id > application.draftId
            ? application.id
            : application.draftId;
        }

        return 0;
      })();

      if (id >= applicationId + 1) return id;

      return applicationId + 1;
    }, 1);

    //  Make new poolDraftId -> biggest id plus one
    const newPoolDraftId = poolDraftId
      ? poolDraftId
      : poolId
      ? undefined
      : applicationsList.reduce((draftId, application) => {
          if (!application?.poolDraftId && !application?.poolId) return draftId;

          const applicationPoolId = (() => {
            if (!application?.poolId && !application?.poolDraftId) return 0;

            if (!application?.poolId && application?.poolDraftId)
              return application.poolDraftId;

            if (application?.poolId && !application?.poolDraftId)
              return application.poolId;

            if (application?.poolId && application?.poolDraftId) {
              return application.poolId > application.poolDraftId
                ? application.poolId
                : application.poolDraftId;
            }

            return 0;
          })();

          if (draftId >= applicationPoolId + 1) return draftId;

          return applicationPoolId + 1;
        }, 1);

    //  Random hash which sets in local application and then posts to remote application
    const hash = (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
    ).toUpperCase();

    const newApplication: DefaultApplicationStateType = {
      draftId,
      type: type,
      client:
        !!["connection", "repair"].includes(type) && clientAccount.trim()
          ? { account: clientAccount.trim() }
          : undefined,
      address: ["line setup"].includes(type) ? address.trim() : "",
      comment: trimIgnoringNL({ text: comment }),
      status: "pending",
      installDate: installDate,
      poolId: poolId,
      poolDraftId: newPoolDraftId,
      hash,
    };

    const data = [...applicationsList, newApplication];

    //  Set new application to store
    dispatch(setApplications({ action: "setData", data }));

    //  Set changes to pools list
    let modifiedPoolsList = [...poolsList];

    if (poolId) {
      modifiedPoolsList = modifiedPoolsList.map((pool) => {
        if (pool.id !== poolId) return pool;

        pool.applicationsCount = pool.applicationsCount + 1;

        return pool;
      });
    }

    if (!poolId && poolDraftId) {
      modifiedPoolsList.push({
        draftId: poolDraftId,
        status: "pending",
        applicationsCount: 1,
      });
    }

    dispatch(setPools({ action: "setData", data: modifiedPoolsList }));

    //  Clear all inputs and states
    dispatch(
      setInputStateCreateTypeReducer({ action: "setText", text: "connection" })
    );
    dispatch(setInputStateCreateClientAccountReducer({ action: "reset" }));
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
    clientAccount,
    address,
    installDate,
    comment,
    applicationsList,
    pageParamsWhenMounted,
    poolId,
    poolsList,
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
                    value={clientAccount}
                    onChangeText={handleChangeClientAccountText}
                  ></Input>
                )}
                {!!["line setup"].includes(type) && (
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
