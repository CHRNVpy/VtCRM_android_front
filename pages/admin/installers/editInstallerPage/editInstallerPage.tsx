import { TextInput } from "react-native";
import { useMemo, useEffect, useCallback, useRef } from "react";
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
import { patchInstaller } from "@/store/installers/patch/patch";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const firstnameInputRef = useRef<TextInput>(null);
  const middlenameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const installerId = pageParamsWhenFocused?.id;
  const installerDraftId = pageParamsWhenFocused?.draftId;

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
        installer?.draftId == installerDraftId
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
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {
              id: pageParamsWhenFocused.id,
              draftId: pageParamsWhenFocused.draftId,
            },
      })
    );
  }, [dispatch, installerData, pageParamsWhenFocused]);

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

  const handleSubmitLastnameEditing = useCallback(() => {
    if (!lastname) return;
    if (!firstnameInputRef.current) return;

    firstnameInputRef.current.focus();
  }, [firstnameInputRef, lastname, firstname, middlename]);

  const handleSubmitFirstnameEditing = useCallback(() => {
    if (!firstname) return;
    if (!middlenameInputRef.current) return;

    middlenameInputRef.current.focus();
  }, [middlenameInputRef, lastname, firstname, middlename]);

  const handleSubmitMiddlenameEditing = useCallback(() => {
    if (!middlename) return;
    if (!phoneInputRef.current) return;

    phoneInputRef.current.focus();
  }, [phoneInputRef, lastname, firstname, middlename]);

  const isButtonDisabled = useMemo(() => {
    if (!lastname.trim()) return true;
    if (!firstname.trim()) return true;
    if (!middlename.trim()) return true;
    if (!phone.trim()) return true;

    return false;
  }, [lastname, firstname, middlename, phone]);

  const handleEditInstaller = useCallback(async () => {
    if (isButtonDisabled) return;

    const modifiedInstallersList = [...installersList].map((installer) => {
      if (
        (!installer?.id || !installerId || installer.id != installerId) &&
        (!installer?.draftId ||
          !installerDraftId ||
          installer?.draftId != installerDraftId)
      )
        return installer;

      const isModified = installer?.isModified
        ? installer.isModified
        : installer?.id
        ? true
        : false;

      return {
        ...installer,
        lastname: lastname.trim(),
        firstname: firstname.trim(),
        middlename: middlename.trim(),
        phone: phone.trim(),
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
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {
              id: pageParamsWhenFocused.id,
              draftId: pageParamsWhenFocused.draftId,
            },
      })
    );

    if (!installerId) return;

    dispatch(patchInstaller({ id: installerId }));
  }, [
    dispatch,
    isButtonDisabled,
    lastname,
    firstname,
    middlename,
    phone,
    pageParamsWhenFocused,
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
        toParams={{ id: pageParamsWhenFocused?.id }}
      />
      <Title>Редактирование монтажника</Title>
      <Content isWithPaddings={true}>
        <Inputs>
          <Input
            label="Фамилия"
            value={lastname}
            onChangeText={handleChangeLastnameText}
            onSubmitEditing={handleSubmitLastnameEditing}
          ></Input>
          <Input
            label="Имя"
            value={firstname}
            onChangeText={handleChangeFirstnameText}
            inputRef={firstnameInputRef}
            onSubmitEditing={handleSubmitFirstnameEditing}
          ></Input>
          <Input
            label="Отчество"
            value={middlename}
            onChangeText={handleChangeMiddlenameText}
            inputRef={middlenameInputRef}
            onSubmitEditing={handleSubmitMiddlenameEditing}
          ></Input>
          <Input
            label="Телефон"
            value={phone}
            onChangeText={handleChangePhoneText}
            inputRef={phoneInputRef}
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
