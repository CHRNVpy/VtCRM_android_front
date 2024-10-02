import { useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Header from "@/components/container/header/header";
import Content from "@/components/wrappers/content/content";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Title from "@/components/wrappers/title/title";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";
import { setPage } from "@/store/navigation/state/state";
import {
  setInputStateEditLastnameReducer,
  setInputStateEditFirstnameReducer,
  setInputStateEditMiddlenameReducer,
  setInputStateEditPhoneReducer,
  setInstallers,
} from "@/store/installers/state/state";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const installerId = pageParamsWhenMounted?.id;
  const installerDraftId = pageParamsWhenMounted?.draftId;

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const installerData = useMemo(() => {
    return installersList.find((installer) => {
      if (installer?.id && installerId && installer.id == installerId)
        return true;

      if (
        installer?.draftId &&
        installerDraftId &&
        installerDraftId == installerDraftId
      )
        return true;

      return false;
    });
  }, [installersList, installerId, installerDraftId]);

  useEffect(() => {
    if (installerData) return;

    //  Navigate back if no installer found
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );
  }, [dispatch, installerData]);

  useEffect(() => {
    //  Set fields on mount
    dispatch(
      setInputStateEditLastnameReducer({
        action: "setText",
        text: installerData?.lastname,
      })
    );
    dispatch(
      setInputStateEditFirstnameReducer({
        action: "setText",
        text: installerData?.firstname,
      })
    );
    dispatch(
      setInputStateEditMiddlenameReducer({
        action: "setText",
        text: installerData?.middlename,
      })
    );
    dispatch(
      setInputStateEditPhoneReducer({
        action: "setText",
        text: installerData?.phone,
      })
    );

    //  Clear fields on unmount
    return () => {
      dispatch(setInputStateEditLastnameReducer({ action: "reset" }));
      dispatch(setInputStateEditFirstnameReducer({ action: "reset" }));
      dispatch(setInputStateEditMiddlenameReducer({ action: "reset" }));
      dispatch(setInputStateEditPhoneReducer({ action: "reset" }));
    };
  }, [installerData]);

  const lastname = useSelector(
    (state: RootState) =>
      state.stateInstallers.editInstallerFields.inputs.lastname.text
  );

  const handleChangeLastnameText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditLastnameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const firstname = useSelector(
    (state: RootState) =>
      state.stateInstallers.editInstallerFields.inputs.firstname.text
  );

  const handleChangeFirstnameText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditFirstnameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const middlename = useSelector(
    (state: RootState) =>
      state.stateInstallers.editInstallerFields.inputs.middlename.text
  );

  const handleChangeMiddlenameText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditMiddlenameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const phone = useSelector(
    (state: RootState) =>
      state.stateInstallers.editInstallerFields.inputs.phone.text
  );

  const handleChangePhoneText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditPhoneReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const isButtonDisabled = useMemo(() => {
    if (!lastname) return true;
    if (!firstname) return true;
    if (!middlename) return true;
    if (!phone) return true;

    return false;
  }, [lastname, firstname, middlename, phone]);

  const handleEditInstaller = useCallback(() => {
    if (isButtonDisabled) return;

    const modifiedInstallersList = [...installersList].map((installer) => {
      if (
        (!installer?.id || !installerId || installer.id != installerId) &&
        (!installer?.draftId ||
          !installerDraftId ||
          installerDraftId != installerDraftId)
      )
        return installer;

      const isModified = installer?.isModified
        ? installer.isModified
        : installer?.id
        ? true
        : false;

      return {
        ...installer,
        lastname,
        firstname,
        middlename,
        phone,
        isModified,
      };
    });

    //  Set new installer to store
    dispatch(
      setInstallers({ action: "setData", data: modifiedInstallersList })
    );

    //  Clear all inputs and states
    dispatch(setInputStateEditLastnameReducer({ action: "reset" }));
    dispatch(setInputStateEditFirstnameReducer({ action: "reset" }));
    dispatch(setInputStateEditMiddlenameReducer({ action: "reset" }));
    dispatch(setInputStateEditPhoneReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );
  }, [
    dispatch,
    isButtonDisabled,
    lastname,
    firstname,
    middlename,
    phone,
    pageParamsWhenMounted,
    installersList,
    installerId,
    installerDraftId,
  ]);

  if (!installerData) return null;

  return (
    <Wrapper>
      <Header
        linkText={`#${installerData.id} ${installerData.lastname} ${installerData.firstname} ${installerData.middlename}`}
        to={"AdminInstallerPage"}
        toParams={{ id: pageParamsWhenMounted?.id }}
      />
      <Title>Редактирование монтажника</Title>
      <Content isWithPaddings={true}>
        <Inputs>
          <Input
            label="Фамилия"
            value={lastname}
            onChangeText={handleChangeLastnameText}
          ></Input>
          <Input
            label="Имя"
            value={firstname}
            onChangeText={handleChangeFirstnameText}
          ></Input>
          <Input
            label="Отчество"
            value={middlename}
            onChangeText={handleChangeMiddlenameText}
          ></Input>
          <Input
            label="Телефон"
            value={phone}
            onChangeText={handleChangePhoneText}
          ></Input>
        </Inputs>
      </Content>
      <Buttons>
        <Button
          icon={<SaveIcon width={s(20)} height={s(20)} />}
          isDisabled={isButtonDisabled}
          onPress={handleEditInstaller}
        >
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}
