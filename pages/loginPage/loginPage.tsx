import { useRef, useMemo, useCallback } from "react";
import { TextInput, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Input from "@/components/controls/input/input";
import Header from "@/components/container/header/header";
import Button from "@/components/controls/button/button";
import Buttons from "@/components/wrappers/buttons/buttons";
import Inputs from "@/components/wrappers/inputs/inputs";
import TextType from "@/components/wrappers/textType/textType";
import Content from "@/components/wrappers/content/content";
import { RootState, AppDispatch } from "@/store/store";
import {
  setInputStateLoginReducer,
  setInputStatePasswordReducer,
  setPostLoginStateReducer,
  postLogin,
} from "@/store/login/post/post";

export default function Page() {
  const passwordInputRef = useRef<TextInput>(null);

  const dispatch: AppDispatch = useDispatch();

  const login = useSelector(
    (state: RootState) => state.postLogin.postLoginFields.inputs.login.text
  );
  const password = useSelector(
    (state: RootState) => state.postLogin.postLoginFields.inputs.password.text
  );
  const postLoginState = useSelector(
    (state: RootState) => state.postLogin.postLoginState
  );

  const handleLoginOnChangeText = useCallback(
    (text?: string) => {
      dispatch(setPostLoginStateReducer({ action: "reset" }));
      dispatch(setInputStateLoginReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handlePasswordOnChangeText = useCallback(
    (text?: string) => {
      dispatch(setPostLoginStateReducer({ action: "reset" }));
      dispatch(setInputStatePasswordReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handleSubmitLoginEditing = useCallback(() => {
    if (!passwordInputRef.current) return;

    passwordInputRef.current.focus();
  }, [passwordInputRef]);

  const isButtonDisabled = useMemo(() => {
    if (!login) return true;

    if (!password) return true;

    return false;
  }, [login, password]);

  const handlePressButton = useCallback(() => {
    dispatch(postLogin());
  }, []);

  return (
    <Wrapper>
      <Header />
      <Content isWithPaddings={true}>
        <Inputs verticalAlign={"center"}>
          <Input
            label="Логин"
            onChangeText={handleLoginOnChangeText}
            onSubmitEditing={handleSubmitLoginEditing}
            value={login}
            isError={
              !!postLoginState.isError &&
              !!postLoginState.errorFields?.includes("login")
            }
            isDisabled={postLoginState.isInProcess}
          ></Input>
          <Input
            label="Пароль"
            onChangeText={handlePasswordOnChangeText}
            value={password}
            type={"password"}
            inputRef={passwordInputRef}
            isError={
              !!postLoginState.isError &&
              !!postLoginState.errorFields?.includes("password")
            }
            isDisabled={postLoginState.isInProcess}
          ></Input>
        </Inputs>
        <TextType minNumberOfLines={2} color="red">
          {!!postLoginState.isError ? postLoginState.errorText : ""}
        </TextType>
      </Content>
      <Buttons>
        <Button
          isDisabled={isButtonDisabled}
          onPress={handlePressButton}
          isInProcess={postLoginState.isInProcess}
        >
          Войти
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
