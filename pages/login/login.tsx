import { useRef } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Input from "@/components/input/input";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import { RootState, AppDispatch } from "@/store/store";
import { setLogin, setPassword } from "@/store/auth";
import colors from "@/helpers/colors";
import { s } from "react-native-size-matters";

export default function Login() {
  const passwordInputRef = useRef<TextInput>(null);

  const dispatch: AppDispatch = useDispatch();

  const login = useSelector((state: RootState) => state.auth.login);
  const password = useSelector((state: RootState) => state.auth.password);

  const handleLoginOnChangeText = (value?: string) => {
    dispatch(setLogin({ value }));
  };
  const handlePasswordOnChangeText = (value?: string) => {
    dispatch(setPassword({ value }));
  };
  const handleSubmitLoginEditing = () => {
    if (!passwordInputRef.current) return;

    passwordInputRef.current.focus();
  };

  return (
    <View style={styles.wrapper}>
      <Header />
      <View style={styles.content}>
        <View style={styles.inputs}>
          <View style={styles.input}>
            <Input
              label="Логин"
              onChangeText={handleLoginOnChangeText}
              onSubmitEditing={handleSubmitLoginEditing}
              value={login}
            ></Input>
          </View>
          <View style={[styles.input, styles.lastChild]}>
            <Input
              label="Пароль"
              onChangeText={handlePasswordOnChangeText}
              value={password}
              type={"password"}
              inputRef={passwordInputRef}
            ></Input>
          </View>
        </View>
        <View style={styles.button}>
          <Button>
            <Text>Войти</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingLeft: s(15),
    paddingRight: s(15),
    paddingBottom: s(15),
  },
  inputs: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
  },
  lastChild: {
    marginBottom: 0,
  },
  button: {},
});
