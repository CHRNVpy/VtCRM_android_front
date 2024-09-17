import { useRef, useMemo, useCallback } from "react";
import { TextInput, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Input from "@/components/controls/input/input";
import Header from "@/components/container/header/header";
import Button from "@/components/controls/button/button";
import Buttons from "@/components/wrappers/buttons/buttons";
import Inputs from "@/components/wrappers/inputs/inputs";
import { RootState, AppDispatch } from "@/store/store";
import {
  setInputStateLoginReducer,
  setInputStatePasswordReducer,
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
  const accessToken = useSelector(
    (state: RootState) => state.stateNavigation.accessToken.data
  );

  const handleLoginOnChangeText = useCallback(
    (text?: string) => {
      console.log(text);
      dispatch(setInputStateLoginReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handlePasswordOnChangeText = useCallback(
    (text?: string) => {
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
      <Inputs verticalAlign={"center"} isWithPaddings={true}>
        <Input
          label="Логин"
          onChangeText={handleLoginOnChangeText}
          onSubmitEditing={handleSubmitLoginEditing}
          value={login}
        ></Input>
        <Input
          label="Пароль"
          onChangeText={handlePasswordOnChangeText}
          value={password}
          type={"password"}
          inputRef={passwordInputRef}
        ></Input>
      </Inputs>
      <Text>{accessToken}</Text>
      <Buttons>
        <Button isDisabled={isButtonDisabled} onPress={handlePressButton}>
          Войти
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
