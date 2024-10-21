import { TextInput } from "react-native";
import { useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Title from "@/components/wrappers/title/title";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import SaveIcon from "@/assets/saveIcon.svg";
import {
  setInputStateCreateLastnameReducer,
  setInputStateCreateFirstnameReducer,
  setInputStateCreateMiddlenameReducer,
  setInputStateCreatePhoneReducer,
  setInputStateCreatePasswordReducer,
  setInstallers,
} from "@/store/installers/state/state";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setPage } from "@/store/navigation/state/state";
import { postInstaller } from "@/store/installers/post/post";
import { s } from "react-native-size-matters";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const firstnameInputRef = useRef<TextInput>(null);
  const middlenameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const lastname = useSelector(
    (state: RootState) =>
      state.stateInstallers.createInstallerFields.inputs.lastname.text
  );

  const firstname = useSelector(
    (state: RootState) =>
      state.stateInstallers.createInstallerFields.inputs.firstname.text
  );

  const middlename = useSelector(
    (state: RootState) =>
      state.stateInstallers.createInstallerFields.inputs.middlename.text
  );

  const phone = useSelector(
    (state: RootState) =>
      state.stateInstallers.createInstallerFields.inputs.phone.text
  );

  const password = useSelector(
    (state: RootState) =>
      state.stateInstallers.createInstallerFields.inputs.password.text
  );

  const installersData = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const handleChangeLastnameText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateLastnameReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeFirstnameText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateFirstnameReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeMiddlenameText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateMiddlenameReducer({
          action: "setText",
          text: text,
        })
      );
    },
    [dispatch]
  );

  const handleChangePhoneText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreatePhoneReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangePasswordText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreatePasswordReducer({
          action: "setText",
          text: text,
        })
      );
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

  const handleSubmitPhoneEditing = useCallback(() => {
    if (!phone) return;
    if (!passwordInputRef.current) return;

    passwordInputRef.current.focus();
  }, [passwordInputRef, phone]);

  const isButtonDisabled = useMemo(() => {
    if (!lastname.trim()) return true;
    if (!firstname.trim()) return true;
    if (!middlename.trim()) return true;
    if (!phone.trim()) return true;
    if (!password.trim()) return true;

    return false;
  }, [lastname, firstname, middlename, phone, password]);

  const handleCreateInstaller = useCallback(async () => {
    if (isButtonDisabled) return;

    //  Make new draftId -> biggest id plus one
    const draftId = installersData.reduce((id, installer) => {
      if (!installer?.draftId && !installer?.id) return id;

      const installerId = (() => {
        if (!installer?.id && !installer?.draftId) return 0;

        if (!installer?.id && installer?.draftId) return installer.draftId;

        if (installer?.id && !installer?.draftId) return installer.id;

        if (installer?.id && installer?.draftId) {
          return installer.id > installer.draftId
            ? installer.id
            : installer.draftId;
        }

        return 0;
      })();

      if (id >= installerId + 1) return id;

      return installerId + 1;
    }, 1);

    //  Random hash which sets in local installer and then posts to remote installer
    const hash = (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
    ).toUpperCase();

    const newInstaller: DefaultInstallerStateType = {
      draftId,
      lastname: lastname.trim(),
      firstname: firstname.trim(),
      middlename: middlename.trim(),
      phone: phone.trim(),
      password: password.trim(),
      status: "active",
      hash,
    };

    const data = [...installersData, newInstaller];

    //  Set new installer to store
    dispatch(setInstallers({ action: "setData", data }));

    //  Clear all inputs and states
    dispatch(setInputStateCreateLastnameReducer({ action: "reset" }));
    dispatch(setInputStateCreateFirstnameReducer({ action: "reset" }));
    dispatch(setInputStateCreateMiddlenameReducer({ action: "reset" }));
    dispatch(setInputStateCreatePhoneReducer({ action: "reset" }));
    dispatch(setInputStateCreatePasswordReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminInstallersPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {},
      })
    );

    dispatch(postInstaller({ id: draftId }));
  }, [
    dispatch,
    isButtonDisabled,
    lastname,
    firstname,
    middlename,
    phone,
    password,
    installersData,
    pageParamsWhenFocused,
  ]);

  return (
    <Wrapper>
      <Header linkText={`Монтажники`} to={"AdminInstallersPage"} />
      <Title>Добавление монтажника</Title>
      <Content isWithScrollView={true}>
        <Inputs isWithPaddings={true}>
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
            inputRef={middlenameInputRef}
            onChangeText={handleChangeMiddlenameText}
            onSubmitEditing={handleSubmitMiddlenameEditing}
          ></Input>
          <Input
            label="Телефон"
            value={phone}
            inputRef={phoneInputRef}
            onChangeText={handleChangePhoneText}
            onSubmitEditing={handleSubmitPhoneEditing}
            isPhoneMask={true}
          ></Input>
          <Input
            label="Новый пароль"
            value={password}
            type="newPassword"
            inputRef={passwordInputRef}
            onChangeText={handleChangePasswordText}
          ></Input>
        </Inputs>
      </Content>
      <Buttons>
        <Button
          icon={<SaveIcon width={s(20)} height={s(20)} />}
          isDisabled={isButtonDisabled}
          onPress={handleCreateInstaller}
        >
          Добавить
        </Button>
      </Buttons>
    </Wrapper>
  );
}
