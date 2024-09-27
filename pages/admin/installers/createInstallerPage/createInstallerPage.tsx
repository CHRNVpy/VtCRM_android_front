import { TextInput, StyleSheet } from "react-native";
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
  setInputStateLastnameReducer,
  setInputStateFirstnameReducer,
  setInputStateMiddlenameReducer,
  setInputStatePhoneReducer,
  setInputStatePasswordReducer,
  setLogin,
  setInstallers,
} from "@/store/installers/state/state";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setPage } from "@/store/navigation/state/state";
import { loginFromNameParts } from "@/helpers/strings";
import { s } from "react-native-size-matters";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const firstnameInputRef = useRef<TextInput>(null);
  const middlenameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

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

  const login = useSelector(
    (state: RootState) =>
      state.stateInstallers.createInstallerFields.states.login.data
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
      dispatch(setInputStateLastnameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handleChangeFirstnameText = useCallback(
    (text?: string) => {
      dispatch(setInputStateFirstnameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handleChangeMiddlenameText = useCallback(
    (text?: string) => {
      dispatch(setInputStateMiddlenameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handleChangePhoneText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStatePhoneReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangePasswordText = useCallback(
    (text?: string) => {
      dispatch(setInputStatePasswordReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const buildLoginFromName = useCallback(() => {
    dispatch(
      setLogin({
        action: "setData",
        data: loginFromNameParts({ lastname, firstname, middlename }),
      })
    );
  }, [dispatch, lastname, firstname, middlename]);

  const handleSubmitLastnameEditing = useCallback(() => {
    buildLoginFromName();

    if (!lastname) return;
    if (!firstnameInputRef.current) return;

    firstnameInputRef.current.focus();
  }, [firstnameInputRef, lastname, firstname, middlename]);

  const handleSubmitFirstnameEditing = useCallback(() => {
    buildLoginFromName();

    if (!firstname) return;
    if (!middlenameInputRef.current) return;

    middlenameInputRef.current.focus();
  }, [middlenameInputRef, lastname, firstname, middlename]);

  const handleSubmitMiddlenameEditing = useCallback(() => {
    buildLoginFromName();

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
    if (!lastname) return true;
    if (!firstname) return true;
    if (!middlename) return true;
    if (!phone) return true;
    if (!password) return true;

    return false;
  }, [lastname, firstname, middlename, phone, password]);

  const handleCreateInstaller = useCallback(() => {
    if (isButtonDisabled) return;

    const newInstaller: DefaultInstallerStateType = {
      lastname,
      firstname,
      middlename,
      phone,
      password,
      login,
      status: "active",
    };

    const data = [...installersData, newInstaller];

    //  Set new installer to store
    dispatch(setInstallers({ action: "setData", data }));

    //  Clear all inputs and states
    dispatch(setInputStateLastnameReducer({ action: "reset" }));
    dispatch(setInputStateFirstnameReducer({ action: "reset" }));
    dispatch(setInputStateMiddlenameReducer({ action: "reset" }));
    dispatch(setInputStatePhoneReducer({ action: "reset" }));
    dispatch(setInputStatePasswordReducer({ action: "reset" }));
    dispatch(setLogin({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminInstallersPage",
        params: pageParamsWhenMounted?.backLink?.params
          ? pageParamsWhenMounted?.backLink?.params
          : {},
      })
    );
  }, [
    dispatch,
    isButtonDisabled,
    lastname,
    firstname,
    middlename,
    phone,
    password,
    login,
    installersData,
    pageParamsWhenMounted,
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
          <Input label="Логин" value={login} isDisabled={true}></Input>
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

const styles = StyleSheet.create({});
