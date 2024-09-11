import { useRef, useMemo, useCallback } from "react";
import { TextInput, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Content from "@/components/wrappers/content/content";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Input from "@/components/controls/input/input";
import Header from "@/components/container/header/header";
import Button from "@/components/controls/button/button";
import Buttons from "@/components/wrappers/buttons/buttons";
import Inputs from "@/components/wrappers/inputs/inputs";
import { RootState, AppDispatch } from "@/store/store";
import { setLogin, setPassword } from "@/store/auth";

export default function Page() {
  const passwordInputRef = useRef<TextInput>(null);

  const dispatch: AppDispatch = useDispatch();

  const login = useSelector((state: RootState) => state.auth.login);
  const password = useSelector((state: RootState) => state.auth.password);

  const handleLoginOnChangeText = useCallback(
    (value?: string) => {
      dispatch(setLogin({ value }));
    },
    [dispatch]
  );

  const handlePasswordOnChangeText = useCallback(
    (value?: string) => {
      dispatch(setPassword({ value }));
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

  return (
    <Wrapper>
      <Header />
      <Inputs verticalAlign={"center"}>
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
      <Buttons>
        <Button isDisabled={isButtonDisabled}>Войти</Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
